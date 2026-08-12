import { CtaMiniForm } from './cta-mini-form'
import type { EnrolCity } from '@/lib/content/enrol-cities'

const stats = [
  { value: '1100+', label: 'uczniów / sezon', color: 'text-violet-soft' },
  { value: '8', label: 'miast', color: 'text-cyan' },
  { value: '10', label: 'lat istnienia', color: 'text-pink' },
] as const

export function CTASection({ cities }: { cities: EnrolCity[] }) {
  return (
    <section
      id="zapisz"
      className="relative overflow-hidden bg-background px-6 py-24 md:px-10 md:py-32"
    >
      {/* Semitransparent background photo */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/images/bg-zapisz.jpg')" }}
      />
      {/* Gradient overlay to darken edges and keep text legible */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 30%, var(--background) 80%)',
        }}
      />
      <div
        aria-hidden
        className="halftone-overlay absolute inset-0 text-primary opacity-[0.04]"
      />
      <div
        aria-hidden
        className="absolute -left-32 top-16 h-[460px] w-[460px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-14">
        {/* LEFT — heading + stats */}
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft md:text-xs">
            Dołącz do treningu
          </p>
          <h2 className="display-bold mt-3 text-balance text-4xl text-foreground md:text-5xl lg:text-6xl" style={{ fontWeight: 400 }}>
            Zapisz dziecko na{' '}
            <span className="gradient-text">pierwszy trening</span>.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Pierwszy trening kosztuje 40 zł. Odzywamy się w ciągu 24 godzin,
            żeby dobrać grupę do poziomu dziecka i dogodne dni treningu.
          </p>

          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className={`stat-number text-3xl md:text-4xl ${s.color}`} style={{ fontWeight: 400 }}>{s.value}</dd>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* RIGHT — mini-formularz: miasto + poziom → modal z formularzem AIPAX */}
        <CtaMiniForm cities={cities} />
      </div>
    </section>
  )
}
