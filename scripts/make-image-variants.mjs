#!/usr/bin/env node
// Warianty rozmiarowe zdjęć kadry. Strona ma `images.unoptimized: true`
// (wymuszone przez `output: 'export'`), więc next/image NIE generuje srcset —
// każdy <img> pobiera dokładnie ten plik, który wskazuje `src`. Bez tego skryptu
// telefon ściągałby hero 1600 px i portret 768×1365 do awatara 64 px.
//
// Uruchomienie: `node scripts/make-image-variants.mjs` (idempotentne — pomija
// pliki, które już istnieją i są nowsze od źródła). sharp jest już w node_modules
// jako zależność Next.js, więc nic nie trzeba instalować.
//
// Konwencja nazw: <nazwa>-w<szerokość>.webp obok oryginału (litera „w", bo
// samo „-1600" kolidowało z rokiem w nazwach typu kadra-air-meeting-2025.jpg
// i skrypt brał oryginał za gotowy wariant). Oryginał .jpg zostaje nietknięty
// jako źródło; kod strony odwołuje się wyłącznie do wariantów
// (lib/content/team-photos.ts, lib/content/team.ts).
//
// FORMAT: WebP (było JPEG). Przy tej samej jakości wizualnej warianty schodzą
// o kolejne 20–30%, a generujemy je wprost z oryginału, więc nie ma mowy
// o nakładaniu straty na stratę — inaczej niż przy konwersji gotowego JPEG-a.
// Jakość dobrana pomiarem wobec starych wariantów JPEG q74 (ten sam oryginał,
// ta sama szerokość): portrety przy q80 są o 20–30% mniejsze, ale zdjęcia
// grupowe kadry przy q80 PUCHNĄ o 13–14% — skale jakości obu formatów nie są
// wymienne. q72 trzyma dla nich −12…−38%. Stare warianty .jpg zostają
// osierocone do ręcznego usunięcia.
import { readdirSync, statSync, existsSync } from 'node:fs'
import { join, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

// fileURLToPath, nie `.pathname`: ścieżka workspace ma „TWÓRCZOŚĆ" i spację,
// a `.pathname` zostawia je zakodowane procentowo (TWO%CC%81…) — ENOENT.
const ROOT = fileURLToPath(new URL('../public/images/', import.meta.url))

// Pojedyncze pliki, które nie pasują do schematu „katalog × szerokości".
const ZADANIA_PLIKI = [
  // Logo w nagłówku i stopce leci na KAŻDEJ podstronie, a plik 592×355 (51 kB)
  // jest wyświetlany na wysokości 42 px (nagłówek), 64 px (stopka), 72 px (404)
  // i 90 px (hero strony głównej). 400 px pokrywa największe z tych użyć przy
  // gęstości 2,7× i waży 30 kB — 21 kB mniej na każdej odsłonie.
  // alphaQuality 100: logo jest na przezroczystym tle, a brzegi poświaty
  // rozsypują się przy kompresji kanału alfa.
  { file: 'airsquad-logo.webp', widths: [400], quality: 88, alpha: 100 },
]

const ZADANIA = [
  // Zdjęcia grupowe w hero /trenerzy/: 900 px na telefony, 1600 px na desktop.
  // Jakość 74 progressive/mozjpeg: oryginały 437–729 kB spadają do ~40–55%.
  { dir: 'kadra', widths: [900, 1600], quality: 72 },
  // Portrety: 192 px do awatarów 64 px (DPR 3), 480 px do kart 3:4 (~240 px
  // szerokości w siatce 4-kolumnowej na 1280, DPR 2).
  { dir: 'trenerzy', widths: [192, 480], quality: 80 },
]

const jestWariantem = (name) => /-w\d{3,4}\.(jpe?g|webp)$/i.test(name)

let zrobione = 0
let pominiete = 0

for (const { dir, widths, quality } of ZADANIA) {
  const katalog = join(ROOT, dir)
  const zrodla = readdirSync(katalog).filter(
    (f) => /\.jpe?g$/i.test(f) && !jestWariantem(f),
  )
  for (const plik of zrodla) {
    const src = join(katalog, plik)
    const baza = basename(plik, extname(plik))
    for (const w of widths) {
      const out = join(katalog, `${baza}-w${w}.webp`)
      if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) {
        pominiete++
        continue
      }
      await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality, effort: 6, smartSubsample: true })
        .toFile(out)
      zrobione++
    }
  }
}

for (const { file, widths, quality, alpha } of ZADANIA_PLIKI) {
  const src = join(ROOT, file)
  if (!existsSync(src)) continue
  const baza = basename(file, extname(file))
  for (const w of widths) {
    const out = join(ROOT, `${baza}-w${w}.webp`)
    if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) {
      pominiete++
      continue
    }
    await sharp(src)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality, effort: 6, alphaQuality: alpha ?? 100 })
      .toFile(out)
    zrobione++
  }
}

console.log(`warianty: ${zrobione} wygenerowane, ${pominiete} aktualne`)
