'use client'

import { useState } from 'react'

// Wyciąga ID filmu z linku YouTube (youtube.com/watch?v=, youtu.be/, youtube.com/embed/).
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  )
  return match ? match[1] : null
}

// Fasada „Naszych Zajawek" — oryginalne klubowe MP4 (hostowane na starym
// WordPressie, linkowane bezpośrednio) LUB film z YouTube — montują się
// dopiero po kliknięciu, żeby ciężkie wideo nie dotykało ładowania strony.
export function CityVideo({
  url,
  poster,
  label,
}: {
  url: string
  poster?: string
  label?: string
}) {
  const [playing, setPlaying] = useState(false)
  const youtubeId = getYouTubeId(url)

  if (playing && youtubeId) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
        title={label ?? 'Film'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="block h-full min-h-72 w-full rounded-3xl border-0"
      />
    )
  }

  if (playing) {
    return (
      <video
        src={url}
        poster={poster}
        controls
        autoPlay
        playsInline
        className="block h-full min-h-72 w-full rounded-3xl object-cover"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Odtwórz film${label ? `: ${label}` : ''}`}
      className="group relative block h-full min-h-72 w-full overflow-hidden rounded-3xl border border-border text-left"
    >
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
      <span className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/10 to-background/70" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-[0_0_40px_rgba(103,232,249,0.45)] transition-transform group-hover:scale-105">
          <span
            aria-hidden
            className="ml-1 block h-0 w-0 border-y-[12px] border-l-[20px] border-y-transparent border-l-background"
          />
        </span>
      </span>
      {label && (
        <span className="absolute bottom-4 left-5 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/70">
          ▶ {label}
        </span>
      )}
    </button>
  )
}
