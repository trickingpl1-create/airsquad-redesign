# Podmiana starej strony na nową — przebieg i audyt SEO

> ## ✅ PODMIANA WYKONANA 2026-10-05, ok. 14:50
> `airsquad.pl` serwuje nową stronę statyczną. Stary WordPress żyje nietknięty w `public_html_wp/` (poza webrootem). Baza danych WordPressa nie była ruszana.

Wersja testowa: `https://new.airsquad.pl/` (noindex) — **działa dalej**, workflow `deploy-ftp.sh staging` bez zmian. Stan projektu jako całości: `00-status.md`. Kontrakt adresów: `03-mapa-url.md`.

Sekcja 0 opisuje, co się realnie wydarzyło. Sekcje 1–6 to **audyt z 2026-09-26**, który do tego doprowadził (6 równoległych audytów + weryfikacja krzyżowa przez niezależnych sceptyków; dwa ustalenia audytorów zostały w tym trybie obalone) — zachowane, bo tłumaczą *dlaczego* procedura wygląda tak, a nie inaczej. Sekcja 7 to starszy audyt z 2026-09-06, z adnotacjami, co się zdezaktualizowało.

---

## 0. Jak przebiegła podmiana (2026-10-05)

Wykonano **model C** z sekcji 3. Przerwa w działaniu: ok. 2 minuty.

### Przebieg

1. `./scripts/make-deploy-zip.sh production` — pierwsze w historii projektu udane złożenie paczki produkcyjnej (wcześniej blokował ją błąd opisany niżej). Kontrole: `✓ bez noindex`, `✓ reguła www → bez www`, 45 stron HTML.
2. `./scripts/move-wp-aside.sh --apply` — 23 pozycje z korzenia `public_html` + `wp-content/duplicator-backups/` przeniesione (RNFR/RNTO po stronie serwera, bez transferu) do `public_html_wp/`, który leży **obok** docrootu i jest niedostępny z przeglądarki. W docroocie zostały dokładnie cztery rzeczy: `wp-content/`, `new/`, `cgi-bin/` i dwa pliki weryfikacji domeny.
3. `./scripts/deploy-ftp.sh production` — `lftp mirror --delete` z wykluczeniami; `--delete` nie miał już czego kasować.

### Weryfikacja po podmianie (wszystko zielone)

| Sprawdzenie | Wynik |
|---|---|
| `X-Robots-Tag` na `/`, `/rzeszow/`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | **brak** — Google ma pełny dostęp |
| 29 adresów ze starej sitemapy Yoasta | **18 × 200, 11 × 301** na właściwe cele, **0 × 404** |
| `www.airsquad.pl` → `airsquad.pl` | 301 (także z pełną ścieżką) |
| `http://` → `https://` | 301 (warstwa hostingu, bez zmian) |
| `/sitemap_index.xml`, `/page-sitemap.xml` | 301 → `/sitemap.xml` |
| Filmy z `wp-content/uploads/` | 200 — galerie i „Nasze zajawki" nienaruszone |
| `/opengraph-image` | `Content-Type: image/png` |
| Nieistniejący adres | twarde 404 |
| `wp-login.php`, `wp-admin/`, `wp-config.php`, `xmlrpc.php`, `index.php`, `readme.html`, `duplicator-backups/`, `public_html_wp/` | **404** — stary WP nieosiągalny z internetu |
| canonical `/rzeszow/`, sitemap (28 adresów), `robots.txt` | wszystko na `https://airsquad.pl` |
| Baner Cookiebot, widget zapisów AIPAX | obecne |
| `new.airsquad.pl` | 200 — staging przeżył |

### Co naprawiono po drodze

- **Ścieżka produkcyjna była martwa od początku.** Kontrola „czy paczka nie zawiera noindex" szukała w `.htaccess` *słowa* `noindex`, które padało również w komentarzu wersji produkcyjnej (`# …bez nagłówka noindex`). Każde `make-deploy-zip.sh production` i `deploy-ftp.sh production` przerywało z błędem, którego nie było. Nigdy nie wyszło na jaw, bo ścieżki produkcyjnej nikt nie uruchomił. Teraz kontrola szuka dyrektywy `Header set X-Robots-Tag`, a komentarz nie zawiera już tego słowa.
- **`www → bez www`** dopisane do produkcyjnego `.htaccess` (do podmiany robił to PHP WordPressa; bez tego `www.airsquad.pl` serwowałby drugą kopię całej strony pod 200). `deploy-ftp.sh` odmawia teraz wysyłki produkcyjnej bez tej reguły.
- **301 dla starych map strony** (`/sitemap_index.xml`, `/page-sitemap.xml` → `/sitemap.xml`).
- **Wykluczenia `--delete`** rozszerzone z `wp-content/uploads/` na: całe `wp-content/`, `new/`, `public_html_wp/`, `.well-known/` i dwa pliki weryfikacji domeny. Bez `new/` pierwsza wysyłka produkcyjna skasowałaby staging, który leży w podkatalogu docrootu produkcji.
- **Strażnik stagingu** odmawia też, gdy cel stagingu równa się `REMOTE_PRODUCTION` (sama nazwa katalogu „new" to za słaby warunek, skoro leży wewnątrz produkcji).
- **`REMOTE_PRODUCTION=public_html`** uzupełnione; fałszywy komentarz w `.deploy-target` („produkcja poza zasięgiem tego konta, to inna domena") usunięty. Konto `MG@airsquad.pl` ma dostęp do docrootu produkcji — bloker „trzeba założyć konto FTP", ciągnięty od 06.09, nigdy nie istniał.
- `wp-content/duplicator-backups/` przeniesione poza webroot (kopie Duplicatora potrafią zawierać zrzut bazy; katalog odpowiadał 200 z webrootu).

### Rollback (nadal dostępny)

```
./scripts/move-wp-aside.sh --rollback   # potwierdzenie: cofnij
```
Przywraca stary WordPress pod `airsquad.pl`. Baza nietknięta, więc nie wymaga odtwarzania. Pliki nowej strony zostają na dysku (nadpisane tylko tam, gdzie nazwy się pokrywają: `.htaccess`, `index.php`).

### Zostało do zrobienia

**Natychmiast (Gabriel):**
- Search Console: własność domenowa `airsquad.pl` → wysłać `sitemap.xml`, usunąć `sitemap_index.xml`, „Poproś o zindeksowanie" dla `/`, `/rzeszow/`, `/akrobatyka/`, `/letni/`
- Cookiebot → Settings → Domains: upewnić się, że Domain Group zawiera `airsquad.pl` i `www.airsquad.pl`

**W kolejnych dniach:** Supabase (sklep i `/media/` są puste — świadoma decyzja z 2026-10-05: „bez sklepu, lecimy"), `og:image` na 29 stronach, treść `/airmeeting/` i `/gravityjam/`, brak analityki, placeholder AIPAX na `/grafik/` i `/zapisy/`, tytuły 61–70 znaków.

**Monitoring:** 24 h — Search Console „Błędy 404" i „Strona z przekierowaniem". 2–8 tygodni — pozycje na `akrobatyka rzeszów`, `akrobatyka dębica`, `tricking rzeszów`, `air camp`. Ok. 20.11.2026 — odnowienie certyfikatu Let's Encrypt.

---

## 1. Werdykt

**Pytanie:** przepiąć adresy tak, żeby stara strona była na `new.airsquad.pl`, a nowa na `airsquad.pl` — „nic nie usuwać, tylko przepiąć". Czy to bezpieczne i czy SEO jest na to gotowe?

**Odpowiedź: na dziś NIE — ale nie dlatego, że nowa strona jest niegotowa.** Warstwa adresów i metadanych jest gotowa w całości (sekcja 5). Blokują trzy rzeczy mechaniczne: katalog stagingu niesie nagłówek `noindex`, który wyindeksowałby produkcję; 54 pliki wideo/galerii nowej strony fizycznie leżą w katalogu WordPressa; a WordPress przeniesiony pod `new.airsquad.pl` **nie zadziała** bez edycji konfiguracji, bo ma adres `https://airsquad.pl` zapisany w bazie.

**SEO: warunkowo gotowe.** Po trzech poprawkach w `.htaccess` (noindex, `www`, stare adresy sitemapy) i dwóch decyzjach klubu (cele 301, Supabase) — można przepinać.

---

## 2. Co blokuje podmianę

Każde ustalenie potwierdzone niezależnie przez 3 sceptyków (reprodukcja techniczna / SEO / administracja hostingu).

| # | Problem | Dowód | Skutek | Model |
|---|---|---|---|---|
| **1** | `.htaccess` paczki stagingowej ustawia `Header set X-Robots-Tag "noindex, nofollow"` | `out/.htaccess:16-19`; `scripts/make-deploy-zip.sh:65-72` (blok tylko dla `TARGET=staging`); na żywo `curl -sI https://new.airsquad.pl/` → `x-robots-tag: noindex, nofollow` na **każdej** odpowiedzi (200, 301, 404, `robots.txt`, `sitemap.xml`, obraz OG) | **Google wyindeksuje całe `airsquad.pl` w ciągu dni.** HTML jest czysty (`meta robots: index, follow`; `noindex` tylko na 404), więc naprawa to sam `.htaccess` — bez rebuildu | A |
| **2** | **54 unikalne pliki** (46 jpg + 8 mp4, ≈310 MB) ładowane absolutnie z `https://airsquad.pl/wp-content/uploads/…`, plus **271 `image:loc`** (229 unikalnych plików) ze starej sitemapy Yoast | `lib/content/cities.ts:32` (`WP_UPLOADS`) + 6 użyć; `lib/content/letni.ts` — 50 URL-i; 10 plików HTML w `out/`: `/biecz/`, `/brzostek/`, `/jaslo/`, `/pilzno/`, `/letni/` + duplikaty hubów. `curl -I https://new.airsquad.pl/wp-content/uploads/…` → 404, ten sam plik na `airsquad.pl` → 200 | Filmy „Nasze zajawki", galerie miast i **Google Images** → 404 tego samego dnia | A |
| **3** | WordPress ma `siteurl` = `home` = `https://airsquad.pl` w bazie; wszystkie linki, canonicale, `og:url`, shortlinki i zasoby motywu/wtyczek są absolutne; Elementor trzyma URL-e w JSON-ie w `postmeta` | `curl https://airsquad.pl/wp-json/` → `url`/`home` = `https://airsquad.pl` (także przy żądaniu z hostem `www` → wartość z bazy, nie z `HTTP_HOST`); 164 odwołania do `airsquad.pl/wp-content` na stronie głównej; WP 6.6.9 + Elementor 4.1.3 + Yoast 25.6, motyw `rife-free` | Pod `new.airsquad.pl` assety ładują się z `airsquad.pl` (czyli z nowej strony) → **stara strona rozbita**. Naprawa = `WP_HOME`/`WP_SITEURL` + search-replace w bazie + Elementor → Tools → Replace URL. Bez `noindex` → indeksowalny duplikat 29 chronionych ścieżek | A |
| **4** | Przekierowanie `www.airsquad.pl → airsquad.pl` robi **PHP WordPressa**, nie hosting | `curl -sI https://www.airsquad.pl/` → 301 + `x-redirect-by: WordPress`; plik statyczny pod `www` (`/wp-includes/js/jquery/jquery.min.js`) → 200 bez przekierowania; `out/.htaccess` nie ma żadnego `RewriteRule`; `https://www.new.airsquad.pl/` → **200** | Po podmianie `www.airsquad.pl` serwuje pełną kopię nowej strony pod 200 → duplikat całego serwisu | oba |
| **5** | Strażnik stagingu sprawdza tylko, czy ścieżka **kończy się na `new`** | `scripts/deploy-ftp.sh:52-58` (`case *new\|*new/\|.`); `.deploy-target`: `REMOTE_STAGING=public_html/new` | Po modelu A każdy kolejny `deploy-ftp.sh staging` wyśle paczkę **z noindex** i `mirror --delete` prosto na produkcję | A |
| **6** | Katalog stagingu leży **wewnątrz** docrootu produkcyjnego, a produkcyjny `mirror --delete` wyklucza tylko `wp-content/uploads/` i `cgi-bin/` | ETag i `content-length` identyczne dla `https://airsquad.pl/new/` i `https://new.airsquad.pl/` (`"2a0a6-6ab64592-…"`, 172198 B) oraz dla `/new/rzeszow/` i `/rzeszow/`; `scripts/deploy-ftp.sh:109` | Pierwszy deploy produkcyjny **skasowałby katalog stagingu** | B |

### Ustalenie, które zmienia obraz sytuacji

`https://airsquad.pl/new/` zwraca **ten sam ETag** co `https://new.airsquad.pl/`. Staging **nie** leży w `domains/airsquad.online/public_html/new`, tylko w **`domains/airsquad.pl/public_html/new`** — czyli w katalogu produkcyjnym WordPressa. Komentarz w `.deploy-target` („Produkcja (airsquad.pl) jest poza zasięgiem tego konta — to inna domena") jest **nieprawdziwy**, a wraz z nim bloker „konto FTP" z `00-status.md`. Do potwierdzenia jednym spojrzeniem w DirectAdmin → FTP Management (katalog domowy konta `strona@airsquad.online`). Jeśli się potwierdzi, `REMOTE_PRODUCTION=public_html` działa z obecnym kontem i nie trzeba zakładać nowego.

---

## 3. Trzy modele podmiany

| | **A** — przepięcie docrootów, WP publicznie pod `new` | **B** — udokumentowany `deploy-ftp.sh production` | **C** — hybryda ⭐ **rekomendowany** |
|---|---|---|---|
| Co się dzieje | WP → `new.airsquad.pl`, katalog `new/` → docroot `airsquad.pl` | `mirror --delete` do `public_html`; WP skasowany poza `wp-content/uploads/` | WP **przeniesiony** (nie skasowany) do `public_html_wp/` poza webem; `uploads/` i `new/` zostają w miejscu; nowa strona do `public_html` |
| „Nic nie usuwać" | tak | **nie** | **tak** (przeniesienie + zip + dump bazy) |
| Stara strona pod `new` | wymaga #3 + `noindex`/hasła; psuje workflow stagingu | nie | nie — `new` zostaje stagingiem; WP można później wystawić jako `old.airsquad.pl` pod hasłem |
| Ryzyko SEO | **wysokie** (#1–#5) | średnie (#4, #6) | **niskie** |
| Rollback | zamiana katalogów z powrotem | przywrócenie zipa | przeniesienie `public_html_wp/` z powrotem (minuty) |

**Dlaczego C, a nie A:** WordPress publicznie pod `new.airsquad.pl` daje stronę *do naprawienia* (siteurl, Elementor, cache), indeksowalny duplikat *do zablokowania* i konflikt z jedyną działającą komendą wdrożenia. Nie ma z tego korzyści, której nie daje nietknięty katalog + zip + dump bazy. „Nic nie usuwać" jest w modelu C spełnione dosłownie.

---

## 4. Checklista przed dniem D

### Gabriel — panele, decyzje, dane

| # | Zadanie | Po co | Czas | Status |
|---|---|---|---|---|
| 1 | **DirectAdmin → FTP Management**: potwierdzić katalog domowy konta `strona@airsquad.online` (dowód wskazuje `domains/airsquad.pl/`) | Jeśli tak — `REMOTE_PRODUCTION=public_html` działa z obecnym kontem; bloker „konto FTP" znika | 2 min | ☐ |
| 2 | **Google Search Console**: własność domenowa `airsquad.pl` (TXT w DNS); eksport „Skuteczność → Strony" za 16 mies. jako punkt odniesienia; sprawdzić kliknięcia na `/zimowy/`, `/portfolio/`, `/airspace/`, `/szarfy/` | Bez GSC nie ma jak wysłać sitemapy, pilnować 404 ani ocenić, czy podmiana zaszkodziła | 15 min | ☐ |
| 3 | Zatwierdzić 10 celów 301 w `lib/content/legacy-redirects.json` (`status` → `zatwierdzone`); decyzja o `/zimowy/` (własna strona czy 301) | Cele to nadal propozycje; `/zimowy/` to jedyna stara strona z własnym meta description | 10 min | ☐ |
| 4 | **Supabase**: czy projekt `ajwuxxflltppzgzdyijf` istnieje / ma nowy ref | Host **nie rozwiązuje się w DNS** (NXDOMAIN, stan niezmienny od 06.09) → `/sklep/` i `/media/` to puste szkielety. Decyzja: odtworzyć przed podmianą czy świadomie przepiąć bez sklepu | 30–60 min albo „akceptuję" | ☐ |
| 5 | **Cookiebot** (manage.cookiebot.com → Settings → Domains): czy Domain Group `fc61955c-…` obejmuje `airsquad.pl` i `www.airsquad.pl` | Baner zgód RODO nie pokaże się na nieautoryzowanej domenie | 2 min | ☐ |
| 6 | Decyzja: przenieść **GTM-W44NNPZ + Meta Pixel** ze starej strony? | Nowa strona nie ma **żadnej** analityki — po podmianie ciągłość GA4/Pixela się urywa | decyzja + ID | ☐ |
| 7 | Backup: zip `domains/airsquad.pl/public_html` + dump bazy (phpMyAdmin albo zainstalowany Duplicator), pobrane lokalnie; sprawdzić Disk Usage | Rollback i wymóg „nic nie usuwać" | 10 min | ☐ |
| 8 | Dane: prawdziwa liczba trenerów Air Camp (12 czy 20), realne ID ogólnego formularza AIPAX | Sprzeczność w treści `/letni/`; placeholder na 3 stronach | 2 min | ☐ |

### Claude — kod (dopiero po akceptacji)

| # | Zadanie | Blokujące |
|---|---|---|
| 9 | Generator produkcyjnego `.htaccess` (`scripts/make-deploy-zip.sh`): reguła `www → non-www` (#4) oraz `Redirect 301 /sitemap_index.xml → /sitemap.xml` i `/page-sitemap.xml → /sitemap.xml` (GSC i stary `robots.txt` znają adres Yoasta) | **tak** |
| 10 | `scripts/deploy-ftp.sh`: wykluczyć z `--delete` także `new/` i `.well-known/`; strażnik odmawiający, gdy w katalogu docelowym jest `wp-config.php` albo produkcyjny `index.html`. `.deploy-target`: `REMOTE_PRODUCTION=public_html` + poprawka fałszywego komentarza | **tak** |
| 11 | `og:image`: **29 z 44 stron** (miasta, dyscypliny, wydarzenia, `/zapisy/`, `/polityka-prywatnosci/`, `/obozy-sportowe/` + duplikaty hubów) **nie ma `og:image`** — `lib/seo/metadata.tsx:31` zwraca `undefined` i nadpisuje wartość z layoutu. Poprawka: domyślne `/opengraph-image` + `og:url` z canonicala + `siteName` + `locale` | nie, ale zalecane |
| 12 | Treść `/airmeeting/` (≈46 słów) i `/gravityjam/` (≈51 słów) — odbudowa z sekcji 7.6; oznaczyć edycje archiwalne | nie, ~1 h |
| 13 | Placeholder AIPAX `5f7b99af-…` na `/grafik/`, `/zapisy/` i w sekcji zapisów dyscyplin (miasta mają realne ID per-miasto) | nie |

---

## 5. Co jest już gotowe — nie robić drugi raz

- **29/29 adresów** starej sitemapy Yoast: **18 → 200** tym samym slugiem, **11 → 301** na sensowny cel, **0 × 404**.
- Canonicale, `og:url`, `sitemap.xml` (28 wpisów, każdy ma plik w `out/`) i `robots.txt` — wszystko już na `https://airsquad.pl` (fallback w `lib/seo/site.ts`, `NEXT_PUBLIC_SITE_URL` celowo nieustawione). **Zero** wycieków `new.airsquad.pl`/`localhost`/`vercel.app` w `out/`; brak `window.location` w kodzie.
- Dokładnie **jeden H1** na każdej z 44 stron; wszystkie description 62–160 znaków; JSON-LD parsuje się (Organization + WebSite, Event, Course, SportsActivityLocation + FAQPage, ContactPage, BreadcrumbList).
- Twarde 404 (`ErrorDocument` + `404.html`, także bez ukośnika); 22 reguły 301 działają na stagingu; `/opengraph-image` → `image/png` dzięki `ForceType`.
- **TLS**: jeden certyfikat Let's Encrypt (CN=airsquad.pl, SAN: `airsquad.pl`, `www.airsquad.pl`, `mail.airsquad.pl`, `new.airsquad.pl`, `www.new.airsquad.pl`), ważny do **17.12.2026**. ACME (`/.well-known/acme-challenge/`) nie zależy od docrootu i nie jest przechwytywane przez `.htaccess` — HTTPS przetrwa podmianę.
- **E-mail nietknięty**: `MX → mail.airsquad.pl`, SPF `v=spf1 a mx include:_spf.cyberfolks.pl -all`, NS `ns1-3.cyberfolks.pl`. Zmiana katalogów nie dotyka strefy DNS. **Nie wolno** usuwać i zakładać domeny w DirectAdmin ponownie — to kasuje skrzynki i DNS.
- AIPAX: embed przyjmuje tylko `form-id`/`locale`/`view`/`mode` — **żadnego parametru domeny**, więc podmiana go nie dotyczy. `admin-app` na Vercelu nie zależy od `airsquad.pl`. Supabase nie ogranicza originów dla klucza `anon`.
- `/kontakt/` **nie ma formularza** (kontakt to `mailto:`), więc nic nie „wpada w próżnię" — Resend dotyczy wyłącznie powiadomień o zamówieniach.

---

## 6. Dzień D — procedura (model C)

1. `git pull origin static-export`; rebuild produkcyjny (`npm run build`, **bez** `ALLOW_PLACEHOLDER_BUILD`).
2. `./scripts/deploy-ftp.sh production --dry-run` — sprawdzić, że kasuje **wyłącznie** pliki WordPressa, a **nie** `wp-content/uploads/` ani `new/`.
3. File Manager: **przenieść** (nie kasować) zawartość `public_html/` **oprócz** `wp-content/uploads/` i `new/` do `domains/airsquad.pl/public_html_wp/`. Od tej sekundy `airsquad.pl` daje 404 przez kilka minut — robić poza godzinami zapisów.
4. `./scripts/deploy-ftp.sh production` (potwierdzenie słowem `produkcja`). Skrypt składa `.htaccess` **bez** `noindex` i przerywa, gdyby `noindex` został w paczce.
5. **Test na żywo (5–10 min):**
   - `curl -sI https://airsquad.pl/` → **brak** `x-robots-tag`
   - `curl -sI https://www.airsquad.pl/rzeszow/` → 301 na `https://airsquad.pl/rzeszow/`
   - 29 adresów z sekcji 7.1 → każdy 200 albo 301 na właściwy cel
   - 3 filmy z `https://airsquad.pl/wp-content/uploads/…` → 200
   - `/opengraph-image` → `Content-Type: image/png`
   - `/tyczyn/` → 301; `/sitemap_index.xml` → 301 na `/sitemap.xml`
   - formularz AIPAX na `/rzeszow/` i `/biecz/` otwiera się; baner Cookiebot widoczny w oknie prywatnym
6. **GSC**: wysłać `https://airsquad.pl/sitemap.xml`, usunąć `sitemap_index.xml`, „Poproś o zindeksowanie" dla `/`, `/rzeszow/`, `/akrobatyka/`, `/letni/`. **Facebook Sharing Debugger**: odświeżyć `/` i `/rzeszow/`.

**Rollback (< 5 min):** przenieść `public_html_wp/*` z powrotem do `public_html/`, nową stronę do `public_html/new/`. Baza i DNS nietknięte. Do kroku 3 rollback to „nic nie rób".

**Cofać natychmiast, gdy:** `x-robots-tag` widoczny na `airsquad.pl` · którykolwiek z 29 adresów daje 404 · filmy z `uploads` dają 404 · baner Cookiebot się nie pokazuje (RODO) · AIPAX zgłasza błąd domeny · w GSC „Strony" spadek > 20 % w tygodniu.

**Monitoring:** 24 h — GSC „Błędy 404" i „Strona z przekierowaniem", Core Web Vitals, pierwsze zapisy przez AIPAX. 2–8 tygodni — pozycje na `akrobatyka rzeszów`, `akrobatyka dębica`, `tricking rzeszów`, `air camp`; CTR tytułów 61–70 znaków (10 stron — nie ruszać przed launchem). Ok. 20.11.2026 — potwierdzić odnowienie certyfikatu.

---

## 7. Audyt SEO z 2026-09-06 (archiwalny, z adnotacjami)

> **Co się zdezaktualizowało:** pkt 1 tabeli blokerów (konto FTP — patrz sekcja 2, „Ustalenie, które zmienia obraz sytuacji"); sekcja 7.3 (og:image **nie** został naprawiony — patrz poz. 11 w sekcji 4); „103 pliki" w pkt 8 (realnie **54** — `city-view` renderuje tylko `videos[0]`, więc filmy Rzeszowa i Tyczyna nie trafiają do HTML).

### 7.1 Czy nowe podstrony mają te same ścieżki? — TAK, wszystkie 29

Sitemapa starej strony (Yoast, `page-sitemap.xml`) ma 29 adresów. Każdy w nowym buildzie zwraca 200 albo 301:

| Stary adres | Nowa strona | Uwagi |
|---|---|---|
| `/` `/rzeszow/` `/debica/` `/jaslo/` `/biecz/` `/brzostek/` `/pilzno/` | **200**, ten sam slug | tytuły zachowują frazę „Akrobatyka <miasto>" ze starej strony |
| `/tricking-akademia/` `/tumbling/` `/longboardy/` | **200** | tytuł Trickingu odzyskał frazę „Tricking Akademia" |
| `/letni/` `/obozy-sportowe/` `/airmeeting/` `/gravityjam/` | **200** | `/airmeeting/` i `/gravityjam/` są **chude treściowo** — patrz 7.6 |
| `/zapisy/` `/aktualnosci/` `/sklep/` `/polityka-prywatnosci/` | **200** | |
| `/tyczyn/` | **301 → `/rzeszow/`** | decyzja klubu (zajęcia zawieszone) |
| `/aircamp24/` | **301 → `/letni/`** | propozycja |
| `/zimowy/` `/diamond-camp-2021/` `/diamond-camp-2022/` | **301 → `/obozy-sportowe/`** | propozycja; `/zimowy/` to jedyna stara strona z własnym meta description — jeśli obóz zimowy wraca, lepiej zbudować mu stronę niż przekierowywać |
| `/stickit/` `/spotkanie/` | **301 → `/wydarzenia/`** | propozycja |
| `/portfolio/` | **301 → `/media/`** | propozycja |
| `/airspace/` `/zapisyairspace/` | **301 → `/rzeszow/`** | propozycja — AirSpace to sala w Rzeszowie |
| `/szarfy/` | **301 → `/sklep/`** | propozycja |

Na starej stronie `/akrobatyka/` **sam jest przekierowaniem 301 na `/`**. Nowa strona ma pod tym adresem pełny landing dyscypliny — to strona dodatkowa, nie ryzyko.

Nowe adresy, których stara strona nie miała: `/trenerzy/`, `/kontakt/`, `/lokalizacje/`, `/dyscypliny/`, `/wydarzenia/`, `/obozy/`, `/grafik/`, `/media/`, `/franczyza/`, `/aircamp/`. Duplikaty pod nową strukturą (`/lokalizacje/rzeszow/`, `/dyscypliny/akrobatyka/`, `/wydarzenia/letni/`, `/aircamp/`) mają canonical na stary adres i są poza sitemapą — zgodnie z planem.

Plan SEO zabrania masowego 301 na stronę główną — generator `.htaccess` odrzuca cel `/` (kontrola w `scripts/emit-redirects.mjs`).

### 7.2 Meta: title, description, canonical, H1, robots

| Kryterium | Stara strona | Nowa strona (44 strony) |
|---|---|---|
| `<title>` | generyczne „X - Air Squad", część WIELKIMI LITERAMI | unikalny na każdej stronie kanonicznej; 14 „duplikatów" to pary stary-slug/nowy-hub z canonicalem |
| meta description | **puste na 28 z 29 stron** | wszystkie 44 mają, wszystkie ≤ 160 znaków |
| canonical | poprawny | 42/44 self-canonical lub → stary slug; brak tylko na `/404/` i `/_not-found/` (noindex) |
| H1 | brak albo wiele na stronę | **dokładnie jeden** na każdej z 44 stron |
| robots meta | — | `index,follow` na landingach; `noindex` na 404 |
| obrazy bez `alt` / iframe bez `title` | nie badano | **0** / **0** |
| uszkodzone linki wewnętrzne | — | **0** |

Długości tytułów: 12 stron ma 61–70 znaków (sufiks „| Air Squad") — Google utnie końcówkę, ale fraza kluczowa jest na początku. Nie ruszać przed launchem.

### 7.3 Open Graph

> ⚠️ **Ta sekcja była błędna.** Deklaracja „wszystkie strony używają `/opengraph-image`" nie została zrealizowana: 29 z 44 stron nie ma `og:image` w ogóle (`lib/seo/metadata.tsx:31`). Zweryfikowane ponownie 26.09. Do poprawy — poz. 11 w sekcji 4.

`ForceType image/png` w `.htaccess` działa (staging zwraca `image/png`) — LiteSpeed nie zna typu pliku bez rozszerzenia, a scrapery odrzucają obraz bez typu MIME.

### 7.4 Schema.org

Organization (`SportsOrganization`) + WebSite na `/`, BreadcrumbList na 25 stronach, FAQPage (6 miast + `/letni/`), Event (Air Meeting, Gravity Jam, `/letni/`), SportsActivityLocation (miasta), ContactPage + ContactPoint (`/kontakt/`), Course (4 dyscypliny). Bez JSON-LD zostają huby i strony narzędziowe — checklista tego nie wymaga. Opcjonalnie później: `ItemList` na hubach, `Person` na `/trenerzy/`, `Product` w sklepie.

### 7.5 Sitemap, robots, staging

- `sitemap.xml`: 28 adresów, wyłącznie kanoniczne slugi; duplikaty hubów celowo poza mapą; żaden wpis nie wskazuje nieistniejącej strony.
- `robots.txt`: `Allow: /`, `Disallow: /admin/`, `/api/`, wskazuje produkcyjną sitemapę. Stara strona (Yoast) miała `Disallow:` puste — równoważne.
- Staging: `X-Robots-Tag: noindex, nofollow` z nagłówka. Skrypt produkcyjny przerywa, jeśli w paczce zostałby `noindex`.

### 7.6 Treść — odzyskane materiały do odbudowy stron wydarzeń

Porównanie objętości (słowa treści, bez nagłówka/stopki):

| Strona | Stara | Nowa | Ocena |
|---|---|---|---|
| `/rzeszow/` i miasta | — | 500–690 | bogatsze niż stare (sale, grupy, FAQ, kadra) |
| `/akrobatyka/` | (301 na `/`) | 462 | nowa treść |
| `/zapisy/` | 165 | 92 | OK — strona ma prowadzić do miasta |
| `/aktualnosci/` | 437 | 186 | OK — tablica ogłoszeń (przebudowana 22.09) |
| `/obozy-sportowe/` | 21 | 69 | lepiej niż było, ale nadal hub bez treści własnej |
| **`/airmeeting/`** | **269** | **≈46** | ⚠️ regresja — **nieusunięta na 26.09** |
| **`/gravityjam/`** | **391** | **≈51** | ⚠️ regresja — **nieusunięta na 26.09** |

**Treść odzyskana ze starych stron — do przeniesienia do `lib/content/letni.ts`:**

- **Air Meeting:** data 18 kwietnia 2026, miejsce Zespół Szkół nr 1, ul. Towarnickiego 4, Rzeszów; program; dojazd autobusem z Jasła i Dębicy; telefon; zastrzeżenie „nie dla grup naborowych".
- **Gravity Jam:** termin 8 czerwca 2025; cennik (wstęp bezpłatny, warsztaty 20 zł, zawody 20 zł, koszulka 45 zł); harmonogram godzinowy; partnerzy MB Park, Street Life.

Obie strony to chronione adresy z historią w Google. Przy odbudowie zaktualizować daty i **jasno oznaczyć edycje archiwalne** (wymóg checklisty publikacji).

### 7.7 Co poprawiono 06.09

10 starych adresów dostało 301 zamiast 404 (`lib/content/legacy-redirects.json` + generator + kontrola w `make-deploy-zip.sh`); obraz OG 1200×630 z `ForceType` (częściowo — patrz 7.3); schema `SportsOrganization` + `WebSite` + `ContactPage`; nieaktualne liczby miast (8/7 → **6** po wycofaniu Tyczyna); tytuł `/tricking-akademia/`; podwójny sufiks w tytule polityki prywatności; skrócone opisy > 160 znaków; `/media/` dopisane do sitemapy.

---

## 8. Pliki, które dotyka podmiana

| Plik | Rola |
|---|---|
| `.deploy-target` (gitignore) | `FTP_HOST`, `REMOTE_STAGING=public_html/new`, `REMOTE_PRODUCTION=` — **do uzupełnienia; komentarz o „innej domenie" jest nieprawdziwy** |
| `~/.netrc` | login/hasło FTP (600) |
| `scripts/make-deploy-zip.sh` | build + `.htaccess` per cel + kontrole spójności 301 — **do dopisania: `www`, stare adresy sitemapy** |
| `scripts/deploy-ftp.sh` | wysyłka FTPS; odmawia stagingu poza katalogiem `new`; produkcja przerywa przy `noindex` — **do dopisania: wykluczenie `new/` z `--delete`, twardszy strażnik** |
| `scripts/emit-redirects.mjs` | reguły 301: `withdrawn-locations.json` + `legacy-redirects.json` |
| `lib/content/legacy-redirects.json` | 10 starych adresów → cele (**do zatwierdzenia**) |
| `lib/seo/metadata.tsx` | **`og:image` gubione na 29 stronach (linia 31)** |
| `app/sitemap.ts`, `app/robots.ts` | zapiekane w buildzie na `https://airsquad.pl` |
