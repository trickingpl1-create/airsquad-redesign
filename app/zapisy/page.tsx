import Link from 'next/link'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionHeader } from '@/components/home/section-header'
import { HowStepsSection } from '@/components/home/how-steps-section'
import { EnrolSearch } from '@/components/zapisy/enrol-search'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import { ENROL_CITIES, ENROL_CITY_CARDS } from '@/lib/content/enrol-cities'
import { CLUB_CONTACT } from '@/lib/content/cities'

// Historyczny URL WordPressa i wg docs/03-mapa-url.md „główna ścieżka konwersji",
// więc musi zwracać 200. Treść jak na airsquad.pl/zapisy: hasło „dla dzieci,
// młodzieży i dorosłych", wyszukiwarka miejscowości i lista wszystkich sekcji —
// każda karta linkuje do kalendarza AIPAX danego miasta (/{slug}/#zapisy) oraz
// do jego podstrony. Kafle kroków i modal zapisów współdzielone ze stroną główną
// (HowStepsSection), dane sal/odbiorców czytane z cities.ts (ENROL_CITY_CARDS).
export const metadata: Metadata = generateSEOMetadata({
  title: 'Zapisy na zajęcia — akrobatyka i tricking',
  description:
    'Zapisz dziecko na akrobatykę, tricking lub tumbling w Air Squad. Sześć miast na Podkarpaciu, małe grupy, dwóch trenerów. Wybierz miasto i sprawdź wolne terminy.',
  canonical: '/zapisy/',
  keywords: 'zapisy akrobatyka, zapisy tricking, Air Squad zapisy, Podkarpacie',
})

const EVENTS = [
  {
    href: '/letni/',
    kicker: 'Lato 2026 · Air Camp',
    label: 'Air Camp',
    desc: 'Letni obóz sportowy — akrobatyka, kajaki, longboardy, paintball.',
    accent: 'var(--emerald)',
  },
  {
    href: '/airmeeting/',
    kicker: 'Wydarzenie · Air Meeting',
    label: 'Air Meeting',
    desc: 'Spotkanie, zawody i wspólne emocje dla członków klubu.',
    accent: 'var(--cyan)',
  },
] as const

export default function EnrolPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <SectionHeader
            as="h1"
            kicker="Zapisy"
            kickerColorClass="text-emerald"
            title="Wybierz miasto"
            gradientPart="i zacznij trenować."
            titleFontWeight={400}
            gradientFontWeight={400}
            className="mb-6"
          />

          <div className="inline-flex items-center gap-3 rounded-full border border-foreground/20 bg-foreground/5 px-5 py-2.5 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald" />
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/90">
              Dla dzieci, młodzieży i dorosłych · Sezon 2025/26 · zapisy otwarte
            </span>
          </div>

          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            Wpisz miejscowość, a zobaczysz grupy treningowe. Każda lokalizacja ma
            własny grafik i kalendarz zapisów — na podstronie miasta zobaczysz
            grupy, godziny i wolne miejsca, a zapis potwierdzisz w formularzu
            AIPAX.
          </p>

          <EnrolSearch cities={ENROL_CITY_CARDS} />
        </div>

        {/* Kroki „Jak to działa" + modal zapisów — te same co na stronie głównej */}
        <HowStepsSection cities={ENROL_CITIES} />

        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <SectionHeader
            kicker="Poza sezonem"
            kickerColorClass="text-amber"
            title="Obozy i"
            gradientPart="wydarzenia."
            titleFontWeight={400}
            gradientFontWeight={400}
            className="mb-6 md:mb-8"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {EVENTS.map((event) => (
              <Link
                key={event.href}
                href={event.href}
                className="rounded-3xl border border-border bg-card p-6 transition-colors hover:border-violet-soft/50"
              >
                <span
                  className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: event.accent }}
                >
                  {event.kicker}
                </span>
                <p className="mb-0 mt-3 text-sm leading-relaxed text-muted-foreground">
                  {event.desc}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-14 rounded-3xl border border-border bg-card p-6 md:p-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-pink">
              Pomoc
            </p>
            <h2
              className="display-bold mt-2 text-2xl text-foreground md:text-3xl"
              style={{ fontWeight: 400 }}
            >
              Nie wiesz, którą grupę wybrać?
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              O przydziale do grupy decyduje trener po zajęciach próbnych —
              dzielimy według umiejętności, nie tylko wieku. Zadzwoń, jeśli chcesz
              to omówić wcześniej.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm">
              <a
                href={`tel:+48${CLUB_CONTACT.phoneTrainer.replace(/\s/g, '')}`}
                className="text-cyan hover:underline"
              >
                ☎ {CLUB_CONTACT.phoneTrainer} (trener)
              </a>
              <a
                href={`mailto:${CLUB_CONTACT.email}`}
                className="text-cyan hover:underline"
              >
                {CLUB_CONTACT.email}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
