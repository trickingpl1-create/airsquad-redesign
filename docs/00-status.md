# Status projektu Air Squad

Stan: **przed launchem produkcyjnym**.
Aktualizacja: ostatni commit w katalogu `app/`.

Ten dokument zastępuje wcześniejsze pliki strategiczne. Stare wersje są w `docs/_archive/` (`QUICKSTART.md`, `PROJECT_ROADMAP.md`, `IMPLEMENTATION_GUIDE.md`, `CONTENT_MIGRATION_STRATEGY.md`, `DATABASE_SEED_VERIFICATION_REPORT.md`, `COLOR_SCHEME_UPDATE.md`) — zostawione tylko jako historia, nie używać do planowania.

## Co jest zrobione

### Infrastruktura
- Next.js 16 (App Router) na Vercel
- Supabase: Postgres + Auth + Storage + RLS
- Domena: do podpięcia przed launchem

### Treść i SEO
- 7 stron miast (`/rzeszow`, `/debica`, `/jaslo`, `/biecz`, `/brzostek`, `/tyczyn`, `/pilzno`)
- 4 strony dyscyplin (`/akrobatyka`, `/tricking-akademia`, `/tumbling`, `/longboardy`)
- 3 strony wydarzeń (`/airmeeting`, `/letni`, `/gravityjam`)
- 4 strony statyczne (`/zapisy`, `/airspace`, `/aktualnosci`, `/polityka-prywatnosci`)
- Sitemap.xml generowany dynamicznie z bazy
- Schema.org: LocalBusiness, Event, Course, BreadcrumbList
- Meta tags + Open Graph dla wszystkich stron z bazy

### Panel admina
- CRUD dla: lokalizacji, trenerów, obozów, produktów sklepu, postów Instagram
- Hasło chronione przez middleware

### Sklep
- Lista produktów z bazy, koszyk w localStorage, formularz zamówienia
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
- [ ] Wstawić realne dane kontaktowe (telefon, email, adresy) do `components/layout/footer.tsx`
- [ ] Zmienić domyślne hasło admina na produkcyjne
- [ ] Otrzymać URL-e iframe od AIPAX i podpiąć w `/zapisy` i `/grafik` (komponent `components/iframe-wrapper.tsx` gotowy do użycia)
- [ ] Wgrać realne zdjęcia trenerów (min. 3) i lokalizacji (wszystkie 7) do Supabase Storage
- [ ] Zweryfikować, że wszystkie chronione URL-e z `03-mapa-url.md` zwracają 200

### Ważne, ale nie blokujące
- [ ] Podpiąć email service (Resend) do formularza kontaktowego i zamówień ze sklepu
- [ ] Google Search Console + sitemap submission
- [ ] Vercel Analytics
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
