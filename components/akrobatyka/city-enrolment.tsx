'use client'

import { useEffect, useState } from 'react'
import { MapPin, ArrowRight } from 'lucide-react'

export interface EnrolmentCity {
  slug: string
  name: string
  /** ID formularza AIPAX dla tej lokalizacji (kalendarz filtrowany do jej grup) */
  aipaxFormId?: string | null
}

const AIPAX_BASE = 'https://aipax.eu/pl/external/enrolment-form-v2'
const STORAGE_KEY = 'airsquad:selected-city'

function calendarUrl(formId: string) {
  return `${AIPAX_BASE}/${formId}?mode=calendar&embedMode=inline`
}

// Wybór miasta + osadzony kalendarz zapisów AIPAX. Iframe montujemy dopiero po
// wyborze miasta (lazy) i tylko gdy miasto ma przypisany aipax_form_id. Wybór
// zapamiętujemy w localStorage, więc wraca przy kolejnej wizycie i na innych
// stronach dyscyplin.
export function CityEnrolment({ cities }: { cities: EnrolmentCity[] }) {
  const [selected, setSelected] = useState<string | null>(null)

  // Przywróć ostatni wybór, o ile to miasto nadal jest na liście.
  useEffect(() => {
    const saved =
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (saved && cities.some((c) => c.slug === saved)) {
      setSelected(saved)
    }
  }, [cities])

  function choose(slug: string) {
    const next = slug === selected ? null : slug
    setSelected(next)
    if (typeof window !== 'undefined') {
      if (next) localStorage.setItem(STORAGE_KEY, next)
      else localStorage.removeItem(STORAGE_KEY)
    }
  }

  if (cities.length === 0) return null

  const active = cities.find((c) => c.slug === selected) || null

  return (
    <section className="space-y-6">
      <div>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-amber">
          Gdzie trenujemy · zapisy online
        </p>
        <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
          Wybierz <span className="gradient-text">swoje miasto</span>.
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Kliknij miasto — poniżej rozwiną się terminy w tej lokalizacji.
          Wybierasz grupę i zapisujesz się od razu, bez wychodzenia ze strony.
        </p>
      </div>

      {/* Chipy miast */}
      <div className="flex flex-wrap gap-3">
        {cities.map((city, i) => {
          const isActive = city.slug === selected
          return (
            <button
              key={city.slug}
              type="button"
              onClick={() => choose(city.slug)}
              aria-expanded={isActive}
              className={[
                'flex items-center gap-2 rounded-full border px-5 py-3 font-mono text-xs uppercase tracking-[0.1em] transition-all',
                isActive
                  ? 'border-primary bg-primary text-white shadow-[0_8px_26px_oklch(0.58_0.24_290/0.45)]'
                  : 'border-border bg-card text-foreground hover:border-primary/50',
              ].join(' ')}
            >
              <span className={isActive ? 'text-white' : 'text-cyan'}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {city.name}
            </button>
          )
        })}
      </div>

      {/* Rozwinięty panel wybranego miasta */}
      {active && (
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-5">
            <div>
              <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cyan">
                <MapPin className="h-3.5 w-3.5" />
                Terminy i zapisy · {active.name}
              </p>
              <h3 className="mt-1 text-xl font-bold text-foreground">
                Wybierz grupę i zapisz się
              </h3>
            </div>
            <a
              href={`/${active.slug}/`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-foreground hover:border-primary/50"
            >
              Pełna strona miasta
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {active.aipaxFormId ? (
            <iframe
              key={active.slug}
              src={calendarUrl(active.aipaxFormId)}
              title={`Zapisy AIPAX — ${active.name}`}
              loading="lazy"
              className="block h-[680px] w-full border-0 bg-white"
              data-hj-allow-iframe="true"
            />
          ) : (
            <div className="px-6 py-12 text-center text-muted-foreground">
              <p>
                Zapisy online dla tej lokalizacji uruchamiamy wkrótce.
                Napisz lub zadzwoń — pomożemy dobrać grupę.
              </p>
              <a
                href="/kontakt/"
                className="mt-4 inline-block rounded-full bg-primary px-6 py-3 font-mono text-xs uppercase tracking-[0.12em] text-white hover:bg-primary/90"
              >
                Skontaktuj się
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
