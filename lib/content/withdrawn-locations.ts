import data from './withdrawn-locations.json'

// Lokalizacje wycofane ze strony.
//
// Dane leżą w sąsiednim .json, a nie tutaj, bo czyta je także skrypt
// wdrożeniowy (scripts/emit-redirects.mjs), który generuje reguły .htaccess.
// Zwykły node nie zaimportuje .ts, a duplikowanie listy w dwóch miejscach
// kończy się tym, że strona znika, a przekierowanie nie powstaje.
//
// STOSUNEK DO KONTRAKTU URL-i (docs/03-mapa-url.md)
// Wpis tutaj wycofuje lokalizację z całego interfejsu ORAZ usuwa jej stronę
// z builda. Dla adresu chronionego wolno to zrobić WYŁĄCZNIE razem z 301 —
// i tylko taki wpis ten plik dopuszcza, bo `redirectTo` jest wymagane.
// Sens reguły z 03-mapa-url.md to „żadnych 404 i cichych zmian slugów", a nie
// „strona musi istnieć wiecznie": 301 przenosi moc adresu zamiast ją wyrzucić,
// więc kontrakt zostaje dotrzymany co do skutku.
//
// Każde takie wycofanie MUSI być odnotowane w docs/03-mapa-url.md przy danym
// adresie — inaczej za rok wygląda to jak przypadkowe skasowanie strony.
//
// Alternatywa, gdy lokalizacja ma wrócić: zostaw stronę i zakomunikuj przerwę
// jej treścią. Ten mechanizm jest dla wycofań bez planu powrotu.
//
// Przywrócenie lokalizacji = usunięcie wpisu z withdrawn-locations.json.
// Treść strony zostaje nietknięta w lib/content/cities.ts — odcinamy ją
// filtrem w getCityPages(), a nie kasowaniem danych.

export interface WithdrawnLocation {
  /** Slug strony, np. „tyczyn" — bez ukośników. */
  slug: string
  /** Dokąd prowadzi 301. Ze ukośnikiem na końcu, zgodnie z trailingSlash. */
  redirectTo: string
  /** Po co to tu jest — żeby za rok nie trzeba było zgadywać. */
  reason: string
}

export const WITHDRAWN_LOCATIONS: readonly WithdrawnLocation[] = data

export const WITHDRAWN_LOCATION_SLUGS: readonly string[] = WITHDRAWN_LOCATIONS.map(
  (location) => location.slug
)

export function isWithdrawnLocation(slug: string): boolean {
  return WITHDRAWN_LOCATION_SLUGS.includes(slug)
}
