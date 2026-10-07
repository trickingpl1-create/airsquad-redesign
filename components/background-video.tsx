'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { hasMarketingConsent, onConsentChange } from '@/lib/consent'

// IFrame Player API ładujemy raz na całą stronę (idempotentnie) — kolejne
// instancje <BackgroundVideo> współdzielą ten sam skrypt i globalny callback.
let apiReady: Promise<void> | null = null
function loadYouTubeIframeAPI(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  const w = window as unknown as {
    YT?: { Player?: unknown }
    onYouTubeIframeAPIReady?: () => void
  }
  if (w.YT?.Player) return Promise.resolve()
  if (apiReady) return apiReady
  apiReady = new Promise<void>((resolve) => {
    // Nie nadpisujemy cudzego handlera — łańcuchujemy (gdyby ktoś inny też
    // ładował API na stronie).
    const prev = w.onYouTubeIframeAPIReady
    w.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })
  return apiReady
}

type YTPlayer = {
  playVideo: () => void
  mute: () => void
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void
  getCurrentTime: () => number
}

/**
 * Film w tle z YouTube BEZ „znaczków" playera:
 *  • brak przycisku ▶ na środku — API wymusza wyciszone autoodtwarzanie,
 *  • brak ekranu końcowego z propozycjami „next" — przy zakończeniu (albo przy
 *    dobiciu do `end`) przewijamy do początku, zanim YouTube zdąży je pokazać,
 *  • brak paska i logo YT — `controls=0`,
 *  • brak pauzy/hoverów — wywołujący daje `pointer-events-none`.
 *
 * Renderuje SAM <iframe> (z `enablejsapi=1`), a API dowiązuje się do już
 * istniejącego elementu — dzięki temu kadrowanie/pozycję/opacity ustawia
 * wywołujący przez `className`/`style`, tak jak przy zwykłym <iframe>. Gdy JS
 * nie wystartuje, film i tak gra i zapętla się przez parametry URL
 * (autoplay/mute/loop) — degradacja bez „stop na play".
 *
 * ZGODA: skrypt https://www.youtube.com/iframe_api ładowany w głównej ramce
 * zapisuje ciasteczka YouTube (YSC, VISITOR_INFO1_LIVE…), które Cookiebot
 * klasyfikuje jako marketingowe — dlatego ładujemy go WYŁĄCZNIE po zgodzie
 * marketingowej (audyt 2026-10-06, R2.1). Bez zgody gra sam iframe
 * youtube-nocookie z parametrami URL: pętla całego filmu zamiast precyzyjnego
 * wycinka start–end, ale bez ciasteczek śledzących.
 *
 * KIEDY SIĘ ŁADUJE (audyt 2026-10-06, F17): iframe nie trafia już do HTML-a.
 *  • activation="idle" (domyślnie, hero) — po zdarzeniu load i chwili
 *    bezczynności przeglądarki, więc YouTube nie konkuruje z LCP i hydratacją;
 *  • activation="visible" (sekcje niżej) — gdy kontener zbliża się do widoku,
 *    a po wyjściu z niego iframe jest odmontowywany (mniej dekodowania wideo).
 * Wcześniej trzy filmy na stronie głównej startowały naraz: ok. 43–58 MB
 * transferu na wizytę mobilną i ok. 0,7 s blokady wątku głównego.
 * Przy prefers-reduced-motion albo trybie oszczędzania danych film w ogóle się
 * nie uruchamia — zostaje tło sekcji (WCAG 2.2.2, F52).
 */
export function BackgroundVideo({
  youtubeId,
  start,
  end,
  className,
  style,
  title = '',
  activation = 'idle',
}: {
  youtubeId: string
  /** Sekunda startu pętli (opcjonalny wycinek). */
  start?: number
  /** Sekunda końca pętli — przewijamy do `start`, NIE używamy parametru end=
      w URL, bo ten zatrzymuje film na przycisku play. */
  end?: number
  className?: string
  style?: CSSProperties
  title?: string
  /** Kiedy montować film: po bezczynności po load (hero) albo przy widoczności. */
  activation?: 'idle' | 'visible'
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  // Element w DOM (placeholder albo iframe) — obserwowany przy activation="visible".
  const [box, setBox] = useState<HTMLElement | null>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
    if (reducedMotion || saveData) return

    if (activation === 'visible') {
      if (!box || !('IntersectionObserver' in window)) return
      const observer = new IntersectionObserver(
        (entries) => setActive(entries.some((entry) => entry.isIntersecting)),
        { rootMargin: '200px 0px' }
      )
      observer.observe(box)
      return () => observer.disconnect()
    }

    // activation === 'idle'
    let idleId = 0
    let timer = 0
    const schedule = () => {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
        cancelIdleCallback?: (id: number) => void
      }
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setActive(true), { timeout: 2500 })
      else timer = window.setTimeout(() => setActive(true), 1200)
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    return () => {
      window.removeEventListener('load', schedule)
      const w = window as Window & { cancelIdleCallback?: (id: number) => void }
      if (idleId && w.cancelIdleCallback) w.cancelIdleCallback(idleId)
      if (timer) window.clearTimeout(timer)
    }
  }, [activation, box])
  // Startowo false także po stronie serwera — stan zgody znamy dopiero w przeglądarce.
  const [marketingConsent, setMarketingConsent] = useState(false)

  useEffect(() => {
    const sync = () => setMarketingConsent(hasMarketingConsent())
    sync()
    return onConsentChange(sync)
  }, [])

  useEffect(() => {
    if (!marketingConsent || !active) return
    let player: YTPlayer | null = null
    let pollTimer = 0
    let cancelled = false
    const startAt = start ?? 0

    // Pętla wycinka bez „mignięcia" ekranu końcowego: zamiast parametru end=
    // (który pauzuje film) sami pilnujemy czasu i zawracamy do startu.
    const tick = () => {
      if (cancelled || !player) return
      try {
        if (end != null && player.getCurrentTime() >= end - 0.25) {
          player.seekTo(startAt, true)
        }
      } catch {
        /* player jeszcze nie gotowy — spróbujemy w kolejnym ticku */
      }
      pollTimer = window.setTimeout(tick, 250)
    }

    loadYouTubeIframeAPI().then(() => {
      if (cancelled || !iframeRef.current) return
      const YT = (window as unknown as { YT?: { Player: new (...a: unknown[]) => YTPlayer } }).YT
      if (!YT?.Player) return
      player = new YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            try {
              player?.mute()
              if (startAt) player?.seekTo(startAt, true)
              player?.playVideo()
            } catch {
              /* niektóre przeglądarki dopuszczą play dopiero po interakcji */
            }
            if (end != null) pollTimer = window.setTimeout(tick, 250)
          },
          onStateChange: (e: { data: number }) => {
            // 0 = ENDED → natychmiastowe zapętlenie, żeby nie pokazał się
            // ekran z propozycjami filmów („next").
            if (e.data === 0) {
              try {
                player?.seekTo(startAt, true)
                player?.playVideo()
              } catch {
                /* noop */
              }
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
      if (pollTimer) window.clearTimeout(pollTimer)
      // Świadomie NIE wołamy player.destroy(): API usunęłoby <iframe>, którym
      // zarządza React → „removeChild" crash. Osierocony player i tak zniknie
      // z GC przy odmontowaniu iframe'a (pełna nawigacja).
    }
  }, [youtubeId, start, end, marketingConsent, active])

  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: youtubeId, // loop=1 działa tylko z playlist=<to samo id>
    controls: '0',
    showinfo: '0',
    rel: '0',
    iv_load_policy: '3',
    modestbranding: '1',
    disablekb: '1',
    fs: '0',
    playsinline: '1',
    enablejsapi: '1', // dowiązanie IFrame Player API do tego iframe'a
  })
  if (start != null) params.set('start', String(start))

  if (!active) {
    // Pusty element o tych samych wymiarach — miejsce w układzie i cel dla
    // IntersectionObservera, dopóki film nie ma się uruchomić.
    return <div ref={setBox} aria-hidden className={className} style={style} />
  }

  return (
    <iframe
      ref={(node) => {
        iframeRef.current = node
        setBox(node)
      }}
      src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`}
      allow="autoplay; encrypted-media"
      title={title}
      tabIndex={-1}
      aria-hidden
      className={className}
      style={style}
    />
  )
}
