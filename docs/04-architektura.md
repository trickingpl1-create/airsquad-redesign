# Architektura — co faktycznie zbudowano

Ten dokument opisuje to, co JEST. Nie analizuje wariantów (WordPress vs Astro vs headless) — ta dyskusja jest w historii projektu.

## Stack

| Warstwa | Technologia | Dlaczego |
|---|---|---|
| Frontend (publiczny) | Next.js 16, `output: 'export'` | Statyczny HTML, dobre SEO, hosting na zwykłym serwerze plików. |
| Hosting (publiczny) | dowolny serwer plików (nginx/Apache) | Katalog `out/` do wgrania, bez Node.js po stronie serwera. |
| Panel admina | Next.js 16 (SSR) w `admin-app/` | Osobna aplikacja — patrz „Dwie aplikacje" niżej. |
| Hosting (panel) | Vercel, osobny projekt | SSR + proxy auth po cookies działa natywnie, ruch znikomy. |
| Baza danych | Supabase (Postgres) | RLS, realtime, REST + JS SDK, niski koszt na start. |
| Auth (admin) | Supabase Auth + proxy (`admin-app/proxy.ts`) | Mały zespół, prosty model. Bez OAuth, bez ról. |
| Storage (zdjęcia) | Supabase Storage | Spójne z bazą, prosty API. |
| CMS treści | Custom panel `/admin` | Polski, dopasowany do typów treści, bez zewnętrznej zależności. |
| Klub-management | AIPAX (zewnętrzny) | Zapisy, grafik, płatności, portal rodzica. Embed iframe. |

## Dwie aplikacje — dlaczego admin jest osobno

Statyczny eksport nie ma serwera, a więc nie ma proxy (dawnego middleware) — a to jedyna ochrona `/admin`. Zostawienie panelu w tej aplikacji wyeksportowałoby `out/admin/*/index.html` jako **publiczne pliki dostępne bez logowania**. Dlatego:

| | `airsquad-web/` (root repo) | `airsquad-web/admin-app/` |
|---|---|---|
| Charakter | statyczny eksport, `out/` | aplikacja serwerowa (SSR) |
| Ochrona tras | brak potrzeby — same publiczne | `proxy.ts` + `supabase.auth.getUser()` po cookies |
| Klient Supabase | `lib/supabase/public.ts` (cookieless) i `client.ts` (przeglądarka) | `lib/supabase/server.ts` + `proxy.ts` (cookies) |
| Deploy | wgranie `out/` na serwer | push → Vercel |

Obie aplikacje czytają **tę samą bazę i te same tabele**. Typy bazy mają jedno źródło: `lib/types/database.ts` w aplikacji publicznej — `admin-app/lib/types/database.ts` tylko je re-eksportuje. Dlatego `admin-app/next.config.mjs` ustawia `turbopack.root` i `outputFileTracingRoot` na katalog nadrzędny, a projekt panelu na Vercelu wymaga włączonego **„Include files outside of the Root Directory in the Build Step"** (Root Directory = `admin-app`).

## Konsekwencje eksportu statycznego

Czego **nie ma** i czego nie wolno dopisywać do aplikacji publicznej:

- **route handlerów `/api/*` i Server Actions** — nie ma serwera, który by je wykonał;
- **middleware/proxy** — jw.;
- **ISR** (`revalidate`) i renderu on-demand — każdy URL musi być znany w czasie builda przez `generateStaticParams`. Slug dodany w bazie **po** buildzie daje 404 do czasu przebudowy;
- **optymalizacji obrazów** przez `next/image` (`images.unoptimized: true`);
- **`cookies()` / `headers()`** w komponentach serwerowych.

Wszystko, co ma być świeże bez przebudowy, musi pobierać dane **w przeglądarce** (`lib/supabase/client.ts`) — tak działają `/sklep` i `/media`.

## Model treści w bazie

Każdy typ ma własną tabelę. Brak hierarchii, brak nadbudowanych abstrakcji. Bezpośrednie mapowanie tabela → strona.

```
locations          → /rzeszow, /debica, ...
disciplines        → /akrobatyka, /tricking-akademia, ...
events             → /airmeeting, /letni, /gravityjam
static_pages       → (pusta; /zapisy/, /obozy-sportowe/ i /aktualnosci/ to jawne trasy w app/)
trainers           → karta trenera (osadzane w stronach miast)
camps              → karta obozu (osadzane w event)
products           → /sklep
orders             → zamówienia ze sklepu (admin)
instagram_posts    → grid na stronie głównej
```

Pola SEO (`slug`, `meta_title`, `meta_description`, `h1_title`) są w każdej tabeli, która generuje publiczną stronę. To celowa redundancja — łatwiej edytować pole obok treści niż w osobnej tabeli SEO.

## Mapowanie URL → kod

| URL | Plik | Źródło danych |
|---|---|---|
| `/` | `app/page.tsx` | locations + disciplines + events |
| `/rzeszow` (i inne miasta) | `app/[slug]/page.tsx` | tabela `locations` |
| `/akrobatyka` (i inne dyscypliny) | `app/[slug]/page.tsx` | tabela `disciplines` |
| `/airmeeting`, `/letni`, `/gravityjam` | `app/[slug]/page.tsx` | tabela `events` |
| `/zapisy/`, `/obozy-sportowe/`, `/aktualnosci/` | jawne trasy w `app/` | treść w kodzie — `static_pages` zostaje pusta |
| `/sklep` | `app/sklep/page.tsx` | tabela `products` (fetch w przeglądarce) |
| `/lokalizacje`, `/trenerzy`, `/obozy` | huby w `app/` | `getLocations()` / `getTrainers()` / `getCamps()` z fallbackiem `lib/content/hubs.ts` |
| `/admin/*` | `admin-app/app/admin/...` | wszystkie tabele (osobna aplikacja, osobny host) |
| `/sitemap.xml` | `app/sitemap.ts` | wszystkie tabele z `is_published=true`, zapiekane w buildzie |
| `/robots.txt` | `app/robots.ts` | zapiekany w buildzie |

**Wzorzec routingu:** jeden catch-all `/[slug]` kolejno sprawdza tabele `locations`, `disciplines`, `events`, `static_pages`. Pierwsza, która zwróci wiersz, renderuje stronę. To upraszcza routing i pozwala zachować historyczne URL-e bez podziału na `/lokalizacje/`, `/zajecia/` itd. (zgodnie z `02-plan-seo.md`).

## Integracja z AIPAX

AIPAX to zewnętrzny system. Air Squad nie buduje konkurencyjnego systemu zapisów.

```
Strona Air Squad (Next.js + Supabase)
  ├─ Treści SEO i wizerunek
  ├─ Sklep z merchem
  └─ Embed AIPAX
       ├─ /{miasto}/#zapisy → kalendarz per-miasto (realne form-id z cities.ts)
       └─ /grafik          → rozjazd do podstron miast
                  ↓
              AIPAX
              ├─ Baza uczniów
              ├─ Płatności za zajęcia
              ├─ Frekwencja
              └─ Portal rodzica
```

ID formularzy AIPAX żyją w `lib/content/cities.ts` (`aipax_form_id`, `aipax_form_id_continuation`) — po jednym na miasto. `components/aipax-widget.tsx` trzyma jeszcze placeholderowy form-id wspólnego formularza (`5f7b99af-…`) do podmiany przed launchem.

## Co nie jest częścią architektury

| Nie ma i nie będzie | Dlaczego |
|---|---|
| ORM (Prisma, Drizzle) | Supabase JS SDK + typy TypeScript wystarczają. |
| State manager (Redux, Zustand) | Server Components + SWR dla klienta = wystarczy. |
| Headless CMS (Sanity, Strapi) | `/admin` pokrywa potrzeby, mniej zależności zewnętrznych. |
| Edge functions / middleware logiki | W aplikacji publicznej niemożliwe (eksport statyczny). W panelu tylko ochrona `/admin`. |
| GraphQL | Supabase REST + RLS = prościej. |
| Custom backend (Express, NestJS) | RSC + Server Actions = wystarczająca warstwa serwerowa. |

Każda z tych technologii dodawałaby złożoności bez realnej wartości na obecnej skali (jeden klub, ~7 lokalizacji, paneluje 1-2 osoby).

## Decyzje, które warto kwestionować

To miejsce na wątpliwości, nie deklaracje. Jeżeli któraś z tych decyzji boli — wracamy do niej:

- **Catch-all `/[slug]` z 4 zapytaniami do bazy** — działa szybko dzięki cache Supabase, ale gdyby ruch wzrósł 10x, można cache-ować w Vercel KV.
- **Brak ról w panelu** — dostęp ma każde konto z tabeli Auth projektu Supabase. Wystarcza przy 1–2 osobach i wyłączonej rejestracji własnej; przy większej liczbie kont trzeba dołożyć sprawdzanie roli (np. kolumna w tabeli profili albo `app_metadata`).
- **Sklep w tej samej domenie co strona wizerunkowa** — prostota wygrywa, ale jeżeli sklep urośnie, można odciąć na subdomenę (np. `sklep.airsquad.pl`).
- **AIPAX jako iframe, nie jako custom integracja przez API** — szybciej i taniej, ale jeżeli AIPAX zacznie ograniczać UX (powolne ładowanie, słaby mobile), warto rozważyć integrację API.

## Bezpieczeństwo

- **RLS na wszystkich tabelach.** Anonimowy klient czyta tylko `is_published=true`. Pisze tylko serwis przez service role key.
- **Logowanie do panelu** to Supabase Auth (`signInWithPassword`) — konto żyje w tabeli Auth projektu Supabase, nie w repo ani w env. Konto zakłada się w Supabase Dashboard → Authentication → Users.
- **Brak sprawdzania roli**: proxy i layout panelu pytają tylko `supabase.auth.getUser()`, więc dostęp do `/admin/*` ma KAŻDE konto w tym projekcie Supabase. Rejestracja własna („Enable signup") musi być w Supabase wyłączona, inaczej panel jest otwarty dla każdego, kto założy konto.
- **Service role key** tylko w Server Components / Server Actions, nigdy w client.
- **Supabase Storage** publiczne dla `images`, prywatne dla `documents` (zamówienia, faktury).

## Wydajność

- **Statyczny HTML** dla całej treści wizerunkowej — zero renderu na żądanie (ISR odpadł razem z serwerem).
- **`next/image` bez optymalizacji** (`images.unoptimized: true`) — eksport statyczny nie ma loadera; zdjęcia trzeba przygotować w docelowym rozmiarze.
- **Generic catch-all** rozwiązany w jednym `generateStaticParams`, który zbiera wszystkie publiczne slugi przy buildzie.
- **Client-side fetch tylko tam, gdzie treść musi być świeża** bez rebuildu (`/sklep`, `/media`) — reszta w RSC, zapieczona.

## Skrypty SQL — których NIE uruchamiać

`scripts/00*.sql` to surowe pliki wklejane ręcznie w SQL editorze Supabase.
**Nie uruchamia się ich w całości.** Gettery działają wg `data ?? FALLBACK`,
więc wiersz z bazy zawsze wygrywa z treścią w `lib/content/*.ts` — a oba seedy
wstawiają treść uboższą albo wprost fałszywą:

| Plik | |
|---|---|
| `001_create_tables.sql` | ✅ całość |
| `002_rls_policies.sql` | ✅ całość — bez RLS rola `anon` nic nie przeczyta |
| `003_seed_data.sql` | ❌ **nie uruchamiać** — blok `trainers` wstawia atrapy („Kamil Nowak", „Anna Kowalska"), które zastąpiłyby prawdziwą kadrę na `/trenerzy/` i stronie głównej; `locations` i `camps` są uboższe od fallbacków z `lib/content/hubs.ts` |
| `003a_seed_products.sql` | ✅ całość — wycięty z `003` blok produktów, jedyne co ze sklepu potrzebuje bazy |
| `004_seo_tables.sql` | ✅ całość (same tabele, zostają puste) |
| `005_seed_seo_pages.sql` | ❌ **pomijamy**. Chude `city_pages` skasowałyby sale, kadrę, grafiki grup, FAQ, wideo hero i **ID formularzy AIPAX** — czyli zapisy przestałyby działać |

Druga pułapka: `data.length > 0 ? data : fallback` — **częściowe dane zastępują
cały fallback**. Zaseedowanie samych brakujących dyscyplin wyrzuciłoby
`akrobatyka` z `generateStaticParams`, więc `/akrobatyka/` dostałoby 404.

Konsekwencja: treść SEO żyje w kodzie, a Supabase obsługuje tylko sklep,
zamówienia, Instagram i logowanie do panelu. Panel i tak nigdy nie miał CRUD-a
dla `city_pages`, `events` ani `static_pages`.

### Kontrola kompletu chronionych URL-i

```bash
awk '/^## Zachowane URL-e/,/^## Nowe strony/' docs/03-mapa-url.md \
  | grep -oE '`/[a-z0-9-]*/`' | tr -d '`' \
  | while read u; do s=${u#/}; s=${s%/}; \
      [ -f "out/$s/index.html" ] && echo "OK $u" || echo "BRAK $u"; done
```

Wszystkie 17 adresów musi dawać „OK". W eksporcie statycznym brakująca strona
to twarde 404 aż do przebudowy — nie naprawi się sama po dodaniu wiersza do bazy.

## Deploy strony publicznej

```bash
DEPLOY_HOST=user@serwer DEPLOY_PATH=/var/www/airsquad ./scripts/deploy.sh
./scripts/deploy.sh --dry-run     # pokazuje, co poszłoby na serwer
```

Skrypt buduje i wysyła `out/` przez `rsync --delete`. Sam `npm run build` też
wystarcza — `out/` wgrywa się dowolnym narzędziem.

`npm run build` odpala hook `prebuild` → `scripts/check-build-env.mjs`, który
**zatrzymuje build**, gdy env jest lokalny lub placeholderowy. Bez tego łatwo
wypuścić katalog wyglądający poprawnie, a mający canonicale i sitemapę na
localhost oraz puste `/sklep` i `/media`. Świadomy build podglądowy:
`ALLOW_PLACEHOLDER_BUILD=1 npm run build`.

Na serwer idzie **cała zawartość `out/`** — HTML, `_next/`, `images/`, `sitemap.xml`, `robots.txt`, `404.html` oraz pliki `__next.*.txt` (payloady RSC dla nawigacji klienckiej — bez nich przejścia między stronami robią pełne przeładowanie).

nginx:

```nginx
server {
    root /var/www/airsquad;   # zawartość out/
    index index.html;

    # trailingSlash: true — /rzeszow ma zostać przekierowane na /rzeszow/
    location / {
        if (-d $request_filename) { rewrite ^(.*[^/])$ $1/ permanent; }
        try_files $uri $uri/index.html =404;
    }

    error_page 404 /404.html;

    # hashowane assety są niezmienne, HTML musi być świeży po każdym wgraniu
    location /_next/static/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
    location ~* \.html$     { add_header Cache-Control "no-cache"; }
}
```

Apache (`.htaccess` w katalogu `out/`) — `DirectorySlash On` jest domyślne i samo dokłada 301 ze slashem:

```apache
DirectoryIndex index.html
DirectorySlash On
ErrorDocument 404 /404.html
Options -Indexes
```

**Zmienne środowiskowe muszą być ustawione w momencie builda** — `NEXT_PUBLIC_*` są wkompilowane w JS i HTML, a nie czytane na serwerze:

| Zmienna | Do czego | Skutek błędnej wartości |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `sitemap.xml`, `robots.txt`, canonicale, OG | canonicale i sitemapa z `localhost` → utrata SEO |
| `NEXT_PUBLIC_SUPABASE_URL` | treść zapiekana w buildzie **oraz** fetch w przeglądarce (`/sklep`, `/media`) | pusta treść z fallbacków; sklep i media wiszą na „Ładowanie" |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | jw. | jw. |

## Deploy panelu admina (Vercel, osobny projekt)

Panel nie jedzie razem ze statyką — to druga aplikacja z tego samego repo.
Konfiguracja jednorazowa w panelu Vercela (nie da się jej ustawić plikiem w repo):

1. **Add New → Project** → to samo repo `airsquad-redesign`.
2. **Root Directory** = `admin-app` (przycisk „Edit" przy wyborze katalogu).
3. **Include files outside of the Root Directory in the Build Step** — musi
   zostać **włączone**. Panel importuje typy bazy z katalogu nadrzędnego
   (`admin-app/lib/types/database.ts` re-eksportuje `lib/types/database.ts`);
   bez tego build nie znajdzie pliku.
4. **Environment Variables** — `NEXT_PUBLIC_SUPABASE_URL` i
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` z realnego projektu Supabase. Bez nich
   `/admin/login` zwraca 500 (`createServerClient` nie przyjmuje pustego URL-a).
5. Framework preset wykrywa się sam (Next.js), Build Command i Output Directory
   zostają domyślne.

Projekt strony publicznej (dotąd budujący całą aplikację) po tej zmianie buduje
już tylko statykę — `/admin` z tego deploya znika i jest to zamierzone.

## Aktualizacja treści po zmianie w adminie

Treść z bazy dzieli się na dwie ścieżki:

| Ścieżka | Co obejmuje | Kiedy się aktualizuje |
|---|---|---|
| Zapiekane w buildzie | strony miast, dyscypliny, wydarzenia, huby, meta tagi, sitemapa | dopiero po `npm run build` i wgraniu `out/` |
| Na żywo w przeglądarce | produkty i zamówienia (`/sklep`), feed Instagrama i galeria (`/media`), zapisy AIPAX | natychmiast, bez rebuildu |

Zmiana w adminie dotycząca treści SEO **nie pojawi się na stronie sama z siebie**.

**Wdrożone: wariant ręczny** — `./scripts/deploy.sh` (build + rsync, jedna komenda).
Zero dodatkowej infrastruktury, kosztem tego, że ktoś musi pamiętać o uruchomieniu.

Warianty automatyczne (nie wdrożone — wymagają infrastruktury, której jeszcze nie ma):

- **Webhook z Supabase → CI** — trigger na `city_pages`/`disciplines`/`events` woła
  `workflow_dispatch` w GitHub Actions, workflow robi to samo co `deploy.sh`.
  Wymaga: runnera, klucza SSH do serwera w sekretach repo i tokenu GitHuba po
  stronie Supabase. Najbliżej „zmieniam w adminie, widzę na stronie".
- **Build z harmonogramu** (nocny cron na serwerze albo `schedule:` w Actions) —
  najprostsza automatyzacja, kosztem opóźnienia do doby.

Oba sprowadzają się do wywołania `deploy.sh` z odpowiednim środowiskiem, więc
przejście na nie nie wymaga zmian w kodzie strony.

## Co dalej w architekturze

Patrz `00-status.md` sekcja "Następne fazy". Architektura nie wymaga zmian przed launchem.
