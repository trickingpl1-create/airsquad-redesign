import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Zdjęcia grupowe kadry na /trenerzy/ (tło hero, components/team/team-photo-backdrop.tsx).
 *
 * Pliki wrzuca się ręcznie do public/images/kadra/ pod DOKŁADNIE tymi nazwami
 * (to jedyna dokumentacja katalogu — README leżałby w public/ i trafiłby do
 * out/, czyli na publiczny serwer):
 *
 *   kadra-air-meeting-2025.jpg     jasnoniebieskie koszulki „Air Meeting", hala, baner AIR SQUAD
 *   kadra-air-camp-piramida.jpg    pomarańczowe koszulki, las, piramida akrobatyczna
 *   kadra-air-camp-2025.jpg        jasnoniebieskie koszulki „Air Camp", las i piasek
 *   kadra-podsumowanie-sezonu.jpg  czarne koszulki, dyplomy, hala AirSpace
 *
 * Zasady:
 * - `chmod 644` na plikach — inaczej Apache na hostingu zwraca 403 (lftp
 *   zachowuje uprawnienia; zdarzyło się to już wcześniej).
 * - Po wgraniu oryginału uruchom `node scripts/make-image-variants.mjs` — robi
 *   warianty <nazwa>-w900.jpg (telefony) i <nazwa>-w1600.jpg (desktop). Strona
 *   ma `images.unoptimized: true` (wymuszone przez `output: 'export'`), więc
 *   srcset trzeba dostarczyć samemu; kod odwołuje się WYŁĄCZNIE do wariantów,
 *   oryginał jest tylko źródłem dla skryptu.
 *
 * Lista jest filtrowana przez existsSync w czasie BUILDA (komponenty serwerowe
 * wykonują się w Node podczas generowania HTML-a, więc to legalne i nic nie
 * kosztuje w przeglądarce). Brak oryginału nie zostawia na stronie dziury —
 * pozycja po prostu się nie renderuje, a pojawia się sama po wgraniu pliku
 * i przebudowaniu. Natomiast oryginał BEZ wariantów zatrzymuje build z jasnym
 * komunikatem: lepiej to niż wypuścić <img> z popsutym srcset.
 *
 * UWAGA przy pracy w dev: wynik existsSync zapada przy pierwszym załadowaniu
 * modułu przez dev server (moduł wykonuje się raz, na starcie). Wgranie nowego
 * zdjęcia albo dorobienie wariantów NIE pokaże się na localhost:2003 do czasu
 * restartu serwera (samo odświeżenie strony ani `touch` nie wystarczą — treść
 * tego pliku .ts się nie zmienia, więc Turbopack nie unieważnia modułu).
 * `npm run build` zawsze liczy to od nowa, więc na produkcji i stagingu
 * problem nie występuje.
 */
export type TeamPhoto = {
  /** Wariant 900 px — `src` i pierwsza pozycja srcset (telefony). */
  src900: string
  /** Wariant 1600 px — druga pozycja srcset (desktop, ekrany 2x). */
  src1600: string
  /** Widoczny podpis pod kadrem; przy zmianie zdjęcia zmienia się razem z nim. */
  caption: string
}

/**
 * Celowo bez pola `alt`: zdjęcia są dekoracyjnym tłem pod nagłówkiem
 * (kontener ma `aria-hidden`, a co przedstawia kadr, mówi widoczny `caption`),
 * więc <img alt=""> jest poprawne i osobne opisy byłyby martwymi danymi.
 * Opis zawartości plików jest w komentarzu wyżej — dla człowieka, nie dla DOM.
 */
const KANDYDACI: { file: string; caption: string }[] = [
  { file: 'kadra-air-meeting-2025.jpg', caption: 'Air Meeting 2025 — kadra w komplecie' },
  { file: 'kadra-air-camp-piramida.jpg', caption: 'Air Camp — piramida kadry' },
  { file: 'kadra-air-camp-2025.jpg', caption: 'Air Camp — kadra i wychowawcy' },
  { file: 'kadra-podsumowanie-sezonu.jpg', caption: 'Podsumowanie sezonu w AirSpace' },
]

const KATALOG = join(process.cwd(), 'public', 'images', 'kadra')
const URL_BAZA = '/images/kadra'

export const TEAM_PHOTOS: TeamPhoto[] = KANDYDACI.flatMap(({ file, caption }) => {
  const baza = file.replace(/\.jpe?g$/i, '')
  const w900 = `${baza}-w900.jpg`
  const w1600 = `${baza}-w1600.jpg`
  const jest = (nazwa: string) => existsSync(join(KATALOG, nazwa))

  if (jest(w900) && jest(w1600)) {
    return [{ src900: `${URL_BAZA}/${w900}`, src1600: `${URL_BAZA}/${w1600}`, caption }]
  }
  if (jest(file)) {
    throw new Error(
      `Zdjęcie public/images/kadra/${file} nie ma wariantów ${w900} / ${w1600} — ` +
        'uruchom `node scripts/make-image-variants.mjs` i zbuduj ponownie.',
    )
  }
  // Brak oryginału = zdjęcia jeszcze nie wgrano; pozycja po prostu się nie renderuje.
  return []
})
