# Rozwój po go-live

Stan: **po launchu** — `airsquad.pl` serwuje nową stronę statyczną od **2026-10-05** (przebieg: `zamiana_strony.md` sekcja 0). Ten dokument opisuje **jak bezpiecznie wprowadzać zmiany teraz, gdy produkcja jest żywa i indeksowana przez Google.** Stan całości: `00-status.md`. Kontrakt adresów: `03-mapa-url.md`.

## Co się zmieniło względem okresu sprzed launchu

Wcześniej jedynym żywym środowiskiem był staging `new.airsquad.pl` i można było wdrażać do niego swobodnie. Teraz:

- **`airsquad.pl` = produkcja** — realny ruch, indeksowana, każdy błąd widzi użytkownik i Google.
- **`new.airsquad.pl` = staging** — ta sama paczka, ale z nagłówkiem `noindex, nofollow`. Służy do sprawdzenia zmiany **przed** produkcją.
- Staging leży **fizycznie wewnątrz** docrootu produkcji (`public_html/new`), dlatego deploy produkcyjny wyklucza katalog `new/` z kasowania — robi to skrypt, nie trzeba o tym pamiętać.

Zasada: **nic nie idzie na `airsquad.pl` bez przejścia przez staging.**

## Środowiska lokalne (`.claude/launch.json`)

| Config | Port | Do czego |
|---|---|---|
| **`airsquad-web-start`** | 2003 | **Rozwój + podgląd strony publicznej** (dev server, HMR). Codzienna praca. |
| `airsquad-web` | 2003 | Podpięcie się pod już działający serwer na :2003 (nie startuje nic). |
| `airsquad-out` | 2004 | Serwuje zbudowany eksport `out/` (`serve out`) — podgląd finalnej statyki 1:1 jak produkcja. |
| `airsquad-admin` | 2005 | Dev server panelu admina (`admin-app/`) — osobna aplikacja. |

Porty: **2003 = strona, 2004 = zbudowany eksport, 2005 = panel.** Nie odpalać `airsquad-web` i `airsquad-web-start` naraz (oba celują w 2003).

## Pętla na jedną zmianę

1. **Pobierz najnowsze** (równoległy czat pracuje na tym samym drzewie):
   ```bash
   cd airsquad-web && git pull
   ```
2. **Rozwój lokalny** — `airsquad-web-start` → `http://localhost:2003` (HMR).
3. **Zatwierdzenie** — zmianę pokazuje się użytkownikowi; nic się nie commituje/pushuje/wdraża bez jego wyraźnej zgody.
4. **Weryfikacja przed wysyłką** (brak lintera i testów — to cała siatka bezpieczeństwa):
   ```bash
   npx tsc --noEmit && npm run build
   ```
5. **Commit + push** — tylko na wyraźną komendę użytkownika. Zawsze `git add` konkretnych plików (nigdy `git add -A` — inny czat ma niezacommitowane `docs/00-status.md`, `docs/zamiana_strony.md`; `next-env.d.ts` jest generowany, nie commitować).
6. **Staging najpierw** → `new.airsquad.pl` (noindex):
   ```bash
   ./scripts/deploy-ftp.sh staging            # dodaj --dry-run, by zobaczyć plan bez wysyłki
   ```
   Weryfikacja na żywo na `https://new.airsquad.pl/`.
7. **Dopiero potem produkcja** → `airsquad.pl`:
   ```bash
   ./scripts/deploy-ftp.sh production
   ```
   Skrypt sam pilnuje bezpieczeństwa (patrz niżej). Weryfikacja na żywo na `https://airsquad.pl/`.

Oba cele robią `build` + `.htaccess` wewnątrz (`make-deploy-zip.sh`), więc to jedna komenda na środowisko. Marker sukcesu: `Wysłane.`

## Zabezpieczenia deploya (wbudowane w `scripts/deploy-ftp.sh`)

- Cel **staging** musi być katalogiem `…/new` i **nie może** być równy `REMOTE_PRODUCTION` — inaczej skrypt przerywa (żeby paczka z `noindex` nie trafiła na produkcję).
- Cel **production** przerywa, jeśli paczka zawiera `noindex`, i wymaga reguły `www → bez www`. Dodatkowo pyta o potwierdzenie — trzeba wpisać `produkcja`.
- Deploy produkcyjny **wyklucza `new/`** i `wp-content/uploads/` z `mirror --delete` — staging i pliki galerii/wideo starej strony przeżywają.

## Rollback

Awaryjny powrót do starego WordPressa (nietknięty w `public_html_wp/`):
```bash
./scripts/move-wp-aside.sh --rollback
```

## Reguły, które obowiązują zawsze

- Pull przed każdym taskiem; każda zmiana do zatwierdzenia; zero commitów/deployów bez zgody użytkownika.
- Slugi i URL-e nietykalne bez analizy — kontrakt SEO (`03-mapa-url.md`). Nagłówki `display` zawsze `fontWeight: 400`.
- System zapisów (AIPAX) jest zewnętrzny — nie dodajemy własnego kalendarza/formularza.

## Po stronie użytkownika (do odhaczenia po launchu)

- Google Search Console: dodać własność `airsquad.pl`, wysłać `sitemap.xml`.
- Cookiebot: dopisać `airsquad.pl` do Domain Group.
