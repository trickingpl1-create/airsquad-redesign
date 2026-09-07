// Wypisuje reguły Apache dla lokalizacji wycofanych ze strony.
// Źródłem jest lib/content/withdrawn-locations.json — ten sam plik, z którego
// aplikacja wyrzuca miasta z menu i zapisów. Dzięki temu nie da się usunąć
// lokalizacji, nie generując dla niej 301.
//
// Wywoływane przez scripts/make-deploy-zip.sh. Samo nic nie zapisuje.

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const source = join(here, '..', 'lib', 'content', 'withdrawn-locations.json')

const locations = JSON.parse(readFileSync(source, 'utf8'))

if (!Array.isArray(locations)) {
  console.error('✗ withdrawn-locations.json nie jest tablicą')
  process.exit(1)
}

for (const location of locations) {
  if (!location.slug || !location.redirectTo) {
    console.error(`✗ Wpis bez slug/redirectTo: ${JSON.stringify(location)}`)
    process.exit(1)
  }
  if (!location.redirectTo.endsWith('/')) {
    console.error(`✗ ${location.slug}: redirectTo musi kończyć się ukośnikiem (trailingSlash)`)
    process.exit(1)
  }
}

if (locations.length > 0) {
  console.log('# Lokalizacje wycofane ze strony — 301 zamiast 404.')
  console.log('# Źródło: lib/content/withdrawn-locations.json')
  for (const location of locations) {
    console.log(`# ${location.slug}: ${location.reason}`)
    // Obie formy: z ukośnikiem i bez, bo historyczne linki bywają jedne i drugie.
    console.log(`Redirect 301 /${location.slug}/ ${location.redirectTo}`)
    console.log(`Redirect 301 /${location.slug} ${location.redirectTo}`)
  }
}

// Stare adresy WordPressa, które nie mają odpowiednika w nowej strukturze
// (archiwalne obozy, wydarzenia, portfolio, sklep szarf). Były w sitemapie
// starej strony i zwracały 200, więc plan SEO (docs/02-plan-seo.md) wymaga
// dla nich 200 albo 301 — nigdy 404 i nigdy masowego 301 na stronę główną.
// Cele to propozycje z docs/06-raport-pokrycia-seo.md; ostateczna decyzja
// należy do klubu po danych z Search Console (pole `status` w JSON-ie).
const legacySource = join(here, '..', 'lib', 'content', 'legacy-redirects.json')
const legacy = JSON.parse(readFileSync(legacySource, 'utf8'))

for (const rule of legacy) {
  if (!rule.from?.startsWith('/') || !rule.to?.startsWith('/')) {
    console.error(`✗ legacy-redirects: from/to muszą zaczynać się od "/": ${JSON.stringify(rule)}`)
    process.exit(1)
  }
  if (!rule.from.endsWith('/') || !rule.to.endsWith('/')) {
    console.error(`✗ legacy-redirects: ${rule.from} → ${rule.to} — oba adresy muszą kończyć się ukośnikiem (trailingSlash)`)
    process.exit(1)
  }
  if (rule.to === '/') {
    console.error(`✗ legacy-redirects: ${rule.from} → / — plan SEO zabrania przekierowań na stronę główną`)
    process.exit(1)
  }
}

if (legacy.length > 0) {
  console.log('')
  console.log('# Stare adresy WordPressa bez odpowiednika — 301 na najbliższą tematycznie stronę.')
  console.log('# Źródło: lib/content/legacy-redirects.json')
  for (const rule of legacy) {
    console.log(`# ${rule.from} (${rule.status}): ${rule.reason}`)
    console.log(`Redirect 301 ${rule.from} ${rule.to}`)
    console.log(`Redirect 301 ${rule.from.replace(/\/$/, '')} ${rule.to}`)
  }
}
