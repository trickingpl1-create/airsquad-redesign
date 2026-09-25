'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

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
 */
export function BackgroundVideo({
  youtubeId,
  start,
  end,
  className,
  style,
  title = '',
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
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
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
  }, [youtubeId, start, end])

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

  return (
    <iframe
      ref={iframeRef}
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
