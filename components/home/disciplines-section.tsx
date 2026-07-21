import Link from 'next/link'
import { SectionHeader } from './section-header'

type Discipline = {
  num: string
  slug: string
  name: string
  age: string
  desc: string
  gradient: string
  photo: string
  /** Opcjonalny zoom/kadr zdjęcia w tle (np. gdy domyślny bg-cover ucina istotny fragment) */
  photoPosition?: string
  photoSize?: string
}

/**
 * DISCIPLINES DATA — Edytowalne URL'e obrazów
 * 
 * Aby zmienić obrazek dla dyscypliny, zaktualizuj pole `photo` poniżej.
 * Możesz użyć:
 * - URL z Unsplash: https://images.unsplash.com/...
 * - URL z własnego hostingu
 * - Ścieżka do pliku lokalnego: /images/dyscypliny/akrobatyka.jpg
 * 
 * Wymiary: min. 600x400px, format: JPG/PNG
 */
const DISCIPLINES: Discipline[] = [
  {
    num: '01',
    slug: 'akrobatyka',
    name: 'Akrobatyka',
    age: 'OD 7 LAT',
    desc: 'Salta z miejsca, rondaty, flik-flaki. Ścieżka rozwoju od podstaw.',
    gradient: 'linear-gradient(135deg, var(--primary), var(--blue-deep))',
    photo: '/images/dyscypliny/akrobatyka.jpg', // Edytuj tutaj
  },
  {
    num: '02',
    slug: 'tricking',
    name: 'Tricking',
    age: 'OD 7 LAT',
    desc: 'Salta, kicki, twisty — ekspresja i estetyka. Najszybciej rosnąca strefa.',
    gradient: 'linear-gradient(135deg, var(--pink), var(--primary))',
    photo: '/images/dyscypliny/tricking.jpg', // Edytuj tutaj
  },
  {
    num: '03',
    slug: 'tumbling',
    name: 'Tumbling',
    age: 'OD 7 LAT',
    desc: 'Ścieżka akrobatyczna, AirTrack — do śrub i łączeń.',
    gradient: 'linear-gradient(135deg, var(--violet-soft), var(--accent))',
    photo: '/images/old-site/tumbling.jpg', // Edytuj tutaj
  },
  {
    num: '04',
    slug: 'showdance',
    name: 'Showdance',
    age: 'OD 7 LAT',
    desc: 'Choreografie, technika, lekcje indywidualne.',
    gradient: 'linear-gradient(135deg, var(--amber), var(--pink))',
    photo: '/images/dyscypliny/showdance.jpg', // Edytuj tutaj
  },
  {
    num: '05',
    slug: 'longboard',
    name: 'Longboard',
    age: 'OD 7 LAT',
    desc: 'Carving, slidy, dancing. Sprzęt wypożyczamy — przyjdź bez deski.',
    gradient: 'linear-gradient(135deg, var(--accent), var(--cyan))',
    photo: '/images/old-site/longboard.jpg', // Edytuj tutaj
    photoPosition: 'center 70%',
    photoSize: '145%',
  },
  {
    num: '06',
    slug: 'snowboard',
    name: 'Snowboard',
    age: 'OD 7 LAT',
    desc: 'Wyjazdy zimowe, technika, pierwsze tricki w snowparku.',
    gradient: 'linear-gradient(135deg, var(--cyan), var(--primary))',
    photo: '/images/old-site/snowboard.jpg', // Edytuj tutaj
  },
]

export function DisciplinesSection() {
  return (
    <section
      id="dyscypliny"
      className="relative overflow-hidden bg-secondary px-6 py-24 md:px-10 md:py-32"
    >
      <div
        aria-hidden
        className="absolute -left-32 -top-32 h-[560px] w-[560px] rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 65%)' }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          kicker="Dyscypliny"
          kickerColorClass="text-cyan"
          title="Nasze"
          gradientPart="dyscypliny."
          titleFontWeight={400}
          gradientFontWeight={400}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DISCIPLINES.map((d) => (
            <Link
              key={d.num}
              href={`/dyscypliny/${d.slug}`}
              className="group relative flex min-h-72 flex-col justify-end overflow-hidden rounded-3xl p-7 text-foreground transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              style={{ background: d.gradient }}
            >
              {/* Semitransparent photo behind gradient */}
              <div
                aria-hidden
                className="absolute inset-0 bg-cover opacity-50 transition-opacity duration-500 group-hover:opacity-65"
                style={{
                  backgroundImage: `url('${d.photo}')`,
                  backgroundPosition: d.photoPosition ?? 'center',
                  backgroundSize: d.photoSize ?? 'cover',
                }}
              />
              <div
                aria-hidden
                className="halftone-overlay absolute inset-0 text-black opacity-[0.08]"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.65), transparent 55%)',
                }}
              />
              <span className="stat-number absolute right-6 top-4 text-6xl text-white/20 md:text-7xl">
                {d.num}
              </span>
              <span className="absolute left-6 top-6 rounded-full border border-white/30 bg-black/30 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground backdrop-blur-sm">
                {d.age}
              </span>
              <div className="relative">
                <h3 className="display-bold m-0 text-3xl md:text-[2.25rem]" style={{ fontWeight: 400 }}>
                  {d.name}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/85">
                  {d.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
