'use client'

import { useState } from 'react'

// Galeria obozu Air Camp — pierwsze 4 zdjęcia zawsze widoczne (masonry),
// reszta montuje się dopiero po kliknięciu "Pokaż więcej zdjęć" (część
// zdjęć jest hostowana bezpośrednio na airsquad.pl — zero obciążenia LCP).
export function ExpandableGallery({
  featured,
  extra,
  cityLabel,
}: {
  featured: string[]
  extra: string[]
  cityLabel: string
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:[grid-template-rows:1fr_1fr]">
        {featured[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={featured[0]}
            alt={`${cityLabel} — galeria`}
            loading="lazy"
            className="min-h-[220px] rounded-3xl object-cover sm:row-span-2 sm:h-full"
          />
        )}
        {featured.slice(1, 3).map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={`${cityLabel} — galeria`}
            loading="lazy"
            className="min-h-[160px] rounded-3xl object-cover sm:h-full"
          />
        ))}
        {featured[3] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={featured[3]}
            alt={`${cityLabel} — galeria`}
            loading="lazy"
            className="min-h-[160px] rounded-3xl object-cover sm:col-span-2 sm:h-full"
          />
        )}
      </div>

      {expanded && extra.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {extra.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={`${cityLabel} — galeria`}
              loading="lazy"
              className="min-h-[180px] rounded-3xl object-cover"
            />
          ))}
        </div>
      )}

      {extra.length > 0 && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-full border border-cyan/45 bg-white/5 px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white/10"
          >
            {expanded ? 'Zwiń galerię' : 'Pokaż więcej zdjęć'}
          </button>
        </div>
      )}
    </>
  )
}
