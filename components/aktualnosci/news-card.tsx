'use client'

import Link from 'next/link'
import { useState } from 'react'

export interface NewsItem {
  kicker: string
  /** Klasa koloru akcentu, np. `text-cyan` — te same akcenty co reszta serwisu. */
  accentClass: string
  title: string
  /** Krótki opis widoczny zawsze. */
  short: string
  photo: string
  /** Pełna treść odsłaniana po „Więcej". */
  full?: string
  /** Dane techniczne (numer konta, telefon) — mono, `\n` łamie linie. */
  meta?: string
  cta?: string
  href?: string
}

/** featured = główny news: na desktopie poziomy (foto z lewej, treść z prawej),
 *  większy tytuł. Na mobile i tak wraca do pionu jak zwykły kafel. */
type NewsCardProps = NewsItem & { featured?: boolean }

// Wariant A z makiety (akceptacja użytkownika 2026-09-22): kafel z foto + krótkim
// opisem, a szczegóły rozwijają się W MIEJSCU po kliknięciu „Więcej". Animacja
// przez grid-template-rows 0fr→1fr — płynna wysokość bez sztywnego max-height.
export function NewsCard({
  kicker,
  accentClass,
  title,
  short,
  photo,
  full,
  meta,
  cta,
  href,
  featured = false,
}: NewsCardProps) {
  const [open, setOpen] = useState(false)
  const hasDetails = Boolean(full || meta || (cta && href))

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-3xl border border-border bg-card ${featured ? 'md:flex-row' : ''}`}
    >
      <div
        aria-hidden
        className={`relative bg-cover bg-center ${featured ? 'h-52 md:h-auto md:min-h-[320px] md:w-[46%]' : 'h-48'}`}
        style={{ backgroundImage: `url('${photo}')` }}
      >
        {/* Na mobile foto jest u góry → gradient od dołu (to-t). Główny na
            desktopie ma foto z lewej, treść z prawej → gradient znika po stronie
            napisów (to-l: from-card przy prawej krawędzi, foto czyste po lewej). */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-card to-transparent ${featured ? 'md:bg-gradient-to-l' : ''}`}
        />
      </div>
      <div className={`flex flex-1 flex-col p-6 ${featured ? 'md:justify-center md:p-8' : ''}`}>
        <p className={`font-mono text-[11px] font-bold uppercase tracking-[0.16em] ${accentClass}`}>
          {kicker}
        </p>
        <h3
          className={`display-bold mt-2 text-2xl text-foreground ${featured ? 'md:text-3xl' : ''}`}
          style={{ fontWeight: 500 }}
        >
          {title}
        </h3>
        <p className={`mt-2 leading-relaxed text-muted-foreground ${featured ? 'text-sm md:max-w-xl md:text-base' : 'text-sm'}`}>
          {short}
        </p>

        {hasDetails && (
          <>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-foreground transition-colors hover:border-cyan hover:text-cyan"
            >
              {open ? 'Mniej' : 'Więcej'}
              <span aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <div className="mt-4 border-t border-border pt-4">
                  {full && (
                    <p className="text-[13.5px] leading-relaxed text-muted-foreground">{full}</p>
                  )}
                  {meta && (
                    <p className="mt-3 whitespace-pre-line font-mono text-[12px] leading-relaxed text-foreground">
                      {meta}
                    </p>
                  )}
                  {cta && href && (
                    <Link
                      href={href}
                      className="mt-4 inline-block rounded-full px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}
                    >
                      {cta} <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </article>
  )
}
