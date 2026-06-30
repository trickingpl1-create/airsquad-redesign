# Zarządzanie obrazkami dyscyplin

## Gdzie edytować?

Wszystkie obrazki dyscyplin znajdziesz w pliku:
```
components/home/disciplines-section.tsx
```

## Jak zmienić obrazek?

### Krok 1: Otwórz plik
Otwórz `components/home/disciplines-section.tsx` w edytorze kodu.

### Krok 2: Znajdź dyscyplinę
Poszukaj dyscypliny którą chcesz edytować (np. "Akrobatyka"):

```typescript
{
  num: '01',
  slug: 'akrobatyka',
  name: 'Akrobatyka',
  age: 'OD 4 LAT',
  desc: 'Salta z miejsca, rondaty, flik-flaki. Ścieżka rozwoju od podstaw.',
  gradient: 'linear-gradient(135deg, var(--primary), var(--blue-deep))',
  photo: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&q=80', // 👈 Edytuj tutaj
},
```

### Krok 3: Zastąp URL
Zmień wartość pola `photo` na nowy URL:

```typescript
photo: 'TUTAJ_WKLEJ_NOWY_URL'
```

### Krok 4: Zapisz
Zapisz plik (Ctrl+S) — strona się zaaktualizuje automatycznie!

## Skąd wziąć obrazki?

### Unsplash (darmowe, wysokiej jakości)
1. Wejdź na https://unsplash.com
2. Wyszukaj termin (np. "acrobatics", "skateboarding")
3. Kliknij "Download" → kopiuj URL obrazka
4. Wklej do pola `photo`

**Przykład:** `https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&q=80`

### Własne zdjęcia (Vercel Blob)
1. Wrzuć plik do `/public/images/dyscypliny/`
2. Użyj ścieżki: `/images/dyscypliny/moja-akrobatyka.jpg`

### Inne źródła
- Pexels: https://www.pexels.com
- Pixabay: https://pixabay.com
- Własny hosting

## Wymiary

Minimalny rozmiar: **600 × 400px**

Optimalne: **1200 × 800px** (będzie skalowany responsywnie)

## Formaty

Wspierane formaty: **JPG**, **PNG**, **WebP**

## Szybkie linki

| Dyscyplina | Pole do edycji | Obecny URL |
|---|---|---|
| Akrobatyka | `DISCIPLINES[0].photo` | `https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&q=80` |
| Tricking | `DISCIPLINES[1].photo` | `https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80` |
| Longboard | `DISCIPLINES[2].photo` | `https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=600&q=80` |
| Tumbling | `DISCIPLINES[3].photo` | `https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=600&q=80` |
| Showdance | `DISCIPLINES[4].photo` | `https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600&q=80` |
| Snowboard | `DISCIPLINES[5].photo` | `https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80` |

## Admin panel

Dostęp do panelu zarządzania:
- **URL:** `/admin/dyscypliny`
- **Ikona:** Sparkles (✨)
- **Menu:** Dashboard → Dyscypliny

## Szybkie porady

✅ **Używaj linków z query params:**
```
https://images.unsplash.com/photo-XXX?w=600&q=80
```

✅ **Testuj na mobile:**
Po zmianie odśwież stronę i sprawdź na telefonie.

❌ **Unikaj:**
- Zbyt dużych plików (>2MB)
- Zbyt małych rozdzielczości (<600px)
- Bitych linków (zwracających 404)

## Jeśli coś pójdzie nie tak

1. **Przywróć poprzedni URL** — powróć do backup'u
2. **Sprawdź konsolę** — zobacz czy URL zwraca błąd
3. **Odśwież cache** — Ctrl+Shift+R (hard refresh)
4. **Sprawdź wymiary** — czy obrazek ma 600×400px minimum
