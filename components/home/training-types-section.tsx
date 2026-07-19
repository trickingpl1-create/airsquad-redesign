import Link from 'next/link'
import type { TrainingType } from '@/lib/types/database'
import { SectionHeader } from './section-header'

interface TrainingTypesSectionProps {
  trainingTypes: TrainingType[]
}

// Per-card accents (CSS custom properties) — rotated across the grid
const accents = [
  'var(--primary)',
  'var(--pink)',
  'var(--cyan)',
  'var(--violet-soft)',
  'var(--amber)',
  'var(--accent)',
  'var(--emerald)',
  'var(--rose)',
] as const

function ageStat(type: TrainingType): { stat: string; statLabel: string } {
  if (type.min_age && type.max_age) {
    return { stat: `${type.min_age}-${type.max_age}`, statLabel: 'lat wiek' }
  }
  if (type.min_age) {
    return { stat: `${type.min_age}+`, statLabel: 'lata wiek' }
  }
  return { stat: 'OPEN', statLabel: 'dla każdego' }
}

export function TrainingTypesSection({ trainingTypes }: TrainingTypesSectionProps) {
  if (trainingTypes.length === 0) return null

  return (
    <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32">
      {/* Soft brand glow */}
      <div
        aria-hidden
        className="absolute right-0 top-0 h-[480px] w-[480px] rounded-full opacity-[0.07]"
        style={{
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          kicker="Oferta"
          kickerColorClass="text-violet-soft"
          title="Co u nas"
          gradientPart="trenujesz."
          titleFontWeight={400}
          gradientFontWeight={400}
          meta={`${trainingTypes.length} aktywnych sekcji — każda dopasowana do wieku i poziomu.`}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trainingTypes.map((type, i) => {
            const accent = accents[i % accents.length]
            const { stat, statLabel } = ageStat(type)

            return (
              <Link
                key={type.id}
                href={`/dyscypliny/${type.slug}`}
                className="group relative min-h-56 overflow-hidden rounded-3xl border border-border bg-card p-7 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              >
                {/* Top accent stripe */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: accent }}
                />
                {/* Halftone in corner */}
                <div
                  aria-hidden
                  className="halftone-overlay absolute -top-4 -right-4 h-24 w-24 opacity-[0.05]"
                  style={{ color: 'var(--foreground)' }}
                />

                {/* Stat in top-right */}
                <div className="absolute top-5 right-6 text-right">
                  <div
                    className="stat-number text-xl opacity-85"
                    style={{ color: accent }}
                  >
                    {stat}
                  </div>
                  <div className="mt-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {statLabel}
                  </div>
                </div>

                {/* Icon swatch */}
                <div
                  className="mt-1 mb-5 grid h-11 w-11 place-items-center rounded-xl"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${accent} 13%, transparent)`,
                    border: `1px solid color-mix(in oklch, ${accent} 35%, transparent)`,
                  }}
                >
                  <div
                    className="h-3.5 w-3.5 rounded-sm"
                    style={{ backgroundColor: accent }}
                  />
                </div>

                <h3 className="display-bold text-xl text-foreground md:text-[1.375rem]">
                  {type.name}
                </h3>
                {type.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {type.description}
                  </p>
                )}

                <div className="mt-5 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors group-hover:text-foreground">
                  <span>Czytaj więcej</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
