import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionHeader } from '@/components/home/section-header'
import { CLUB_CONTACT } from '@/lib/content/cities'

export const metadata = {
  title: 'Aktualności | Air Squad',
  description:
    'Ogłoszenia klubu Air Squad — wydarzenia, obozy, zapisy i bieżące informacje dla rodziców i zawodników.',
}

// Treść zescrapowana z żywej strony airsquad.pl/aktualnosci/ (2026-07-14) —
// format „tablicy ogłoszeń", nie chronologicznego bloga. Bez fallbacku DB:
// to prosta statyczna strona, aktualizowana ręcznie w kodzie.
const announcements = [
  {
    kicker: 'Wydarzenie',
    accent: 'text-cyan',
    title: 'AirMeeting 2026',
    desc: 'Spotkanie, zawody i wspólne emocje. Zapisy na kolejną edycję są już otwarte.',
    cta: 'Zobacz szczegóły',
    href: '/airmeeting',
  },
  {
    kicker: 'Lato 2026',
    accent: 'text-emerald',
    title: 'Air Camp — połowa miejsc już zajęta',
    desc: 'Longboard, kajaki, SUP, paintball, akrobatyka i tricking. Kontakt w sprawie zapisów: ' + CLUB_CONTACT.phoneTrainer + '.',
    cta: 'Zobacz turnusy',
    href: '/letni',
  },
  {
    kicker: 'Sklep klubowy',
    accent: 'text-violet-soft',
    title: 'Zamówienia koszulek klubowych',
    desc: 'Koszulka Air Squad — 50 zł, do wyboru rozmiar. Nadruk imienia na plecach +10 zł. Zamówienia przez SMS na numer ' + CLUB_CONTACT.phone + '.',
  },
  {
    kicker: 'Sezon 2025/26',
    accent: 'text-amber',
    title: 'Zapisy na nowy sezon trwają',
    desc: 'Opłata rezerwacyjna 40 zł zalicza się na poczet pierwszego miesiąca. Numer konta klubu otrzymasz po zgłoszeniu.',
    cta: 'Zapisz dziecko',
    href: '/kontakt',
  },
  {
    kicker: '5–7.12.2025',
    accent: 'text-pink',
    title: 'Akro Nocka',
    desc: 'Nocna impreza akrobatyczna — trening, karaoke, pizza, film i wspólne śniadanie. Koszt 120 zł, zapisy przez SMS na numer ' + CLUB_CONTACT.phone + '.',
  },
  {
    kicker: 'Wyjazd',
    accent: 'text-cyan',
    title: 'Wyjazd na Stick It (IV edycja)',
    desc: 'Klub organizuje wspólny wyjazd na zawody akrobatyczne w Łodzi — różne poziomy zaawansowania. Pytania kieruj na ' + CLUB_CONTACT.email + '.',
  },
] as const

export default function NewsPage() {
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((a) => (
              <div
                key={a.title}
                className="flex flex-col rounded-3xl border border-border bg-card p-7"
              >
                <p
                  className={`font-mono text-[11px] font-bold uppercase tracking-[0.16em] ${a.accent}`}
                >
                  {a.kicker}
                </p>
                <h3
                  className="display-bold mt-3 text-2xl text-foreground"
                  style={{ fontWeight: 500 }}
                >
                  {a.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {a.desc}
                </p>
                {'cta' in a && (
                  <Link
                    href={a.href}
                    className="mt-5 inline-flex w-fit items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/80 transition-colors hover:text-cyan"
                  >
                    {a.cta}
                    <span aria-hidden>→</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
