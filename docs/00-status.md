# Status projektu Air Squad

Stan: **po launchu** — `airsquad.pl` serwuje nową stronę od **2026-10-05**. Stary WordPress odsunięty do `public_html_wp/` (poza webrootem), nietknięty, z działającym rollbackiem. Przebieg i weryfikacja: `zamiana_strony.md` sekcja 0.
Aktualizacja: ostatni commit w katalogu `app/`.

Ten dokument zastępuje wcześniejsze pliki strategiczne. Stare wersje są w `docs/_archive/` (`QUICKSTART.md`, `PROJECT_ROADMAP.md`, `IMPLEMENTATION_GUIDE.md`, `CONTENT_MIGRATION_STRATEGY.md`, `DATABASE_SEED_VERIFICATION_REPORT.md`, `COLOR_SCHEME_UPDATE.md`) — zostawione tylko jako historia, nie używać do planowania.

## Co jest zrobione

### Infrastruktura
- Next.js 16 (App Router), **strona publiczna jako eksport statyczny** (`output: 'export'` → katalog `out/`, hosting na zwykłym serwerze plików bez Node.js)
- Panel admina wydzielony do osobnej aplikacji `admin-app/` (SSR + proxy auth), hosting na Vercelu jako osobny projekt — uzasadnienie w `04-architektura.md`
- Supabase: Postgres + Auth + Storage + RLS
- Domena: **`airsquad.pl` = nowa strona** (podmiana 2026-10-05, `zamiana_strony.md` sekcja 0). `new.airsquad.pl` pozostaje wersją testową z `noindex`. Stary WordPress odsunięty do `public_html_wp/`, rollback jedną komendą (`scripts/move-wp-aside.sh --rollback`)

### Treść i SEO
- 6 stron miast (`/rzeszow`, `/debica`, `/jaslo`, `/biecz`, `/brzostek`, `/pilzno`). Tyczyn wycofany — zajęcia zawieszone, adres przekierowany 301 na `/rzeszow/`, szczegóły w `03-mapa-url.md`
- 4 strony dyscyplin (`/akrobatyka`, `/tricking-akademia`, `/tumbling`, `/longboardy`)
- 3 strony wydarzeń (`/airmeeting`, `/letni`, `/gravityjam`)
- Strony `/zapisy/`, `/obozy-sportowe/`, `/aktualnosci/` jako jawne trasy w `app/` (nie przez tabelę `static_pages`)
- Sitemap.xml generowany dynamicznie z bazy
- Schema.org: LocalBusiness, Event, Course, BreadcrumbList
- Meta tags + Open Graph dla wszystkich stron z bazy

### Panel admina
- CRUD dla produktów sklepu, zamówień i postów Instagram — czyli tabel, które strona publiczna czyta w przeglądarce, więc zmiana jest widoczna bez przebudowy
- Treść stron (miasta, dyscypliny, wydarzenia) **nie ma** CRUD-a i nigdy nie miała — żyje w `lib/content/*.ts` i wymaga przebudowy
- **Podgląd sklepu** (`/admin/podglad-sklepu`) i **podgląd całej ścieżki zamówienia** (`/admin/podglad-zamowienia`) — osoba prowadząca sklep widzi, co zobaczy klient, zamiast wierszy tabeli. W oknie edycji produktu podgląd kafelka i okna szczegółów, karmiony formularzem na żywo
- Logowanie przez Supabase Auth, egzekwowane w `admin-app/proxy.ts` (konto zakładane w Supabase Dashboard, nie w repo)
- Osobna aplikacja i osobny host — w eksporcie statycznym proxy nie istnieje, więc panel w tym samym buildzie byłby publiczny

### Sklep
- Lista produktów z bazy, koszyk w localStorage, formularz zamówienia
- Wygląd w języku wizualnym reszty serwisu (`SectionHeader`, karty `rounded-3xl`, pigułki kategorii zamiast `Tabs`)
- **Płatność u trenera przy odbiorze** — komunikowana w koszyku, w formularzu przy kwocie i na potwierdzeniu. Treści w `lib/content/shop.ts`, w jednym miejscu. Sposób płatności to stała modelu biznesowego, nie kolumna w `orders`
- `stock_status` wreszcie coś robi: `low` daje pigułkę „Ostatnie sztuki", `out_of_stock` blokuje zakup
- Bez płatności online (faza druga)

## Co NIE jest zrobione i NIE BĘDZIE w tym projekcie

| Co | Dlaczego nie | Gdzie to jest |
|---|---|---|
| Zapisy na zajęcia | Robi to AIPAX | Embed iframe na `/zapisy` |
| Grafik zajęć | Robi to AIPAX | Embed iframe na `/grafik` |
| Płatności za zajęcia | Robi to AIPAX | W systemie AIPAX |
| Portal rodzica | Robi to AIPAX | Link do AIPAX |
| Konta uczniów | Robi to AIPAX | W systemie AIPAX |
| Obecność i frekwencja | Robi to AIPAX | W systemie AIPAX |

## Co musi się zdarzyć przed launchem

Zadania krytyczne, blokujące publikację. Reszta to nice-to-have.
**Lista robocza na dzień podmiany, audyt SEO i werdykt „czy można przepinać" (2026-09-26): `zamiana_strony.md`.**

### Blokery launchu
- [ ] **Założyć konto administratora w Supabase** — `klub.airsquad@gmail.com`, Authentication → Users → Add user, z „Auto Confirm User". Panel dokleja `@airsquad.pl` tylko do loginu bez małpy, więc pełny adres wpisuje się w całości (`admin-app/lib/auth-login.ts`)
- [ ] **Wyłączyć rejestrację własną** (Authentication → Providers → Email → „Enable signup") — panel nie sprawdza roli, więc **każde** konto założone w tym projekcie Supabase dostaje pełny dostęp do `/admin/*`. Przy publicznym adresie panelu to jedyna rzecz z tej listy, która jest realnym problemem bezpieczeństwa, a nie wygody
- [ ] Podmienić placeholderowy form-id AIPAX w `components/aipax-widget.tsx` (`5f7b99af-…`, ten sam oznaczony jako zaślepka w `lib/content/akrobatyka.ts`). Podstrony miast mają już realne, per-miasto ID w `cities.ts` — brakuje tylko formularza ogólnego
- [x] ~~Wgrać realne zdjęcia trenerów~~ — 7 portretów w `public/images/trenerzy/` i 4 zdjęcia grupowe kadry w `public/images/kadra/` (hero `/trenerzy/`), z wariantami rozmiarowymi z `scripts/make-image-variants.mjs`. Świadomie **nie** w Supabase Storage: strona jest statyczna i pliki jadą z FTP razem z `out/`; skład i role w `lib/content/team.ts`
- [ ] Wgrać realne zdjęcia lokalizacji (wszystkie 6 sal) — dziś podstrony miast używają zdjęć ze starej strony z `public/images/miasta/` (27 ścieżek w `lib/content/cities.ts`; katalog `old-site/` nie jest już przez nie używany)
- [ ] Przenieść 54 pliki galerii i filmów „Nasze zajawki" (46 jpg + 8 mp4, ≈310 MB) z `wp-content/uploads/` do `public/media/` albo Supabase Storage i podmienić `WP_UPLOADS` w `cities.ts`/`letni.ts`. **Nie pilne**: katalog został na serwerze po podmianie i jest wykluczony z `--delete` w `deploy-ftp.sh`, więc pliki działają. Dopóki tam są, `wp-content/` nie wolno kasować
- [x] ~~Zweryfikować, że wszystkie chronione URL-e z `03-mapa-url.md` zwracają 200~~ — komplet obecny w `out/`; skrypt porównujący w `04-architektura.md`. Wyjątki świadome: `/tyczyn/` wycofany z 301 na `/rzeszow/`, `/zajecia/` to proponowany hub, który nigdy nie istniał
- [ ] **Supabase: host projektu nie istnieje w DNS** (`ajwuxxflltppzgzdyijf.supabase.co` → NXDOMAIN; stan niezmienny od 2026-09-06, potwierdzony ponownie 2026-09-26). Wartości są wkompilowane w build, więc `/sklep/` i `/media/` renderują puste szkielety, a panel nie ma się do czego logować. Gabriel: dashboard Supabase → czy projekt istnieje / ma nowy ref. Jeśli nowy ref → podmiana `NEXT_PUBLIC_SUPABASE_*` w `.env.local` i na Vercelu + rebuild **przed** wysyłką produkcyjną. (Canonicale i sitemapa budują się poprawnie na `https://airsquad.pl` niezależnie od tego.)
- [x] ~~**Uruchomić SQL w kolejności `001` → `002` → `003a` → `004`.**~~ — wykonane; 13 tabel odpowiada, `products` ma 6 wierszy, reszta pusta (treść z fallbacków), RLS zweryfikowane (odczyt `orders` przez `anon` zablokowany, zapis przechodzi).
  `003_seed_data.sql` i `005_seed_seo_pages.sql` celowo pominięte — wstawiają treść uboższą albo atrapy trenerów, a wiersz z bazy nadpisuje bogatszy fallback z `lib/content/`, łącznie z ID formularzy AIPAX. Uzasadnienie w `04-architektura.md`
- [x] ~~Utworzyć projekt Vercel dla panelu~~ — projekt `airsquad-admin` założony, zmienne Supabase ustawione; panel uniezależniony od katalogu nadrzędnego i wdrażany z CLI (`cd admin-app && vercel --prod`). Zostało samo wywołanie deployu.
- [x] ~~**Wpisać realne `NEXT_PUBLIC_SUPABASE_*` w Production projektu `airsquad-web`**~~ — poprawione we wszystkich trzech środowiskach (Production, Preview `static-export`, Development). Były tam **puste stringi**, nie placeholdery; przy pustych sklep i feed IG są martwe, bo czyta je przeglądarka. Wartości Production i Preview są oznaczone jako sensitive, więc `vercel env pull` zwraca dla nich pustkę — to nie znaczy, że są puste
- [x] ~~Podpiąć serwer docelowy~~ — wdrożenie przez FTPS na cyber-folks (`scripts/deploy-ftp.sh`). Port 22 zamknięty, więc `deploy.sh` na rsync odpada. Wersja testowa stoi na **new.airsquad.pl**
- [x] ~~Włączyć Let's Encrypt dla `new.airsquad.pl`~~ — certyfikat dodany w DirectAdmin, `https://new.airsquad.pl/` przechodzi pełną weryfikację
- [x] ~~Wdrożyć panel~~ — `cd admin-app && vercel --prod` wykonane; panel odpowiada pod `https://airsquad-admin.vercel.app/admin/login`
- [x] ~~Uzupełnić `REMOTE_PRODUCTION` w `.deploy-target`~~ — ustawione na `public_html`. Konto FTP `MG@airsquad.pl` ląduje w katalogu domowym domeny `airsquad.pl` i **ma dostęp do docrootu produkcji**; komentarz twierdzący, że „produkcja jest poza zasięgiem tego konta — to inna domena", był nieprawdziwy, a ciągnięty za nim bloker „założyć konto FTP" nigdy nie istniał. Staging (`public_html/new`) leży wewnątrz docrootu produkcji, więc `new/` jest wykluczone z `--delete`
- [ ] Usunąć testowe zamówienie `TEST-RLS-PROBE` z tabeli `orders`
- [ ] Poprawić opisy produktów w panelu — dane z seeda są bez polskich znaków („bawelna", „Ciepla", „cwiczen")

### Ważne, ale nie blokujące
- [ ] **`og:image` gubione na 29 z 44 stron** (miasta, dyscypliny, wydarzenia, `/zapisy/`, `/polityka-prywatnosci/`, `/obozy-sportowe/` + duplikaty hubów) — `lib/seo/metadata.tsx:31` zwraca `undefined`, co kasuje wartość dziedziczoną z layoutu. Udostępnienia na FB/WhatsApp bez obrazka. Poprawka: domyślne `/opengraph-image` + `og:url` z canonicala + `siteName`/`locale`. (Wpis w `zamiana_strony.md` 7.3 twierdzący, że to naprawione, był błędny.)
- [ ] Odbudować treść `/airmeeting/` (≈46 słów) i `/gravityjam/` (≈51) — jedyna realna regresja SEO na chronionych adresach; materiał odzyskany w `zamiana_strony.md` 7.6
- [ ] **Brak jakiejkolwiek analityki** — stara strona ma GTM-W44NNPZ i Meta Pixel, nowa nie ma nic. Po podmianie ciągłość GA4/Pixela się urywa; decyzja, czy przenosić kontener
- [ ] Podpiąć email service (Resend) do zamówień ze sklepu (`/kontakt/` nie ma formularza — kontakt to `mailto:`, więc nic nie ginie)
- [ ] Google Search Console + sitemap submission — **warunek monitoringu po podmianie**; bez własności `airsquad.pl` nie ma jak wysłać sitemapy ani pilnować 404
- [ ] Statystyki odwiedzin — `@vercel/analytics` usunięte ze strony publicznej (skrypt `/_vercel/insights/script.js` istnieje tylko na Vercelu i dawał 404 na serwerze statycznym); do wyboru Plausible/Umami/GA
- [ ] Test mobile na realnych urządzeniach (iOS Safari, Android Chrome)

### Po launchu, w trybie monitoringu (2-8 tygodni)
- [ ] Sprawdzanie błędów 404 w Search Console
- [ ] Indeksacja chronionych URL-i
- [ ] Pozycje na frazy lokalne (`akrobatyka rzeszów`, `akrobatyka dębica`)
- [ ] Core Web Vitals
- [ ] Pierwsze realne zapisy przez AIPAX iframe

## Następne fazy (po launchu)

Tylko nagłówki — szczegóły dopiero po danych z monitoringu.

**Faza 2 (1-3 mies. po launchu):**
- Płatności za sklep (Stripe lub PayU)
- Blog/aktualności jako dynamiczny CMS, jeżeli redakcja faktycznie pisze
- Galerie zdjęć z lokalizacji

**Faza 3 (po stabilizacji):**
- Wielojęzyczność PL/EN, jeżeli pojawi się ruch zagraniczny
- Dodatkowe strony lokalne (nowe miasta), tylko gdy są realne zajęcia
- Integracje analityczne (Hotjar/Clarity), jeżeli będą realne pytania o UX

## Czego nie robić

- Nie dodawać własnego systemu zapisów. To kompetencja AIPAX.
- Nie zmieniać URL-i z `03-mapa-url.md` bez analizy Search Console.
- Nie kasować archiwalnych stron (`/aircamp24`, `/diamond-camp-2021`, `/spotkanie`, `/stickit`) bez decyzji.
- Nie kopiować 1:1 mockupu z `option-c2-street-violet.jsx` — to inspiracja, nie kod.
- Nie tworzyć nowych kategorii dokumentacji w katalogu głównym. Cała strategia w `/docs`.
