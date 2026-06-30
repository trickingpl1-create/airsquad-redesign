import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Air Camp 2026 — Obóz sportowo-rekreacyjny',
  description: 'Letni obóz Air Squad — akrobatyka, longboard, kajaki, paintball. Zapisy dla dzieci i młodzieży.',
  openGraph: {
    title: 'Air Camp 2026 — Obóz sportowo-rekreacyjny',
    description: 'Letni obóz Air Squad — akrobatyka, longboard, kajaki, paintball.',
    images: [{ url: '/images/aircamp-2026-logo.png' }],
  },
}

export default function AircampPage() {
  return (
    <>
      {/* Hero with logo */}
      <section className="relative overflow-hidden bg-background px-6 py-32 md:px-10 md:py-48">
        <div
          aria-hidden
          className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, var(--emerald) 0%, transparent 70%)',
          }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/aircamp-2026-logo.png"
              alt="Air Camp 2026"
              width={400}
              height={200}
              className="h-[160px] w-auto object-contain drop-shadow-[0_0_24px_rgba(16,185,129,0.4)]"
              priority
            />
          </div>

          <h1 className="display-bold text-4xl text-foreground md:text-6xl">
            Letnie przygody z{' '}
            <span className="bg-gradient-to-r from-emerald to-cyan bg-clip-text text-transparent">
              Air Squad
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
            Wiosenna/letnia przygoda dla dzieci i młodzieży. Dni pełne akrobatyki, longboardu, kajaka, paintballa i wiele
            więcej. Profesjonalni trenerzy, bezpieczne maty AirTrack i niezapomniane wspomnienia.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/obozy"
              className="rounded-full px-8 py-4 font-mono text-sm font-bold uppercase tracking-[0.1em] text-white"
              style={{
                background: 'linear-gradient(135deg, var(--emerald), var(--cyan))',
              }}
            >
              Zarezerwuj turnus
            </Link>
            <Link
              href="/#aircamp"
              className="rounded-full border-2 border-emerald/40 px-8 py-4 font-mono text-sm font-bold uppercase tracking-[0.1em] text-emerald hover:border-emerald/60 hover:bg-emerald/5"
            >
              Wróć do strony głównej
            </Link>
          </div>
        </div>
      </section>

      {/* Info grid */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="mb-4 text-4xl">🏕️</div>
              <h3 className="display-bold text-2xl text-foreground">Terminy 2026</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Turnusy od czerwca do sierpnia. Nowe terminy co tydzień dla różnych grup wiekowych.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="mb-4 text-4xl">👥</div>
              <h3 className="display-bold text-2xl text-foreground">Małe grupy</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Do 20 osób w grupie, dwóch doświadczonych trenerów na każdy turnus.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="mb-4 text-4xl">🎯</div>
              <h3 className="display-bold text-2xl text-foreground">6 dyscyplin</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Akrobatyka, tricking, longboard, kajaki, paintball, show dance i wiele więcej.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:px-10">
        <div
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-12 text-center text-white md:p-16"
          style={{
            background: 'linear-gradient(135deg, var(--emerald) 0%, var(--cyan) 100%)',
          }}
        >
          <h2 className="display-bold text-4xl md:text-5xl">Gotowy na przygodę?</h2>
          <p className="mt-4 text-lg opacity-90">
            Wybierz turnus, zarezerwuj miejsce i dołącz do najlepszego obozu na Podkarpaciu.
          </p>
          <Link
            href="/obozy"
            className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-mono text-sm font-bold uppercase tracking-[0.1em] text-emerald hover:opacity-90"
          >
            Sprawdź turnusy →
          </Link>
        </div>
      </section>
    </>
  )
}
