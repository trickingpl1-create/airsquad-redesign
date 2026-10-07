'use client'

import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'

/**
 * Fasada filmu YouTube: do kliknięcia pokazuje tylko miniaturę (zwykły obrazek,
 * leniwie ładowany, bez ciasteczek) i przycisk odtwarzania. Właściwy player —
 * z domeny youtube-nocookie.com — montuje się dopiero po kliknięciu.
 *
 * Wcześniej /letni/ osadzał od razu iframe z www.youtube.com: ok. 1 MB skryptów
 * przy wejściu na stronę i ciasteczka YouTube przed zgodą (audyt 2026-10-06, F47).
 */
export function YouTubeFacade({
  youtubeId,
  title,
  className = '',
}: {
  youtubeId: string
  title: string
  className?: string
}) {
  const [playing, setPlaying] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)

  // Przycisk znika po kliknięciu — fokus przenosimy na player, żeby osoba
  // korzystająca z klawiatury nie wylądowała na początku strony.
  useEffect(() => {
    if (playing) frameRef.current?.focus()
  }, [playing])

  if (playing) {
    return (
      <iframe
        ref={frameRef}
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className={`block h-full w-full border-0 ${className}`}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Odtwórz film: ${title}`}
      className={`group relative block h-full w-full cursor-pointer overflow-hidden bg-black focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cyan ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- eksport statyczny, images.unoptimized */}
      <img
        src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
        alt=""
        width={480}
        height={360}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-transform group-hover:scale-110"
      >
        <Play className="ml-1 h-7 w-7" fill="currentColor" />
      </span>
    </button>
  )
}
