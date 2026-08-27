import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Zdjęcia grupowe kadry na /trenerzy/.
 *
 * Pliki wrzuca się ręcznie do public/images/kadra/. Lista jest filtrowana
 * przez existsSync w czasie BUILDA (output: 'export' — komponenty serwerowe
 * wykonują się w Node podczas generowania HTML-a, więc to legalne i nic nie
 * kosztuje w przeglądarce). Dzięki temu brak pliku nie zostawia na stronie
 * dziury z popsutym obrazkiem — pozycja po prostu się nie renderuje,
 * a pojawia się sama po wgraniu pliku i przebudowaniu.
 *
 * UWAGA przy pracy w dev: wynik existsSync zapada przy pierwszym załadowaniu
 * modułu przez dev server. Wgranie nowego zdjęcia NIE pokaże się na
 * localhost:2003 do czasu restartu serwera (samo odświeżenie strony ani
 * `touch` nie wystarczą — treść pliku się nie zmienia, więc Turbopack nie
 * unieważnia modułu). `npm run build` zawsze liczy to od nowa, więc na
 * produkcji i stagingu problem nie występuje.
 */
export type TeamPhoto = {
  file: string
  alt: string
  caption: string
}

const KANDYDACI: TeamPhoto[] = [
  {
    file: 'kadra-air-meeting-2025.jpg',
    alt: 'Kadra Air Squad w koszulkach Air Meeting 2025 na hali, przed banerem klubu',
    caption: 'Air Meeting 2025 — kadra w komplecie',
  },
  {
    file: 'kadra-air-camp-piramida.jpg',
    alt: 'Trenerzy Air Squad układają piramidę akrobatyczną na leśnej polanie podczas Air Camp',
    caption: 'Air Camp — piramida kadry',
  },
  {
    file: 'kadra-air-camp-2025.jpg',
    alt: 'Kadra i wychowawcy Air Camp 2025 na terenie ośrodka w Janowie Lubelskim',
    caption: 'Air Camp — kadra i wychowawcy',
  },
  {
    file: 'kadra-podsumowanie-sezonu.jpg',
    alt: 'Trenerzy Air Squad z dyplomami podczas podsumowania sezonu w hali AirSpace',
    caption: 'Podsumowanie sezonu w AirSpace',
  },
]

export const TEAM_PHOTOS: TeamPhoto[] = KANDYDACI.filter((p) =>
  existsSync(join(process.cwd(), 'public', 'images', 'kadra', p.file)),
).map((p) => ({ ...p, file: `/images/kadra/${p.file}` }))
