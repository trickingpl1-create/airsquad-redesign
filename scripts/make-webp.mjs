#!/usr/bin/env node
// Konwersja zdjęć na WebP — równolegle do scripts/optimize-images.mjs.
//
//   node scripts/make-webp.mjs            → tylko raport, nic nie zapisuje
//   node scripts/make-webp.mjs --apply    → tworzy pliki .webp obok .jpg
//
// PO CO
// optimize-images.mjs zszedł z rozmiarem tak daleko, jak pozwala JPEG (q74,
// 0,10–0,18 bajta na piksel). WebP przy tej samej jakości wizualnej pakuje
// zdjęcia o kolejne 20–35%, bo ma lepszy predyktor bloków i bezstratną wersję
// kanału alfa. To ostatni duży zapas w zdjęciach bez ruszania wymiarów.
//
// DLACZEGO BEZ <picture> I BEZ ZAPASOWEGO JPEG-a
// Serwis już dziś podaje logo wyłącznie jako `airsquad-logo.webp` — w nagłówku
// na każdej podstronie, bez żadnego zapasowego formatu. Dokładanie <picture>
// tylko dla zdjęć byłoby niekonsekwencją, a przy okazji pułapką: gdy <source>
// pasuje typem, ale plik zwróci 404, przeglądarka NIE cofa się do <img> —
// pokazuje zepsute zdjęcie. Prosty `src` na .webp takiego stanu nie ma.
// WebP czyta każda przeglądarka od 2020 roku (Safari 14, Chrome 32, Firefox 65).
//
// CO POTEM
// Skrypt tylko DODAJE pliki; nie rusza i nie kasuje .jpg. Podmiana odwołań
// w kodzie jest osobnym krokiem, a osierocone .jpg usuwa się dopiero po
// sprawdzeniu zbudowanej strony (`git rm`, więc do odzyskania z historii).
//
// PODZIAŁ PRACY Z make-image-variants.mjs
// Gotowych wariantów `-w192`…`-w1600` ten skrypt NIE tyka. Konwersja JPEG-a,
// który sam jest już przeskalowaną kopią, nakłada stratę na stratę; te pliki
// powstają na nowo wprost z oryginału (make-image-variants.mjs zapisuje je
// od teraz jako .webp). Tutaj zostają więc tylko zdjęcia serwowane w całości:
// tła, hero, galerie i pełnowymiarowe portrety z trenerzy/.

import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

// fileURLToPath, nie `.pathname`: ścieżka workspace ma „TWÓRCZOŚĆ" i spację.
const ROOT = fileURLToPath(new URL('../public/images/', import.meta.url))

const JAKOSC = 80 // wyżej niż JPEG-owe 74: źródło jest już raz skompresowane,
// a przy drugim przejściu nie chcemy dokładać widocznej straty generacyjnej
const WYSILEK = 6 // czas kodowania vs rozmiar; 6 to ostatni poziom z realnym zyskiem
const MIN_ZYSK = 0.08 // plik .webp zapisujemy tylko, gdy jest o 8%+ mniejszy

// Warianty `-w<szerokość>.jpg` i cały katalog kadra/ (same źródła plus warianty)
// należą do make-image-variants.mjs — patrz nagłówek.
const NALEZY_DO_WARIANTOW = /(^kadra\/|-w\d+\.jpe?g$)/i

// Pliki bez żadnego odwołania w kodzie — czekają na `git rm`, nie ma czego konwertować.
const NIEUZYWANE = new Set([
  'old-site/akrobatyka.jpg',
  'old-site/showdance.jpg',
  'bg-snowboard.jpg',
  'miasta/biecz-zajawka.jpg',
])
const apply = process.argv.includes('--apply')
const kb = (b) => (b / 1024).toFixed(0)

function zbierz(katalog) {
  const wynik = []
  for (const nazwa of readdirSync(katalog)) {
    const sciezka = join(katalog, nazwa)
    if (statSync(sciezka).isDirectory()) wynik.push(...zbierz(sciezka))
    else if (/\.jpe?g$/i.test(nazwa)) wynik.push(sciezka)
  }
  return wynik
}

const raport = []
let przed = 0
let po = 0
let pominiete = 0

for (const sciezka of zbierz(ROOT).sort()) {
  const etykieta = relative(ROOT, sciezka)
  if (NIEUZYWANE.has(etykieta) || NALEZY_DO_WARIANTOW.test(etykieta)) {
    pominiete++
    continue
  }
  const cel = sciezka.replace(/\.jpe?g$/i, '.webp')
  const rozmiar = statSync(sciezka).size
  const bufor = await sharp(sciezka)
    .webp({ quality: JAKOSC, effort: WYSILEK, smartSubsample: true })
    .toBuffer()
  const zysk = 1 - bufor.length / rozmiar
  if (zysk < MIN_ZYSK) {
    pominiete++
    continue
  }
  raport.push({ etykieta, rozmiar, nowy: bufor.length, zysk, istnieje: existsSync(cel) })
  przed += rozmiar
  po += bufor.length
  if (apply) writeFileSync(cel, bufor)
}

raport.sort((a, b) => b.rozmiar - a.rozmiar)
console.log(apply ? 'ZAPISANO pliki .webp:' : 'PODGLĄD (nic nie zapisano):')
console.log('')
console.log('PLIK                                           JPG        WEBP    ZYSK')
for (const r of raport) {
  console.log(
    `${r.etykieta.padEnd(44)} ${kb(r.rozmiar).padStart(6)} KB ${kb(r.nowy).padStart(6)} KB  ${(r.zysk * 100).toFixed(0).padStart(3)}%`,
  )
}
console.log('')
console.log(`Do konwersji: ${raport.length}, pominiętych: ${pominiete}`)
console.log(`Razem: ${kb(przed)} KB → ${kb(po)} KB  (oszczędność ${kb(przed - po)} KB, ${((1 - po / przed) * 100).toFixed(0)}%)`)
if (!apply) console.log('\nAby wykonać: node scripts/make-webp.mjs --apply')
