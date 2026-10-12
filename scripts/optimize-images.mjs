#!/usr/bin/env node
// Rekompresja zdjęć serwowanych bezpośrednio ze strony.
//
//   node scripts/optimize-images.mjs            → tylko raport, nic nie zapisuje
//   node scripts/optimize-images.mjs --apply    → nadpisuje pliki w miejscu
//
// PO CO
// Zdjęcia przeniesione ze starej strony mają dobre wymiary (najczęściej 1600 px),
// ale są zapisane z jakością bliską bezstratnej: `old-site/dorosli-ekipa.jpg` to
// 739 kB przy 1600×1067, czyli 0,44 bajta na piksel — 3–4× więcej, niż potrzeba.
// Strona główna ważyła przez to 5,4 MB, a `/letni/` 7,1 MB (pomiar na żywo
// 2026-10-12). Na telefonie w 4G to kilkanaście sekund ładowania.
//
// DLACZEGO W MIEJSCU, A NIE JAKO WARIANTY
// Ciężkie zdjęcia są na stronie głównej osadzone jako `background-image` w stylu
// inline (13 sztuk). Tło CSS nie przyjmuje `srcset`, więc nie da się podać
// telefonowi mniejszego pliku — jedyne, co działa, to zmniejszenie samego pliku.
// Nazwy zostają bez zmian, więc żaden komponent nie wymaga edycji. Oryginały są
// w gicie (95/95 plików śledzonych), więc cofnięcie to `git checkout public/images`.
//
// CZEGO SKRYPT NIE RUSZA
//   kadra/, trenerzy/ — to ŹRÓDŁA dla scripts/make-image-variants.mjs. Strona
//     serwuje warianty `-w192`/`-w480`/`-w900`/`-w1600`, już lekkie; rekompresja
//     źródła pogorszyłaby jakość wariantów przy następnym generowaniu.
//   *.webp, *.svg — już skompresowane albo wektorowe.
//   logo — `airsquad-logo.webp` (52 kB) jest elementem LCP strony głównej;
//     nie dotykamy go tym skryptem, żeby nie ruszać najważniejszego piksela
//     bez osobnej decyzji.
//
// ZABEZPIECZENIE PRZED PODWÓJNĄ KOMPRESJĄ
// Zamiast listy zrobionych plików patrzymy na gęstość: bajty na piksel. Plik
// poniżej PROG_BPP jest już efektywny i zostaje pominięty. Po przejściu skryptu
// pliki schodzą do ok. 0,10–0,18 B/px, więc ponowne uruchomienie ich nie tknie —
// skrypt jest idempotentny bez żadnego pliku stanu.

import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

// fileURLToPath, nie `.pathname`: ścieżka workspace ma „TWÓRCZOŚĆ" i spację,
// a `.pathname` zostawia je zakodowane procentowo (TWO%CC%81…) — ENOENT.
const ROOT = fileURLToPath(new URL('../public/images/', import.meta.url))

// Katalogi serwowane bezpośrednio (tła CSS i <img> bez wariantów).
// '.' to pliki w korzeniu public/images (bg-*.jpg).
const KATALOGI = ['.', 'old-site', 'miasta', 'letni', 'akrobatyka', 'dyscypliny', 'hero']

const POMIJAJ_KATALOGI = new Set(['kadra', 'trenerzy'])
const POMIJAJ_PLIKI = new Set([
  'airsquad-logo.png',
  'airsquad-logo.webp',
  // Logo Air Camp: 1,4 MB PNG, którego żadna zbudowana strona nie używa —
  // serwowany jest wariant .webp (104 kB) na 15 stronach. Kwantyzacja palety
  // potrafi zrobić pasy na gradientach logotypu, a tu nie ma czego zyskiwać:
  // plik jest kandydatem do skasowania, nie do rekompresji.
  'aircamp-2026-logo.png',
])

const MAX_SZEROKOSC = 1600 // pełnoekranowe tła; wyżej nikt tego nie zobaczy
const JAKOSC = 74 // mozjpeg; przy tych rozmiarach wyświetlania różnica niewidoczna
const PROG_BPP = 0.22 // powyżej tej gęstości plik uznajemy za przepakowany
const MIN_ZYSK = 0.1 // zapisujemy tylko, gdy oszczędność przekracza 10%

const apply = process.argv.includes('--apply')

const kb = (b) => (b / 1024).toFixed(0)

const pliki = []
for (const dir of KATALOGI) {
  const katalog = dir === '.' ? ROOT : join(ROOT, dir)
  if (!existsSync(katalog)) continue
  if (POMIJAJ_KATALOGI.has(dir)) continue
  for (const nazwa of readdirSync(katalog)) {
    if (POMIJAJ_PLIKI.has(nazwa)) continue
    if (!/\.(jpe?g|png)$/i.test(nazwa)) continue
    const sciezka = join(katalog, nazwa)
    if (!statSync(sciezka).isFile()) continue
    pliki.push({ etykieta: dir === '.' ? nazwa : `${dir}/${nazwa}`, sciezka })
  }
}

let doZrobienia = 0
let przed = 0
let po = 0
let pominiete = 0
const raport = []

for (const { etykieta, sciezka } of pliki) {
  const rozmiar = statSync(sciezka).size
  const meta = await sharp(sciezka).metadata()
  const bpp = rozmiar / (meta.width * meta.height)

  if (bpp < PROG_BPP) {
    pominiete++
    continue
  }

  // PNG bez przezroczystości traktujemy jak zdjęcie i zapisujemy jako JPEG-a
  // pod tą samą nazwą? NIE — zmiana formatu przy tym samym rozszerzeniu myli
  // serwer i scrapery. PNG-i zostają PNG-ami, tylko przepakowane.
  const jestPng = extname(sciezka).toLowerCase() === '.png'
  let potok = sharp(sciezka).rotate() // rotate() honoruje EXIF przed zdjęciem metadanych
  if (meta.width > MAX_SZEROKOSC) potok = potok.resize({ width: MAX_SZEROKOSC, withoutEnlargement: true })
  potok = jestPng
    ? potok.png({ compressionLevel: 9, palette: true })
    : potok.jpeg({ quality: JAKOSC, progressive: true, mozjpeg: true })

  const bufor = await potok.toBuffer()
  const zysk = 1 - bufor.length / rozmiar

  if (zysk < MIN_ZYSK) {
    pominiete++
    continue
  }

  raport.push({ etykieta, rozmiar, nowy: bufor.length, zysk, wymiary: `${meta.width}×${meta.height}` })
  przed += rozmiar
  po += bufor.length
  doZrobienia++

  if (apply) writeFileSync(sciezka, bufor)
}

raport.sort((a, b) => b.rozmiar - a.rozmiar)
console.log(apply ? 'ZAPISANO:' : 'PODGLĄD (nic nie zapisano):')
console.log('')
console.log('PLIK                                      WYMIARY        PRZED      PO    ZYSK')
for (const r of raport) {
  console.log(
    `${r.etykieta.padEnd(41)} ${r.wymiary.padEnd(12)} ${kb(r.rozmiar).padStart(6)} KB ${kb(r.nowy).padStart(6)} KB  ${(r.zysk * 100).toFixed(0).padStart(3)}%`,
  )
}
console.log('')
console.log(`Plików do poprawy: ${doZrobienia}, pominiętych (już efektywne): ${pominiete}`)
console.log(`Razem: ${kb(przed)} KB → ${kb(po)} KB  (oszczędność ${kb(przed - po)} KB, ${((1 - po / przed) * 100).toFixed(0)}%)`)
if (!apply) console.log('\nAby wykonać: node scripts/optimize-images.mjs --apply')
