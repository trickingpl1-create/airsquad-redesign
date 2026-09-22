'use client'

import { useEffect, useRef, useState } from 'react'

// Wyciąga ID filmu z linku YouTube (watch?v=, youtu.be/, embed/, shorts/).
// shorts/ dodane, bo rolki z telefonu kopiuje się właśnie w tym formacie.
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  )
  return match ? match[1] : null
}

// „Nasze zajawki" — MP4 z klubowego WordPressa LUB film z YouTube. Odtwarza się
// automatycznie DOPIERO po wejściu w widok (IntersectionObserver), wyciszony i
// w pętli — jak tło-teaser. Do tego momentu montuje się tylko poster, więc
// ciężki player nie dotyka pierwszego ładowania strony (efekt lazy zachowany).
export function CityVideo({
  url,
  poster,
  label,
}: {
  url: string
  poster?: string
  label?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const youtubeId = getYouTubeId(url)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Gdy przeglądarka nie zna IntersectionObserver — od razu montujemy player.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          io.disconnect() // start jednorazowy — nie restartujemy przy każdym scrollu
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative block h-full min-h-72 w-full overflow-hidden rounded-3xl border border-border"
    >
      {inView ? (
        youtubeId ? (
          <iframe
            // mute=1 → autoplay przechodzi przez politykę przeglądarek;
            // loop=1 wymaga playlist=<to samo id>, inaczej YouTube nie zapętla.
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=1&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
            title={label ?? 'Film'}
            allow="autoplay; encrypted-media; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <video
            src={url}
            poster={poster}
            muted
            loop
            autoPlay
            playsInline
            controls
            className="absolute inset-0 h-full w-full object-cover"
          />
        )
      ) : (
        <>
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
          ) : (
            <span className="absolute inset-0 bg-gradient-to-br from-cyan/15 to-background" />
          )}
          <span className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/50" />
          {label && (
            <span className="absolute bottom-4 left-5 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/70">
              ▶ {label}
            </span>
          )}
        </>
      )}
    </div>
  )
}
