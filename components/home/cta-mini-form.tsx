'use client'

import { useState } from 'react'
import { AipaxModal } from '@/components/aipax-modal'
import type { EnrolCity } from '@/lib/content/enrol-cities'

// Poziom mapuje się na typ formularza AIPAX: nabór (nowe osoby) albo
// kontynuacja (już trenujący; miasto bez osobnego formularza → nabór).
const LEVELS = [
  { value: 'nabor', label: 'Zaczyna przygodę — pierwszy raz' },
  { value: 'kontynuacja', label: 'Trenuje już w Air Squad' },
] as const

const FIELD_CLASS =
  'w-full appearance-none rounded-2xl border border-border bg-background px-5 py-4 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan'

// Mini-formularz sekcji CTA: miasto + poziom → "Prześlij" otwiera właściwy
// formularz zgłoszeniowy AIPAX w modalu.
export function CtaMiniForm({ cities }: { cities: EnrolCity[] }) {
  const [citySlug, setCitySlug] = useState('')
  const [level, setLevel] = useState<(typeof LEVELS)[number]['value']>('nabor')
  const [error, setError] = useState(false)
  const [openForm, setOpenForm] = useState<{ formId: string; title: string } | null>(null)

  const submit = () => {
    const city = cities.find((c) => c.slug === citySlug)
    if (!city) {
      setError(true)
      return
    }
    const formId =
      level === 'kontynuacja' ? (city.formIdContinuation ?? city.formId) : city.formId
    const suffix = level === 'kontynuacja' ? 'kontynuacja' : 'nabór'
    setOpenForm({ formId, title: `Zapisy — ${city.name} (${suffix})` })
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-7 md:p-9">
      <div className="mb-4">
        <label
          htmlFor="cta-city"
          className="mb-2 block font-mono text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Miasto
        </label>
        <select
          id="cta-city"
          value={citySlug}
          onChange={(e) => {
            setCitySlug(e.target.value)
            setError(false)
          }}
          className={`${FIELD_CLASS} ${citySlug === '' ? 'text-muted-foreground/70' : ''} ${
            error ? 'border-destructive' : ''
          }`}
        >
          <option value="" disabled>
            Wybierz miasto…
          </option>
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-2 text-xs text-destructive">Wybierz miasto, żeby przejść dalej.</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="cta-level"
          className="mb-2 block font-mono text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Poziom
        </label>
        <select
          id="cta-level"
          value={level}
          onChange={(e) => setLevel(e.target.value as (typeof LEVELS)[number]['value'])}
          className={FIELD_CLASS}
        >
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={submit}
        className="mt-3 block w-full rounded-2xl px-6 py-5 text-center text-sm font-bold tracking-tight text-primary-foreground shadow-[0_12px_32px_oklch(0.58_0.24_290/0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
        style={{
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
        }}
      >
        Prześlij
      </button>
      <p className="mb-0 mt-3 text-center text-xs text-muted-foreground/70">
        Otworzy się kalendarz zapisów AIPAX wybranego miasta.
      </p>

      {openForm && (
        <AipaxModal
          formId={openForm.formId}
          title={openForm.title}
          onClose={() => setOpenForm(null)}
        />
      )}
    </div>
  )
}
