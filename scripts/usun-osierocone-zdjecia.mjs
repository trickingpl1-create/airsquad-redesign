#!/usr/bin/env node
// Zdjęcia, do których nic już nie prowadzi — po przejściu na WebP.
//
//   node scripts/usun-osierocone-zdjecia.mjs            → tylko lista, nic nie kasuje
//   node scripts/usun-osierocone-zdjecia.mjs --apply    → `git rm` na tych plikach
//
// PO CO
// scripts/make-webp.mjs tylko DODAJE pliki .webp, a podmiana odwołań w kodzie
// zostawia stare .jpg w repozytorium. Działającej stronie to nie szkodzi
// (nikt ich nie pobiera), ale lecą na serwer przy każdym wdrożeniu i mylą przy
// szukaniu, który plik jest ten właściwy.
//
// CZEGO SKRYPT NIE RUSZA — i dlaczego to nie jest to samo co „nieużywany"
//   kadra/<nazwa>.jpg i trenerzy/<nazwa>.jpg bez sufiksu -w… — to ŹRÓDŁA, z których
//     scripts/make-image-variants.mjs generuje serwowane warianty. W kodzie strony
//     nie występują, bo kod odwołuje się wyłącznie do wariantów.
//   airsquad-logo.webp — źródło wariantu -w400.
//   airsquad-logo.png — logo w danych strukturalnych (app/page.tsx), podawane
//     Google'owi jako bezwzględny URL, więc musi zostać na serwerze.
//   *-w192/-w480/-w900/-w1600.webp — nazwy składane w locie (photoVariant,
//     team-photos.ts), więc dosłownie w kodzie ich nie ma.
//
// BEZPIECZNIK: kasujemy przez `git rm`, czyli pliki zostają w historii.
// Przywrócenie: `git checkout HEAD~1 -- public/images`.

import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join, relative, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const PROJEKT = fileURLToPath(new URL('..', import.meta.url))
const PUBLICZNE = join(PROJEKT, 'public')
const OBRAZY = join(PUBLICZNE, 'images')

function wszystkie(katalog, filtr) {
  const wynik = []
  for (const nazwa of readdirSync(katalog)) {
    const sciezka = join(katalog, nazwa)
    if (statSync(sciezka).isDirectory()) wynik.push(...wszystkie(sciezka, filtr))
    else if (filtr(nazwa)) wynik.push(sciezka)
  }
  return wynik
}

// Cały kod w jednym stringu — szukamy dosłownych ścieżek „/images/…".
const kod = ['app', 'components', 'lib', 'scripts']
  .flatMap((d) => wszystkie(join(PROJEKT, d), (n) => /\.(tsx?|mjs|css|json)$/.test(n)))
  .map((p) => readFileSync(p, 'utf8'))
  .join('\n')

const CHRONIONE = [
  [/^kadra\/[a-z0-9-]+\.jpe?g$/i, 'źródło wariantów kadry'],
  [/^trenerzy\/[a-z-]+\.jpe?g$/i, 'źródło wariantów portretu'],
  [/^airsquad-logo\.webp$/i, 'źródło wariantu logo'],
  [/^airsquad-logo\.png$/i, 'logo w danych strukturalnych'],
]
const WARIANT = /-w\d{3,4}\.(webp|jpe?g)$/i
const chroniony = (et) =>
  !WARIANT.test(et) && (CHRONIONE.find(([re]) => re.test(et)) || [])[1]

const osierocone = []
for (const sciezka of wszystkie(OBRAZY, (n) => /\.(jpe?g|png|webp)$/i.test(n))) {
  const etykieta = relative(OBRAZY, sciezka)
  const url = `/images/${etykieta}`
  if (kod.includes(url)) continue
  if (chroniony(etykieta)) continue
  // wariant .webp składany w locie — w kodzie jest tylko wzór, nie nazwa
  if (/-w\d{3,4}\.webp$/i.test(etykieta)) continue
  osierocone.push({ sciezka, url, rozmiar: statSync(sciezka).size })
}

osierocone.sort((a, b) => b.rozmiar - a.rozmiar)
const suma = osierocone.reduce((s, o) => s + o.rozmiar, 0)
const apply = process.argv.includes('--apply')

console.log(apply ? 'USUWAM:' : 'DO USUNIĘCIA (nic nie skasowano):')
for (const o of osierocone) {
  console.log(`  ${String(Math.round(o.rozmiar / 1024)).padStart(5)} kB  ${o.url}`)
}
console.log(`\nRazem: ${osierocone.length} plików, ${(suma / 1024 / 1024).toFixed(1)} MB`)

if (!apply) {
  console.log('\nAby wykonać: node scripts/usun-osierocone-zdjecia.mjs --apply')
} else if (osierocone.length) {
  execFileSync('git', ['rm', '-q', '--', ...osierocone.map((o) => relative(PROJEKT, o.sciezka))], {
    cwd: PROJEKT,
    stdio: 'inherit',
  })
  console.log('\nUsunięte przez `git rm` — do odzyskania: git checkout HEAD -- public/images')
}
