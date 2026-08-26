#!/usr/bin/env bash
# Wysyła zbudowaną statykę na serwer przez FTPS, przyrostowo.
#
#   ./scripts/deploy-ftp.sh staging      → new.airsquad.pl
#   ./scripts/deploy-ftp.sh production   → airsquad.pl
#   ./scripts/deploy-ftp.sh staging --dry-run   → pokazuje, co by zrobił
#
# DLACZEGO FTPS, A NIE RSYNC/SSH
# Serwer (ProFTPD na cyber-folks) ma zamknięty port 22 — scripts/deploy.sh
# oparty na rsync przez SSH nie ma jak zadziałać. Port 21 jest otwarty
# i odpowiada „234 AUTH TLS successful", a certyfikat to *.cyber-folks.pl
# od Certum. Dlatego wymuszamy TLS I weryfikację certyfikatu: bez tego
# hasło FTP leci przez sieć otwartym tekstem.
#
# HASŁO
# Nie trzymamy go w repo ani w zmiennych wywołania (byłoby widoczne w `ps`).
# Skrypt czyta ~/.netrc — standardowy plik uwierzytelniania, poza repozytorium.
# Załóż go raz:
#
#   machine sXX.cyber-folks.pl login TWOJ_LOGIN_FTP password TWOJE_HASLO
#
#   chmod 600 ~/.netrc
#
# Nazwę serwera (sXX.cyber-folks.pl) znajdziesz w panelu cyber_Folks.
# Musi to być nazwa z domeny cyber-folks.pl, bo tylko na nią pasuje certyfikat.

set -euo pipefail

TARGET="${1:-}"
DRY="${2:-}"

if [ "$TARGET" != "staging" ] && [ "$TARGET" != "production" ]; then
  echo "Użycie: $0 staging|production [--dry-run]" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

CONF="$ROOT/.deploy-target"
if [ ! -f "$CONF" ]; then
  cat >&2 <<MSG
✗ Brak $CONF

Utwórz go (jest w .gitignore) z dwiema liniami:

  FTP_HOST=sXX.cyber-folks.pl
  REMOTE_STAGING=/domains/airsquad.pl/public_html/new
  REMOTE_PRODUCTION=/domains/airsquad.pl/public_html

Hasło NIE tutaj — idzie do ~/.netrc (patrz komentarz na górze skryptu).
MSG
  exit 1
fi

# shellcheck disable=SC1090
source "$CONF"

: "${FTP_HOST:?Brak FTP_HOST w .deploy-target}"
if [ "$TARGET" = "staging" ]; then
  : "${REMOTE_STAGING:?Brak REMOTE_STAGING w .deploy-target}"
  REMOTE="$REMOTE_STAGING"
else
  : "${REMOTE_PRODUCTION:?Brak REMOTE_PRODUCTION w .deploy-target}"
  REMOTE="$REMOTE_PRODUCTION"
fi

case "$FTP_HOST" in
  *.cyber-folks.pl) ;;
  *)
    echo "✗ FTP_HOST musi być nazwą z domeny cyber-folks.pl — certyfikat FTPS" >&2
    echo "  jest wystawiony na *.cyber-folks.pl i tylko wtedy się zweryfikuje." >&2
    exit 1 ;;
esac

if [ ! -f "$HOME/.netrc" ]; then
  echo "✗ Brak ~/.netrc — bez niego skrypt nie ma jak się zalogować." >&2
  echo "  Format i uprawnienia opisane w komentarzu na górze tego pliku." >&2
  exit 1
fi
PERMS="$(stat -f '%A' "$HOME/.netrc" 2>/dev/null || stat -c '%a' "$HOME/.netrc")"
if [ "$PERMS" != "600" ]; then
  echo "✗ ~/.netrc ma uprawnienia $PERMS — hasło czytelne dla innych. Napraw:" >&2
  echo "    chmod 600 ~/.netrc" >&2
  exit 1
fi

command -v lftp >/dev/null 2>&1 || { echo "✗ Brak lftp. Zainstaluj: brew install lftp" >&2; exit 1; }

echo "→ Buduję statykę i .htaccess dla: $TARGET"
"$ROOT/scripts/make-deploy-zip.sh" "$TARGET" >/dev/null
echo "   ✓ out/ gotowe ($(find out -name '*.html' | wc -l | tr -d ' ') stron HTML)"

if [ ! -f out/.htaccess ]; then
  echo "✗ Brak out/.htaccess — przerywam, bo wysłałbym build bez konfiguracji serwera." >&2
  exit 1
fi

if [ "$TARGET" = "production" ] && [ "$DRY" != "--dry-run" ]; then
  if grep -q "noindex" out/.htaccess; then
    echo "✗ Paczka produkcyjna zawiera noindex — przerywam." >&2
    exit 1
  fi
  echo ""
  echo "!! Wysyłasz na PRODUKCJĘ: $FTP_HOST:$REMOTE"
  echo "   --delete skasuje na serwerze pliki, których nie ma w out/."
  printf "   Wpisz 'produkcja', żeby potwierdzić: "
  read -r ANSWER
  [ "$ANSWER" = "produkcja" ] || { echo "Przerwane."; exit 1; }
fi

MIRROR_OPTS="--reverse --delete --verbose --parallel=4 --exclude-glob .DS_Store"
[ "$DRY" = "--dry-run" ] && MIRROR_OPTS="$MIRROR_OPTS --dry-run"

echo "→ Synchronizuję z $FTP_HOST:$REMOTE"
# ssl-force + ssl-protect-data: TLS na kanale sterującym I na danych.
# ssl:verify-certificate yes: bez tego TLS chroni przed podsłuchem,
# ale nie przed podstawieniem serwera.
lftp -c "
set ftp:ssl-force true;
set ftp:ssl-protect-data true;
set ssl:verify-certificate yes;
set net:max-retries 3;
set net:timeout 20;
open ftp://$FTP_HOST;
mirror $MIRROR_OPTS out/ $REMOTE/;
bye
"

echo ""
if [ "$DRY" = "--dry-run" ]; then
  echo "Próba zakończona — nic nie wysłano."
else
  echo "Wysłane. Sprawdź:"
  [ "$TARGET" = "staging" ] && echo "  https://new.airsquad.pl/" || echo "  https://airsquad.pl/"
fi
