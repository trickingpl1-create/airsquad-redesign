'use client'

import { useEffect, useRef, useState } from 'react'

// Kalendarz AIPAX dla podstrony miasta — oficjalny widget (skrypt) montuje
// się od razu przy wejściu na sekcję zapisów.
const AIPAX_SRC = 'https://aipax.pro/scripts/aipax-enrolment-widget.v1.js?v=20260505'

// Ten sam próg co tailwindowe `md` — dzięki temu CSS placeholdera i JS wybierający
// widok przełączają się dokładnie w tym samym punkcie. Jednostka MUSI być w `rem`
// (Tailwind v4 emituje `md:` jako `@media (width >= 48rem)`), bo `rem` w media query
// liczy się od domyślnej czcionki przeglądarki: przy ustawieniu 20px `48rem` = 960px,
// więc twarde `768px` po stronie JS rozjechałoby się z CSS-em o prawie 200px.
const DESKTOP_MEDIA_QUERY = '(min-width: 48rem)'

// Startowa wysokość, jaką skrypt AIPAX wpisuje iframe'owi launchera inline
// (`height:320px`), zanim ten zmierzy się i przyśle AIPAX_ENROLMENT_LAUNCHER_RESIZE
// (~214px). Rezerwujemy właśnie 320px, a nie docelowe ~214px, bo `min-height` jest
// podłogą, a nie sufitem: przy 220px boks urósłby do 320px, a po komunikacie wrócił
// do 220px — dwa przeciwstawne skoki layoutu zamiast żadnego.
const LAUNCHER_MIN_HEIGHT = 'min-h-[320px]'

// Widok, o który realnie prosimy skrypt AIPAX:
// - 'calendar' → data-aipax-view="calendar"; skrypt ustawia iframe'owi NA SZTYWNO
//   980px i nigdy tego nie koryguje (nasłuchuje wyłącznie komunikatu
//   AIPAX_ENROLMENT_LAUNCHER_RESIZE, którego widok kalendarza nie wysyła).
//   Na desktopie siatka tygodnia realnie wypełnia te 980px, ale na 375px AIPAX
//   przełącza się na listę (~350px) i zostaje ~600px martwej pustki.
// - 'launcher' → zwarta karta „Zapisz się”, która sama raportuje swoją wysokość
//   (zmierzone 214px) i otwiera pełny formularz w modalu AIPAX. Zero pustki.
type AipaxWidgetView = 'calendar' | 'launcher'

function AipaxCalendarWidget({
  formId,
  cityName,
  view,
}: {
  formId: string
  cityName: string
  view: AipaxWidgetView
}) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const script = document.createElement('script')
    script.src = AIPAX_SRC
    script.async = true
    script.setAttribute('data-aipax-form-id', formId)
    script.setAttribute('data-aipax-locale', 'pl')
    // Skrypt AIPAX mapuje KAŻDĄ wartość różną od 'calendar' (w tym brak atrybutu)
    // na mode=launcher, więc dla launchera po prostu nie ustawiamy atrybutu — to
    // dokładnie ten sam DOM, który leciał dotąd dla wariantu 'form'.
    if (view === 'calendar') script.setAttribute('data-aipax-view', 'calendar')
    host.appendChild(script)

    return () => {
      host.innerHTML = ''
    }
  }, [formId, view])

  return (
    <div
      ref={hostRef}
      role="region"
      aria-label={`Zapisy AIPAX — ${cityName}`}
      // min-height rezerwuje miejsce na czas ładowania iframe'a, więc musi być
      // dopasowany do wybranego widoku: dla launchera dawne 680px generowałoby
      // ~460px pustki, czyli dokładnie to, co usuwamy.
      className={view === 'calendar' ? 'min-h-[680px] w-full' : `${LAUNCHER_MIN_HEIGHT} w-full`}
    />
  )
}

function ResponsiveAipaxWidget({
  formId,
  cityName,
  view,
}: {
  formId: string
  cityName: string
  view: 'calendar' | 'form'
}) {
  // matchMedia nie istnieje w czasie builda (output: 'export' — HTML powstaje w Node),
  // więc startujemy z null: pierwszy render kliencki jest wtedy identyczny z tym
  // zapieczonym w HTML-u (zero rozjazdu hydratacji), a realny widok ustalamy dopiero
  // w useEffect.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_MEDIA_QUERY)
    const sync = (event: MediaQueryList | MediaQueryListEvent) => setIsDesktop(event.matches)

    sync(query)
    // Obrót telefonu / zmiana rozmiaru okna musi przełączyć widok, bo skrypt AIPAX
    // nie umie zmienić trybu w locie — zmiana stanu zmienia `key` niżej i widget
    // montuje się od zera.
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  if (isDesktop === null) {
    // Placeholder do czasu poznania szerokości okna. Wysokość rezerwujemy czystym
    // CSS-em na tym samym progu 48rem co DESKTOP_MEDIA_QUERY: na mobile nigdy nie ma
    // tu 680px pustki, a na desktopie miejsce na kalendarz jest gotowe zanim wjedzie
    // iframe. Wartość mobilna musi być identyczna z hostem launchera, inaczej podmiana
    // placeholdera na widget sama w sobie przesuwa treść pod spodem.
    return (
      <div
        aria-hidden="true"
        className={
          view === 'calendar'
            ? `${LAUNCHER_MIN_HEIGHT} w-full md:min-h-[680px]`
            : `${LAUNCHER_MIN_HEIGHT} w-full`
        }
      />
    )
  }

  // Na mobile zawsze launcher. Wariant 'form' (jedyne miasto: Jasło — lib/content/cities.ts)
  // idzie w launcher również na
  // desktopie i NIE jest to zmiana zachowania: skrypt AIPAX i tak mapuje 'form' na
  // mode=launcher, więc ten wariant od początku renderował kartę z przyciskiem,
  // a pełny formularz otwiera się z niej w modalu.
  const widgetView: AipaxWidgetView = isDesktop && view === 'calendar' ? 'calendar' : 'launcher'

  return (
    <AipaxCalendarWidget
      // Klucz zawiera wybrany widok, żeby przekroczenie progu 48rem odmontowało
      // stary widget i zamontowało nowy ze świeżym skryptem.
      key={`${formId}:${widgetView}`}
      formId={formId}
      cityName={cityName}
      view={widgetView}
    />
  )
}

export function CityAipaxCalendar({
  formId,
  cityName,
  view = 'calendar',
}: {
  formId: string | null | undefined
  cityName: string
  /** Widok widgetu: tygodniowy kalendarz (domyślnie) albo pełny formularz zgłoszeniowy */
  view?: 'calendar' | 'form'
}) {
  if (!formId) {
    return (
      <div className="px-6 py-10 text-center text-muted-foreground">
        <p>
          Zapisy online dla tej lokalizacji uruchamiamy wkrótce. Zadzwoń:{' '}
          <a href="tel:+48728559101" className="text-cyan hover:underline">
            728 559 101
          </a>
        </p>
      </div>
    )
  }

  return <ResponsiveAipaxWidget formId={formId} cityName={cityName} view={view} />
}
