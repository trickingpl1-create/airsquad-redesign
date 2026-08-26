'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { AipaxModal } from '@/components/aipax-modal'
import { EnrolPicker } from '@/components/enrol-picker'
import type { EnrolCity } from '@/lib/content/enrol-cities'

// Pływający przycisk zapisów, montowany w root layout — widoczny na każdej
// stronie. Klik → panel wyboru miasta/wydarzenia; miasto otwiera modal
// z kalendarzem AIPAX (lazy iframe — nic nie ładuje się przed klikiem).
export function EnrolFab({ cities }: { cities: EnrolCity[] }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<EnrolCity | null>(null)
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

  // ESC zamyka panel; modal ma własną obsługę ESC i blokady scrolla (AipaxModal)
  useEffect(() => {
    if (!open || selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, selected])

  return (
    <>
      {open && (
        <div
          aria-hidden
          className="fixed inset-0 z-[55] bg-black/25"
          onClick={closeAll}
        />
      )}

      {/*
        data-enrol-fab: uchwyt dla reguły w globals.css, która chowa przycisk przy
        otwartym menu mobilnym (flagę `data-mobile-nav-open` ustawia
        components/layout/header.tsx). Bez tego FAB siada na CTA w drawerze.
      */}
      <div
        data-enrol-fab
        className={`fixed bottom-4 right-4 z-[60] transition-transform duration-300 md:bottom-6 md:right-6 ${
          hidden && !open ? 'translate-y-24' : 'translate-y-0'
        }`}
      >
        {open && !selected && (
          <div className="absolute bottom-full right-0 mb-3 w-[19rem] rounded-3xl border border-border bg-card p-5 shadow-2xl">
            <EnrolPicker cities={cities} onCity={setSelected} onNavigate={closeAll} />
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
        <AipaxModal
          formId={selected.formId}
          title={`Zapisy — ${selected.name}`}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
