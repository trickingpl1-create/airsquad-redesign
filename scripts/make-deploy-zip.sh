#!/usr/bin/env bash
# Buduje out/ i pakuje do zipa gotowego pod menedżer plików DirectAdmin.
#
# Powód istnienia: .htaccess dla wersji testowej NIE MOŻE leżeć w public/,
# bo public/ trafia do KAŻDEGO builda — także produkcyjnego. Wersja testowa
# ma noindex; wysłanie tego samego pliku na airsquad.pl wyrzuciłoby produkcję
# z Google. Dlatego .htaccess powstaje tutaj, zależnie od celu.
#
#   ./scripts/make-deploy-zip.sh staging      → new.airsquad.pl (noindex)
#   ./scripts/make-deploy-zip.sh production   → airsquad.pl (indeksowana)
#
set -euo pipefail

TARGET="${1:-}"
if [ "$TARGET" != "staging" ] && [ "$TARGET" != "production" ]; then
  echo "Użycie: $0 staging|production" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ Buduję statykę…"
npm run build

if [ ! -f out/index.html ]; then
  echo "✗ Brak out/index.html — build nie wyprodukował statyki." >&2
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M)"
OUTZIP="$ROOT/../airsquad-${TARGET}-${STAMP}.zip"

echo "→ Składam .htaccess dla: $TARGET"
{
  echo "# Wygenerowane przez scripts/make-deploy-zip.sh — nie edytować ręcznie."
  echo "ErrorDocument 404 /404.html"
  echo ""
  echo "# Strona jest eksportem statycznym z trailingSlash: true — katalogi mają"
  echo "# własny index.html, więc wystarczy domyślne zachowanie Apache."
  echo "DirectoryIndex index.html"
  echo ""
  if [ "$TARGET" = "staging" ]; then
    echo "# WERSJA TESTOWA — nie może trafić do wyszukiwarki obok produkcji."
    echo '<IfModule mod_headers.c>'
    echo '  Header set X-Robots-Tag "noindex, nofollow"'
    echo '</IfModule>'
  else
    echo "# Wersja produkcyjna — indeksowanie włączone, bez nagłówka noindex."
  fi
  echo ""
  node scripts/emit-redirects.mjs
} > out/.htaccess

# Wycofana lokalizacja nie może jednocześnie mieć swojej strony w buildzie —
# to znak, że ktoś dopisał ją do withdrawn-locations.json, ale nie usunął
# rekordu z lib/content/cities.ts. Wysyłka takiej paczki daje sprzeczność:
# 301 obok istniejącego pliku.
echo "→ Sprawdzam spójność wycofanych lokalizacji…"
node -e '
  const fs = require("node:fs")
  const list = JSON.parse(fs.readFileSync("lib/content/withdrawn-locations.json", "utf8"))
  let bad = 0
  for (const loc of list) {
    if (fs.existsSync("out/" + loc.slug + "/index.html")) {
      console.error("   ✗ " + loc.slug + " jest wycofany, ale out/" + loc.slug + "/index.html istnieje.")
      console.error("     Usuń jego rekord z lib/content/cities.ts i zbuduj ponownie.")
      bad++
    }
    if (!fs.existsSync("out/" + (loc.redirectTo.replace(/^\/|\/$/g, "")) + "/index.html")) {
      console.error("   ✗ " + loc.slug + ": cel 301 " + loc.redirectTo + " nie istnieje w buildzie.")
      bad++
    }
  }
  if (bad) process.exit(1)
  console.log("   ✓ " + list.length + " wycofanych, każda z działającym celem 301")
'

echo "→ Pakuję (zip zawiera .htaccess, bo -y i kropkowe pliki są uwzględnione)…"
rm -f "$OUTZIP"
( cd out && zip -rq "$OUTZIP" . -x '.DS_Store' )

echo "→ Kontrola zawartości:"
unzip -l "$OUTZIP" | grep -E "\.htaccess|index\.html$" | head -3
echo "   stron HTML: $(cd out && find . -name '*.html' | wc -l | tr -d ' ')"
if [ "$TARGET" = "staging" ]; then
  grep -q "noindex" out/.htaccess && echo "   ✓ noindex obecny" || { echo "   ✗ BRAK noindex" >&2; exit 1; }
else
  grep -q "noindex" out/.htaccess && { echo "   ✗ noindex w paczce PRODUKCYJNEJ" >&2; exit 1; } || echo "   ✓ bez noindex"
fi

echo ""
echo "Gotowe: $OUTZIP"
