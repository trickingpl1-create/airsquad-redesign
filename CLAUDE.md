# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

Air Squad (airsquad.pl) — redesign strony klubu akrobatyki/trickingu, Next.js 16 (App Router, Turbopack) + Tailwind CSS v4 + Supabase + shadcn/ui. Vercel jest połączony z tym repo (branch `main` = auto-deploy). Ten katalog (`airsquad-web/`) jest jedyną deployowaną aplikacją w workspace — sąsiednie foldery (`../_referencje/`, `../wizualizacje/`) to materiały pomocnicze, nie kod.

## Zasady pracy (obowiązkowe)

### NIGDY nie commituj bez instrukcji użytkownika
Nie wolno tworzyć commita, pushować ani mergować bez wyraźnej akceptacji i polecenia od użytkownika. Każda zmiana musi być najpierw pokazana użytkownikowi do zatwierdzenia.

### Pull przed każdym nowym taskiem
```bash
git pull origin main
```

## Komendy

```bash
npm run dev              # dev server, domyślnie :3000 (w tej sesji podgląd chodzi na :2003 — patrz ../.claude/launch.json)
npm run build             # production build (uwaga: typescript.ignoreBuildErrors=true w next.config.mjs — build NIE wychwytuje błędów typów)
npm run start              # serwuje zbudowany output
npm run lint                # eslint .
npx tsc --noEmit             # jedyny sposób realnej weryfikacji typów, bo build ich nie sprawdza
```

Brak testów automatycznych (brak frameworku testowego w `package.json`, brak katalogu `__tests__`/`*.test.*`). Weryfikacja poprawności = `tsc --noEmit` + ręczne sprawdzenie w przeglądarce (curl / preview).

Migracje bazy to surowe pliki SQL w `scripts/001..005_*.sql` — nie ma narzędzia migracyjnego (Prisma/Drizzle); wklejane ręcznie w Supabase SQL editor w kolejności numerycznej.

## Zmienne środowiskowe

`.env.local` (nie commitować), wzorzec w `.env.local.example`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — jeśli brakuje lub URL zawiera `placeholder`, `getPublicSupabaseClient()` (`lib/supabase/public.ts`) zwraca `null` i cała treść renderuje się z fallbacków w kodzie (patrz niżej) zamiast wisieć na próbie połączenia z martwym hostem.
- `NEXT_PUBLIC_SITE_URL`

## Architektura

### Model treści: jedna tabela = jeden typ strony
Bez hierarchii, bez wspólnej abstrakcji SEO — pola `slug`/`meta_title`/`meta_description`/`h1_title` są duplikowane w każdej tabeli (`locations`/`city_pages`, `disciplines`, `events`, `static_pages`, ...), bo to prostsze niż osobna tabela SEO. Typy w `lib/types/database.ts`.

### Routing: jeden catch-all rozwiązuje kaskadę typów
`app/[slug]/page.tsx` (ISR, `revalidate = 3600`) woła `resolveRootSlug(slug)` z `lib/seo/queries.ts`, które sprawdza po kolei: **miasto → dyscyplina → wydarzenie → strona statyczna**, i renderuje pierwszy trafiony typ. To pozwala trzymać historyczne, płaskie URL-e WordPressa (`/rzeszow/`, `/akrobatyka/`, `/airmeeting/`) bez przenoszenia ich pod nowe huby typu `/lokalizacje/rzeszow/`. `generateStaticParams` zbiera sloty ze wszystkich 4 getterów naraz.

### Fallback content pattern (krytyczne, bo baza jest obecnie placeholderem)
Część treści istnieje jako statyczne fallbacki w `lib/content/*.ts` (`cities.ts`, `akrobatyka.ts`, `letni.ts`). Query zawsze wygląda tak: `data ?? FALLBACK[slug] ?? null` — dane z Supabase, jeśli są, zawsze nadpisują fallback; fallback istnieje tylko żeby strona działała, zanim baza zostanie realnie wypełniona. Przy dodawaniu nowego typu treści z fallbackiem trzymaj się tego wzorca (patrz `getCityPage`/`getCityPages` w `lib/seo/queries.ts` jako referencja).

### Dwa klienty Supabase — nie mieszać
- `lib/supabase/public.ts` (`getPublicSupabaseClient`) — bez cookies, do treści cache'owalnej/ISR (strony `[slug]`, strona główna). Użycie `cookies()` w komponencie renderowanym statycznie wymusza dynamic rendering i zabija ISR.
- `lib/supabase/server.ts` / `lib/supabase/proxy.ts` — cookie-based, do `/admin` (auth przez hasło + proxy, nie Supabase Auth).

### SEO — nie ruszać istniejących URL-i bez analizy
- `next.config.mjs`: `trailingSlash: true` — WordPress miał URL-e ze slashem; bez tego stare linki dostają 308 i tracą część SEO equity.
- Kontrakt chronionych URL-i (nie zmieniać slugów, nie przenosić pod nowe huby, nie masowo przekierowywać): `docs/03-mapa-url.md`. Głębsze analizy strategiczne: `../_referencje/analizy-seo/`.
- `app/sitemap.ts` czyta bezpośrednio z gettery `lib/seo/queries.ts` (nie z surowych zapytań) — wiersze fallbackowe mają puste `updated_at`, więc każdy mapper musi mieć guard (`updated_at ? new Date(updated_at) : new Date()`), inaczej `Invalid Date` wysypuje serializację.
- Schema.org (`lib/seo/metadata.tsx`): union typów `StructuredData` (LocalBusiness/SportsActivityLocation, Event, Course, FAQPage, BreadcrumbList) — rozszerzaj union zamiast pisać JSON-LD ad-hoc w widoku.

### Integracja AIPAX (zapisy/grafik/płatności — świadomie NIE budowane w tym repo)
Zapisy, grafik zajęć, płatności za zajęcia, portal rodzica i frekwencja to domena zewnętrznego systemu AIPAX — embedowanego jako lazy iframe facade (wzorzec: `components/akrobatyka/city-enrolment.tsx`, `components/seo/city-aipax-calendar.tsx`: nic się nie montuje, dopóki użytkownik nie kliknie). Nie dodawać własnego systemu zapisów/kalendarza — to świadoma decyzja architektoniczna (`docs/04-architektura.md`).

### Typografia display (konwencja — decyzja użytkownika 2026-07-11)
Nagłówki ozdobne używają klasy `display-bold` (font odręczny „Covered By Your Grace"; klasa ustawia font-weight 800 = sztuczne pogrubienie jednowagowego fontu). Przy tworzeniu NOWYCH treści duże nagłówki (hero H1, tytuły sekcji) zawsze ściągaj do wagi **400**: `style={{ fontWeight: 400 }}` na elemencie albo `titleFontWeight={400}` + `gradientFontWeight={400}` na `SectionHeader`. Mniejsze tytuły kart bywają na 500 (wzorzec: `components/home/pricing-section.tsx`).

### Panel admina
`/admin/*` — CRUD dla lokalizacji/trenerów/obozów/produktów/postów IG, chroniony hasłem przez `proxy.ts` (konwencja proxy Next 16, dawne middleware; nie Supabase Auth — mały zespół, prosty model).

## Dokumentacja projektu

`docs/00-status.md` jest źródłem prawdy o tym, co zrobione / co blokuje launch — czytaj go zamiast zgadywać stan projektu. `docs/04-architektura.md` opisuje decyzje i ich uzasadnienia (w tym czego świadomie brakuje: ORM, state manager, headless CMS, GraphQL — patrz tabela „Co nie jest częścią architektury"). Nie twórz nowych kategorii dokumentacji w katalogu głównym repo ani w `docs/` — cała strategia ma żyć w istniejących plikach `docs/`.
