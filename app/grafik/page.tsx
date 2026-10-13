import type { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionHeader } from '@/components/home/section-header'
import { SOCIALS } from '@/lib/content/socials'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Grafik zajęć',
  description:
    'Sprawdź grafik zajęć Air Squad. Akrobatyka, tricking, skoki na ścieżce w 6 lokalizacjach na Podkarpaciu.',
  canonical: '/grafik/',
})

// Kafelki miast — szczegółowy grafik grup każdego miasta żyje na jego
// podstronie (chronione root-slugi SEO, jak w components/home/cities-section.tsx).
const CITY_TILES = [
  { city: 'Rzeszów', slug: '/rzeszow/', detail: 'Sala AIR SPACE · ul. Boya-Żeleńskiego 15' },
  { city: 'Dębica', slug: '/debica/', detail: 'AIR SPACE Dębica · SP nr 4 · SP nr 10' },
  { city: 'Jasło', slug: '/jaslo/', detail: 'Podkarpackie Centrum Sportów Walki' },
  { city: 'Biecz', slug: '/biecz/', detail: 'Hala Sportowa' },
  { city: 'Brzostek', slug: '/brzostek/', detail: 'Hala Widowiskowo-Sportowa' },
  { city: 'Pilzno', slug: '/pilzno/', detail: 'Szkoła Podstawowa, Strzegocice' },
] as const

export default function SchedulePage() {
  const ig = SOCIALS.find((s) => s.short === 'IG')?.href
  const fb = SOCIALS.find((s) => s.short === 'FB')?.href
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24">
        {/* Kafelki miast — wejście w miasto = pełny grafik grup tej sekcji */}
        <section className="container mx-auto px-4 pt-12">
          <SectionHeader
            as="h1"
            kicker="Grafik zajęć"
            kickerColorClass="text-cyan"
            title="Wybierz swoje"
            gradientPart="miasto."
            titleFontWeight={400}
            gradientFontWeight={400}
            meta={`[Sale] // ${CITY_TILES.length} miast — grafik grup znajdziesz na podstronie miasta.`}
            className="mb-8 md:mb-10"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CITY_TILES.map((tile, i) => (
              <Link
                key={tile.slug}
                href={tile.slug}
                className="group relative min-h-36 rounded-3xl border border-border bg-card p-6 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              >
                <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  <span>
                    {String(i + 1).padStart(2, '0')} / {String(CITY_TILES.length).padStart(2, '0')}
                  </span>
                  <span aria-hidden className="transition-colors group-hover:text-cyan">
                    ↗
                  </span>
                </div>
                <div className="display-bold mt-3 text-2xl text-foreground" style={{ fontWeight: 500 }}>
                  {tile.city}
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  ↳ {tile.detail}
                </div>
                <span className="mt-3 inline-block rounded-md border border-cyan/25 bg-cyan/10 px-2 py-0.5 font-mono text-[11px] text-cyan">
                  {tile.slug}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Zapisy wkrótce — kalendarz AIPAX uruchomimy po ogłoszeniu terminów */}
        <section className="container mx-auto px-4 pb-16 pt-14">
          <div className="relative overflow-hidden rounded-3xl border border-emerald/30 bg-gradient-to-br from-emerald/15 to-cyan/10 p-8 text-center md:p-12">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald">
              Zapisy
            </p>
            <h2
              className="display-bold mt-3 text-3xl text-foreground md:text-4xl"
              style={{ fontWeight: 400 }}
            >
              Zapisy ruszają już{' '}
              <span className="gradient-text" style={{ fontWeight: 400 }}>
                wkrótce
              </span>
              .
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Grafik grup i zapisy online pojawią się tutaj niebawem. Śledźcie nas
              na Instagramie i Facebooku — tam ogłaszamy terminy jako pierwsi.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href={ig}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white transition-transform hover:scale-[1.03]"
              >
                Instagram →
              </a>
              <a
                href={fb}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-foreground/25 bg-foreground/5 px-7 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-cyan hover:text-cyan"
              >
                Facebook ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
