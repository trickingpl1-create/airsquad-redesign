import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionHeader } from '@/components/home/section-header'
import { CLUB_CONTACT } from '@/lib/content/cities'

export const metadata = {
  title: 'Aktualności',
  description:
    'Ogłoszenia klubu Air Squad — wydarzenia, obozy, zapisy i bieżące informacje dla rodziców i zawodników.',
}

// Treść zescrapowana z żywej strony airsquad.pl/aktualnosci/ (2026-07-14) —
// format „tablicy ogłoszeń", nie chronologicznego bloga. Bez fallbacku DB:
// to prosta statyczna strona, aktualizowana ręcznie w kodzie.
// Zdjęcia z istniejących zasobów public/images/ (wariant B: foto w lewej połowie karty).
const announcements = [
  {
    kicker: 'Wydarzenie',
    accent: 'text-cyan',
    title: 'AirMeeting 2026',
    desc: 'Spotkanie, zawody i wspólne emocje. Zapisy na kolejną edycję są już otwarte.',
    cta: 'Zobacz szczegóły',
    href: '/airmeeting',
    photo: '/images/akrobatyka/hero-salto.jpg',
  },
  {
    kicker: 'Lato 2026',
    accent: 'text-emerald',
    title: 'Air Camp — połowa miejsc już zajęta',
    desc: 'Longboard, kajaki, SUP, paintball, akrobatyka i tricking. Kontakt w sprawie zapisów: ' + CLUB_CONTACT.phoneTrainer + '.',
    cta: 'Zobacz turnusy',
    href: '/letni',
    photo: '/images/old-site/aircamp-wodny.jpg',
  },
  {
    kicker: 'Sklep klubowy',
    accent: 'text-violet-soft',
    title: 'Zamówienia koszulek klubowych',
    desc: 'Koszulka Air Squad — 50 zł, do wyboru rozmiar. Nadruk imienia na plecach +10 zł. Zamówienia przez SMS na numer ' + CLUB_CONTACT.phone + '.',
    photo: '/images/old-site/dorosli-ekipa.jpg',
  },
  {
    kicker: 'Sezon 2025/26',
    accent: 'text-amber',
    title: 'Zapisy na nowy sezon trwają',
    desc: 'Opłata rezerwacyjna 40 zł zalicza się na poczet pierwszego miesiąca. Numer konta klubu otrzymasz po zgłoszeniu.',
    cta: 'Zapisz dziecko',
    href: '/kontakt',
    photo: '/images/old-site/dzieci-airtrack.jpg',
  },
  {
    kicker: '5–7.12.2025',
    accent: 'text-pink',
    title: 'Akro Nocka',
    desc: 'Nocna impreza akrobatyczna — trening, karaoke, pizza, film i wspólne śniadanie. Koszt 120 zł, zapisy przez SMS na numer ' + CLUB_CONTACT.phone + '.',
    photo: '/images/old-site/hala-airspace.jpg',
  },
  {
    kicker: 'Wyjazd',
    accent: 'text-cyan',
    title: 'Wyjazd na Stick It (IV edycja)',
    desc: 'Klub organizuje wspólny wyjazd na zawody akrobatyczne w Łodzi — różne poziomy zaawansowania. Pytania kieruj na ' + CLUB_CONTACT.email + '.',
    photo: '/images/old-site/tumbling.jpg',
  },
] as const

type Announcement = (typeof announcements)[number]

function AnnouncementBody({
  a,
  featured = false,
}: {
  a: Announcement
  featured?: boolean
}) {
  return (
    <div className={`flex flex-col ${featured ? 'p-6 md:p-8' : 'p-5 md:p-6'}`}>
      <p
        className={`m-0 font-mono text-[11px] font-bold uppercase tracking-[0.16em] ${a.accent}`}
      >
        {a.kicker}
      </p>
      <h3
        className={`display-bold mt-2 text-foreground ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}
        style={{ fontWeight: 500 }}
      >
        {a.title}
      </h3>
      <p
        className={`mb-0 mt-2 flex-1 leading-relaxed text-muted-foreground ${featured ? 'max-w-xl text-sm md:text-base' : 'text-[13px]'}`}
      >
        {a.desc}
      </p>
      {'cta' in a && (
        <Link
          href={a.href}
          className="mt-4 inline-flex w-fit items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/80 transition-colors hover:text-cyan"
        >
          {a.cta}
          <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  )
}

function AnnouncementPhoto({ a, className }: { a: Announcement; className: string }) {
  return (
    <div
      aria-hidden
      className={`bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url('${a.photo}')` }}
    />
  )
}

export default function NewsPage() {
  // Układ „wyróżniony news + siatka": pierwszy wpis duży na całą szerokość,
  // 4 kolejne w parach, ostatni jako wąski poziomy pasek.
  const [featured, ...rest] = announcements
  const middle = rest.slice(0, 4)
  const strip = rest[4]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <SectionHeader
            kicker="Aktualności"
            kickerColorClass="text-emerald"
            title="Co słychać"
            gradientPart="w klubie."
            titleFontWeight={500}
            gradientFontWeight={500}
          />

          {/* Wyróżniony news — cała szerokość, duże foto w lewej połowie */}
          <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-[1.1fr_1fr]">
            <AnnouncementPhoto a={featured} className="h-52 md:h-full md:min-h-72" />
            <AnnouncementBody a={featured} featured />
          </div>

          {/* Cztery średnie karty w parach */}
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {middle.map((a) => (
              <div
                key={a.title}
                className="grid grid-cols-1 overflow-hidden rounded-3xl border border-border bg-card sm:grid-cols-[1fr_1.3fr]"
              >
                <AnnouncementPhoto a={a} className="h-40 sm:h-full sm:min-h-48" />
                <AnnouncementBody a={a} />
              </div>
            ))}
          </div>

          {/* Ostatni wpis — wąski poziomy pasek */}
          {strip && (
            <div className="mt-4 grid grid-cols-1 overflow-hidden rounded-3xl border border-border bg-card sm:grid-cols-[1fr_2.5fr]">
              <AnnouncementPhoto a={strip} className="h-40 sm:h-full sm:min-h-36" />
              <AnnouncementBody a={strip} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
