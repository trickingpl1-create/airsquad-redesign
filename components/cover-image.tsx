// Zdjęcie wypełniające rodzica — zamiennik dla `background-image` w stylu inline.
//
// PO CO TO ISTNIEJE
// Serwis wyświetlał zdjęcia jako tła CSS (18 miejsc). Tło CSS ma dwie wady,
// których nie da się obejść ustawieniami:
//   1. Nie ma leniwego ładowania. Strona główna startowała z 23 zdjęciami naraz
//      (3,4 MB), razem z sekcjami kilka ekranów niżej.
//   2. Przeglądarka odkrywa je późno — skaner wstępny czyta HTML i widzi tylko
//      `<img src>`; adres w atrybucie `style` wychodzi na jaw dopiero przy
//      budowaniu drzewa stylów. Dla zdjęcia w pierwszym ekranie to opóźnienie
//      wprost w LCP.
// `<img>` załatwia oba: `loading="lazy"` odkłada to, co pod zgięciem, a zdjęcia
// nad zgięciem (`priority`) zaczynają się pobierać natychmiast.
//
// RÓWNOWAŻNOŚĆ ZE STARYM ZAPISEM
//   background-size: cover    → object-cover (domyślnie)
//   background-size: contain  → fit="contain"
//   background-position: X    → position="X"
// Wygląd zostaje bez zmian; zmienia się tylko moment pobrania pliku.
//
// DOSTĘPNOŚĆ: to dekoracja, nie treść — stąd `alt=""` i `aria-hidden`.
// Czytniki ekranu pomijały tła CSS i mają je pomijać dalej.
//
// Zwykły <img>, nie next/image: `images.unoptimized: true` (wymuszone przez
// `output: 'export'`) sprawia, że next/image i tak nie generuje srcset —
// dokładałby tylko opakowanie bez korzyści.

type CoverImageProps = {
  src: string
  /** Odpowiednik background-position, np. 'center', 'top', '50% 30%'. */
  position?: string
  /** 'cover' (domyślnie) albo 'contain' — odpowiednik background-size. */
  fit?: 'cover' | 'contain'
  /** Zdjęcie w pierwszym ekranie: pobieraj od razu i z wysokim priorytetem.
   *  Dla wszystkiego poniżej zgięcia zostaw domyślne `false` (leniwe). */
  priority?: boolean
  /** Dokładane do klas — krycie, zaokrąglenia, skala przy najechaniu itp. */
  className?: string
}

export function CoverImage({
  src,
  position = 'center',
  fit = 'cover',
  priority = false,
  className = '',
}: CoverImageProps) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      loading={priority ? 'eager' : 'lazy'}
      // async nie blokuje wątku głównego dekodowaniem; przy priority zostawiamy
      // decyzję przeglądarce, żeby nie opóźnić malowania elementu LCP.
      decoding={priority ? 'auto' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={`absolute inset-0 h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
      style={{ objectPosition: position }}
    />
  )
}
