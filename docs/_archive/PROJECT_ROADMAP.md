# Air Squad - Harmonogram Prac i Kolejne Kroki

> Dokument opisuje szczegolowy plan rozwoju projektu Air Squad z podzialem na etapy, zadania, priorytety i odpowiedzialnosci.

---

## Status Projektu (Stan na Kwiecien 2026)

### Zrealizowane Komponenty

| Kategoria | Status | Szczegoly |
|-----------|--------|-----------|
| Infrastruktura | 100% | Vercel + Supabase skonfigurowane |
| Baza danych | 100% | 13 tabel z RLS, seed data |
| Panel admina | 95% | CRUD dla wszystkich encji |
| Strony SEO | 100% | 7 miast, 4 dyscypliny, 3 wydarzenia, 4 statyczne |
| Sklep | 90% | Katalog, koszyk, zamowienia (brak platnosci online) |
| Branding | 100% | Logo, kolorystyka purple/blue, video hero |
| Dokumentacja | 100% | QUICKSTART, IMPLEMENTATION_GUIDE, CONTENT_MIGRATION |

### Komponenty Wymagajace Pracy

| Kategoria | Status | Pozostale Prace |
|-----------|--------|-----------------|
| Integracja AIPAX | 0% | Iframe'y do zapisow, grafiku, portalu rodzica |
| Tresc (content) | 30% | Zdjecia trenerow, lokalizacji, produktow |
| Email | 0% | Integracja Resend/SendGrid |
| Analityka | 0% | GA4, Search Console, Vercel Analytics |
| Testowanie | 20% | Testy manualne, responsywnosc |

---

## ETAP 1: Przygotowanie do Launchu (Tydzien 1-2)

### 1.1 Integracja AIPAX (Priorytet: Krytyczny)

**Cel**: Osadzenie kluczowych komponentow AIPAX na stronie Air Squad

#### Zadania Techniczne

| ID | Zadanie | Plik/Lokalizacja | Czas | Odpowiedzialnosc |
|----|---------|------------------|------|------------------|
| A1.1 | Utworz komponent IframeWrapper | `/components/integrations/iframe-wrapper.tsx` | 2h | Developer |
| A1.2 | Strona zapisow z iframe AIPAX | `/app/zapisy/page.tsx` | 3h | Developer |
| A1.3 | Strona grafiku z iframe AIPAX | `/app/grafik/page.tsx` | 3h | Developer |
| A1.4 | Link/iframe do portalu rodzica | `/app/portal/page.tsx` | 2h | Developer |
| A1.5 | Testowanie responsywnosci iframe | Wszystkie strony z iframe | 4h | QA |

#### Wymagane od AIPAX

- URL formularza zapisow (embed)
- URL widgetu grafiku (embed)
- URL portalu rodzica (link lub embed)
- Dokumentacja API/parametrow iframe
- Dane testowe do weryfikacji

#### Kod komponentu IframeWrapper

```tsx
// /components/integrations/iframe-wrapper.tsx
'use client'

import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

interface IframeWrapperProps {
  src: string
  title: string
  minHeight?: string
  className?: string
}

export function IframeWrapper({ 
  src, 
  title, 
  minHeight = '600px',
  className = ''
}: IframeWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`relative w-full ${className}`} style={{ minHeight }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Spinner className="h-8 w-8" />
          <span className="ml-2 text-muted-foreground">Ladowanie...</span>
        </div>
      )}
      <iframe
        src={src}
        title={title}
        className="w-full h-full border-0"
        style={{ minHeight }}
        onLoad={() => setIsLoading(false)}
        allow="payment"
      />
    </div>
  )
}
```

---

### 1.2 Uzupelnienie Tresci (Priorytet: Krytyczny)

**Cel**: Wypelnienie bazy danych rzeczywistymi danymi klubu

#### Zadania Organizacyjne

| ID | Zadanie | Zrodlo | Termin | Odpowiedzialnosc |
|----|---------|--------|--------|------------------|
| C1.1 | Zdjecia trenerow (min. 5) | Sesja zdjec lub archiwum | 3 dni | Marketing/Admin |
| C1.2 | Zdjecia lokalizacji (7 miast) | Wizyta lokalna lub archiwum | 5 dni | Marketing/Admin |
| C1.3 | Opisy trenerow (biografie) | Trenerzy | 3 dni | Trenerzy |
| C1.4 | Produkty sklepu (min. 10) | Magazyn + zdjecia produktow | 5 dni | Marketing |
| C1.5 | Posty Instagram (6-12) | Konto @airsquad | 1 dzien | Admin |

#### Specyfikacja Zdjec

| Typ | Wymiary | Format | Uwagi |
|-----|---------|--------|-------|
| Zdjecia trenerow | 400x500px min | JPG/WebP | Portret, jednolite tlo |
| Zdjecia lokalizacji | 1200x800px min | JPG/WebP | Szerokie ujecie sali |
| Zdjecia produktow | 800x800px | PNG (przezroczyste tlo) | Biale tlo lub wyciete |
| Hero images | 1920x1080px | JPG/WebP | Dla stron SEO |

---

### 1.3 Konfiguracja Produkcyjna (Priorytet: Wysoki)

#### Zadania Techniczne

| ID | Zadanie | Plik | Wartosc do Zmiany |
|----|---------|------|-------------------|
| K1.1 | Zmiana hasla admina | `app/admin/login/page.tsx` | `ADMIN_PASSWORD` -> silne haslo |
| K1.2 | Aktualizacja kontaktu | `components/layout/footer.tsx` | Telefon, email, adres |
| K1.3 | Linki social media | `components/layout/footer.tsx` | Instagram, Facebook, YouTube, TikTok |
| K1.4 | Godziny otwarcia | `components/layout/footer.tsx` | Realne godziny pracy |
| K1.5 | Dane do przelewu | `app/[slug]/page.tsx` (zapisy) | Numer konta, dane firmy |

#### Zmienne Srodowiskowe (Vercel)

```env
# Juz skonfigurowane
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Do dodania
RESEND_API_KEY=...           # Email service
GOOGLE_ANALYTICS_ID=...       # GA4
AIPAX_EMBED_URL=...           # Base URL for AIPAX iframes
```

---

## ETAP 2: Uruchomienie i Monitoring (Tydzien 3-4)

### 2.1 Integracja Email (Priorytet: Wysoki)

**Cel**: Automatyczne powiadomienia email dla zamowien i formularza kontaktowego

#### Zadania Techniczne

| ID | Zadanie | Implementacja | Czas |
|----|---------|---------------|------|
| E2.1 | Rejestracja konta Resend | resend.com | 30min |
| E2.2 | Konfiguracja domeny nadawcy | DNS + Resend dashboard | 1h |
| E2.3 | API route dla kontaktu | `/app/api/contact/route.ts` | 2h |
| E2.4 | Email potwierdzenia zamowienia | `/app/api/orders/route.ts` | 3h |
| E2.5 | Szablony email (HTML) | `/lib/email-templates/` | 4h |

#### Struktura Emaili

```
/lib/email-templates/
  contact-confirmation.tsx    # Potwierdzenie wyslania formularza
  order-confirmation.tsx      # Potwierdzenie zamowienia
  order-status-change.tsx     # Zmiana statusu zamowienia
```

---

### 2.2 Analityka i SEO (Priorytet: Wysoki)

#### Zadania Techniczne

| ID | Zadanie | Serwis | Implementacja |
|----|---------|--------|---------------|
| S2.1 | Konfiguracja GA4 | Google Analytics | Dodaj tracking ID do layout.tsx |
| S2.2 | Weryfikacja domeny | Google Search Console | Dodaj meta tag lub DNS |
| S2.3 | Wyslij sitemap | Google Search Console | Submit /sitemap.xml |
| S2.4 | Wlacz Vercel Analytics | Vercel Dashboard | 1-click enable |
| S2.5 | Konfiguracja zdarzen | GA4 | Tracking klikniec CTA, zamowien |

#### Kluczowe Zdarzenia do Sledzenia (GA4)

| Zdarzenie | Trigger | Wartosc |
|-----------|---------|---------|
| `page_view` | Kazda strona | Automatyczne |
| `view_item` | Strona produktu | product_id, price |
| `add_to_cart` | Dodanie do koszyka | product_id, quantity |
| `begin_checkout` | Otwarcie koszyka | cart_value |
| `purchase` | Zlozenie zamowienia | order_value, items |
| `contact_form_submit` | Wyslanie formularza | form_type |
| `aipax_registration_start` | Klikniecie "Zapisz sie" | discipline, location |

---

### 2.3 Testowanie Przedprodukcyjne (Priorytet: Krytyczny)

#### Checklist Testow Manualnych

**Strony Publiczne**
- [ ] Strona glowna laduje < 3s
- [ ] Video hero dziala na mobile
- [ ] Nawigacja dziala na wszystkich stronach
- [ ] Footer wyswietla poprawne dane
- [ ] Wszystkie 7 stron lokalizacji renderuja sie
- [ ] Wszystkie 4 strony dyscyplin renderuja sie
- [ ] Strona grafiku laduje iframe AIPAX
- [ ] Strona zapisow laduje iframe AIPAX
- [ ] Sklep wyswietla produkty
- [ ] Koszyk dziala (dodawanie, usuwanie, checkout)
- [ ] Formularz kontaktowy wysyla dane

**Panel Admina**
- [ ] Logowanie dziala
- [ ] CRUD lokalizacji
- [ ] CRUD trenerow
- [ ] CRUD produktow
- [ ] Lista zamowien
- [ ] Zmiana statusu zamowienia
- [ ] Dodawanie postow Instagram

**Responsywnosc**
- [ ] iPhone SE (375px)
- [ ] iPhone 14 Pro (393px)
- [ ] iPad (768px)
- [ ] Desktop (1280px+)

**Przegladarki**
- [ ] Chrome (Windows/Mac)
- [ ] Safari (Mac/iOS)
- [ ] Firefox
- [ ] Edge

---

## ETAP 3: Rozwoj Funkcjonalnosci (Tydzien 5-8)

### 3.1 Rozszerzenie Sklepu (Priorytet: Sredni)

#### Opcja A: Platnosci Online (Stripe)

| ID | Zadanie | Czas | Zlozonosc |
|----|---------|------|-----------|
| P3.1 | Rejestracja konta Stripe | 1h | Niska |
| P3.2 | Integracja Stripe Checkout | 6h | Srednia |
| P3.3 | Webhook dla potwierdzenia platnosci | 4h | Srednia |
| P3.4 | Aktualizacja statusu zamowienia | 2h | Niska |
| P3.5 | Testy platnosci (sandbox) | 4h | Niska |

#### Opcja B: PayU (dla polskiego rynku)

| ID | Zadanie | Czas | Zlozonosc |
|----|---------|------|-----------|
| P3.6 | Rejestracja konta PayU | 2-5 dni (weryfikacja) | Niska |
| P3.7 | Integracja PayU REST API | 8h | Wysoka |
| P3.8 | Obsluga notyfikacji platnosci | 4h | Srednia |

**Rekomendacja**: Stripe dla szybkosci wdrozenia, PayU dla lepszych stawek w Polsce.

---

### 3.2 Blog / Aktualnosci (Priorytet: Sredni)

**Cel**: Dynamiczna sekcja aktualnosci zarzadzana z panelu admina

#### Schemat Bazy Danych

```sql
-- Nowa tabela: blog_posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author_id UUID REFERENCES trainers(id),
  category TEXT, -- 'aktualnosci', 'porady', 'wydarzenia'
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admin can manage posts" ON blog_posts
  FOR ALL TO authenticated USING (true);
```

#### Zadania Implementacyjne

| ID | Zadanie | Plik | Czas |
|----|---------|------|------|
| B3.1 | Migracja bazy danych | `scripts/blog-migration.sql` | 1h |
| B3.2 | Strona listy artykulow | `/app/aktualnosci/page.tsx` | 4h |
| B3.3 | Strona pojedynczego artykulu | `/app/aktualnosci/[slug]/page.tsx` | 3h |
| B3.4 | Panel admina - lista postow | `/app/admin/blog/page.tsx` | 4h |
| B3.5 | Panel admina - edytor WYSIWYG | `/app/admin/blog/[id]/page.tsx` | 6h |
| B3.6 | SEO dla artykulow | Meta tagi, Schema.org Article | 2h |

---

### 3.3 Galeria Zdjec (Priorytet: Niski)

**Cel**: Atrakcyjna galeria zdjec z treningow, zawodow, obozow

#### Zadania

| ID | Zadanie | Czas |
|----|---------|------|
| G3.1 | Komponent Lightbox (shadcn/ui dialog) | 3h |
| G3.2 | Strona galerii z kategoriami | 4h |
| G3.3 | Panel admina - upload zdjec | 4h |
| G3.4 | Integracja Vercel Blob | 2h |
| G3.5 | Optymalizacja obrazow (next/image) | 2h |

---

## ETAP 4: Optymalizacja i Skalowanie (Miesiac 2-3)

### 4.1 Wydajnosc (Priorytet: Sredni)

#### Metryki Docelowe

| Metryka | Cel | Narzedzie |
|---------|-----|-----------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse |
| FID (First Input Delay) | < 100ms | Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| TTFB (Time to First Byte) | < 600ms | WebPageTest |

#### Zadania Optymalizacyjne

| ID | Zadanie | Wplyw | Czas |
|----|---------|-------|------|
| O4.1 | Lazy loading obrazow | LCP | 2h |
| O4.2 | Preload krytycznych zasobow | LCP | 1h |
| O4.3 | Optymalizacja fontow (next/font) | CLS | 1h |
| O4.4 | Code splitting komponentow | FID | 3h |
| O4.5 | Cache'owanie danych (ISR/SWR) | TTFB | 4h |
| O4.6 | CDN dla mediow (Cloudinary) | LCP | 4h |

---

### 4.2 Bezpieczenstwo (Priorytet: Wysoki)

#### Zadania

| ID | Zadanie | Implementacja |
|----|---------|---------------|
| S4.1 | Rate limiting API | Upstash Redis + middleware |
| S4.2 | CSRF protection | Next.js built-in |
| S4.3 | Content Security Policy | next.config.js headers |
| S4.4 | Input sanitization | zod + DOMPurify |
| S4.5 | Audit logowanie | Tabela admin_logs w Supabase |

---

### 4.3 Wielojezykowosc PL/EN (Priorytet: Niski)

**Cel**: Obsluga angielskiej wersji strony dla turystow i obcokrajowcow

#### Architektura

```
/app
  /[locale]           # Dynamic locale segment
    /page.tsx         # Homepage
    /grafik/page.tsx
    /lokalizacje/page.tsx
    ...
/messages
  /pl.json            # Polish translations
  /en.json            # English translations
/lib/i18n.ts          # next-intl configuration
```

#### Zadania

| ID | Zadanie | Czas |
|----|---------|------|
| I4.1 | Konfiguracja next-intl | 2h |
| I4.2 | Ekstrakcja tekstow do plikow JSON | 8h |
| I4.3 | Tlumaczenie na angielski | 4h (lub tlumacz) |
| I4.4 | Przelacznik jezykow w UI | 2h |
| I4.5 | Hreflang tagi SEO | 1h |

---

## Harmonogram Czasowy

```
TYDZIEN 1-2: Przygotowanie do Launchu
├── Integracja AIPAX (iframe'y)
├── Uzupelnienie tresci (zdjecia, opisy)
├── Konfiguracja produkcyjna
└── Testy manualne

TYDZIEN 3-4: Uruchomienie
├── Deploy produkcyjny
├── Integracja email (Resend)
├── Konfiguracja GA4 + Search Console
├── Monitoring i bugfixy
└── LAUNCH!

TYDZIEN 5-8: Rozwoj
├── Platnosci online (Stripe/PayU)
├── Blog/Aktualnosci
├── Galeria zdjec
└── Optymalizacja wydajnosci

MIESIAC 2-3: Skalowanie
├── Bezpieczenstwo (rate limiting, CSP)
├── Wielojezykowosc (opcjonalnie)
├── Integracje marketingowe
└── Analiza i iteracje
```

---

## Podzial Odpowiedzialnosci

| Rola | Zadania | Osoba |
|------|---------|-------|
| Developer | Implementacja, integracje, bugfixy | [Do przypisania] |
| Admin/Content | Zdjecia, opisy, produkty, Instagram | [Do przypisania] |
| Marketing | Teksty, SEO, social media, kampanie | [Do przypisania] |
| QA | Testowanie, raportowanie bledow | [Do przypisania] |
| AIPAX Liaison | Koordynacja z AIPAX, dostep do API | [Do przypisania] |

---

## Ryzyka i Mitygacja

| Ryzyko | Prawdopodobienstwo | Wplyw | Mitygacja |
|--------|---------------------|-------|-----------|
| Opoznienia AIPAX | Srednie | Wysoki | Placeholder strony z info "Wkrotce" |
| Brak zdjec | Wysokie | Sredni | Stock photos tymczasowo |
| Bledy integracji email | Niskie | Niski | Fallback do console.log + manual |
| Przekroczenie limitu Supabase | Niskie | Sredni | Monitoring uzycia, plan upgrade |
| Problemy z SEO po migracji | Srednie | Wysoki | 301 redirects, zachowanie URL |

---

## Metryki Sukcesu

### Tydzien 1-2 (Pre-launch)
- [ ] 100% stron renderuje bez bledow
- [ ] AIPAX iframe'y dzialaja na mobile
- [ ] Min. 5 trenerow z pelnym profilem
- [ ] Min. 10 produktow w sklepie

### Tydzien 3-4 (Launch)
- [ ] Strona dostepna pod domena airsquad.pl
- [ ] Lighthouse Performance > 80
- [ ] GA4 zbiera dane
- [ ] Pierwsze zamowienie w sklepie

### Miesiac 1-3 (Growth)
- [ ] Min. 1000 unikalnych uzytkownikow/miesiac
- [ ] Min. 10 zamowien w sklepie/miesiac
- [ ] Min. 50 zapisow przez AIPAX/miesiac
- [ ] Bounce rate < 50%
- [ ] Sredni czas na stronie > 2 min

---

## Podsumowanie

Projekt Air Squad jest w zaawansowanym stanie realizacji (~70% ukonczone). Kluczowe pozostale prace to:

1. **Krytyczne**: Integracja AIPAX (iframe'y), uzupelnienie tresci, konfiguracja produkcyjna
2. **Wazne**: Email, analityka, testowanie
3. **Rozwojowe**: Platnosci online, blog, galeria

Szacowany czas do pelnego launchu: **2-4 tygodnie** (zalezne od dostarczenia tresci i koordynacji z AIPAX).

---

*Dokument utworzony: Kwiecien 2026*
*Ostatnia aktualizacja: [Data]*
*Wersja: 1.0*
