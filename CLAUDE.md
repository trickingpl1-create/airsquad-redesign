# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

Air Squad (airsquad.pl) — redesign strony klubu akrobatyki/trickingu, Next.js 16 (App Router, Turbopack) + Tailwind CSS v4 + Supabase + shadcn/ui. Sąsiednie foldery workspace (`../_referencje/`, `../wizualizacje/`) to materiały pomocnicze, nie kod.

**To repo trzyma dwie osobne aplikacje** (git root = `airsquad-web/`):

| Katalog | Co to | Build | Hosting |
|---|---|---|---|
| `airsquad-web/` (root) | publiczna strona, **w pełni statyczna** (`output: 'export'`) | `npm run build` → `out/` | zwykły serwer plików (nginx/Apache), bez Node.js |
| `airsquad-web/admin-app/` | panel `/admin/*`, aplikacja serwerowa (SSR + proxy auth) | `npm run build` w `admin-app/` | Vercel, osobny projekt (Root Directory = `admin-app`) |

Obie czytają tę samą bazę Supabase. Typy bazy mają jedno źródło — `lib/types/database.ts` w aplikacji publicznej; `admin-app/lib/types/database.ts` tylko je re-eksportuje. Uzasadnienie podziału: `docs/04-architektura.md`, sekcja „Dwie aplikacje".

## Zasady pracy (obowiązkowe)

### NIGDY nie commituj bez instrukcji użytkownika
Nie wolno tworzyć commita, pushować ani mergować bez wyraźnej akceptacji i polecenia od użytkownika. Każda zmiana musi być najpierw pokazana użytkownikowi do zatwierdzenia.

### Pull przed każdym nowym taskiem
```bash
git pull origin main
```

## Komendy

Strona publiczna (katalog główny repo):

```bash
npm run dev              # dev server, domyślnie :3000 (w tej sesji podgląd chodzi na :2003 — patrz ../.claude/launch.json)
npm run build             # eksport statyczny → out/ (uwaga: typescript.ignoreBuildErrors=true — build NIE wychwytuje błędów typów)
npx tsc --noEmit             # jedyny sposób realnej weryfikacji typów, bo build ich nie sprawdza
npx serve out                 # podgląd gotowego out/ (konfiguracja „airsquad-out" na :2004)
```

`npm run start` nie ma zastosowania przy `output: 'export'` — nie ma czego serwować Nodem.

Panel admina (`admin-app/`, własny `package.json` i `node_modules`):

```bash
cd admin-app && npm install    # jednorazowo — root npm install NIE instaluje zależności panelu
cd admin-app && npm run dev    # konfiguracja „airsquad-admin" na :2005
cd admin-app && npm run build  # build sprawdza typy (panel nie ma ignoreBuildErrors)
cd admin-app && npx tsc --noEmit
```

Panel wymaga własnego `admin-app/.env.local` — bez `NEXT_PUBLIC_SUPABASE_*` strona logowania rzuca 500 (`createServerClient` nie przyjmuje pustego URL-a). Rootowy `tsconfig.json` wyklucza `admin-app`, więc każdą aplikację typuje się osobno.

Brak testów automatycznych (brak frameworku testowego w `package.json`, brak katalogu `__tests__`/`*.test.*`) i **brak lintera** — `eslint` nie jest zainstalowany ani skonfigurowany, więc dawny skrypt `npm run lint` tylko wywalał się na „command not found" i został usunięty. Weryfikacja poprawności = `tsc --noEmit` + `npm run build` + ręczne sprawdzenie w przeglądarce (`npx serve out` / preview).

Migracje bazy to surowe pliki SQL w `scripts/001..005_*.sql` — nie ma narzędzia migracyjnego (Prisma/Drizzle); wklejane ręcznie w Supabase SQL editor w kolejności numerycznej.

## Zmienne środowiskowe

`.env.local` (nie commitować), wzorzec w `.env.local.example`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — jeśli brakuje lub URL zawiera `placeholder`, `getPublicSupabaseClient()` (`lib/supabase/public.ts`) zwraca `null` i cała treść renderuje się z fallbacków w kodzie (patrz niżej) zamiast wisieć na próbie połączenia z martwym hostem.
- `NEXT_PUBLIC_SITE_URL`

## Architektura

### Model treści: jedna tabela = jeden typ strony
Bez hierarchii, bez wspólnej abstrakcji SEO — pola `slug`/`meta_title`/`meta_description`/`h1_title` są duplikowane w każdej tabeli (`locations`/`city_pages`, `disciplines`, `events`, `static_pages`, ...), bo to prostsze niż osobna tabela SEO. Typy w `lib/types/database.ts`.

### Eksport statyczny — czego NIE wolno dodawać do strony publicznej
`next.config.mjs` ma `output: 'export'`. Nie ma serwera, więc **nie działają**: route handlery `/api/*`, Server Actions, middleware/proxy, `cookies()`/`headers()` w komponentach serwerowych, ISR i render on-demand. Każdy URL musi być znany w czasie builda przez `generateStaticParams` — slug dodany w bazie po buildzie daje 404 aż do przebudowy. Wszystko, co ma być świeże bez rebuildu, pobiera dane **w przeglądarce** (`lib/supabase/client.ts`) — wzorzec: `/sklep` i `/media`.

`NEXT_PUBLIC_*` są wkompilowane w JS w momencie builda — build z placeholderowym `.env.local` wypuszcza sitemapę i canonicale z `http://localhost:3000`.

### Routing: jeden catch-all rozwiązuje kaskadę typów
`app/[slug]/page.tsx` (`revalidate = 3600` — martwe przy eksporcie statycznym, zostaje na wypadek powrotu na Vercela) woła `resolveRootSlug(slug)` z `lib/seo/queries.ts`, które sprawdza po kolei: **miasto → dyscyplina → wydarzenie → strona statyczna**, i renderuje pierwszy trafiony typ. To pozwala trzymać historyczne, płaskie URL-e WordPressa (`/rzeszow/`, `/akrobatyka/`, `/airmeeting/`) bez przenoszenia ich pod nowe huby typu `/lokalizacje/rzeszow/`. `generateStaticParams` zbiera sloty ze wszystkich 4 getterów naraz.

### Fallback content pattern (krytyczne, bo baza jest obecnie placeholderem)
Część treści istnieje jako statyczne fallbacki w `lib/content/*.ts` (`cities.ts`, `akrobatyka.ts`, `letni.ts`). Query zawsze wygląda tak: `data ?? FALLBACK[slug] ?? null` — dane z Supabase, jeśli są, zawsze nadpisują fallback; fallback istnieje tylko żeby strona działała, zanim baza zostanie realnie wypełniona. Przy dodawaniu nowego typu treści z fallbackiem trzymaj się tego wzorca (patrz `getCityPage`/`getCityPages` w `lib/seo/queries.ts` jako referencja).

### Dwa klienty Supabase — nie mieszać
- `lib/supabase/public.ts` (`getPublicSupabaseClient`) — bez cookies, do treści zapiekanej w buildzie (strony `[slug]`, strona główna, huby, sitemapa). **Jedyny** klient serwerowy dozwolony w aplikacji publicznej: `cookies()` wywala eksport statyczny.
- `lib/supabase/client.ts` (`getBrowserSupabaseClient`) — klient przeglądarki, do danych świeżych bez rebuildu (`/sklep`, `/media`). Ma ten sam guard na placeholder co `public.ts` i **zwraca `null`**, więc każdy wołający musi pokazać stan pusty; bez tego fetch leci na martwy host i komponent wisi na „Ładowanie…".
- `admin-app/lib/supabase/server.ts` i `admin-app/lib/supabase/proxy.ts` — cookie-based, żyją **wyłącznie** w aplikacji panelu (auth przez hasło + proxy, nie Supabase Auth).

### SEO — nie ruszać istniejących URL-i bez analizy
- `next.config.mjs`: `trailingSlash: true` — WordPress miał URL-e ze slashem; bez tego stare linki dostają 308 i tracą część SEO equity.
- Kontrakt chronionych URL-i (nie zmieniać slugów, nie przenosić pod nowe huby, nie masowo przekierowywać): `docs/03-mapa-url.md`. Głębsze analizy strategiczne: `../_referencje/analizy-seo/`.
- `app/sitemap.ts` czyta bezpośrednio z gettery `lib/seo/queries.ts` (nie z surowych zapytań) — wiersze fallbackowe mają puste `updated_at`, więc każdy mapper musi mieć guard (`updated_at ? new Date(updated_at) : new Date()`), inaczej `Invalid Date` wysypuje serializację.
- Schema.org (`lib/seo/metadata.tsx`): union typów `StructuredData` (LocalBusiness/SportsActivityLocation, Event, Course, FAQPage, BreadcrumbList) — rozszerzaj union zamiast pisać JSON-LD ad-hoc w widoku.

### Integracja AIPAX (zapisy/grafik/płatności — świadomie NIE budowane w tym repo)
Zapisy, grafik zajęć, płatności za zajęcia, portal rodzica i frekwencja to domena zewnętrznego systemu AIPAX — embedowanego jako lazy iframe facade (wzorzec: `components/akrobatyka/city-enrolment.tsx`, `components/seo/city-aipax-calendar.tsx`: nic się nie montuje, dopóki użytkownik nie kliknie). Nie dodawać własnego systemu zapisów/kalendarza — to świadoma decyzja architektoniczna (`docs/04-architektura.md`).

### Typografia display (konwencja — decyzja użytkownika 2026-07-11)
Nagłówki ozdobne używają klasy `display-bold` (font odręczny „Covered By Your Grace"; klasa ustawia font-weight 800 = sztuczne pogrubienie jednowagowego fontu). Przy tworzeniu NOWYCH treści duże nagłówki (hero H1, tytuły sekcji) zawsze ściągaj do wagi **400**: `style={{ fontWeight: 400 }}` na elemencie albo `titleFontWeight={400}` + `gradientFontWeight={400}` na `SectionHeader`. Mniejsze tytuły kart bywają na 500 (wzorzec: `components/home/pricing-section.tsx`).

### Panel admina — osobna aplikacja
`admin-app/` — CRUD dla lokalizacji/trenerów/obozów/produktów/postów IG pod `/admin/*`, chroniony hasłem przez `admin-app/proxy.ts` (konwencja proxy Next 16, dawne middleware; nie Supabase Auth — mały zespół, prosty model). Panel **musi** zostać aplikacją serwerową: w eksporcie statycznym proxy nie istnieje, więc `out/admin/*/index.html` byłyby publicznymi plikami dostępnymi bez logowania.

Panel ma własną kopię prymitywów `components/ui/*` (vendorowany shadcn — normalny model tego narzędzia, każda aplikacja ma swój rejestr). Współdzielone są tylko typy bazy. Zmiana w `components/ui/*` po stronie publicznej **nie** propaguje się do panelu i odwrotnie.

## Dokumentacja projektu

`docs/00-status.md` jest źródłem prawdy o tym, co zrobione / co blokuje launch — czytaj go zamiast zgadywać stan projektu. `docs/04-architektura.md` opisuje decyzje i ich uzasadnienia (w tym czego świadomie brakuje: ORM, state manager, headless CMS, GraphQL — patrz tabela „Co nie jest częścią architektury"). Nie twórz nowych kategorii dokumentacji w katalogu głównym repo ani w `docs/` — cała strategia ma żyć w istniejących plikach `docs/`.
