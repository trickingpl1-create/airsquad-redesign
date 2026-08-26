// Odtwarza admin-app/lib/types/database.ts z oryginału w aplikacji publicznej.
// Uruchamiaj po każdej zmianie pól w airsquad-web/lib/types/database.ts.
// Powód istnienia kopii i jej pilnowania — patrz check-types-sync.mjs.

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const copyPath = join(here, '..', 'lib', 'types', 'database.ts')
const originPath = join(here, '..', '..', 'lib', 'types', 'database.ts')

if (!existsSync(originPath)) {
  console.error('✗ Nie znajduję oryginału: ' + originPath)
  process.exit(1)
}

const HEADER = `// KOPIA. Oryginał: airsquad-web/lib/types/database.ts
//
// Panel jest wdrażany z CLI wprost z tego katalogu (\`vercel --prod\`), więc nie
// może importować niczego spoza admin-app/ — deploy wysyła tylko ten katalog.
// Dlatego zamiast re-eksportu trzymamy tu zsynchronizowaną kopię.
//
// Rozjazd typów oznaczałby ciche błędy w CRUD-zie, więc pilnuje tego
// scripts/check-types-sync.mjs (hook \`prebuild\`): build panelu przerwie się,
// jeśli ten plik różni się od oryginału. Nowe pola dopisuj w ORYGINALE,
// potem uruchom \`npm run sync-types\`.

`

writeFileSync(copyPath, HEADER + readFileSync(originPath, 'utf8'))
console.log('✓ Typy zsynchronizowane z oryginałem.')
