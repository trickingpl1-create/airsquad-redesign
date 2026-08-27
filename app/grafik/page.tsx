import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AipaxWidget } from '@/components/aipax-widget'
import { SectionHeader } from '@/components/home/section-header'

export const metadata = {
  alternates: { canonical: '/grafik/' },
  title: 'Grafik zajęć',
  description: 'Sprawdź grafik zajęć Air Squad. Akrobatyka, tricking, skoki na ścieżce w 7 lokalizacjach.',
}

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

        {/* Zapisy online — pełny kalendarz klubu (widget AIPAX) */}
        <section className="container mx-auto px-4 pb-16 pt-14">
          <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald">
            Pełny kalendarz zajęć klubu
          </p>
          <AipaxWidget />
        </section>
      </main>
      <Footer />
    </div>
  )
}
