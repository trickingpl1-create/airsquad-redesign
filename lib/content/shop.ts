// Treści sklepu /sklep/ — JEDNO źródło prawdy dla komunikatu o płatności.
//
// Model biznesowy: nie ma płatności online i nie będzie w tej fazie. Klient
// składa wiążącą rezerwację, a kwotę przekazuje trenerowi osobiście przy
// odbiorze. Sposób płatności jest STAŁĄ modelu, nie danymi per zamówienie —
// dlatego tabela `orders` nie ma i nie dostanie kolumny na płatność.
//
// UWAGA — panel admina: admin-app/ jest samowystarczalny (deploy z CLI wysyła
// tylko ten katalog) i NIE MOŻE importować tego pliku. Jeśli panel ma pokazywać
// te same zdania, musi mieć własną KOPIĘ tych stałych z komentarzem wskazującym
// ten plik jako oryginał. Po zmianie treści tutaj — zaktualizuj kopię ręcznie.

/** Jedna linijka do koszyka i pod przyciskiem CTA. */
export const PAYMENT_NOTICE_SHORT =
  'Nie płacisz teraz. Całą kwotę przekazujesz trenerowi przy odbiorze.'

/** Pełny komunikat przy podsumowaniu kwoty w formularzu zamówienia. */
export const PAYMENT_NOTICE_LONG =
  'W tym sklepie nie ma płatności online. Klikając „Złóż zamówienie” rezerwujesz towar — nic nie płacisz przez internet i nie podajesz danych karty. Umówioną kwotę przekazujesz trenerowi gotówką lub BLIK-iem dopiero przy odbiorze, na treningu.'

/** Powtórzenie zasady na ekranie potwierdzenia — po złożeniu zamówienia. */
export const PAYMENT_NOTICE_CONFIRMATION =
  'Nic nie płacisz online. Kwotę przekazujesz trenerowi przy odbiorze zamówienia na treningu.'

/** Gdzie i jak odbieram — pokazywane w koszyku i w formularzu. */
export const PICKUP_INFO =
  'Odbiór osobisty u trenera na treningu — w polu „Uwagi” napisz, w której lokalizacji i w jakie dni trenujesz, żebyśmy wiedzieli, gdzie dowieźć zamówienie.'

/** Zdanie o wiążącym charakterze rezerwacji (koszyk, przed przejściem dalej). */
export const ORDER_IS_RESERVATION =
  'Zamówienie jest wiążącą rezerwacją — przygotowujemy towar specjalnie dla Ciebie.'

/** Co się dzieje po złożeniu zamówienia — 3 kroki na ekranie potwierdzenia. */
export const ORDER_NEXT_STEPS = [
  'Potwierdzamy zamówienie telefonicznie lub mailowo.',
  'Trener przywozi towar na Twój trening.',
  'Płacisz przy odbiorze i zabierasz swoje rzeczy.',
] as const

/** Numer klubu — awaryjny kontakt, gdy zamówienia nie działają. */
export const SHOP_PHONE = '728 559 101'
export const SHOP_PHONE_HREF = 'tel:+48728559101'

/** Komunikat, gdy backend zamówień jest niedostępny (brak konfiguracji Supabase). */
export const SHOP_UNAVAILABLE_NOTICE =
  'Składanie zamówień jest chwilowo niedostępne. Zadzwoń do nas — przyjmiemy zamówienie telefonicznie.'
