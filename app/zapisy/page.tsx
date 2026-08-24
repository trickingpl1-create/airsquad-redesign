import Link from 'next/link'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionHeader } from '@/components/home/section-header'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import { ENROL_CITIES } from '@/lib/content/enrol-cities'
import { CLUB_CONTACT } from '@/lib/content/cities'

// Historyczny URL WordPressa i wg docs/03-mapa-url.md „główna ścieżka konwersji",
// więc musi zwracać 200 — a w eksporcie statycznym istnieje tylko to, co powstanie
// w czasie builda. Jawna trasa zamiast wiersza w `static_pages`: generyczny
// StaticPageView osadza AipaxWidget z placeholderowym form-id, a realne formularze
// per-miasto siedzą w lib/content/cities.ts. Zamiast osadzać jeden wspólny
// kalendarz, kierujemy do sekcji #zapisy właściwego miasta — to też prawdziwe,
// indeksowalne linki wewnętrzne zamiast treści chowanej za JS-em.
export const metadata: Metadata = generateSEOMetadata({
  title: 'Zapisy na zajęcia — akrobatyka i tricking',
  description:
    'Zapisz dziecko na akrobatykę, tricking lub tumbling w Air Squad. Siedem miast na Podkarpaciu, małe grupy, dwóch trenerów. Wybierz swoje miasto i sprawdź wolne terminy.',
  canonical: '/zapisy/',
  keywords: 'zapisy akrobatyka, zapisy tricking, Air Squad zapisy, Podkarpacie',
})

const EVENTS = [
  {
    href: '/letni/',
    label: 'Air Camp',
    desc: 'Letni obóz sportowy — akrobatyka, kajaki, longboardy, paintball.',
    accent: 'var(--emerald)',
  },
  {
    href: '/airmeeting/',
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
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <SectionHeader
            kicker="Zapisy"
            kickerColorClass="text-emerald"
            title="Wybierz miasto"
            gradientPart="i zacznij trenować."
            titleFontWeight={400}
            gradientFontWeight={400}
          />

          <p className="-mt-4 mb-10 max-w-2xl leading-relaxed text-muted-foreground">
            Każde miasto ma własny grafik i własny kalendarz zapisów. Kliknij
            swoją lokalizację — zobaczysz grupy, godziny i wolne miejsca, a zapis
            potwierdzisz w formularzu AIPAX.
          </p>

          <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {ENROL_CITIES.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/${city.slug}/#zapisy`}
                  className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:border-violet-soft/50"
                >
                  <span
                    className="display-bold text-xl text-foreground"
                    style={{ fontWeight: 500 }}
                  >
                    {city.name}
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-sm text-muted-foreground transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <h2
            className="display-bold mt-14 text-2xl text-foreground md:text-3xl"
            style={{ fontWeight: 400 }}
          >
            Obozy i wydarzenia
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {EVENTS.map((event) => (
              <Link
                key={event.href}
                href={event.href}
                className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-violet-soft/50"
              >
                <span
                  className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: event.accent }}
                >
                  {event.label}
                </span>
                <p className="mb-0 mt-2 text-sm leading-relaxed text-muted-foreground">
                  {event.desc}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-14 rounded-3xl border border-border bg-card p-6 md:p-8">
            <h2
              className="display-bold text-xl text-foreground"
              style={{ fontWeight: 500 }}
            >
              Nie wiesz, którą grupę wybrać?
            </h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              O przydziale do grupy decyduje trener po zajęciach próbnych —
              dzielimy według umiejętności, nie tylko wieku. Zadzwoń, jeśli chcesz
              to omówić wcześniej.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 font-mono text-sm">
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
