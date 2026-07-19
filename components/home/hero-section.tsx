import Link from 'next/link'
import Image from 'next/image'
import { Instagram } from 'lucide-react'

const YOUTUBE_ID = 'uFobcH0aQ7g'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background video — fixed do viewportu: podczas przewijania hero video zostaje
          "przyklejone" w miejscu (paralaksa), zapętlone i odtwarzane bez przerwy; kolejne,
          nieprzezroczyste sekcje strony naturalnie zasłaniają je, gdy scrollujesz dalej. */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.4]"
          style={{
            width: 'max(100vw, calc(100vh * 16 / 9))',
            height: 'max(100vh, calc(100vw * 9 / 16))',
          }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&playsinline=1&start=9&end=25`}
            allow="autoplay; encrypted-media"
            className="absolute inset-0 h-full w-full border-0 opacity-80"
            title="Air Squad background video"
          />
        </div>

        {/* Darkening overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, var(--background) 0%, color-mix(in oklch, var(--background) 78%, transparent) 40%, color-mix(in oklch, var(--background) 12%, transparent) 100%), linear-gradient(180deg, transparent 0%, color-mix(in oklch, var(--background) 40%, transparent) 70%, var(--background) 100%)',
          }}
        />
      </div>

      {/* Halftone texture + brand blobs — zostają przypisane do samej sekcji hero (przewijają się razem z nią) */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div
          aria-hidden
          className="halftone-overlay absolute inset-0 text-primary opacity-[0.04]"
        />
        <div
          aria-hidden
          className="absolute -right-32 -top-32 h-[720px] w-[720px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, var(--primary) 0%, transparent 65%)',
          }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-40 h-[540px] w-[540px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* LEFT — heading & CTAs */}
          <div>
            {/* Hero logo */}
            <div className="mb-6">
              <Image
                src="/images/airsquad-logo.png"
                alt="Air Squad"
                width={240}
                height={114}
                className="h-[90px] w-auto object-contain drop-shadow-[0_0_24px_rgba(168,85,247,0.6)]"
                priority
              />
            </div>

            {/* Season badge */}
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-foreground/20 bg-foreground/5 px-5 py-2.5 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald" />
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/90">
                SEZON 2025/26 · ZAPISY OTWARTE
              </span>
            </div>

            {/* Main heading — italic gradient like v16 */}
            <h1 className="m-0">
              <span
                className="display-italic block text-[3.5rem] leading-[0.95] text-foreground sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem]"
                style={{
                  fontWeight: 400,
                }}
              >
                Akrobatyka.
              </span>
              <span
                className="block text-[3.5rem] leading-[0.95] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem]"
                style={{
                  fontFamily: 'var(--font-covered-by-your-grace)',
                  letterSpacing: '0.025em',
                  background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Tricking.
              </span>
            </h1>

            {/* Subheading — italic with cyan accent */}
            <p className="mt-6 text-2xl font-bold italic text-foreground md:text-3xl">
              Klub gdzie uczysz się{' '}
              <span className="text-cyan">latać</span>.
            </p>

            {/* Description */}
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Akrobatyka, tricking, longboard i tumbling — dla dzieci od 7 lat,
              młodzieży i dorosłych. Małe grupy, dwóch trenerów, profesjonalne
              maty AirTrack. Siedem miast na Podkarpaciu.
            </p>

            {/* CTA buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-3 md:gap-4">
              {/* Air Camp badge */}
              <Link
                href="#aircamp"
                className="inline-flex items-center gap-2 rounded-full border border-emerald/40 bg-emerald/5 px-4 py-2.5 backdrop-blur-sm"
              >
                <Image
                  src="/images/aircamp-2026-logo.png"
                  alt="Air Camp 2026"
                  width={80}
                  height={40}
                  className="h-[24px] w-auto object-contain"
                />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-emerald">
                  Zarejestruj się
                </span>
              </Link>

              <Link
                href="/kontakt"
                className="rounded-full px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground shadow-[0_12px_32px_oklch(0.58_0.24_290/0.35)] transition-transform hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                }}
              >
                ZAPISZ SIĘ NA ZAJĘCIA
              </Link>
              <Link
                href="/grafik"
                className="flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground/40 hover:bg-foreground/10"
              >
                SPRAWDŹ GRAFIK
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* RIGHT — stat cards stack */}
          <div className="flex flex-col gap-4">
            {/* Big cyan card — DYSCYPLINY W KLUBIE */}
            <div
              className="relative min-h-48 overflow-hidden rounded-3xl p-8 text-white md:min-h-56 md:p-10"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
              }}
            >
              {/* Semi-transparent background image */}
              <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center opacity-35"
                style={{
                  backgroundImage:
                    "url('/images/old-site/dzieci-airtrack.jpg')",
                }}
              />
              {/* Dashed circle decoration */}
              <div
                aria-hidden
                className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full border-2 border-dashed border-white/30"
              />
              <div className="relative">
              <div
                style={{ fontFamily: 'var(--font-covered-by-your-grace)', letterSpacing: '0.025em' }}
                className="text-[16px] font-bold uppercase text-white/80"
              >
                SEKCJE TRENINGOWE
              </div>
                <div className="mt-3 font-[family-name:var(--font-display)] text-7xl font-black text-white md:text-8xl" style={{ fontWeight: 400 }}>
                  06
                </div>
                <div className="mt-3 max-w-xs text-sm leading-relaxed text-white/80">
                  Akrobatyka · Tricking · Longboard · Tumbling · Showdance · Snowboard
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Cyan stat — LOKALIZACJE */}
              <div
                className="relative min-h-40 overflow-hidden rounded-3xl p-6 text-foreground"
                style={{
                  background: 'linear-gradient(135deg, #06d6ff 0%, #00d9ff 100%)',
                }}
              >
                {/* Semi-transparent background image */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{
                    backgroundImage:
                      "url('/images/old-site/hala-airspace.jpg')",
                  }}
                />
                <div className="relative">
                  <div
                    style={{ fontFamily: 'var(--font-covered-by-your-grace)', letterSpacing: '0.025em' }}
                    className="text-[16px] font-bold uppercase text-white/75"
                  >
                    LOKALIZACJE
                  </div>
                  <div className="mt-2 font-[family-name:var(--font-display)] text-6xl font-black text-white" style={{ fontWeight: 400 }}>
                    8
                  </div>
                  <div className="mt-1 text-xs text-white/75">
                    miast na Podkarpaciu
                  </div>
                </div>
              </div>

              {/* Purple/violet stat — Instagram */}
              <a
                href="https://instagram.com/airsquad_akrobatyka"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative min-h-40 overflow-hidden rounded-3xl p-6 text-foreground transition-transform hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #1a1a3e 0%, #2d1b4e 100%)',
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{
                    backgroundImage: "url('/images/hero/instagram.jpg')",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1), transparent 60%)',
                  }}
                />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div
                      style={{ fontFamily: 'var(--font-covered-by-your-grace)', letterSpacing: '0.025em' }}
                      className="text-[16px] font-bold uppercase text-white/75"
                    >
                      Instagram
                    </div>
                    <Instagram aria-hidden className="h-5 w-5 text-white/60 transition-colors group-hover:text-white" />
                  </div>
                  <div>
                    <div className="font-[family-name:var(--font-display)] text-3xl font-black text-white" style={{ fontWeight: 400 }}>
                      @airsquad
                    </div>
                    <div className="mt-1 text-xs text-white/75">
                      Zobacz nasz profil →
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
