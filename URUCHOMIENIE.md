# Uruchomienie projektu Air Squad (lokalnie na Macu)

Dwie aplikacje w jednym repozytorium:

| Co | Katalog | Port | Czym jest |
|---|---|---|---|
| Strona publiczna | `airsquad-web/` | 2003 | Next.js 16, **eksport statyczny** do `out/` |
| Panel admina | `airsquad-web/admin-app/` | 2005 | Next.js 16, aplikacja serwerowa (SSR + auth) |

Uzasadnienie podziału: `docs/04-architektura.md`, sekcja „Dwie aplikacje".

---

## 1. Zmienne środowiskowe

Obie aplikacje potrzebują tych samych dwóch wartości z Supabase
(**Project Settings → API**):

```
NEXT_PUBLIC_SUPABASE_URL=https://<projekt>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon / public key>
```

Wpisz je do `airsquad-web/.env.local`. Klucz `anon` jest publiczny z założenia —
i tak trafia do JavaScriptu w przeglądarce, a chroni go RLS. Klucza
`service_role` projekt **nigdzie nie używa** i nie należy go tu wstawiać.

`NEXT_PUBLIC_SITE_URL` jest opcjonalny — `lib/seo/site.ts` ma fallback
`https://airsquad.pl`.

---

## 2. Baza danych

W Supabase → **SQL Editor**, w tej kolejności:

| Plik | |
|---|---|
| `scripts/001_create_tables.sql` | ✅ całość |
| `scripts/002_rls_policies.sql` | ✅ całość — bez RLS `anon` nic nie przeczyta |
| `scripts/003a_seed_products.sql` | ✅ całość (same produkty do sklepu) |
| `scripts/004_seo_tables.sql` | ✅ całość |
| `scripts/003_seed_data.sql` | ❌ **pomiń** |
| `scripts/005_seed_seo_pages.sql` | ❌ **pomiń** |

Dwa ostatnie wstawiają atrapy trenerów i uboższe wersje stron miast. Gettery
działają wg zasady „wiersz z bazy wygrywa z kodem", więc zaseedowanie ich
**zastąpiłoby** bogatsze treści z `lib/content/` — łącznie z ID formularzy
AIPAX, czyli zapisy przestałyby działać. Pełne uzasadnienie w
`docs/04-architektura.md`, sekcja „Skrypty SQL — których NIE uruchamiać".

Puste tabele to stan normalny: strona renderuje wtedy fallbacki z kodu.

---

## 3. Uruchomienie

```bash
cd "/Users/fanatyk/Desktop/TWÓRCZOŚĆ/airsquad redesign/airsquad-web"
npm install
npm run dev -- -p 2003
```

Panel, w osobnym oknie terminala:

```bash
cd "/Users/fanatyk/Desktop/TWÓRCZOŚĆ/airsquad redesign/airsquad-web/admin-app"
npm install
npm run dev -- -p 2005
```

Panel: **http://localhost:2005/admin** — logowanie przez Supabase Auth, konto
zakładasz w Supabase Dashboard (Authentication → Users → Add user, z „Auto
Confirm User"). W polu „Login lub e-mail" krótka nazwa dostaje doklejone
`@airsquad.pl`; adres na innej domenie wpisuje się w całości.

**Panel w dev chodzi na webpacku i tak ma zostać.** Turbopack wywala panikę przy
kompilacji `/admin/(panel)/page`, bo tnie nazwę zawierającą `TWÓRCZOŚĆ` w środku
znaku UTF-8. Szczegóły i trwałe rozwiązanie w `docs/04-architektura.md`.
Produkcji to nie dotyczy.

---

## 4. Build i podgląd statyki

```bash
npm run build            # → out/
npx serve out            # podgląd tego, co realnie pojedzie na serwer
```

`npm run build` odpala hook `prebuild` (`scripts/check-build-env.mjs`), który
**zatrzymuje build** przy lokalnym lub placeholderowym env. Bez tego łatwo
wypuścić katalog wyglądający poprawnie, a mający canonicale i sitemapę na
`localhost` oraz martwy sklep. Świadomy build podglądowy:
`ALLOW_PLACEHOLDER_BUILD=1 npm run build`.

Build panelu odpala `scripts/check-types-sync.mjs` — `admin-app` ma własną
**kopię** typów bazy (nie może importować spoza swojego katalogu) i build
przerwie się, jeśli rozjedzie się z oryginałem. Naprawa: `npm run sync-types`.

---

## 5. Wdrożenie

```bash
./scripts/deploy-ftp.sh staging --dry-run   # pokazuje, co poszłoby na serwer
./scripts/deploy-ftp.sh staging             # → new.airsquad.pl
```

Wymaga `lftp` (`brew install lftp`), pliku `.deploy-target` z nazwą serwera
i wpisu w `~/.netrc` (chmod 600) z danymi FTP. Szczegóły w komentarzu na górze
skryptu. Panel wdraża się osobno: `cd admin-app && vercel --prod`.

---

## Uwagi

- Wymagany Node 18+ (sprawdzone na Node 25).
- `next.config.mjs` ma `typescript.ignoreBuildErrors: true`, więc `npm run build`
  **nie** waliduje typów. Uruchamiaj `npx tsc --noEmit` osobno.
- Bez kluczy Supabase strona wystartuje i pokaże treść z fallbacków, ale sklep
  i feed Instagrama będą puste — te dwa czyta przeglądarka, nie build.
- Zapisy na zajęcia i grafik to zewnętrzny system AIPAX (iframe). Nie budujemy
  własnego — patrz `docs/00-status.md`.
