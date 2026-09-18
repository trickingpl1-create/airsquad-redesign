import { SectionHeader } from './section-header'
import { DisciplinesReveal, type Discipline } from './disciplines-reveal'

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
    slug: 'tricking-akademia',
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
    href: '/zapisy/', // brak strony /dyscypliny/showdance/ — kierujemy do zapisów
    name: 'Showdance',
    age: 'OD 7 LAT',
    desc: 'Choreografie, technika, lekcje indywidualne.',
    gradient: 'linear-gradient(135deg, var(--amber), var(--pink))',
    photo: '/images/dyscypliny/showdance.jpg', // Edytuj tutaj
  },
  {
    num: '05',
    slug: 'longboardy',
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
    href: '/obozy/', // brak strony /dyscypliny/snowboard/ — wyjazdy zimowe są w obozach
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
          className="mb-8 md:mb-10"
        />

        <DisciplinesReveal disciplines={DISCIPLINES} />
      </div>
    </section>
  )
}
