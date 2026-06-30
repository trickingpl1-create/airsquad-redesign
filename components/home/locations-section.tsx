import Link from 'next/link'
import type { Location } from '@/lib/types/database'
import { SectionHeader } from './section-header'

interface LocationsSectionProps {
  locations: Location[]
}

const accents = [
  'var(--primary)',
  'var(--accent)',
  'var(--cyan)',
  'var(--pink)',
  'var(--violet-soft)',
  'var(--amber)',
  'var(--emerald)',
] as const

export function LocationsSection({ locations }: LocationsSectionProps) {
  if (locations.length === 0) return null

  const total = locations.length
  const totalLabel = String(total).padStart(2, '0')

  return (
    <section className="relative overflow-hidden bg-secondary px-6 py-24 md:px-10 md:py-32">
      <div
        aria-hidden
        className="halftone-overlay absolute inset-0 text-primary opacity-[0.04]"
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          kicker="Lokalizacje"
          kickerColorClass="text-accent"
          title="Gdzie nas"
          gradientPart="znajdziesz?"
          meta={`[Lokalizacje] // ${total} miast na Podkarpaciu. Wybierz najbliższe.`}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {locations.map((location, i) => {
            const accent = accents[i % accents.length]
            const num = String(i + 1).padStart(2, '0')
            const slug = location.slug ?? location.city.toLowerCase()

            return (
              <Link
                key={location.id}
                href={`/lokalizacje/${slug}`}
                className="group relative min-h-44 overflow-hidden rounded-3xl border border-border bg-card p-7 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              >
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: accent }}
                />
                <div
                  aria-hidden
                  className="halftone-overlay absolute -top-4 -right-4 h-20 w-20 opacity-10"
                  style={{ color: accent }}
                />

                <div
                  className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: accent }}
                >
                  {num} / {totalLabel}
                </div>
                <div className="display-bold mt-4 text-3xl text-foreground md:text-[2rem]">
                  {location.city}
                </div>
                {location.address && (
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    ↳ {location.address}
                  </div>
                )}
              </Link>
            )
          })}

          {/* "Twoje miasto?" CTA card */}
          <Link
            href="/kontakt"
            className="group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-3xl p-7 text-foreground transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            }}
          >
            <div
              aria-hidden
              className="halftone-overlay absolute inset-0 text-black opacity-10"
            />
            <div className="relative font-mono text-[11px] font-bold uppercase tracking-[0.14em] opacity-85">
              Twoje miasto?
            </div>
            <div className="display-bold relative text-xl text-foreground">
              Otwórzmy razem ósmą lokalizację →
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
