# Architektura — co faktycznie zbudowano

Ten dokument opisuje to, co JEST. Nie analizuje wariantów (WordPress vs Astro vs headless) — ta dyskusja jest w historii projektu.

## Stack

| Warstwa | Technologia | Dlaczego |
|---|---|---|
| Frontend | Next.js 16 (App Router) | Server Components, ISR, dobre SEO, Vercel-native. |
| Hosting | Vercel | Edge deploy, zero-config dla Next.js, automatyczne previews. |
| Baza danych | Supabase (Postgres) | RLS, realtime, REST + JS SDK, niski koszt na start. |
| Auth (admin) | Hasło + middleware | Mały zespół, prosty model. Bez OAuth. |
| Storage (zdjęcia) | Supabase Storage | Spójne z bazą, prosty API. |
| CMS treści | Custom panel `/admin` | Polski, dopasowany do typów treści, bez zewnętrznej zależności. |
| Klub-management | AIPAX (zewnętrzny) | Zapisy, grafik, płatności, portal rodzica. Embed iframe. |

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
| `/sklep` | `app/sklep/page.tsx` | tabela `products` |
| `/admin/*` | `app/admin/...` | wszystkie tabele |
| `/sitemap.xml` | `app/sitemap.ts` | wszystkie tabele z `is_published=true` |
| `/robots.txt` | `public/robots.txt` | statyczny |

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

- **ISR** dla stron z bazy (rewalidacja co 1h dla treści, co 5min dla `aktualnosci`).
- **`next/image`** dla wszystkich zdjęć z Supabase Storage.
- **Generic catch-all** rozwiązany w jednym `generateStaticParams`, który prefetchuje wszystkie publiczne slugi przy buildzie.
- **Brak client-side fetch** dla treści wizerunkowej — wszystko w RSC.

## Co dalej w architekturze

Patrz `00-status.md` sekcja "Następne fazy". Architektura nie wymaga zmian przed launchem.
