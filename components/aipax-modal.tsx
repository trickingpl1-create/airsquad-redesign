'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

export const AIPAX_ENROLMENT_BASE = 'https://aipax.pro/pl/external/enrolment-form-v2'

// Pełnoekranowy modal z formularzem zapisów AIPAX (lazy — iframe montuje się
// dopiero z modalem). Używany przez pływający przycisk (enrol-fab) i kafelki
// "Jak to działa" na stronie głównej.
export function AipaxModal({
  formId,
  title,
  onClose,
}: {
  formId: string
  title: string
  onClose: () => void
}) {
  // ESC zamyka; scroll strony zablokowany na czas otwarcia
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-3 md:p-8"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-violet-soft">
            {title}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij formularz"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <iframe
          src={`${AIPAX_ENROLMENT_BASE}/${formId}?mode=calendar`}
          title={`Formularz zapisów AIPAX — ${title}`}
          className="w-full flex-1 border-0 bg-white"
        />
      </div>
    </div>
  )
}
