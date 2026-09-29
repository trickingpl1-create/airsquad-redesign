import { FALLBACK_CITY_PAGES } from './cities'
import { isWithdrawnLocation } from './withdrawn-locations'

export interface EnrolCity {
  slug: string
  name: string
  formId: string
  /** Formularz kontynuacji dla już trenujących — nie każde miasto go ma */
  formIdContinuation?: string
}

// Kompaktowa lista miast do UI zapisów (pływający przycisk, kroki "Jak to
// działa", mini-formularz CTA) — tylko nazwa + formularze AIPAX. Importować
// wyłącznie w komponentach serwerowych i przekazywać klientom przez props,
// żeby pełne rekordy miast (cities.ts) nie trafiały do bundla klienta.
export const ENROL_CITIES: EnrolCity[] = Object.entries(FALLBACK_CITY_PAGES)
  .filter(([slug]) => !isWithdrawnLocation(slug))
  .filter(([, page]) => page.aipax_form_id)
  .map(([slug, page]) => ({
    slug,
    name: page.city_name ?? page.h1_title,
    formId: page.aipax_form_id!,
    ...(page.aipax_form_id_continuation
      ? { formIdContinuation: page.aipax_form_id_continuation }
      : {}),
  }))

// --- Bogate karty do podstrony /zapisy (sala, adres, odbiorcy) ---------------

/** Odbiorca grupy jako pigułka na karcie miasta. „Dorośli" tylko tam, gdzie
 *  w groups_info realnie istnieje grupa dorosłych (nie z ogólnych opisów SEO). */
export type Audience = 'Dzieci' | 'Młodzież' | 'Dorośli'

export interface EnrolCityCard {
  slug: string
  name: string
  /** Nazwa sali/obiektu z cities.ts (hall.name) */
  hallName?: string
  /** Adres/lokalizacja (hall.address) — pokazywany tylko gdy różny od nazwy */
  hallAddress?: string
  /** Kogo przyjmuje ta lokalizacja — Dzieci·Młodzież (+Dorośli gdy jest grupa) */
  audience: Audience[]
  /** Tekst do wyszukiwarki: nazwa + sala + adres, znormalizowany po stronie UI */
  haystack: string
}

// „Dorośli" wyprowadzone z danych, nie hardkodowane: miasto ma dorosłych, gdy
// któraś grupa w groups_info ma w polu age/name/level słowo „doroś(li)".
// Uwaga: „doroś" z „ś" (U+015B) — ASCII „doros" nigdy nie trafi (stąd wzorzec).
function hasAdultGroup(groups: Record<string, unknown>[]): boolean {
  return groups.some((g) =>
    (['age', 'name', 'level'] as const).some((k) => {
      const v = g[k]
      return typeof v === 'string' && /doroś/i.test(v)
    }),
  )
}

export const ENROL_CITY_CARDS: EnrolCityCard[] = Object.entries(FALLBACK_CITY_PAGES)
  .filter(([slug]) => !isWithdrawnLocation(slug))
  .filter(([, page]) => page.aipax_form_id)
  .map(([slug, page]) => {
    const name = page.city_name ?? page.h1_title
    const hallName = page.hall?.name
    const hallAddress = page.hall?.address
    // Adres pokazujemy tylko, gdy wnosi coś ponad nazwę sali (np. Jasło ma
    // name === address, Brzostek address zawarty w name — wtedy jedna linia).
    const distinctAddress =
      hallAddress && hallAddress !== hallName && !hallName?.includes(hallAddress)
        ? hallAddress
        : undefined
    const audience: Audience[] = hasAdultGroup(page.groups_info ?? [])
      ? ['Dzieci', 'Młodzież', 'Dorośli']
      : ['Dzieci', 'Młodzież']
    return {
      slug,
      name,
      hallName,
      hallAddress: distinctAddress,
      audience,
      haystack: [name, hallName, hallAddress].filter(Boolean).join(' '),
    }
  })
