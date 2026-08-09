'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'

export interface EnrolFabCity {
  slug: string
  name: string
  formId: string
}

const AIPAX_ENROLMENT_BASE = 'https://aipax.pro/pl/external/enrolment-form-v2'

// Kafelki wydarzeń prowadzą na podstrony (brak osobnych formularzy AIPAX
// dla wydarzeń — decyzja użytkownika 2026-08-09, wariant "a").
const EVENTS = [
  { label: 'Air Camp 2026', note: 'obóz letni', href: '/letni/', accent: 'var(--emerald)' },
  { label: 'Air Meeting 2026', note: 'zawody', href: '/airmeeting/', accent: 'var(--cyan)' },
] as const

// Pływający przycisk zapisów, montowany w root layout — widoczny na każdej
// stronie poza /admin. Klik → panel wyboru miasta/wydarzenia; miasto otwiera
// modal z kalendarzem AIPAX (lazy iframe — nic nie ładuje się przed klikiem).
export function EnrolFab({ cities }: { cities: EnrolFabCity[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<EnrolFabCity | null>(null)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  // Na mobile przycisk chowa się przy scrollu w dół, wraca przy scrollu w górę
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const isMobile = window.matchMedia('(max-width: 767px)').matches
      if (isMobile && y > 300) {
        setHidden(y > lastScrollY.current)
      } else {
        setHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeAll = useCallback(() => {
    setSelected(null)
    setOpen(false)
  }, [])

  // ESC zamyka najpierw modal, potem panel; modal blokuje scroll strony
  useEffect(() => {
    if (!open && !selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selected) setSelected(null)
        else setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    if (selected) document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, selected])

  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      {open && (
        <div
          aria-hidden
          className="fixed inset-0 z-[55] bg-black/25"
          onClick={closeAll}
        />
      )}

      <div
        className={`fixed bottom-4 right-4 z-[60] transition-transform duration-300 md:bottom-6 md:right-6 ${
          hidden && !open ? 'translate-y-24' : 'translate-y-0'
        }`}
      >
        {open && !selected && (
          <div className="absolute bottom-full right-0 mb-3 w-[19rem] rounded-3xl border border-border bg-card p-5 shadow-2xl">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-violet-soft">
              Zapisy — wybierz miasto
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {cities.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setSelected(c)}
                  className="rounded-full border border-violet-soft/30 bg-violet-soft/10 px-3.5 py-1.5 font-mono text-xs text-violet-soft transition-colors hover:bg-violet-soft/20"
                >
                  {c.name}
                </button>
              ))}
            </div>
            <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-emerald">
              lub wydarzenie
            </p>
            <div className="mt-2 space-y-2">
              {EVENTS.map((ev) => (
                <Link
                  key={ev.href}
                  href={ev.href}
                  onClick={closeAll}
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
          </div>
        )}

        <button
          type="button"
          onClick={() => (open ? closeAll() : setOpen(true))}
          aria-expanded={open}
          className="flex items-center gap-2.5 rounded-full px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg md:px-6"
          style={{
            background: open
              ? 'oklch(0.35 0.05 290)'
              : 'linear-gradient(135deg, var(--primary), var(--accent))',
            boxShadow: '0 8px 24px oklch(0.48 0.26 290 / 0.35)',
          }}
        >
          {open ? (
            <>
              <X className="h-4 w-4" aria-hidden />
              Zamknij
            </>
          ) : (
            <>
              <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-emerald" />
              Zapisz się
            </>
          )}
        </button>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-3 md:p-8"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Zapisy — ${selected.name}`}
            className="flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-violet-soft">
                Zapisy — {selected.name}
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Zamknij formularz"
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <iframe
              src={`${AIPAX_ENROLMENT_BASE}/${selected.formId}?mode=calendar`}
              title={`Formularz zapisów AIPAX — ${selected.name}`}
              className="w-full flex-1 border-0 bg-white"
            />
          </div>
        </div>
      )}
    </>
  )
}
