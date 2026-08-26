// Panel trzyma własną KOPIĘ typów bazy (lib/types/database.ts), bo deploy z CLI
// wysyła wyłącznie katalog admin-app/ — import spoza niego nie zbudowałby się.
// Kopia bez pilnowania rozjeżdża się po cichu, a rozjazd typów bazy to ciche
// błędy w CRUD-zie. Ten hook porównuje kopię z oryginałem i przerywa build.
//
// Na Vercelu oryginału nie ma (wysyłamy sam admin-app) — wtedy sprawdzenie
// jest pomijane. Realną ochroną jest build lokalny, którym i tak wdrażamy.

import { existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const copyPath = join(here, '..', 'lib', 'types', 'database.ts')
const originPath = join(here, '..', '..', 'lib', 'types', 'database.ts')

if (!existsSync(originPath)) {
  console.log('ℹ Oryginał typów niedostępny (deploy) — pomijam sprawdzenie synchronizacji.')
  process.exit(0)
}

// Kopia ma własny nagłówek wyjaśniający, skąd pochodzi, a oryginał swój —
// porównujemy dopiero od pierwszej linii kodu, odcinając wiodące komentarze.
const copy = readFileSync(copyPath, 'utf8')
const origin = readFileSync(originPath, 'utf8')

const cut = (text) => {
  const lines = text.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i].trim()
    if (line === '' || line.startsWith('//')) i++
    else break
  }
  return lines.slice(i).join('\n').trim()
}

if (cut(copy) !== cut(origin)) {
  console.error('\n✗ admin-app/lib/types/database.ts rozjechał się z oryginałem.')
  console.error('  Oryginał: airsquad-web/lib/types/database.ts')
  console.error('  Napraw: npm run sync-types\n')
  process.exit(1)
}

console.log('✓ Typy bazy zgodne z oryginałem.')
