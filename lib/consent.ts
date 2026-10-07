// Odczyt zgód Cookiebot po stronie klienta.
//
// Cookiebot działa w trybie data-blockingmode="manual" (app/layout.tsx), więc
// sam niczego nie blokuje — każdy skrypt, który zapisuje ciasteczka śledzące,
// musi sam sprawdzić zgodę. Ten moduł to jedno miejsce, w którym się to robi.

type CookiebotConsent = {
  necessary?: boolean
  preferences?: boolean
  statistics?: boolean
  marketing?: boolean
}

declare global {
  interface Window {
    Cookiebot?: {
      consent?: CookiebotConsent
      renew?: () => void
    }
  }
}

export function hasStatisticsConsent(): boolean {
  return typeof window !== 'undefined' && window.Cookiebot?.consent?.statistics === true
}

export function hasMarketingConsent(): boolean {
  return typeof window !== 'undefined' && window.Cookiebot?.consent?.marketing === true
}

// Zdarzenia Cookiebot: OnConsentReady przy starcie (zgoda już zapisana) i po
// każdej decyzji, OnAccept/OnDecline przy kliknięciu w banerze.
const CONSENT_EVENTS = ['CookiebotOnConsentReady', 'CookiebotOnAccept', 'CookiebotOnDecline'] as const

/** Wywołuje callback przy każdej zmianie zgody. Zwraca funkcję sprzątającą. */
export function onConsentChange(callback: () => void): () => void {
  CONSENT_EVENTS.forEach((name) => window.addEventListener(name, callback))
  return () => CONSENT_EVENTS.forEach((name) => window.removeEventListener(name, callback))
}

export function openConsentSettings(): void {
  // Gdy uc.js się nie załadował (adblock, sieć), window.Cookiebot potrafi być
  // elementem <script id="Cookiebot"> (elementy z id są widoczne jako window.<id>)
  // bez metody renew — wtedy zamiast błędu prowadzimy do polityki prywatności.
  const cookiebot = window.Cookiebot
  if (cookiebot && typeof cookiebot.renew === 'function') cookiebot.renew()
  else window.location.assign('/polityka-prywatnosci/')
}
