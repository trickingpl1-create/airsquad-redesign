import Link from 'next/link'

const promoCards = [
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
    fullWidth: true,
  },
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
] as const

export function PromoSection() {
  return (
    <section className="relative overflow-hidden px-6 py-12 md:px-10 md:py-16">
      <div className="relative mx-auto max-w-7xl">
        {/* Promo cards — AkroNocki na całą szerokość, Air Camp / Air Meeting pod spodem */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {promoCards.map((card) => (
            <div
              key={card.title}
              className={`relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} p-6 md:p-8 ${
                'fullWidth' in card ? 'md:col-span-2' : ''
              }`}
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
              
              <h3 className="display-bold mt-2.5 text-2xl text-foreground md:text-3xl" style={{ fontWeight: 500 }}>
                {card.title}
              </h3>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                {card.desc}
              </p>

              <Link
                href={card.href}
                className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground transition-transform hover:-translate-y-0.5"
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
      </div>
    </section>
  )
}
