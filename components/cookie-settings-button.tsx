'use client'

import { openConsentSettings } from '@/lib/consent'

// Ponowne otwarcie banera Cookiebot — sposób na zmianę lub wycofanie zgody,
// na który powołuje się polityka prywatności. Przycisk zamiast wzorca
// <a href="javascript:Cookiebot.renew()"> z dokumentacji Cookiebot, bo React 19
// blokuje adresy javascript: w href.
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      Ustawienia cookies
    </button>
  )
}
