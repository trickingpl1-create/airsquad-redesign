import { FALLBACK_CITY_PAGES } from './cities'

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
  .filter(([, page]) => page.aipax_form_id)
  .map(([slug, page]) => ({
    slug,
    name: page.city_name ?? page.h1_title,
    formId: page.aipax_form_id!,
    ...(page.aipax_form_id_continuation
      ? { formIdContinuation: page.aipax_form_id_continuation }
      : {}),
  }))
