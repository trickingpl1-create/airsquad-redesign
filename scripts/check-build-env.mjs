// Kontrola zmiennych środowiskowych przed buildem statycznym (hook `prebuild`).
//
// Przy output: 'export' wartości NEXT_PUBLIC_* są WKOMPILOWANE w HTML i JS —
// nie ma serwera, który przeczytałby je później. Build z lokalnym `.env.local`
// wypuszcza więc katalog `out/` z canonicalami i sitemapą wskazującymi na
// localhost, a `/sklep` i `/media` (fetch w przeglądarce) zostają puste.
// Taki katalog wygląda poprawnie i wgrywa się bez błędu — dlatego blokujemy go
// tutaj, zamiast liczyć, że ktoś zauważy to po publikacji.
//
// Świadomy build na placeholderach (podgląd układu lokalnie):
//   ALLOW_PLACEHOLDER_BUILD=1 npm run build

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Zwykły `node` nie czyta .env.local — robi to dopiero Next. Wczytujemy plik
// sami, z tą samą kolejnością pierwszeństwa co Next: zmienne już obecne
// w środowisku (np. ustawione w panelu hostingu albo w CI) wygrywają z plikiem.
function loadEnvLocal() {
  const path = join(process.cwd(), '.env.local')
  if (!existsSync(path)) return

  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    if (process.env[key] !== undefined) continue
    process.env[key] = rawValue.trim().replace(/^["']|["']$/g, '')
  }
}

loadEnvLocal()

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const problems = []

// SITE_URL ma fallback 'https://airsquad.pl' (lib/seo/site.ts), więc brak
// zmiennej jest OK — groźna jest dopiero jawnie ustawiona wartość lokalna.
if (siteUrl && /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(siteUrl)) {
  problems.push(
    `NEXT_PUBLIC_SITE_URL = ${siteUrl}\n` +
      '     → canonicale, sitemap.xml, robots.txt i Open Graph wskażą localhost.\n' +
      '       Ustaw https://airsquad.pl albo usuń zmienną (fallback w lib/seo/site.ts).',
  )
}

if (!supabaseUrl || !supabaseKey) {
  problems.push(
    'Brak NEXT_PUBLIC_SUPABASE_URL lub NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
      '     → treść zbuduje się z fallbacków w lib/content/, strony z tabeli\n' +
      '       static_pages w ogóle nie powstaną, a /sklep i /media będą puste.',
  )
} else if (supabaseUrl.includes('placeholder')) {
  problems.push(
    `NEXT_PUBLIC_SUPABASE_URL = ${supabaseUrl}\n` +
      '     → to adres-zaślepka; skutek jak wyżej — treść wyłącznie z fallbacków.',
  )
}

if (problems.length === 0) {
  console.log('✓ Zmienne środowiskowe buildu wyglądają produkcyjnie.')
  process.exit(0)
}

const list = problems.map((p, i) => `  ${i + 1}. ${p}`).join('\n\n')

if (process.env.ALLOW_PLACEHOLDER_BUILD) {
  console.warn(
    `\n⚠  Build na niepełnym środowisku (ALLOW_PLACEHOLDER_BUILD=1):\n\n${list}\n\n` +
      '   Katalog out/ nadaje się do podglądu, NIE do wgrania na produkcję.\n',
  )
  process.exit(0)
}

console.error(
  `\n✗ Build zatrzymany — to środowisko wypuściłoby wadliwy katalog out/:\n\n${list}\n\n` +
    '   Napraw .env.local (wzorzec: .env.local.example) albo zmienne w panelu\n' +
    '   hostingu, a dla świadomego buildu podglądowego uruchom:\n' +
    '     ALLOW_PLACEHOLDER_BUILD=1 npm run build\n',
)
process.exit(1)
