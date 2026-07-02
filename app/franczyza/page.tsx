import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Handshake, MapPin, TrendingUp, Phone } from 'lucide-react'

// Nowa strona (dokładana, nie zastępuje żadnego chronionego URL-a z docs/03-mapa-url.md).
export const metadata: Metadata = {
  title: 'Franczyza — otwórz salę Air Squad',
  description:
    'Otwórz salę akrobatyczną Air Squad w swoim mieście. Sprawdzony model treningowy, rozpoznawalna marka na Podkarpaciu i wsparcie na start.',
  alternates: { canonical: '/franczyza/' },
}

const BENEFITS = [
  {
    icon: Handshake,
    title: 'Sprawdzony model',
    desc: 'Ponad 20 lat doświadczenia, program treningowy od 4 do 99 lat i marka rozpoznawalna w regionie.',
  },
  {
    icon: MapPin,
    title: 'Wsparcie na start',
    desc: 'Pomoc w wyborze sali i sprzętu (maty AirTrack), szkolenie kadry, materiały marketingowe i system zapisów.',
  },
  {
    icon: TrendingUp,
    title: 'Region rośnie',
    desc: 'Siedem działających lokalizacji i rosnący popyt na zajęcia akrobatyczne dla dzieci. Twoje miasto może być następne.',
  },
] as const

export default function FranczyzaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pt-24">
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-emerald/20 via-background to-background">
          <div className="container relative mx-auto px-4 py-20 md:py-24">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald md:text-xs">
              Twoje miasto? // Franczyza
            </p>
            <h1 className="display-bold mt-4 max-w-3xl text-5xl text-foreground md:text-6xl">
              Otwórz salę <span className="gradient-text">Air Squad</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Prowadzisz salę, klub sportowy albo chcesz zbudować coś od zera?
              Dołącz do sieci Air Squad — pomożemy Ci wystartować z akrobatyką
              w Twoim mieście.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-3xl border border-border bg-card p-7"
              >
                <benefit.icon className="h-7 w-7 text-emerald" aria-hidden />
                <h2 className="display-bold mt-4 text-xl text-foreground">
                  {benefit.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 flex max-w-5xl flex-col items-start justify-between gap-6 rounded-3xl border border-dashed border-emerald/50 bg-emerald/5 p-8 md:flex-row md:items-center">
            <div>
              <h2 className="display-bold text-2xl text-foreground">
                Porozmawiajmy o Twoim mieście
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Napisz lub zadzwoń — opowiemy, jak wygląda start krok po kroku.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:+48728559101"
                className="inline-flex items-center gap-2 rounded-full bg-emerald px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-emerald-950 transition-transform hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" aria-hidden />
                728 559 101
              </a>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-emerald hover:text-emerald"
              >
                Formularz kontaktowy <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
