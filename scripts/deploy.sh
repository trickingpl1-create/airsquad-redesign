#!/usr/bin/env bash
#
# Przebudowa strony publicznej i wgranie jej na serwer plików.
#
# Przy output: 'export' treść z Supabase zapieka się w HTML w momencie builda,
# więc zmiana w panelu admina pojawia się na stronie dopiero po uruchomieniu
# tego skryptu. Dane pobierane w przeglądarce (/sklep, /media, zapisy AIPAX)
# aktualizują się same — ich nie dotyczy.
#
# Wymaga zmiennych (najwygodniej w ~/.airsquad-deploy.env i `source` przed użyciem):
#   DEPLOY_HOST   użytkownik i host SSH, np. airsquad@srv12345.example.net
#   DEPLOY_PATH   katalog na serwerze serwowany przez nginx/Apache, np. /var/www/airsquad
#
# Użycie:
#   DEPLOY_HOST=... DEPLOY_PATH=... ./scripts/deploy.sh
#   ./scripts/deploy.sh --dry-run     # pokazuje, co poszłoby na serwer, nic nie wysyła

set -euo pipefail

cd "$(dirname "$0")/.."

DRY_RUN=""
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN="--dry-run"
  echo "── TRYB PRÓBNY: nic nie zostanie wysłane ──"
fi

if [[ -z "${DEPLOY_HOST:-}" || -z "${DEPLOY_PATH:-}" ]]; then
  echo "✗ Ustaw DEPLOY_HOST i DEPLOY_PATH (opis w nagłówku tego pliku)." >&2
  exit 1
fi

# `npm run build` odpala hook prebuild (scripts/check-build-env.mjs), który
# zatrzyma wszystko, jeśli env jest lokalny/placeholderowy — dzięki temu nie da
# się wgrać statyki z canonicalami na localhost.
echo "── Build ──"
npm run build

if [[ ! -f out/index.html || ! -f out/sitemap.xml ]]; then
  echo "✗ Katalog out/ wygląda na niekompletny — przerywam przed wysyłką." >&2
  exit 1
fi

echo "── Wysyłka na ${DEPLOY_HOST}:${DEPLOY_PATH} ──"
# Ukośnik po `out/` jest istotny: wysyłamy ZAWARTOŚĆ katalogu, nie sam katalog.
# --delete kasuje na serwerze pliki nieobecne w nowym buildzie (np. usunięte
# podstrony), inaczej stare HTML-e zostawałyby tam w nieskończoność.
rsync -avz --delete ${DRY_RUN} \
  --exclude '.DS_Store' \
  out/ "${DEPLOY_HOST}:${DEPLOY_PATH}/"

if [[ -n "${DRY_RUN}" ]]; then
  echo "── Tryb próbny zakończony — nic nie wysłano. ──"
else
  echo "── Gotowe. Sprawdź https://airsquad.pl/ i /sitemap.xml ──"
fi
