'use client'

import { useEffect, useRef } from 'react'

// Kalendarz AIPAX dla podstrony miasta — oficjalny widget (skrypt) montuje
// się od razu przy wejściu na sekcję zapisów.
const AIPAX_SRC = 'https://aipax.pro/scripts/aipax-enrolment-widget.v1.js?v=20260505'

function AipaxCalendarWidget({ formId, cityName }: { formId: string; cityName: string }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const script = document.createElement('script')
    script.src = AIPAX_SRC
    script.async = true
    script.setAttribute('data-aipax-form-id', formId)
    script.setAttribute('data-aipax-locale', 'pl')
    host.appendChild(script)

    return () => {
      host.innerHTML = ''
    }
  }, [formId])

  return (
    <div
      ref={hostRef}
      role="region"
      aria-label={`Zapisy AIPAX — ${cityName}`}
      className="min-h-[680px] w-full"
    />
  )
}

export function CityAipaxCalendar({
  formId,
  cityName,
}: {
  formId: string | null | undefined
  cityName: string
}) {
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

  return <AipaxCalendarWidget key={formId} formId={formId} cityName={cityName} />
}
