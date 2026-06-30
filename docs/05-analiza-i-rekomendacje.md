# Analiza dokumentacji i kodu wizualnego — raport

Data: 2026-05-02  
Autor: v0  
Status: ukończone

---

## 1. Podsumowanie wykonawcze

### Stan dokumentacji
Dokumentacja została skonsolidowana do 5 plików w `/docs`. Usunięto redundancje i sprzeczności. Jedno źródło prawdy zamiast 13 rozproszonych dokumentów.

### Stan kodu wizualnego (JSX)
Plik `option-c2-street-violet.jsx` to **mockup designerski**, nie kod produkcyjny. Zawiera wartościowe pomysły wizualne, ale wymaga pełnego przepisania na Tailwind + React patterns zgodne z projektem.

### Decyzja kluczowa
Projekt Air Squad NIE kopiuje JSX 1:1. Zamiast tego: wyciągamy palety i kierunek wizualny, implementujemy w istniejącym stacku (Next.js + Tailwind + shadcn/ui).

---

## 2. Analiza dokumentów Markdown

### 2.1 Dokumenty zachowane bez zmian

| Plik | Ocena | Uzasadnienie |
|------|-------|--------------|
| `01-audyt-strony.md` | Bardzo dobry | Konkretna analiza 18 URL-ów, realne problemy, bez hipotez |
| `02-plan-seo.md` | Dobry | Wykonalny plan, zgodny z audytem |
| `03-mapa-url.md` | Dobry | Jedno źródło prawdy o strukturze URL |

### 2.2 Dokumenty przepisane

| Plik | Co zmieniono | Dlaczego |
|------|--------------|----------|
| `00-status.md` | Nowy, zastępuje 3 pliki | Eliminacja sprzeczności między QUICKSTART, PROJECT_ROADMAP, IMPLEMENTATION_GUIDE |
| `04-architektura.md` | Nowy, zastępuje hipotezy | Opisuje to co JEST (Next.js + Supabase), nie warianty (WordPress vs Astro) |
| `README.md` | Nowy index | Nawigacja po dokumentacji |

### 2.3 Dokumenty archiwizowane (nie w /docs)

Poniższe pliki z `user_read_only_context` NIE zostały skopiowane — zawierają nieaktualne hipotezy lub redundantne informacje:

- `02-trzy-koncepcje-designu.md` — decyzja już zapadła
- `03-rekomendowana-architektura.md` — zastąpiony przez `04-architektura.md`
- `04-model-tresci-i-administracja.md` — pokryty przez `04-architektura.md`
- `09-podsumowanie-zalozen-dla-wdrozenia.md` — redundantny z audytem
- `10-analiza-aktualnego-projektu-i-jsx.md` — zastąpiony przez ten raport
- `11-zebrane-materialy-i-media.md` — do przeniesienia do Notion/Google Drive
- `13-jak-administrowac-strona.md` — do napisania jako onboarding po launchu
- `14-checklista-publikacji.md` — pokryta przez `00-status.md`
- `15-raport-z-wdrozenia.md` — zastąpiony przez `00-status.md`
- `README_FOR_CODEX.md` — nieaktualny stack (sugeruje WordPress/Astro)

---

## 3. Analiza kodu JSX (`option-c2-street-violet.jsx`)

### 3.1 Struktura pliku

```
568 linii, 9 komponentów:
├── C2_PALETTE (paleta kolorów)
├── c2Styles (style bazowe)
├── C2Sticker (komponent naklejki)
├── C2Nav (nawigacja)
├── C2Hero (sekcja hero z wideo)
├── C2Marquee (pasek przesuwny)
├── C2Disciplines (karty dyscyplin)
├── C2Camp (sekcja obozu)
├── C2Locations (lista lokalizacji)
├── C2Team (zespół)
└── C2Footer (stopka)
```

### 3.2 Co jest dobre (do zachowania)

| Element | Wartość | Jak przenieść |
|---------|---------|---------------|
| Paleta kolorów | Spójny brand: czerń + fiolet + niebieski + cyan | Zdefiniować w `globals.css` jako CSS variables |
| Efekt naklejki | Wizualnie wyróżniający, zgodny z brandem | Komponent `<Sticker>` z Tailwind |
| Marquee | Dynamiczny, przyciąga uwagę | Gotowy komponent `react-fast-marquee` lub CSS animation |
| Typography display | Duże, bold, italic — charakter | Klasy Tailwind: `text-[280px] font-bold italic` |
| Struktura sekcji | Hero → Marquee → Disciplines → Camp → Locations → Team → Footer | Zachować kolejność w `page.tsx` |

### 3.3 Co jest złe (do poprawy)

#### Krytyczne (bloker produkcji)

| Problem | Gdzie | Naprawa |
|---------|-------|---------|
| Inline styles wszędzie | Wszystkie komponenty | Przepisać na Tailwind classes |
| Brak responsive | `fontSize: 280`, `gridTemplateColumns: repeat(4, 1fr)` | Breakpoints: `text-[120px] md:text-[200px] lg:text-[280px]` |
| Hardcodowane treści | Zespół, lokalizacje, dyscypliny w komponentach | Dane z Supabase, komponenty przyjmują props |
| Fonty nie ładowane | `Space Grotesk`, `JetBrains Mono` | Dodać do `next/font` w `layout.tsx` |
| Brak a11y | Brak `aria-label`, `alt`, focus states | Audyt a11y przed launchem |

#### Ważne (do naprawy przed launchem)

| Problem | Gdzie | Naprawa |
|---------|-------|---------|
| Kontrast poniżej WCAG AA | `rgba(255,255,255,0.55)` na fiolecie | Zwiększyć do 0.7 lub użyć białego |
| YouTube iframe bez `title` | `C2Hero` | Dodać opisowy `title` |
| Box-shadow aliasing | `8px 8px 0 cyan` + `rotate(-0.5deg)` | Zmniejszyć shadow lub usunąć rotate |
| Brak loading states | Wszystkie sekcje | Skeleton components |

#### Kosmetyczne (nice-to-have)

| Problem | Gdzie | Naprawa |
|---------|-------|---------|
| Animacja marquee w `<style>` inline | `C2Marquee` | Przenieść do `globals.css` |
| Wielokrotne definiowanie gradientów | `C2Locations`, `C2Team` | Wyciągnąć do zmiennych |

### 3.4 Ocena zgodności z best practices

| Kryterium | Ocena | Komentarz |
|-----------|-------|-----------|
| Czytelność kodu | 3/5 | Logiczna struktura, ale inline styles utrudniają skanowanie |
| Reusability | 2/5 | `C2Sticker` reusable, reszta monolityczna |
| Maintainability | 2/5 | Zmiana koloru = edycja w 20 miejscach |
| Performance | 3/5 | YouTube iframe ciężki, brak lazy loading |
| Accessibility | 1/5 | Brak podstawowych atrybutów a11y |
| Responsiveness | 1/5 | Stałe wartości px, brak media queries |

---

## 4. Rekomendacje techniczne

### 4.1 Paleta kolorów — implementacja w Tailwind

Dodać do `app/globals.css`:

```css
@theme inline {
  --color-brand-bg: #0A0A12;
  --color-brand-panel: #15152A;
  --color-brand-violet: #8A2BE2;
  --color-brand-violet-soft: #B287FF;
  --color-brand-blue: #1F8BFF;
  --color-brand-cyan: #5CE7FF;
  --color-brand-pink: #E040FB;
  --color-brand-mute: rgba(255, 255, 255, 0.55);
  --color-brand-line: rgba(255, 255, 255, 0.12);
}
```

Użycie: `bg-brand-bg`, `text-brand-cyan`, `border-brand-violet`.

### 4.2 Fonty — implementacja w Next.js

Dodać do `app/layout.tsx`:

```tsx
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-display'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono'
})
```

Dodać do `globals.css`:

```css
@theme inline {
  --font-sans: var(--font-display), system-ui, sans-serif;
  --font-mono: var(--font-mono), ui-monospace, monospace;
}
```

### 4.3 Komponent Sticker — przykład Tailwind

```tsx
// components/ui/sticker.tsx
import { cn } from '@/lib/utils'

interface StickerProps {
  children: React.ReactNode
  variant?: 'violet' | 'cyan' | 'pink' | 'blue'
  size?: 'sm' | 'md' | 'lg'
  rotate?: number
  className?: string
}

const variants = {
  violet: 'bg-brand-violet text-white',
  cyan: 'bg-brand-cyan text-brand-bg',
  pink: 'bg-brand-pink text-white',
  blue: 'bg-brand-blue text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
}

export function Sticker({ 
  children, 
  variant = 'violet', 
  size = 'md', 
  rotate = -3,
  className 
}: StickerProps) {
  return (
    <span 
      className={cn(
        'inline-block rounded-full font-bold font-mono',
        'border-2 border-white shadow-[3px_3px_0_var(--color-brand-violet)]',
        variants[variant],
        sizes[size],
        className
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  )
}
```

### 4.4 Responsive typography

Zamiast `fontSize: 280`:

```tsx
<h1 className="text-6xl sm:text-8xl md:text-[160px] lg:text-[280px] font-bold leading-none tracking-tight">
  flip.
</h1>
```

### 4.5 YouTube embed z lazy loading

```tsx
// components/video-background.tsx
'use client'

import { useState } from 'react'

export function VideoBackground({ videoId, start = 9, end = 25 }: {
  videoId: string
  start?: number
  end?: number
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {!loaded && (
        <div className="absolute inset-0 bg-brand-bg animate-pulse" />
      )}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&start=${start}&end=${end}&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3`}
        title="Air Squad - akrobatyka i tricking"
        allow="autoplay; encrypted-media"
        onLoad={() => setLoaded(true)}
        className={cn(
          'absolute top-1/2 left-1/2 w-[177.77vh] h-full min-w-full min-h-[56.25vw]',
          '-translate-x-1/2 -translate-y-1/2 scale-140 border-0',
          loaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-500'
        )}
      />
    </div>
  )
}
```

---

## 5. Rekomendacje organizacyjne

### 5.1 Harmonogram prac

| Tydzień | Zadania | Odpowiedzialność |
|---------|---------|------------------|
| 1 | Dane kontaktowe, hasło admina, zdjęcia trenerów | Air Squad |
| 1 | URL-e iframe AIPAX | Air Squad + AIPAX |
| 2 | Test iframe na mobile, test wszystkich URL-i | Developer |
| 2 | Google Search Console, Vercel Analytics | Developer |
| 3 | Email service (Resend) dla sklepu | Developer |
| 3 | Test na rzeczywistych urządzeniach | Air Squad |
| 4 | Launch produkcyjny | Developer + Air Squad |
| 5-8 | Monitoring 404, indeksacja, Core Web Vitals | Developer |

### 5.2 Podział odpowiedzialności

| Rola | Zakres | Osoba/zespół |
|------|--------|--------------|
| Product Owner | Priorytety, akceptacja | Air Squad (Gabriel) |
| Developer | Kod, deploy, monitoring | v0 / zespół dev |
| Content | Zdjęcia, opisy, dane | Air Squad |
| SEO | Monitoring, optymalizacja | Developer + Air Squad |
| AIPAX | Konfiguracja, URL-e | AIPAX support |

### 5.3 Testowanie

#### Przed launchem (blokujące)
- [ ] Wszystkie 18 chronionych URL-i zwracają 200
- [ ] Sitemap.xml dostępny i poprawny
- [ ] Meta tags na każdej stronie (sprawdzić Open Graph debuggerem)
- [ ] AIPAX iframe ładuje się na mobile
- [ ] Formularz kontaktowy wysyła email (po podpięciu Resend)
- [ ] Zamówienie w sklepie tworzy rekord w bazie

#### Po launchu (monitoring)
- [ ] Google Search Console — brak błędów indeksacji
- [ ] Core Web Vitals — LCP < 2.5s, CLS < 0.1
- [ ] Bounce rate na stronach lokalizacji
- [ ] Konwersja: kliknięcia "Zapisz" → AIPAX

### 5.4 Deployment

#### Procedura wdrożenia
1. **Staging** — Vercel preview deployment (automatyczny z każdego PR)
2. **Production** — merge do `main`, Vercel auto-deploy
3. **Domena** — podpiąć przed launchem w Vercel dashboard
4. **DNS** — A/CNAME record u rejestratora domeny
5. **SSL** — automatyczny przez Vercel

#### Checklista zmiennych środowiskowych

Przed deployem na produkcję sprawdź w Vercel → Settings → Environment Variables:

| Zmienna | Wymagana | Skąd |
|---------|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Tak | Supabase Dashboard → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tak | Supabase Dashboard → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Tak | Supabase Dashboard → API (server-only) |
| `RESEND_API_KEY` | Tak (po podpięciu) | resend.com/api-keys |
| `NEXT_PUBLIC_SITE_URL` | Tak | `https://airsquad.pl` |
| `ADMIN_PASSWORD` | Tak | Wygenerować silne hasło |
| `NEXT_PUBLIC_AIPAX_URL` | Tak | AIPAX support |

Zasada: zmienne `NEXT_PUBLIC_*` widoczne w przeglądarce, reszta tylko po stronie serwera. Service role key NIGDY nie może wyciec do klienta.

#### Smoke testy po deployu (10 minut)

Wykonać natychmiast po podpięciu domeny — zanim ogłosimy launch:

- [ ] `https://airsquad.pl` zwraca 200 i renderuje hero
- [ ] `https://airsquad.pl/akrobatyka` — strona dyscypliny działa
- [ ] `https://airsquad.pl/rzeszow` — pierwsza lokalizacja działa
- [ ] `https://airsquad.pl/zapisy` — iframe AIPAX ładuje się
- [ ] `https://airsquad.pl/sitemap.xml` — zwraca XML, lista URL-i kompletna
- [ ] `https://airsquad.pl/robots.txt` — pozwala na indeksację
- [ ] DevTools → Console: zero błędów na home
- [ ] DevTools → Network: wszystkie zasoby 200, brak CORS errors
- [ ] Lighthouse na home: Performance > 80, SEO > 95, A11y > 90
- [ ] Test formularza kontaktowego (wysłać prawdziwy email)
- [ ] Test zamówienia w sklepie (status `pending` w bazie)
- [ ] Mobile (iPhone Safari, Android Chrome): hero, nav, iframe AIPAX

#### Rollback strategy

Jeżeli smoke test wykryje krytyczny błąd:

1. **Vercel → Deployments → poprzedni działający deployment → "Promote to Production"** — przywrócenie w 30 sekund, bez rebuilda.
2. Stworzyć issue z opisem problemu i logami z `Vercel → Logs`.
3. Naprawić na branchu, zmergować, ponowny deploy.
4. NIE rolować bazy danych przez Vercel — zmiany w Supabase trzeba cofać osobno (manualnym SQL lub backupem z `supabase db dump`).

Krytyczne: backup bazy Supabase robić **przed każdym deployem** który zmienia schemat. Komenda: Supabase Dashboard → Database → Backups → Create backup.

---

## 6. Cele na każdy etap

Każdy etap ma **mierzalne kryterium zamknięcia** — bez tego nie wiemy, czy idziemy dalej.

### Etap 1: Pre-launch (tydzień 1-2)

**Cel:** Strona gotowa do podpięcia domeny.

| KPI | Próg zamknięcia |
|-----|-----------------|
| Liczba otwartych blokerów w `00-status.md` | 0 |
| Trenerzy z pełnym profilem (zdjęcie + bio) | ≥ 3 |
| Lokalizacje ze zdjęciem i opisem | 7/7 |
| Błędy w konsoli na home | 0 |
| Lighthouse Performance (desktop, staging) | ≥ 80 |
| Działający iframe AIPAX na `/zapisy` | Tak |

**Definition of done:** wszystkie powyższe spełnione + akceptacja Product Ownera.

### Etap 2: Launch (tydzień 3-4)

**Cel:** Domena żyje, Google widzi stronę.

| KPI | Próg zamknięcia |
|-----|-----------------|
| Domena `airsquad.pl` wskazuje na nową stronę | Tak |
| SSL aktywny (zielona kłódka) | Tak |
| Google Search Console — sitemap przesłany | Tak |
| Strony zindeksowane w Google | ≥ 10 z 18 chronionych URL-i |
| Smoke testy z 5.4 | 12/12 zielone |
| Pierwsza wizyta z organic search (GA4) | Tak |

**Definition of done:** Search Console raportuje przesłany sitemap, brak błędów krytycznych.

### Etap 3: Stabilizacja (tydzień 5-8)

**Cel:** Strona działa stabilnie, ruch wraca do poziomu sprzed redesignu.

| KPI | Próg zamknięcia |
|-----|-----------------|
| Błędy 404 w Search Console | 0 (dla URL-i z mapy 03) |
| Core Web Vitals — LCP (75th percentile) | < 2.5s |
| Core Web Vitals — CLS (75th percentile) | < 0.1 |
| Core Web Vitals — INP (75th percentile) | < 200ms |
| Pierwsze zapisy przez iframe AIPAX | ≥ 5 zapisów |
| Bounce rate na lokalizacjach (vs. baseline ze starej strony) | nie wyższy o > 10% |

**Definition of done:** trzy kolejne tygodnie stabilne metryki, brak regresji ruchu organicznego.

### Etap 4: Rozwój (miesiąc 2-3)

**Cel:** Funkcjonalności podnoszące konwersję i przychód.

| KPI | Próg zamknięcia |
|-----|-----------------|
| Płatności online w sklepie (Stripe/PayU) | Pierwsze udane zamówienie z płatnością |
| Blog/aktualności jako CMS | ≥ 3 opublikowane wpisy (jeśli redakcja pisze) |
| Galerie zdjęć z lokalizacji | ≥ 4 lokalizacje z galerią po ≥ 6 zdjęć |
| Konwersja `/zapisy` → AIPAX (kliknięcie CTA) | Wzrost o ≥ 20% vs. tydzień 4 |

**Definition of done:** nowe funkcje używane przez klientów (nie tylko zdeployowane), bez regresji KPI z etapu 3.

---

## 7. Podsumowanie

### Co zrobić teraz
1. Zamknąć blokery launchu z `00-status.md`
2. Nie kopiować JSX — wyciągnąć palety i wzorce do Tailwind
3. Utrzymywać dokumentację w `/docs`, nie dodawać nowych plików w katalogu głównym

### Czego nie robić
1. Nie budować własnego systemu zapisów (to AIPAX)
2. Nie zmieniać URL-i bez analizy Search Console
3. Nie przepisywać JSX 1:1 — to mockup, nie kod produkcyjny

### Następny krok
Wdrożyć palety kolorów i fonty z JSX do `globals.css` i `layout.tsx`, zachowując obecną architekturę komponentów.
