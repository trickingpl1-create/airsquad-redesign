import Link from 'next/link'

const promoCards = [
  {
    kicker: 'LATO 2026',
    title: 'Air Camp',
    desc: 'Longboardy, kajaki, SUP, paintball, akrobatyka, tricking, taniec, gry terenowe. Sprawdzeni instruktorzy i program pełen wyzwań. Tel: 728 559 101',
    cta: 'Zapisz dziecko',
    href: '/letni',
    accentColor: 'var(--primary)',
    gradientFrom: 'from-primary/15',
    gradientTo: 'to-violet-soft/10',
    kickerColor: 'text-violet-soft',
  },
  {
    kicker: 'WYDARZENIE',
    title: 'Air Meeting 2026',
    desc: 'Spotkanie, zawody i wspólne emocje. Niezapomniane, przepełnione pozytywną energią wydarzenie dla członków klubu Air Squad.',
    cta: 'Więcej informacji',
    href: '/airmeeting',
    accentColor: 'var(--cyan)',
    gradientFrom: 'from-cyan/15',
    gradientTo: 'to-accent/10',
    kickerColor: 'text-cyan',
  },
] as const

export function PromoSection() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-16 md:px-10 md:py-20">
      <div className="relative mx-auto max-w-7xl">
        {/* Two promo cards */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {promoCards.map((card) => (
            <div
              key={card.title}
              className={`relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} p-8 md:p-10`}
            >
              {/* Decorative circle */}
              <div
                aria-hidden
                className="absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-20"
                style={{
                  background: `radial-gradient(circle, ${card.accentColor} 0%, transparent 70%)`,
                }}
              />

              <p className={`font-mono text-[11px] font-bold uppercase tracking-[0.18em] ${card.kickerColor} md:text-xs`}>
                {card.kicker}
              </p>
              
              <h3 className="display-bold mt-3 text-3xl text-foreground md:text-4xl" style={{ fontWeight: 500 }}>
                {card.title}
              </h3>
              
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                {card.desc}
              </p>
              
              <Link
                href={card.href}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground transition-transform hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${card.accentColor}, var(--accent))`,
                  boxShadow: `0 8px 24px color-mix(in oklch, ${card.accentColor} 30%, transparent)`,
                }}
              >
                {card.cta}
                <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Full-width event banner */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-amber/15 to-amber/5 px-8 py-8 md:px-10">
          {/* Decorative element */}
          <div
            aria-hidden
            className="absolute right-8 top-1/2 hidden h-32 w-32 -translate-y-1/2 rounded-full opacity-20 md:block"
            style={{
              background: 'radial-gradient(circle, var(--amber) 0%, transparent 70%)',
            }}
          />

          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-amber md:text-xs">
                Nowe wydarzenie
              </p>
              <h3 className="display-bold mt-2 text-2xl text-foreground md:text-3xl" style={{ fontWeight: 500 }}>
                Gravity Jam — święto kultury ulicznej
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Warsztaty rolkowe, akrobatyczne, strefa longboardowa i gier drewnianych. Razem z MB Park i Street Life Rzeszów.
              </p>
            </div>
            
            <Link
              href="/gravityjam"
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-full px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-amber-foreground transition-transform hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, var(--amber), oklch(0.72 0.15 55))',
                boxShadow: '0 8px 24px color-mix(in oklch, var(--amber) 30%, transparent)',
                color: 'oklch(0.25 0.03 75)',
              }}
            >
              Sprawdź
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
