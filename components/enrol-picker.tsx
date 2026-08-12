'use client'

import Link from 'next/link'
import type { EnrolCity } from '@/lib/content/enrol-cities'

// Kafelki wydarzeń prowadzą na podstrony (brak osobnych formularzy AIPAX
// dla wydarzeń — decyzja użytkownika 2026-08-09, wariant "a").
const EVENTS = [
  { label: 'Air Camp 2026', note: 'obóz letni', href: '/letni/', accent: 'var(--emerald)' },
  { label: 'Air Meeting 2026', note: 'zawody', href: '/airmeeting/', accent: 'var(--cyan)' },
] as const

// Wspólna treść wyboru celu zapisów (miasto → formularz AIPAX, wydarzenie →
// podstrona). Używana w panelu pływającego przycisku i w kroku pośrednim
// kafelków "Jak to działa" na stronie głównej.
export function EnrolPicker({
  cities,
  onCity,
  onNavigate,
}: {
  cities: EnrolCity[]
  /** Wybrano miasto — rodzic otwiera modal AIPAX */
  onCity: (city: EnrolCity) => void
  /** Klik w link wydarzenia — rodzic zamyka swój panel/modal */
  onNavigate: () => void
}) {
  return (
    <>
      <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-violet-soft">
        Zapisy — wybierz miasto
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {cities.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => onCity(c)}
            className="rounded-full border border-violet-soft/30 bg-violet-soft/10 px-3.5 py-1.5 font-mono text-xs text-violet-soft transition-colors hover:bg-violet-soft/20"
          >
            {c.name}
          </button>
        ))}
      </div>
      <p className="mb-0 mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-emerald">
        lub wydarzenie
      </p>
      <div className="mt-2 space-y-2">
        {EVENTS.map((ev) => (
          <Link
            key={ev.href}
            href={ev.href}
            onClick={onNavigate}
            className="flex items-center justify-between rounded-xl border border-dashed px-3.5 py-2.5 transition-colors hover:bg-muted"
            style={{ borderColor: `color-mix(in oklch, ${ev.accent} 50%, transparent)` }}
          >
            <span className="text-sm font-medium text-foreground">{ev.label}</span>
            <span className="font-mono text-[11px]" style={{ color: ev.accent }}>
              {ev.note} →
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
