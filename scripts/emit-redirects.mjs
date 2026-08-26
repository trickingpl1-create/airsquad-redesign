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

if (locations.length === 0) process.exit(0)

console.log('# Lokalizacje wycofane ze strony — 301 zamiast 404.')
console.log('# Źródło: lib/content/withdrawn-locations.json')
for (const location of locations) {
  console.log(`# ${location.slug}: ${location.reason}`)
  // Obie formy: z ukośnikiem i bez, bo historyczne linki bywają jedne i drugie.
  console.log(`Redirect 301 /${location.slug}/ ${location.redirectTo}`)
  console.log(`Redirect 301 /${location.slug} ${location.redirectTo}`)
}
