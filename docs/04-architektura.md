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
| Auth (admin) | Hasło + proxy (`admin-app/proxy.ts`) | Mały zespół, prosty model. Bez OAuth. |
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
static_pages       → /zapisy, /airspace, /aktualnosci
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
| `/zapisy`, `/airspace`, `/aktualnosci` | `app/[slug]/page.tsx` | tabela `static_pages` |
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
       ├─ /zapisy   → iframe formularza
       └─ /grafik   → iframe kalendarza
                  ↓
              AIPAX
              ├─ Baza uczniów
              ├─ Płatności za zajęcia
              ├─ Frekwencja
              └─ Portal rodzica
```

URL-e iframe konfigurowane w tabeli `static_pages.content` lub w zmiennej środowiskowej `NEXT_PUBLIC_AIPAX_REGISTRATION_URL` (do ustalenia przed launchem).

## Co nie jest częścią architektury

| Nie ma i nie będzie | Dlaczego |
|---|---|
| ORM (Prisma, Drizzle) | Supabase JS SDK + typy TypeScript wystarczają. |
| State manager (Redux, Zustand) | Server Components + SWR dla klienta = wystarczy. |
| Headless CMS (Sanity, Strapi) | `/admin` pokrywa potrzeby, mniej zależności zewnętrznych. |
| Edge functions / middleware logiki | Tylko ochrona `/admin` przez hasło. Reszta to RSC. |
| GraphQL | Supabase REST + RLS = prościej. |
| Custom backend (Express, NestJS) | RSC + Server Actions = wystarczająca warstwa serwerowa. |

Każda z tych technologii dodawałaby złożoności bez realnej wartości na obecnej skali (jeden klub, ~7 lokalizacji, paneluje 1-2 osoby).

## Decyzje, które warto kwestionować

To miejsce na wątpliwości, nie deklaracje. Jeżeli któraś z tych decyzji boli — wracamy do niej:

- **Catch-all `/[slug]` z 4 zapytaniami do bazy** — działa szybko dzięki cache Supabase, ale gdyby ruch wzrósł 10x, można cache-ować w Vercel KV.
- **Hasło zamiast Supabase Auth dla admina** — działa, ale przy >2 administratorach warto przejść na Auth.
- **Sklep w tej samej domenie co strona wizerunkowa** — prostota wygrywa, ale jeżeli sklep urośnie, można odciąć na subdomenę (np. `sklep.airsquad.pl`).
- **AIPAX jako iframe, nie jako custom integracja przez API** — szybciej i taniej, ale jeżeli AIPAX zacznie ograniczać UX (powolne ładowanie, słaby mobile), warto rozważyć integrację API.

## Bezpieczeństwo

- **RLS na wszystkich tabelach.** Anonimowy klient czyta tylko `is_published=true`. Pisze tylko serwis przez service role key.
- **Hasło admina** w env, nie w kodzie.
- **Service role key** tylko w Server Components / Server Actions, nigdy w client.
- **Supabase Storage** publiczne dla `images`, prywatne dla `documents` (zamówienia, faktury).

## Wydajność

- **Statyczny HTML** dla całej treści wizerunkowej — zero renderu na żądanie (ISR odpadł razem z serwerem).
- **`next/image` bez optymalizacji** (`images.unoptimized: true`) — eksport statyczny nie ma loadera; zdjęcia trzeba przygotować w docelowym rozmiarze.
- **Generic catch-all** rozwiązany w jednym `generateStaticParams`, który zbiera wszystkie publiczne slugi przy buildzie.
- **Client-side fetch tylko tam, gdzie treść musi być świeża** bez rebuildu (`/sklep`, `/media`) — reszta w RSC, zapieczona.

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
