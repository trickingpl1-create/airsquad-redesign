import Image from 'next/image'
import type { Trainer } from '@/lib/types/database'
import { SectionHeader } from './section-header'

interface TeamSectionProps {
  trainers: Trainer[]
}

const cardGradients = [
  'linear-gradient(135deg, var(--primary), var(--accent))',
  'linear-gradient(135deg, var(--pink), var(--primary))',
  'linear-gradient(135deg, var(--cyan), var(--accent))',
  'linear-gradient(135deg, var(--violet-soft), var(--primary))',
  'linear-gradient(135deg, var(--accent), var(--cyan))',
  'linear-gradient(135deg, var(--primary), var(--pink))',
  'linear-gradient(135deg, var(--cyan), var(--violet-soft))',
  'linear-gradient(135deg, var(--amber), var(--pink))',
] as const

export function TeamSection({ trainers }: TeamSectionProps) {
  if (trainers.length === 0) return null

  return (
    <section
      id="zespol"
      className="relative overflow-hidden bg-secondary px-6 py-24 md:px-10 md:py-32"
    >
      <div
        aria-hidden
        className="halftone-overlay absolute inset-0 text-cyan opacity-[0.04]"
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          kicker="Trenerzy"
          kickerColorClass="text-cyan"
          title="Zespół, któremu"
          gradientPart="ufają rodzice."
          titleFontWeight={400}
          gradientFontWeight={400}
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {trainers.map((t, i) => {
            const gradient = cardGradients[i % cardGradients.length]
            const number = String(i + 1).padStart(2, '0')

            return (
              <article
                key={t.id}
                className="overflow-hidden rounded-3xl border border-border bg-card"
              >
                <div
                  className="relative aspect-[4/5] overflow-hidden"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.10), rgba(255,255,255,0.10) 1px, transparent 1px, transparent 10px), ${gradient}`,
                  }}
                >
                  {t.photo_url && (
                    <Image
                      src={t.photo_url}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  )}
                  <div
                    aria-hidden
                    className="halftone-overlay absolute inset-0 text-black opacity-10"
                  />
                  <div className="absolute left-3 top-3 font-mono text-[11px] font-extrabold text-foreground/85">
                    #{number}
                  </div>
                  {t.instagram_url && (
                    <a
                      href={t.instagram_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Instagram ${t.name}`}
                      className="absolute bottom-3 right-3 grid h-7 w-7 place-items-center rounded-full border border-white/30 bg-black/40 text-sm text-foreground transition-colors hover:bg-black/60"
                    >
                      ↗
                    </a>
                  )}
                </div>
                <div className="p-5">
                  <div className="display-bold text-base text-foreground">
                    {t.name}
                  </div>
                  {t.role && (
                    <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-violet-soft">
                      {t.role}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
