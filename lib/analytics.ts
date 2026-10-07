import { hasStatisticsConsent } from '@/lib/consent'

// Zdarzenia dla Google Tag Managera (GTM-W44NNPZ). Kontener ładuje się dopiero
// po zgodzie na statystykę (app/layout.tsx) i tylko wtedy coś wysyłamy — bez
// zgody nic nie trafia nawet do lokalnej kolejki dataLayer.
//
// enrol_open = otwarcie formularza zapisów AIPAX po stronie airsquad.pl.
// Samo wysłanie zapisu dzieje się w ramce AIPAX (inna domena) i strona go nie
// widzi. Konfiguracja wyzwalaczy i tagów w GTM: docs/08a-pakiet-gabriela.md, A3
// (audyt 2026-10-06, F14). Nazwy pól muszą zgadzać się ze zmiennymi
// warstwy danych w GTM: enrol_city, enrol_type, enrol_source.
export type EnrolType = 'nabor' | 'kontynuacja' | 'ogolny' | 'oboz'

export type EnrolTracking = {
  /** slug miasta (rzeszow, debica…), 'general' albo 'letni' */
  city: string
  type: EnrolType
  /** miejsce na stronie: fab, how_steps, cta_form, discipline_page, city_group */
  source: string
}

export function trackEnrolOpen({ city, type, source }: EnrolTracking): void {
  if (!hasStatisticsConsent()) return
  const w = window as Window & { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event: 'enrol_open', enrol_city: city, enrol_type: type, enrol_source: source })
}
