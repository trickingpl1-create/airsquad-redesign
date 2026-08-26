#!/usr/bin/env bash
# Wysyła zbudowaną statykę na serwer przez FTPS, przyrostowo.
#
#   ./scripts/deploy-ftp.sh staging --dry-run   → pokazuje, co by zrobił
#   ./scripts/deploy-ftp.sh staging             → wysyła
#
# DLACZEGO FTPS, A NIE RSYNC/SSH
# Serwer (ProFTPD na cyber-folks) ma zamknięty port 22, więc scripts/deploy.sh
# oparty na rsync nie ma jak zadziałać. Port 21 odpowiada „234 AUTH TLS
# successful", certyfikat to *.cyber-folks.pl od Certum.
#
# TRZY RZECZY, KTÓRE NIE SĄ OCZYWISTE
# 1. lftp NIE czyta ~/.netrc, gdy nie poda mu się nazwy użytkownika — próbuje
#    wtedy logowania anonimowego i dostaje „530 Login incorrect", co wygląda
#    jak złe hasło. Dlatego czytamy netrc sami.
# 2. Hasła nie da się podać w linii poleceń, bo byłoby widoczne w `ps` dla
#    każdego procesu. Idzie do pliku poleceń o uprawnieniach 600, kasowanego
#    przez trap nawet przy przerwaniu skryptu.
# 3. Serwer wysyła NIEKOMPLETNY łańcuch certyfikatów — bez pośredniego CA.
#    curl to nadrabia, lftp nie. Dlatego budujemy własny magazyn, dociągając
#    brakujące ogniwo z adresu w rozszerzeniu AIA certyfikatu serwera.
#
# HASŁO w ~/.netrc, w jednej linii, chmod 600:
#   machine s176.cyber-folks.pl login LOGIN password HASLO

set -euo pipefail

TARGET="${1:-}"
DRY="${2:-}"
[ "$TARGET" = "staging" ] || [ "$TARGET" = "production" ] || {
  echo "Użycie: $0 staging|production [--dry-run]" >&2; exit 1; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

[ -f "$ROOT/.deploy-target" ] || { echo "✗ Brak .deploy-target" >&2; exit 1; }
# shellcheck disable=SC1090
source "$ROOT/.deploy-target"
: "${FTP_HOST:?Brak FTP_HOST}"

if [ "$TARGET" = "staging" ]; then REMOTE="${REMOTE_STAGING:-}"; else REMOTE="${REMOTE_PRODUCTION:-}"; fi
[ -n "$REMOTE" ] || { echo "✗ Brak ścieżki dla '$TARGET' w .deploy-target." >&2; exit 1; }

case "$FTP_HOST" in *.cyber-folks.pl) ;; *)
  echo "✗ FTP_HOST musi być z domeny cyber-folks.pl — na inną nazwę certyfikat się nie zweryfikuje." >&2
  exit 1 ;; esac

# Cel staging MUSI kończyć się na "new". Katalog produkcyjny airsquad.pl
# zawiera żywego WordPressa, a mirror --delete skasowałby go bez pytania.
# Ten warunek sprawia, że pomyłka w .deploy-target zatrzyma się tutaj,
# zamiast na serwerze.
if [ "$TARGET" = "staging" ]; then
  case "$REMOTE" in
    *new|*new/|.) ;;
    *) echo "✗ Cel staging to '$REMOTE' — spodziewam się katalogu 'new'." >&2
       echo "  Odmawiam synchronizacji: pod airsquad.pl/public_html stoi produkcja." >&2
       exit 1 ;;
  esac
fi

[ -f "$HOME/.netrc" ] || { echo "✗ Brak ~/.netrc" >&2; exit 1; }
PERMS="$(stat -f '%A' "$HOME/.netrc" 2>/dev/null || stat -c '%a' "$HOME/.netrc")"
[ "$PERMS" = "600" ] || { echo "✗ ~/.netrc ma uprawnienia $PERMS — napraw: chmod 600 ~/.netrc" >&2; exit 1; }
command -v lftp >/dev/null || { echo "✗ Brak lftp: brew install lftp" >&2; exit 1; }

# --- magazyn CA: dociąga pośredni certyfikat, jeśli go nie ma ---
CA_DIR="$ROOT/.certs"
CA_BUNDLE="$CA_DIR/ftp-ca-bundle.pem"
if [ ! -f "$CA_BUNDLE" ]; then
  echo "→ Buduję magazyn CA (serwer nie wysyła pełnego łańcucha)…"
  mkdir -p "$CA_DIR"
  SYS_CA=""
  for c in /opt/homebrew/etc/ca-certificates/cert.pem /etc/ssl/cert.pem; do
    [ -f "$c" ] && { SYS_CA="$c"; break; }
  done
  [ -n "$SYS_CA" ] || { echo "✗ Nie znajduję systemowego magazynu CA." >&2; exit 1; }
  AIA="$(openssl s_client -connect "$FTP_HOST:21" -starttls ftp </dev/null 2>/dev/null \
        | openssl x509 -noout -text 2>/dev/null \
        | grep -o 'URI:http[^ ]*' | sed 's/URI://' | grep -iE '\.(cer|crt|pem)$' | head -1)"
  [ -n "$AIA" ] || { echo "✗ Nie znajduję adresu pośredniego CA w certyfikacie serwera." >&2; exit 1; }
  curl -sS --max-time 20 -o "$CA_DIR/intermediate.der" "$AIA"
  openssl x509 -inform DER -in "$CA_DIR/intermediate.der" -out "$CA_DIR/intermediate.pem" 2>/dev/null \
    || cp "$CA_DIR/intermediate.der" "$CA_DIR/intermediate.pem"
  cat "$SYS_CA" "$CA_DIR/intermediate.pem" > "$CA_BUNDLE"
  echo "   ✓ $(grep -c 'BEGIN CERTIFICATE' "$CA_BUNDLE") certyfikatów"
fi

echo "→ Buduję statykę i .htaccess dla: $TARGET"
"$ROOT/scripts/make-deploy-zip.sh" "$TARGET" >/dev/null
[ -f out/.htaccess ] || { echo "✗ Brak out/.htaccess — przerywam." >&2; exit 1; }
echo "   ✓ $(find out -name '*.html' | wc -l | tr -d ' ') stron HTML"

if [ "$TARGET" = "production" ] && [ "$DRY" != "--dry-run" ]; then
  grep -q noindex out/.htaccess && { echo "✗ Paczka produkcyjna ma noindex — przerywam." >&2; exit 1; }
  echo ""; echo "!! PRODUKCJA: $FTP_HOST:$REMOTE — --delete skasuje pliki spoza out/"
  printf "   Wpisz 'produkcja', żeby potwierdzić: "; read -r A
  [ "$A" = "produkcja" ] || { echo "Przerwane."; exit 1; }
fi

# --perms przenosi uprawnienia na serwer. Bez tego pliki wgrane wcześniej
# z uprawnieniami 600 zostawałyby nieczytelne dla Apache (403), bo mirror
# pomija pliki o niezmienionej treści i nigdy by ich nie poprawił.
MIRROR="--reverse --delete --perms --verbose --parallel=4 --exclude-glob .DS_Store --exclude-glob cgi-bin/"
[ "$DRY" = "--dry-run" ] && MIRROR="$MIRROR --dry-run"

CMDFILE="$(mktemp)"; chmod 600 "$CMDFILE"
trap 'rm -f "$CMDFILE"' EXIT INT TERM

PW="$(python3 -c "
import os
t=open(os.path.expanduser('~/.netrc'),encoding='utf-8').read().split()
print(t[t.index('password')+1])
")"

python3 - "$CMDFILE" "$CA_BUNDLE" "$FTP_HOST" "$REMOTE" "$MIRROR" <<'PY'
import os, sys
cmdfile, ca, host, remote, mirror = sys.argv[1:6]
t = open(os.path.expanduser('~/.netrc'), encoding='utf-8').read().split()
user, pw = t[t.index('login')+1], t[t.index('password')+1]
esc = lambda v: "'" + v.replace("'", "''") + "'"
open(cmdfile, 'w', encoding='utf-8').write(
    f"set ssl:ca-file {ca}\n"
    "set ftp:ssl-force true\nset ftp:ssl-protect-data true\n"
    "set ssl:verify-certificate yes\nset net:timeout 25\nset net:max-retries 3\n"
    f"open ftp://{host}\n"
    f"user {esc(user)} {esc(pw)}\n"
    f"mirror {mirror} out/ {remote}/\n"
    "bye\n"
)
PY

echo "→ Synchronizuję z $FTP_HOST:$REMOTE"
# lftp potrafi wypisać hasło w komunikacie błędu — filtrujemy KAŻDĄ linię wyjścia.
set +e
lftp -f "$CMDFILE" 2>&1 | sed "s|${PW}|<ukryte>|g"
STATUS=${PIPESTATUS[0]}
set -e
[ "$STATUS" -eq 0 ] || { echo "✗ lftp zakończył się kodem $STATUS" >&2; exit "$STATUS"; }

echo ""
[ "$DRY" = "--dry-run" ] && echo "Próba zakończona — nic nie wysłano." || echo "Wysłane."
