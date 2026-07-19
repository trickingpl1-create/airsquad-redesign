import Link from 'next/link'
import Image from 'next/image'
import { SectionHeader } from './section-header'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Basic',
    price: '150',
    period: '/mies.',
    desc: 'Idealny start — jedna grupa w tygodniu',
    features: [
      '1 trening / tydzień',
      'Zniżka 5% na obozy',
    ],
    accent: 'var(--border)',
    popular: false,
  },
  {
    name: 'Standard',
    price: '240',
    period: '/mies.',
    desc: 'Najczęściej wybierany — pełen rozwój',
    features: [
      '2 treningi / tydzień',
      'Zniżka 5% na obozy',
    ],
    accent: 'var(--primary)',
    popular: true,
  },
  {
    name: 'Premium',
    price: '290',
    period: '/mies.',
    desc: 'Dla pełnego zaangażowania',
    features: [
      '3 treningi / tydzień',
      'Zniżka 10% na obozy',
    ],
    accent: 'var(--cyan)',
    popular: false,
  },
] as const

const dropIn: ReadonlyArray<readonly [string, string, string]> = [
  ['Pojedynczy trening', '40 zł', '60 min zajęć'],
  ['Open Training', '40 zł', '90 min sesja'],
  ['Trening w małej grupie', '300 zł', '60 min · 2–3 osoby'],
  ['Pakiet 4 treningi', '270 zł', 'bez umowy'],
  ['Trial — pierwsze zajęcia', '40 zł', 'jednorazowo'],
]

interface PricingSectionProps {
  /** Ukrywa wskazane plany (dopasowanie po `name`, np. ['Premium']) — domyślnie widoczne wszystkie */
  hidePlans?: string[]
  /** Ukrywa wskazane wejścia jednorazowe (dopasowanie po nazwie, np. ['Open Training']) */
  hideDropIns?: string[]
  /** Gdy podany, przyciski planów prowadzą tu (np. formularz AIPAX danego miasta) zamiast /kontakt,
   *  a etykieta traci nazwę planu ("Wybierz" zamiast "Wybierz Standard") */
  enrolHref?: string
}

export function PricingSection({ hidePlans = [], hideDropIns = [], enrolHref }: PricingSectionProps = {}) {
  const visiblePlans = plans.filter((p) => !hidePlans.includes(p.name))
  const visibleDropIns = dropIn.filter(([name]) => !hideDropIns.includes(name))
  return (
    <section
      id="cennik"
      className="relative overflow-hidden bg-muted px-6 py-24 dark:bg-secondary md:px-10 md:py-32"
    >
      <div
        aria-hidden
        className="absolute -left-32 -top-32 h-[560px] w-[560px] rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 65%)' }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          kicker="Cennik"
          kickerColorClass="text-emerald"
          title="Wybierz"
          gradientPart="swój plan."
          titleFontWeight={500}
          gradientFontWeight={500}
        />

        <div
          className={cn(
            'mb-20 grid grid-cols-1 gap-4',
            visiblePlans.length >= 3 ? 'lg:grid-cols-3' : 'lg:mx-auto lg:max-w-3xl lg:grid-cols-2',
          )}
        >
          {visiblePlans.map((p) => (
            <div
              key={p.name}
              className="relative flex flex-col overflow-hidden rounded-3xl border-2 bg-card p-9"
              style={{
                borderColor: p.popular ? 'var(--primary)' : 'var(--border)',
                boxShadow: p.popular
                  ? '0 20px 60px oklch(0.55 0.28 295 / 0.2)'
                  : 'none',
              }}
            >
              {p.popular && (
                <div
                  className="absolute right-0 top-0 rounded-bl-2xl px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  }}
                >
                  Najpopularniejszy
                </div>
              )}
              <div
                aria-hidden
                className="halftone-overlay absolute -right-4 -top-4 h-28 w-28 opacity-[0.05]"
                style={{ color: p.accent }}
              />

              <h3 className="display-bold m-0 mb-1 text-3xl" style={{ fontWeight: 500 }}>{p.name}</h3>
              <p className="mb-6 text-sm text-muted-foreground">{p.desc}</p>

              <div className="mb-7">
                <span className="stat-number text-6xl text-foreground" style={{ fontWeight: 500 }}>{p.price}</span>
                <span className="ml-2 text-base text-muted-foreground">
                  zł{p.period}
                </span>
              </div>

              <ul className="m-0 mb-8 flex-1 list-none space-y-3 p-0">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-[13.5px] text-foreground/85"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 grid h-[18px] w-[18px] flex-shrink-0 place-items-center rounded-md text-[11px] font-black"
                      style={{
                        background: `color-mix(in oklch, ${p.accent} 13%, transparent)`,
                        border: `1px solid color-mix(in oklch, ${p.accent} 50%, transparent)`,
                        color: p.popular ? 'var(--violet-soft)' : 'var(--cyan)',
                      }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={enrolHref ?? '/kontakt'}
                {...(enrolHref ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="block rounded-2xl px-6 py-4 text-center text-sm font-bold tracking-tight text-foreground transition-transform hover:-translate-y-0.5"
                style={
                  p.popular
                    ? {
                        background:
                          'linear-gradient(135deg, var(--primary), var(--accent))',
                        boxShadow: '0 12px 30px oklch(0.58 0.24 290 / 0.3)',
                      }
                    : {
                        background: 'color-mix(in oklch, var(--foreground) 4%, transparent)',
                        border: '1px solid var(--border)',
                      }
                }
              >
                {enrolHref ? 'Wybierz' : `Wybierz ${p.name}`}
              </Link>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-amber md:text-xs">
            Wejścia jednorazowe
          </p>
          <h3 className="display-bold mt-3 text-balance text-3xl text-foreground md:text-4xl" style={{ fontWeight: 500 }}>
            Bez zobowiązań.
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleDropIns.map(([name, price, note]) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-6 py-5"
            >
              <div>
                <div className="display-bold text-base text-foreground" style={{ fontWeight: 500 }}>
                  {name}
                </div>
                <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {note}
                </div>
              </div>
              <span
                className={`stat-number text-2xl ${
                  price === '40 zł' ? 'text-cyan' : 'text-violet-soft'
                }`}
                style={{ fontWeight: 500 }}
              >
                {price}
              </span>
            </div>
          ))}
        </div>

        {/* Air Camp section */}
        <div className="mt-24 overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-emerald/10 to-cyan/10 p-10 md:p-14">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald md:text-xs">
                Letnie przygody
              </p>
              <h3 className="display-bold mt-3 text-3xl text-foreground md:text-4xl">
                Air Camp 2026
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                Cały dzień pełen aktywności — akrobatyka, longboard, kajaki, paintball i wiele więcej. Zajęcia dla dzieci i młodzieży w grupach do 20 osób.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/obozy"
                  className="rounded-full px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white"
                  style={{
                    background: 'linear-gradient(135deg, var(--emerald), var(--cyan))',
                  }}
                >
                  Sprawdź turnusy
                </Link>
                <Link
                  href="#aircamp"
                  className="rounded-full border border-emerald/40 bg-emerald/5 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-emerald hover:border-emerald/60"
                >
                  Dowiedz się więcej
                </Link>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <Image
                src="/images/aircamp-2026-logo.png"
                alt="Air Camp 2026 — Obóz sportowo-rekreacyjny"
                width={320}
                height={160}
                className="h-[120px] w-auto object-contain drop-shadow-[0_0_16px_rgba(16,185,129,0.3)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
