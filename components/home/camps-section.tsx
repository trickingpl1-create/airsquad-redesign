import Link from 'next/link'
import Image from 'next/image'
import type { Camp } from '@/lib/types/database'

interface CampsSectionProps {
  camps: Camp[]
}

const attractions = [
  { label: 'Longboardy', accent: 'var(--cyan)' },
  { label: 'Kajaki · SUP', accent: 'var(--violet-soft)' },
  { label: 'Paintball', accent: 'var(--pink)' },
  { label: 'Akro · Tricking', accent: 'var(--accent)' },
] as const

const stats = [
  ['9', 'dni'],
  ['20', 'kadra'],
  ['20+', 'aktywności'],
  ['2500', 'od zł / turnus'],
] as const

function formatPrice(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
  })
}

export function CampsSection({ camps }: CampsSectionProps) {
  const featured = camps[0]

  return (
    <section
      id="aircamp"
      className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32"
      style={{
        background:
          'radial-gradient(ellipse at 25% 30%, color-mix(in oklch, var(--primary) 32%, transparent), transparent 50%), radial-gradient(ellipse at 75% 70%, color-mix(in oklch, var(--accent) 28%, transparent), transparent 50%), oklch(0.1 0.02 280)',
      }}
    >
      {/* Semitransparent background photo */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/images/old-site/aircamp-wodny.jpg')" }}
      />
      <div
        aria-hidden
        className="halftone-overlay absolute inset-0 text-cyan opacity-[0.06]"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Air Camp hero logo */}
        <div className="mb-12 flex justify-center">
          <Image
            src="/images/aircamp-2026-logo.png"
            alt="Air Camp 2026 — Obóz sportowo-rekreacyjny"
            width={580}
            height={290}
            className="h-[300px] w-auto object-contain drop-shadow-[0_0_32px_rgba(16,185,129,0.4)]"
            priority
          />
        </div>

        <p className="text-center font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan md:text-xs">
          Obóz letni · zapisy otwarte
        </p>

        {/* Attractions grid */}
        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {attractions.map((a, i) => (
            <div
              key={a.label}
              className="relative overflow-hidden rounded-2xl border bg-white/5 p-6"
              style={{ borderColor: `color-mix(in oklch, ${a.accent} 50%, transparent)` }}
            >
              <div
                aria-hidden
                className="halftone-overlay absolute inset-0 opacity-[0.05]"
                style={{ color: a.accent }}
              />
              <div
                className="relative font-mono text-[11px] font-bold uppercase tracking-[0.14em]"
                style={{ color: a.accent }}
              >
                ◆ 0{i + 1} · Atrakcja
              </div>
              <div className="display-bold relative mt-3 text-2xl text-foreground" style={{ fontWeight: 500 }}>
                {a.label}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-14 flex flex-wrap items-end justify-center gap-x-12 gap-y-6">
          {stats.map(([value, label], i) => (
            <div key={label} className="flex items-end gap-12">
              <div className="text-center">
                <div className="stat-number gradient-text text-5xl md:text-6xl" style={{ fontWeight: 400 }}>{value}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {label}
                </div>
              </div>
              {i < stats.length - 1 && (
                <span aria-hidden className="hidden h-12 w-px bg-border md:block" />
              )}
            </div>
          ))}
        </div>

        {/* Featured camp from DB (if any) */}
        {featured && (
          <div className="mt-16 grid gap-4 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
              <div className="font-mono text-[11px] font-extrabold uppercase tracking-[0.16em] text-cyan">
                {formatDate(featured.start_date)} – {formatDate(featured.end_date)}
                {featured.location && <> · {featured.location}</>}
              </div>
              <h3 className="display-bold mt-3 text-3xl text-foreground md:text-4xl">
                {featured.name}
              </h3>
              {featured.description && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {featured.description}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                {featured.price && (
                  <div>
                    <div className="stat-number text-3xl text-foreground md:text-4xl">
                      {formatPrice(featured.price)}
                    </div>
                    {featured.spots_total !== null &&
                      featured.spots_total - featured.spots_taken > 0 && (
                        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                          {featured.spots_total - featured.spots_taken} z{' '}
                          {featured.spots_total} miejsc
                        </div>
                      )}
                  </div>
                )}
                <Link
                  href={`/obozy/${featured.slug}`}
                  className="rounded-2xl border-2 border-foreground/15 px-6 py-3 font-mono text-xs font-extrabold uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground/40"
                >
                  Szczegóły turnusu →
                </Link>
              </div>
            </div>

            <Link
              href="/obozy"
              className="block rounded-3xl p-8 text-center text-primary-foreground shadow-[0_14px_36px_oklch(0.58_0.24_290/0.35)] transition-transform hover:-translate-y-1 md:p-10"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              }}
            >
              <span className="display-bold block text-2xl md:text-3xl">
                Zarezerwuj turnus
              </span>
              <span className="mt-2 block text-xs opacity-80">
                Wszystkie terminy obozów 2026
              </span>
            </Link>
          </div>
        )}

        {!featured && (
          <div className="mt-14 text-center">
            <Link
              href="/obozy"
              className="inline-block rounded-2xl px-10 py-5 text-sm font-bold tracking-tight text-primary-foreground shadow-[0_14px_36px_oklch(0.58_0.24_290/0.35)] transition-transform hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              }}
            >
              Zarezerwuj turnus
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
