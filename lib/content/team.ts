/**
 * Kadra klubu — jedno źródło prawdy dla sekcji „Zespół" na stronie głównej
 * i dla /trenerzy/.
 *
 * Dlaczego osobny plik, a nie wyprowadzanie z miast (jak było w hubs.ts):
 * lista trenerów w `cities.ts` opisuje, KTO UCZY W DANYM MIEŚCIE, i z założenia
 * nie zawiera osób bez przypisania do sali (np. koordynatorki logistyki).
 * Nie ma tam też zdjęć ani pełnych ról. Skład i role pochodzą z materiałów
 * klubu (docs/_archive/CONTENT_MIGRATION_STRATEGY.md), zdjęcia z banku mediów.
 *
 * `featured` wskazuje osoby prezentowane z dużym zdjęciem. Pozostali
 * renderują się jako plakietki z samym imieniem i nazwiskiem — decyzja
 * użytkownika, żeby sekcja nie wracała do „za dużo osób małą czcionką",
 * co było zarzutem wobec starej strony.
 */
/**
 * Liczba trenerów w klubie. To NIE jest `TEAM.length` — lista niżej zawiera
 * wyłącznie osoby z gotowym profilem (zdjęcie + rola), a kadra klubu jest
 * szersza. Potwierdzone przez klub 2026-10-13: 20 trenerów.
 *
 * Trzymamy to jako osobną stałą, a nie wpisujemy w JSX: dokładnie tak
 * powstała poprzednia rozbieżność — na stronie głównej widniało „15",
 * a /trenerzy/ liczyło „9 osób" z listy. Obie strony czytają teraz stąd.
 * Gdy dojdą profile pozostałych trenerów, ta liczba i `TEAM.length` się zrównają.
 */
export const LICZBA_TRENEROW = 20

export type TeamMember = {
  name: string
  role: string
  photo: string | null
  featured: boolean
}

export const TEAM: TeamMember[] = [
  {
    name: 'Gabriel Myśliwiec',
    role: 'Prezes, główny trener AirSpace · akrobatyka, tricking',
    photo: '/images/trenerzy/gabriel-mysliwiec.webp',
    featured: true,
  },
  {
    name: 'Łukasz Pacocha',
    role: 'Wiceprezes, trener · mgr wychowania fizycznego, instruktor judo',
    photo: '/images/trenerzy/lukasz-pacocha.webp',
    featured: true,
  },
  {
    name: 'Paulina Bester-Myśliwiec',
    role: 'Trenerka koordynująca zajęcia dla dzieci',
    photo: '/images/trenerzy/paulina-bester-mysliwiec.webp',
    featured: true,
  },
  {
    name: 'Wiktoria Goleń',
    role: 'Koordynatorka logistyki',
    photo: '/images/trenerzy/wiktoria-golen.webp',
    featured: true,
  },

  // Poniżej — plakietki. `photo` zostaje, bo /trenerzy/ może z nich skorzystać,
  // a sekcja na stronie głównej i tak ich nie renderuje.
  {
    name: 'Patryk Dębski',
    role: 'Trener · licencjat fizjoterapii',
    photo: null,
    featured: false,
  },
  {
    name: 'Gabriela Cichoń',
    role: 'Trenerka · magister fizjoterapii',
    photo: '/images/trenerzy/gabriela-cichon.webp',
    featured: false,
  },
  {
    name: 'Agnieszka Sobczyk',
    role: 'Trenerka · samoobrona, judo, trening personalny',
    photo: null,
    featured: false,
  },
  {
    name: 'Maja Bieniek',
    role: 'Trenerka dla dzieci',
    photo: '/images/trenerzy/maja-bieniek.webp',
    featured: false,
  },
  {
    name: 'Karol Rączy',
    role: 'Trener zaawansowany',
    photo: '/images/trenerzy/karol-raczy.webp',
    featured: false,
  },
]

export const TEAM_FEATURED = TEAM.filter((m) => m.featured)
export const TEAM_REST = TEAM.filter((m) => !m.featured)
