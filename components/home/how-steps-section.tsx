'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { SectionHeader } from './section-header'
import { AipaxModal } from '@/components/aipax-modal'
import { EnrolPicker } from '@/components/enrol-picker'
import type { EnrolCity } from '@/lib/content/enrol-cities'

const steps = [
  {
    n: '1',
    title: 'Krótkie zapisy',
    desc: 'Wybierasz miasto, dyscyplinę i poziom dziecka. Formularz zajmuje minutę — odpisujemy w 24 godziny.',
  },
  {
    n: '2',
    title: 'Zajęcia próbne',
    desc: 'Pierwszy trening kosztuje 40 zł. Wspólnie dobieramy grupę, w której dziecko poczuje się pewnie.',
  },
  {
    n: '3',
    title: 'Regularne treningi',
    desc: 'Sezon trwa od września do czerwca, a latem mamy obozy. Małe grupy, dwóch trenerów, profesjonalny sprzęt.',
  },
] as const

// Kompaktowa wersja "Jak to działa?" tuż pod kafelkami miast — kafelek otwiera
// krok pośredni (wybór miasta/wydarzenia, wspólny EnrolPicker), a wybrane
// miasto swój formularz zgłoszeniowy AIPAX w modalu.
export function HowStepsSection({ cities }: { cities: EnrolCity[] }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [selected, setSelected] = useState<EnrolCity | null>(null)

  // ESC zamyka picker; modal AIPAX ma własną obsługę (AipaxModal)
  useEffect(() => {
    if (!pickerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPickerOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [pickerOpen])

  return (
    <section
      id="jak-zaczac"
      className="relative overflow-hidden px-6 py-10 md:px-10 md:py-14"
    >
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          kicker="Jak zacząć"
          kickerColorClass="text-amber"
          title="Jak to"
          gradientPart="działa?"
          titleFontWeight={400}
          gradientFontWeight={400}
          className="mb-8 md:mb-10"
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {steps.map((s) => (
            <button
              key={s.n}
              type="button"
              onClick={() => setPickerOpen(true)}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-violet-soft/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className="step-badge grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg shadow-[0_6px_16px_oklch(0.58_0.24_290/0.3)]"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  }}
                >
                  <span className="stat-number text-foreground" style={{ fontSize: '18px', fontWeight: 400 }}>
                    {s.n}
                  </span>
                </div>
                <h3 className="display-bold m-0 text-base text-foreground md:text-lg" style={{ fontWeight: 400 }}>
                  {s.title}
                </h3>
              </div>
              <p className="mb-0 mt-2.5 text-xs leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
              <span className="mt-2.5 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-violet-soft opacity-70 transition-opacity group-hover:opacity-100">
                Formularz zgłoszeniowy →
              </span>
            </button>
          ))}
        </div>
      </div>

      {pickerOpen && !selected && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center bg-black/45 p-4"
          onClick={() => setPickerOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Zapisy — wybierz miasto lub wydarzenie"
            className="relative w-[19rem] rounded-3xl border border-border bg-card p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              aria-label="Zamknij wybór"
              className="absolute right-3.5 top-3.5 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <EnrolPicker
              cities={cities}
              onCity={(c) => {
                setSelected(c)
                setPickerOpen(false)
              }}
              onNavigate={() => setPickerOpen(false)}
            />
          </div>
        </div>
      )}

      {selected && (
        <AipaxModal
          formId={selected.formId}
          title={`Zapisy — ${selected.name}`}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  )
}
