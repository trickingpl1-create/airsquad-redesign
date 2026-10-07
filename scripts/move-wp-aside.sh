#!/usr/bin/env bash
# Odsuwa starego WordPressa z docrootu produkcji — BEZ KASOWANIA CZEGOKOLWIEK.
#
#   ./scripts/move-wp-aside.sh              → pokazuje plan, nic nie rusza
#   ./scripts/move-wp-aside.sh --apply      → przenosi (pyta o potwierdzenie)
#   ./scripts/move-wp-aside.sh --rollback   → cofa CAŁĄ podmianę (oba etapy):
#                                             WordPress wraca pod airsquad.pl
#   ./scripts/move-wp-aside.sh --apply-wp-content
#                                           → tylko drugi etap (2026-10-06): kod WP
#                                             z wp-content/ + blokada PHP (pyta)
#   ./scripts/move-wp-aside.sh --rollback-wp-content
#                                           → cofa TYLKO drugi etap; nowa strona
#                                             zostaje pod airsquad.pl
#
# PO CO
# Katalog `public_html` to docroot airsquad.pl i stoi w nim WordPress. Żeby
# wszedł tam eksport statyczny, pliki WP muszą zejść z drogi. Nie kasujemy ich:
# przenosimy o jeden poziom wyżej, do `public_html_wp`, który leży OBOK
# `public_html`, a więc jest poza zasięgiem serwera WWW (nikt go nie otworzy
# z przeglądarki). Rollback to te same przenosiny w drugą stronę.
#
# CO ZOSTAJE W MIEJSCU I DLACZEGO
#   wp-content/   — nowa strona ładuje stamtąd 54 pliki (8 filmów „Nasze
#                   zajawki" + 46 zdjęć galerii, ok. 310 MB) na /letni/ i
#                   landingach miast; dodatkowo 271 obrazów z tego katalogu
#                   zna Google Images ze starej sitemapy. Zostają więc uploads/
#                   i gallery/ (zdjęcia starej galerii NextGEN). Przenosimy:
#                   duplicator-backups/ (kopie Duplicatora potrafią zawierać
#                   zrzut bazy) oraz — od 2026-10-06 — cały kod WordPressa:
#                   wtyczki, motywy, mu-plugins, upgrade*, languages. Ich pliki
#                   PHP dało się wywołać z internetu, a readme.txt ujawniały
#                   wersje porzuconych, nieaktualizowanych wtyczek (audyt F02).
#                   Do wp-content/ trafia .htaccess blokujący wykonywanie PHP
#                   (scripts/wp-content.htaccess); rollback go zdejmuje.
#   new/          — katalog wersji testowej (new.airsquad.pl) leży fizycznie
#                   wewnątrz public_html produkcji.
#   cgi-bin/      — katalog systemowy hostingu.
#   *.html o losowych nazwach — pliki weryfikacji domeny. Skasowanie albo
#                   przeniesienie unieważnia weryfikację (np. w Search Console).
#
# Baza danych NIE jest ruszana. Rollback nie wymaga jej kopii.

set -euo pipefail

MODE="${1:-}"
case "$MODE" in
  ""|--dry-run)       ACTION="plan" ;;
  --apply)            ACTION="apply" ;;
  --apply-wp-content) ACTION="apply-wp-content" ;;
  --rollback)         ACTION="rollback" ;;
  --rollback-wp-content) ACTION="rollback-wp-content" ;;
  *) echo "Użycie: $0 [--apply|--apply-wp-content|--rollback|--rollback-wp-content]" >&2; exit 1 ;;
esac

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

[ -f "$ROOT/.deploy-target" ] || { echo "✗ Brak .deploy-target" >&2; exit 1; }
# shellcheck disable=SC1090
source "$ROOT/.deploy-target"
: "${FTP_HOST:?Brak FTP_HOST}"

PROD="${REMOTE_PRODUCTION:-}"
[ -n "$PROD" ] || { echo "✗ REMOTE_PRODUCTION jest puste w .deploy-target." >&2; exit 1; }
PROD="${PROD%/}"
ASIDE="${PROD}_wp"

[ -f "$HOME/.netrc" ] || { echo "✗ Brak ~/.netrc" >&2; exit 1; }
PERMS="$(stat -f '%A' "$HOME/.netrc" 2>/dev/null || stat -c '%a' "$HOME/.netrc")"
[ "$PERMS" = "600" ] || { echo "✗ ~/.netrc ma uprawnienia $PERMS — napraw: chmod 600 ~/.netrc" >&2; exit 1; }
command -v lftp >/dev/null || { echo "✗ Brak lftp: brew install lftp" >&2; exit 1; }

CA_BUNDLE="$ROOT/.certs/ftp-ca-bundle.pem"
[ -f "$CA_BUNDLE" ] || { echo "✗ Brak $CA_BUNDLE — uruchom najpierw ./scripts/deploy-ftp.sh staging --dry-run" >&2; exit 1; }

# Pliki i katalogi WordPressa w korzeniu docrootu — spisane z serwera 2026-10-05.
# Kolejność bez znaczenia: każdy wpis to osobne RNFR/RNTO, czyli zmiana nazwy
# po stronie serwera (natychmiastowa, bez przesyłania danych).
ITEMS=(
  ".htaccess"
  ".htaccess.2021-06-17-1623939221"
  ".htaccess.2025-01-21-1737444234"
  ".htaccess.2025-01-21-1737444531"
  "index.php"
  "license.txt"
  "readme.html"
  "wp-activate.php"
  "wp-admin"
  "wp-blog-header.php"
  "wp-comments-post.php"
  "wp-config-sample.php"
  "wp-config.php"
  "wp-cron.php"
  "wp-includes"
  "wp-links-opml.php"
  "wp-load.php"
  "wp-login.php"
  "wp-mail.php"
  "wp-settings.php"
  "wp-signup.php"
  "wp-trackback.php"
  "xmlrpc.php"
)
# Kod WordPressa w wp-content/ — spisany z serwera 2026-10-06. Etap drugi
# (--apply-wp-content); pełny --apply i --rollback obejmują go razem z resztą.
WP_CONTENT_CODE=(
  "wp-content/plugins"
  "wp-content/themes"
  "wp-content/mu-plugins"
  "wp-content/upgrade"
  "wp-content/upgrade-temp-backup"
  "wp-content/languages"
  "wp-content/index.php"
  "wp-content/rsssl-managed-htaccess.lock"
)
NESTED=( "wp-content/duplicator-backups" "${WP_CONTENT_CODE[@]}" )
WP_CONTENT_HTACCESS="$ROOT/scripts/wp-content.htaccess"

if [ "$ACTION" = "plan" ]; then
  echo "PLAN (nic nie zostanie zmienione)"
  echo ""
  echo "  serwer:     $FTP_HOST"
  echo "  z:          $PROD/"
  echo "  do:         $ASIDE/   (obok docrootu — niedostępny z przeglądarki)"
  echo ""
  echo "  Przeniesione (${#ITEMS[@]} pozycji w korzeniu + ${#NESTED[@]} zagnieżdżona):"
  for i in "${ITEMS[@]}"; do echo "    → $i"; done
  for i in "${NESTED[@]}"; do echo "    → $i"; done
  echo ""
  echo "  Zostaje w miejscu:"
  echo "    · wp-content/uploads/ i wp-content/gallery/ — filmy, galerie, 271 obrazów z Google Images"
  echo "      (+ wp-content/.htaccess blokujący wykonywanie PHP)"
  echo "    · new/        — wersja testowa"
  echo "    · cgi-bin/    — katalog hostingu"
  echo "    · 5x9t82plju2orf9n5cozmu7uzvozh5.html, qqo1u10feqoy353e9bs3hjimex4ek7.html — weryfikacja domeny"
  echo ""
  echo "  Baza danych: NIE RUSZANA."
  echo ""
  echo "  Od chwili przenosin do końca wysyłki nowej strony airsquad.pl zwraca błąd."
  echo "  Zaraz po tym kroku uruchom: ./scripts/deploy-ftp.sh production"
  echo ""
  echo "Aby wykonać: $0 --apply"
  exit 0
fi

if [ "$ACTION" = "apply-wp-content" ]; then
  echo "!! $FTP_HOST — przenosiny kodu WordPressa z $PROD/wp-content/ do $ASIDE/wp-content/"
  for i in "${WP_CONTENT_CODE[@]}"; do echo "    → $i"; done
  echo "   + wgranie $PROD/wp-content/.htaccess (blokada PHP)."
  echo "   Media (uploads/, gallery/) zostają. Nic nie jest kasowane. Cofnięcie: $0 --rollback-wp-content"
  printf "   Wpisz 'przenies', żeby potwierdzić: "; read -r A
  [ "$A" = "przenies" ] || { echo "Przerwane."; exit 1; }
elif [ "$ACTION" = "rollback-wp-content" ]; then
  echo "!! $FTP_HOST — cofnięcie drugiego etapu: kod WP z $ASIDE/wp-content/ z powrotem do $PROD/wp-content/"
  for i in "${WP_CONTENT_CODE[@]}"; do echo "    ← $i"; done
  echo "   + zdjęcie $PROD/wp-content/.htaccess (blokada PHP) na bok."
  echo "   Nowa strona zostaje pod airsquad.pl (to NIE jest pełny rollback podmiany)."
  printf "   Wpisz 'cofnij', żeby potwierdzić: "; read -r A
  [ "$A" = "cofnij" ] || { echo "Przerwane."; exit 1; }
elif [ "$ACTION" = "apply" ]; then
  echo "!! $FTP_HOST — przenosiny starego WordPressa z $PROD/ do $ASIDE/"
  echo "   Nic nie jest kasowane. Cofnięcie: $0 --rollback"
  echo "   UWAGA: od tej chwili airsquad.pl będzie zwracać błąd, dopóki nie"
  echo "   wgrasz nowej strony (./scripts/deploy-ftp.sh production)."
  printf "   Wpisz 'przenies', żeby potwierdzić: "; read -r A
  [ "$A" = "przenies" ] || { echo "Przerwane."; exit 1; }
else
  echo "!! $FTP_HOST — COFANIE: $ASIDE/ z powrotem do $PROD/"
  echo "   Stara strona wróci pod airsquad.pl; pliki nowej strony zostaną nadpisane"
  echo "   tam, gdzie nazwy się pokrywają (.htaccess, index.php)."
  printf "   Wpisz 'cofnij', żeby potwierdzić: "; read -r A
  [ "$A" = "cofnij" ] || { echo "Przerwane."; exit 1; }
fi

CMDFILE="$(mktemp)"; chmod 600 "$CMDFILE"
trap 'rm -f "$CMDFILE"' EXIT INT TERM

PW="$(python3 -c "
import os
t=open(os.path.expanduser('~/.netrc'),encoding='utf-8').read().split()
print(t[t.index('password')+1])
")"

python3 - "$CMDFILE" "$CA_BUNDLE" "$FTP_HOST" "$PROD" "$ASIDE" "$ACTION" "$WP_CONTENT_HTACCESS" "${ITEMS[@]}" "--nested--" "${NESTED[@]}" "--wpcode--" "${WP_CONTENT_CODE[@]}" <<'PY'
import os, sys
cmdfile, ca, host, prod, aside, action, htaccess = sys.argv[1:8]
rest = sys.argv[8:]
split = rest.index('--nested--')
split2 = rest.index('--wpcode--')
items, nested, wpcode = rest[:split], rest[split+1:split2], rest[split2+1:]

t = open(os.path.expanduser('~/.netrc'), encoding='utf-8').read().split()
user, pw = t[t.index('login')+1], t[t.index('password')+1]
esc = lambda v: "'" + v.replace("'", "''") + "'"

lines = [
    f"set ssl:ca-file {ca}",
    "set ftp:ssl-force true",
    "set ftp:ssl-protect-data true",
    "set ssl:verify-certificate yes",
    "set net:timeout 25",
    "set net:max-retries 3",
    f"open ftp://{host}",
    f"user {esc(user)} {esc(pw)}",
]

# .htaccess z blokadą PHP: wgrywany przy przenosinach kodu, przy rollbacku
# odkładany obok (stary WP nie miał tego pliku w wp-content/).
put_htaccess = f"put {esc(htaccess)} -o {esc(prod + '/wp-content/.htaccess')}"
if action == 'apply':
    lines.append(f"mkdir -f {esc(aside)}")
    lines.append(f"mkdir -f {esc(aside + '/wp-content')}")
    for i in items:
        lines.append(f"mv {esc(prod + '/' + i)} {esc(aside + '/' + i)}")
    for i in nested:
        lines.append(f"mv {esc(prod + '/' + i)} {esc(aside + '/' + i)}")
    lines.append(put_htaccess)
elif action == 'apply-wp-content':
    lines.append(f"mkdir -f {esc(aside + '/wp-content')}")
    for i in wpcode:
        lines.append(f"mv {esc(prod + '/' + i)} {esc(aside + '/' + i)}")
    lines.append(put_htaccess)
    lines.append("echo '--- wp-content po operacji ---'")
    lines.append(f"cls -1a --sort=name {esc(prod + '/wp-content/')}")
elif action == 'rollback-wp-content':
    lines.append(f"mv {esc(prod + '/wp-content/.htaccess')} {esc(aside + '/wp-content.htaccess.nowa-strona')}")
    for i in wpcode:
        lines.append(f"mv {esc(aside + '/' + i)} {esc(prod + '/' + i)}")
else:
    lines.append(f"mv {esc(prod + '/wp-content/.htaccess')} {esc(aside + '/wp-content.htaccess.nowa-strona')}")
    for i in items:
        lines.append(f"mv {esc(aside + '/' + i)} {esc(prod + '/' + i)}")
    for i in nested:
        lines.append(f"mv {esc(aside + '/' + i)} {esc(prod + '/' + i)}")

lines.append("echo '--- stan docrootu po operacji ---'")
lines.append(f"cls -1 --sort=name {esc(prod + '/')}")
lines.append("bye")
open(cmdfile, 'w', encoding='utf-8').write("\n".join(lines) + "\n")
PY

echo ""
echo "→ Wykonuję…"
set +e
lftp -f "$CMDFILE" 2>&1 | sed "s|${PW}|<ukryte>|g"
STATUS=${PIPESTATUS[0]}
set -e

echo ""
if [ "$STATUS" -ne 0 ]; then
  echo "✗ lftp zakończył się kodem $STATUS — sprawdź listing powyżej." >&2
  echo "  Operacja jest odwracalna: $0 --rollback" >&2
  exit "$STATUS"
fi

if [ "$ACTION" = "apply" ]; then
  echo "Przeniesione. Teraz: ./scripts/deploy-ftp.sh production"
elif [ "$ACTION" = "apply-wp-content" ]; then
  echo "Przeniesione. Sprawdź: media z wp-content/uploads → 200, *.php w wp-content → 403/404."
elif [ "$ACTION" = "rollback-wp-content" ]; then
  echo "Cofnięte — kod WP znów w $PROD/wp-content/, blokada PHP zdjęta. Nowa strona bez zmian."
else
  echo "Cofnięte — stara strona powinna znów działać pod airsquad.pl."
fi
