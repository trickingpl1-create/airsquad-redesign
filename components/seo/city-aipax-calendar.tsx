'use client'

import { useState } from 'react'

// Fasada kalendarza AIPAX dla podstrony miasta — iframe montuje się dopiero
// po kliknięciu (wzorzec z components/akrobatyka/city-enrolment.tsx), żeby
// zewnętrzny embed nie obciążał LCP chronionych landingów SEO.
const AIPAX_BASE = 'https://aipax.eu/pl/external/enrolment-form-v2'

export function CityAipaxCalendar({
  formId,
  cityName,
}: {
  formId: string | null | undefined
  cityName: string
}) {
  const [open, setOpen] = useState(false)

  if (!formId) {
    return (
      <div className="px-6 py-10 text-center text-muted-foreground">
        <p>
          Zapisy online dla tej lokalizacji uruchamiamy wkrótce. Zadzwoń:{' '}
          <a href="tel:+48728559101" className="text-cyan hover:underline">
            728 559 101
          </a>
        </p>
      </div>
    )
  }

  if (!open) {
    return (
      <div className="px-6 py-10 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-emerald px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.12em] text-emerald-950 transition-transform hover:-translate-y-0.5"
        >
          Pokaż terminy i zapisz się <span aria-hidden>→</span>
        </button>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          Kalendarz AIPAX załaduje się po kliknięciu
        </p>
      </div>
    )
  }

  return (
    <iframe
      src={`${AIPAX_BASE}/${formId}?mode=calendar&embedMode=inline`}
      title={`Zapisy AIPAX — ${cityName}`}
      loading="lazy"
      className="block h-[680px] w-full border-0 bg-white"
      data-hj-allow-iframe="true"
    />
  )
}
