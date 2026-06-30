import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 40%, oklch(0.38 0.18 290 / 0.16), transparent)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/airsquad-logo.png"
            alt="Air Squad"
            width={180}
            height={86}
            className="h-[72px] w-auto object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.55)]"
            priority
          />
        </Link>

        {/* 404 number */}
        <div
          className="font-[family-name:var(--font-display)] text-[9rem] leading-none md:text-[12rem]"
          style={{
            fontWeight: 400,
            background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-violet-soft">
            Strona nie istnieje
          </p>
          <h1 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
            Wygląda na to, że ta strona zrobiła salto i zniknęła.
          </h1>
          <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Nie ma tu nic do zobaczenia. Wróć na stronę główną i znajdź swoje zajęcia.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            }}
          >
            Wróc na start
          </Link>
          <Link
            href="/lokalizacje"
            className="flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.1em] text-foreground transition-colors hover:border-foreground/40"
          >
            Znajdź lokalizację
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
