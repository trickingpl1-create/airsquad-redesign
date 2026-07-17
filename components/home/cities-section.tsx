import Link from 'next/link'
import { SectionHeader } from './section-header'

// Moduł szybkich linków do landingów miast na stronie głównej.
// Linkuje do historycznych root-slugów (docs/03-mapa-url.md) — celowo
// NIE do /lokalizacje/{slug}, bo to root-slugi są chronionymi URL-ami SEO.
const AIR_SPACE_HALLS = [
  {
    city: 'Rzeszów',
    slug: '/rzeszow/',
    detail: 'ul. Boya-Żeleńskiego 15 · AirTrack',
  },
  {
    city: 'Dębica',
    slug: '/debica/',
    detail: 'Sala klubowa Air Squad',
  },
] as const

const CITIES = [
  { city: 'Jasło', slug: '/jaslo/' },
  { city: 'Biecz', slug: '/biecz/' },
  { city: 'Brzostek', slug: '/brzostek/' },
  { city: 'Pilzno', slug: '/pilzno/' },
] as const

// Tyczyn (7. lokalizacja, strona /tyczyn/ dalej istnieje i działa) nie ma
// tu własnego kafelka — jego miejsce w gridzie zajmuje CTA franczyzy.
const TOTAL = AIR_SPACE_HALLS.length + CITIES.length + 1
const TOTAL_LABEL = String(TOTAL).padStart(2, '0')

export function CitiesSection() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-16 md:px-10 md:py-20">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          kicker="Lokalizacje"
          kickerColorClass="text-cyan"
          title="Trenuj w swoim"
          gradientPart="mieście."
          titleFontWeight={400}
          gradientFontWeight={400}
          meta={`[Sale] // ${TOTAL} miast na Podkarpaciu. Wybierz najbliższe.`}
          className="mb-10 md:mb-12"
        />

        {/* Wyróżnione sale AIR SPACE */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {AIR_SPACE_HALLS.map((hall) => (
            <Link
              key={hall.slug}
              href={hall.slug}
              className="group relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/15 to-violet-soft/10 p-7 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-primary-foreground">
                  Sala Air Space
                </span>
                <span
                  aria-hidden
                  className="font-mono text-base text-cyan transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </div>
              <div className="display-bold mt-5 text-3xl text-foreground md:text-[2rem]">
                {hall.city}
              </div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                ↳ {hall.detail}
              </div>
              <span className="mt-4 inline-block rounded-md border border-cyan/25 bg-cyan/10 px-2 py-0.5 font-mono text-[11px] text-cyan">
                {hall.slug}
              </span>
            </Link>
          ))}
        </div>

        {/* Pozostałe miasta */}
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CITIES.map((c, i) => {
            const num = String(i + 1 + AIR_SPACE_HALLS.length).padStart(2, '0')
            return (
              <Link
                key={c.slug}
                href={c.slug}
                className="group relative min-h-32 rounded-3xl border border-border bg-card p-5 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              >
                <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  <span>
                    {num} / {TOTAL_LABEL}
                  </span>
                  <span
                    aria-hidden
                    className="transition-colors group-hover:text-cyan"
                  >
                    ↗
                  </span>
                </div>
                <div className="display-bold mt-3 text-xl text-foreground md:text-2xl">
                  {c.city}
                </div>
                <div className="mt-1 font-mono text-[11px] text-cyan/80">
                  {c.slug}
                </div>
              </Link>
            )
          })}

          {/* Franczyza — inna intencja niż zapis dziecka, stąd odrębny styl; zajmuje miejsce Tyczynia w gridzie */}
          <Link
            href="/franczyza/"
            className="group relative min-h-32 rounded-3xl border border-dashed border-emerald/50 bg-emerald/5 p-5 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
          >
            <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-emerald">
              <span>Twoje miasto?</span>
              <span
                aria-hidden
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                →
              </span>
            </div>
            <div
              className="display-bold mt-3 text-xl text-foreground md:text-2xl"
              style={{ fontWeight: 500 }}
            >
              Otwórz salę Air Squad
            </div>
            <div className="mt-1 font-mono text-[11px] text-emerald/80">
              /franczyza/
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
