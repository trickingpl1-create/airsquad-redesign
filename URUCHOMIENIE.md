# Uruchomienie projektu AirSquad (lokalnie na Macu)

Aplikacja to **Next.js 16 (App Router) + Supabase**. Poniżej komplet kroków, żeby
ją odpalić na `http://localhost:3000`.

---

## 1. Załóż projekt Supabase

1. Wejdź na https://supabase.com i utwórz nowy projekt (region: Europa, np. Frankfurt).
2. Po utworzeniu wejdź w **Project Settings → API** i skopiuj dwie wartości:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Załóż strukturę bazy

W panelu Supabase otwórz **SQL Editor** i uruchom po kolei trzy skrypty z folderu
`scripts/` (każdy osobno, w tej kolejności):

1. `scripts/001_create_tables.sql` — tworzy tabele (lokalizacje, trenerzy, obozy, produkty, posty IG…)
2. `scripts/002_rls_policies.sql` — polityki Row Level Security
3. `scripts/003_seed_data.sql` — dane startowe (treść stron)

Najprościej: otwórz plik, skopiuj całość, wklej do SQL Editora, **Run**. Powtórz dla kolejnego.

## 3. Ustaw zmienne środowiskowe

W katalogu `supabase-integration-status/` skopiuj szablon i wpisz swoje klucze:

```bash
cp .env.local.example .env.local
# następnie edytuj .env.local i wstaw URL + anon key z kroku 1
```

## 4. Zainstaluj zależności i uruchom

```bash
cd "v0 airsquad app/supabase-integration-status"
npm install
npm run dev
```

Otwórz w przeglądarce: **http://localhost:3000**

Panel admina (CRUD treści): **http://localhost:3000/admin** — chroniony hasłem
przez `middleware.ts` (domyślne hasło zmień przed produkcją).

---

## Komendy w skrócie (kopiuj-wklej na Macu)

```bash
cd "/Users/fanatyk/Desktop/TWÓRCZOŚĆ/airsquad redesign/v0 airsquad app/supabase-integration-status"
cp .env.local.example .env.local      # potem wpisz klucze Supabase
npm install
npm run dev
```

Build produkcyjny: `npm run build && npm start`

---

## Uwagi

- Bez kluczy Supabase aplikacja **wystartuje**, ale strony pobierające dane z bazy
  będą puste lub zwrócą błąd — dlatego krok 1–3 jest wymagany do pełnego działania.
- W repo `next.config.mjs` ma `typescript.ignoreBuildErrors: true`, więc istniejące
  ostrzeżenia typów TypeScript **nie blokują** uruchomienia ani builda (to typowy
  output z v0).
- Wymagany Node 18+ (sprawdzono na Node 22). Działa też z `pnpm` (jest `pnpm-lock.yaml`).
- Zapisy i grafik zajęć to zewnętrzny system AIPAX (iframe) — patrz `docs/00-status.md`.
