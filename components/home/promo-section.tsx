import Link from 'next/link'

const promoCards = [
  {
    kicker: 'LATO 2026',
    title: 'Air Camp',
    desc: 'Longboardy, kajaki, SUP, paintball, akrobatyka, tricking, taniec, gry terenowe. Sprawdzeni instruktorzy i program pełen wyzwań. Tel: 728 559 101',
    cta: 'Zapisz dziecko',
    href: '/letni',
    accentColor: 'var(--primary)',
    gradientFrom: 'from-primary/42',
    gradientTo: 'to-violet-soft/22',
    kickerColor: 'text-violet-soft',
  },
  {
    kicker: 'WYDARZENIE',
    title: 'Air Meeting',
    desc: 'Spotkanie, zawody i wspólne emocje. Niezapomniane, przepełnione pozytywną energią wydarzenie dla członków klubu Air Squad.',
    cta: 'Więcej informacji',
    href: '/airmeeting',
    accentColor: 'var(--cyan)',
    gradientFrom: 'from-cyan/42',
    gradientTo: 'to-accent/22',
    kickerColor: 'text-cyan',
  },
  {
    kicker: 'WYDARZENIE KLUBOWE',
    title: 'AkroNocki',
    desc: 'Nocowanie na sali razem z treningiem wieczorem i rano, integracja, dyskoteka, karaoke i film. Niezapomniana noc dla członków klubu.',
    cta: 'Zobacz szczegóły',
    href: '/aktualnosci',
    accentColor: 'var(--pink)',
    gradientFrom: 'from-pink/42',
    gradientTo: 'to-pink/22',
    kickerColor: 'text-pink',
  },
  {
    kicker: 'NOWE WYDARZENIE',
    title: 'Gravity Jam — święto kultury ulicznej',
    desc: 'Warsztaty rolkowe, akrobatyczne, strefa longboardowa i gier drewnianych. Razem z MB Park i Street Life Rzeszów.',
    cta: 'Sprawdź',
    href: '/gravityjam',
    accentColor: 'var(--amber)',
    gradientFrom: 'from-amber/42',
    gradientTo: 'to-amber/22',
    kickerColor: 'text-amber',
    ctaTo: 'oklch(0.72 0.15 55)',
    ctaTextColor: 'oklch(0.25 0.03 75)',
  },
] as const

export function PromoSection() {
  return (
    <section className="relative overflow-hidden px-6 py-16 md:px-10 md:py-20">
      <div className="relative mx-auto max-w-7xl">
        {/* Promo cards — Air Camp / Air Meeting w pierwszym rzędzie, Akronocki / Gravity Jam w drugim */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  background: `linear-gradient(135deg, ${card.accentColor}, ${'ctaTo' in card ? card.ctaTo : 'var(--accent)'})`,
                  boxShadow: `0 8px 24px color-mix(in oklch, ${card.accentColor} 30%, transparent)`,
                  ...('ctaTextColor' in card ? { color: card.ctaTextColor } : {}),
                }}
              >
                {card.cta}
                <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
