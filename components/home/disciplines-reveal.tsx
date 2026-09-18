import Link from 'next/link'

export type Discipline = {
  num: string
  slug: string
  name: string
  age: string
  desc: string
  gradient: string
  photo: string
  href?: string
  photoPosition?: string
  photoSize?: string
}

// Skos cięcia między kadrami (px) — tylko na desktopie. Pierwszy kadr ma prostą
// lewą krawędź, ostatni prostą prawą; środkowe zachodzą na poprzedni o SKEW,
// tworząc jeden ukośny szew. Na mobilce slice'y układają się w pion (bez skosu).
const SKEW = 34
const CLIP_RIGHT = `polygon(0 0, 100% 0, calc(100% - ${SKEW}px) 100%, 0 100%)`
const CLIP_LEFT = `polygon(${SKEW}px 0, 100% 0, 100% 100%, 0 100%)`

/**
 * Pas dyscyplin — skośna mozaika ze zdjęć. Nazwa widoczna zawsze, opis pojawia
 * się po najechaniu (na desktopie kadr się rozsuwa i odsłania tekst). Opis jest
 * w DOM cały czas (opacity, nie display:none) — crawler i czytniki go widzą,
 * więc treść i linki wewnętrzne do stron dyscyplin działają bez zmian.
 * Na mobilce (brak hoveru) slice'y są w pionie z opisem zawsze widocznym.
 */
export function DisciplinesReveal({ disciplines }: { disciplines: readonly Discipline[] }) {
  const last = disciplines.length - 1
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-black md:h-[19rem] md:flex-row">
      {disciplines.map((d, i) => (
        <Link
          key={d.num}
          href={d.href ?? `/dyscypliny/${d.slug}/`}
          className={`group/slice relative flex min-h-40 w-full flex-col justify-end overflow-hidden p-5 text-white focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cyan md:min-h-0 md:w-auto md:grow md:basis-0 md:p-6 md:transition-[flex-grow,filter] md:duration-500 md:ease-out md:hover:z-10 md:hover:grow-[2.8] md:focus-visible:grow-[2.8] md:[filter:saturate(0.9)_brightness(0.74)] md:hover:[filter:none] md:focus-visible:[filter:none] md:[clip-path:var(--clip)] motion-reduce:md:transition-none ${
            i === 0 ? '' : 'md:-ml-[34px]'
          }`}
          style={{
            // clip-path aktywujemy tylko na desktopie (md:[clip-path:var(--clip)]);
            // na mobilce slice'y są prostokątne i ułożone w pionie.
            ['--clip' as string]: i === last ? CLIP_LEFT : CLIP_RIGHT,
          }}
        >
          <span
            aria-hidden
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: `url('${d.photo}')`,
              backgroundPosition: d.photoPosition ?? 'center',
              backgroundSize: d.photoSize ?? 'cover',
            }}
          />
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(8,4,20,0.94), rgba(8,4,20,0.45) 52%, rgba(8,4,20,0.18) 100%), linear-gradient(120deg, color-mix(in oklab, var(--primary) 40%, transparent), transparent 58%)',
            }}
          />
          <span
            aria-hidden
            className="halftone-overlay absolute inset-0 text-black opacity-[0.06]"
          />
          <span className="relative">
            <span className="block font-mono text-[10px] tracking-[0.16em] text-cyan [text-shadow:0_1px_5px_rgba(0,0,0,0.9)]">
              {d.num} · {d.age}
            </span>
            <span
              className="display-bold mt-1 block text-2xl leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] md:text-[1.7rem]"
              style={{ fontWeight: 400 }}
            >
              {d.name}
            </span>
            <span className="mt-2 block max-w-[22rem] text-[13px] leading-relaxed text-white/95 [text-shadow:0_1px_6px_rgba(0,0,0,0.85)] transition-opacity duration-300 md:opacity-0 md:group-hover/slice:opacity-100 md:group-focus-visible/slice:opacity-100 motion-reduce:transition-none">
              {d.desc}
            </span>
          </span>
        </Link>
      ))}
    </div>
  )
}
