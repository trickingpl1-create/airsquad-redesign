# Air Squad — Next.js (v0) — Instrukcje dla Claude

## Projekt

Strona Air Squad zbudowana w Next.js 16 (Turbopack) + Tailwind CSS + Supabase + shadcn/ui.
Vercel jest połączony z tym repozytorium i deployuje automatycznie z brancha `main`.

**Dev server:** `npm run dev` → http://localhost:3000

## Zasady pracy (obowiązkowe)

### NIGDY nie commituj bez instrukcji użytkownika
Nie wolno tworzyć commita, pushować ani mergować bez wyraźnej akceptacji i polecenia od użytkownika.
Każda zmiana musi być najpierw pokazana użytkownikowi do zatwierdzenia.

### Pull przed każdym nowym taskiem
Przed rozpoczęciem każdego nowego zadania zawsze wykonaj:
```bash
git pull origin main
```
Dzięki temu pracujesz zawsze na aktualnej wersji kodu.

## Struktura projektu

```
app/                  # Next.js App Router — strony i layouty
  [slug]/             # Dynamiczne strony SEO
  admin/              # Panel admina
  aircamp/            # Podstrona obozów AirCamp
  dyscypliny/         # Dyscypliny (akrobatyka, tricking, longboard…)
  grafik/             # Grafik zajęć
  kontakt/            # Kontakt
  lokalizacje/        # Lokalizacje klubu
  media/              # Galeria / media
  obozy/              # Obozy sportowe
  sklep/              # Sklep
  trenerzy/           # Kadra trenerska
  wydarzenia/         # Aktualności / wydarzenia
  page.tsx            # Strona główna
  layout.tsx          # Root layout

components/
  home/               # Sekcje strony głównej
  layout/             # Nawigacja, footer
  ui/                 # shadcn/ui komponenty
  admin/              # Komponenty panelu admina
  akrobatyka/         # Dyscyplina-specific komponenty
  seo/                # Komponenty SEO
  integrations/       # Integracje zewnętrzne

scripts/              # Migracje Supabase (SQL)
  001_create_tables.sql
  002_rls_policies.sql
  003_seed_data.sql
  004_seo_tables.sql
  005_seed_seo_pages.sql

lib/                  # Helpery, klient Supabase
hooks/                # React hooks
public/               # Statyczne zasoby (obrazy, ikony)
styles/               # Globalne style
```

## Stack technologiczny

- **Framework:** Next.js 16.2 (App Router, Turbopack)
- **Język:** TypeScript
- **Style:** Tailwind CSS v4
- **Komponenty:** shadcn/ui + Radix UI
- **Backend:** Supabase (baza danych + auth + storage)
- **Deployment:** Vercel (auto-deploy z `main`)
- **Formularze:** react-hook-form + zod
- **Wykresy:** recharts

## Zmienne środowiskowe

Wymagane w `.env.local` (nie commitować):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Workflow

1. `git pull origin main` — zawsze na początku nowego taska
2. Implementacja zmian
3. Pokaż diff użytkownikowi i poczekaj na akceptację
4. Commit + push dopiero po wyraźnym poleceniu użytkownika
