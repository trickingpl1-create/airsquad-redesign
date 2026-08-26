# Status projektu Air Squad

Stan: **przed launchem produkcyjnym**.
Aktualizacja: ostatni commit w katalogu `app/`.

Ten dokument zastępuje wcześniejsze pliki strategiczne. Stare wersje są w `docs/_archive/` (`QUICKSTART.md`, `PROJECT_ROADMAP.md`, `IMPLEMENTATION_GUIDE.md`, `CONTENT_MIGRATION_STRATEGY.md`, `DATABASE_SEED_VERIFICATION_REPORT.md`, `COLOR_SCHEME_UPDATE.md`) — zostawione tylko jako historia, nie używać do planowania.

## Co jest zrobione

### Infrastruktura
- Next.js 16 (App Router), **strona publiczna jako eksport statyczny** (`output: 'export'` → katalog `out/`, hosting na zwykłym serwerze plików bez Node.js)
- Panel admina wydzielony do osobnej aplikacji `admin-app/` (SSR + proxy auth), hosting na Vercelu jako osobny projekt — uzasadnienie w `04-architektura.md`
- Supabase: Postgres + Auth + Storage + RLS
- Domena: do podpięcia przed launchem

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

### Blokery launchu
- [ ] **Założyć konto administratora w Supabase** — `klub.airsquad@gmail.com`, Authentication → Users → Add user, z „Auto Confirm User". Panel dokleja `@airsquad.pl` tylko do loginu bez małpy, więc pełny adres wpisuje się w całości (`admin-app/lib/auth-login.ts`)
- [ ] **Wyłączyć rejestrację własną** (Authentication → Providers → Email → „Enable signup") — panel nie sprawdza roli, więc **każde** konto założone w tym projekcie Supabase dostaje pełny dostęp do `/admin/*`. Przy publicznym adresie panelu to jedyna rzecz z tej listy, która jest realnym problemem bezpieczeństwa, a nie wygody
- [ ] Podmienić placeholderowy form-id AIPAX w `components/aipax-widget.tsx` (`5f7b99af-…`, ten sam oznaczony jako zaślepka w `lib/content/akrobatyka.ts`). Podstrony miast mają już realne, per-miasto ID w `cities.ts` — brakuje tylko formularza ogólnego
- [ ] Wgrać realne zdjęcia trenerów (min. 3) i lokalizacji (wszystkie 6) do Supabase Storage
- [x] ~~Zweryfikować, że wszystkie chronione URL-e z `03-mapa-url.md` zwracają 200~~ — komplet obecny w `out/`; skrypt porównujący w `04-architektura.md`. Wyjątki świadome: `/tyczyn/` wycofany z 301 na `/rzeszow/`, `/zajecia/` to proponowany hub, który nigdy nie istniał
- [x] ~~Wpisać produkcyjne `NEXT_PUBLIC_SUPABASE_*`~~ — projekt podłączony, canonicale i sitemapa budują się na `https://airsquad.pl`
- [x] ~~**Uruchomić SQL w kolejności `001` → `002` → `003a` → `004`.**~~ — wykonane; 13 tabel odpowiada, `products` ma 6 wierszy, reszta pusta (treść z fallbacków), RLS zweryfikowane (odczyt `orders` przez `anon` zablokowany, zapis przechodzi).
  `003_seed_data.sql` i `005_seed_seo_pages.sql` celowo pominięte — wstawiają treść uboższą albo atrapy trenerów, a wiersz z bazy nadpisuje bogatszy fallback z `lib/content/`, łącznie z ID formularzy AIPAX. Uzasadnienie w `04-architektura.md`
- [x] ~~Utworzyć projekt Vercel dla panelu~~ — projekt `airsquad-admin` założony, zmienne Supabase ustawione; panel uniezależniony od katalogu nadrzędnego i wdrażany z CLI (`cd admin-app && vercel --prod`). Zostało samo wywołanie deployu.
- [x] ~~**Wpisać realne `NEXT_PUBLIC_SUPABASE_*` w Production projektu `airsquad-web`**~~ — poprawione we wszystkich trzech środowiskach (Production, Preview `static-export`, Development). Były tam **puste stringi**, nie placeholdery; przy pustych sklep i feed IG są martwe, bo czyta je przeglądarka. Wartości Production i Preview są oznaczone jako sensitive, więc `vercel env pull` zwraca dla nich pustkę — to nie znaczy, że są puste
- [x] ~~Podpiąć serwer docelowy~~ — wdrożenie przez FTPS na cyber-folks (`scripts/deploy-ftp.sh`). Port 22 zamknięty, więc `deploy.sh` na rsync odpada. Wersja testowa stoi na **new.airsquad.pl**
- [ ] **Włączyć Let's Encrypt dla `new.airsquad.pl`** — DirectAdmin → SSL Certificates → zaznaczyć subdomenę. Dziś serwer podaje certyfikat wystawiony na `airsquad.pl`, więc przeglądarka ostrzega przed niezabezpieczonym połączeniem
- [ ] **Wdrożyć panel**: `cd admin-app && vercel --prod`
- [ ] Usunąć testowe zamówienie `TEST-RLS-PROBE` z tabeli `orders`
- [ ] Poprawić opisy produktów w panelu — dane z seeda są bez polskich znaków („bawelna", „Ciepla", „cwiczen")

### Ważne, ale nie blokujące
- [ ] Podpiąć email service (Resend) do formularza kontaktowego i zamówień ze sklepu
- [ ] Google Search Console + sitemap submission
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
