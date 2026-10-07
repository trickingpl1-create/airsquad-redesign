'use client'

import type { AnchorHTMLAttributes } from 'react'
import { trackEnrolOpen, type EnrolTracking } from '@/lib/analytics'

// Link do formularza AIPAX (nowa karta), który przy kliknięciu wysyła
// enrol_open do GTM. Strony miast są komponentami serwerowymi, więc obsługa
// kliknięcia musi żyć tutaj (audyt 2026-10-06, F14).
export function TrackedEnrolLink({
  tracking,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { tracking?: EnrolTracking }) {
  return (
    <a
      {...props}
      onClick={(event) => {
        if (tracking) trackEnrolOpen(tracking)
        onClick?.(event)
      }}
    />
  )
}
