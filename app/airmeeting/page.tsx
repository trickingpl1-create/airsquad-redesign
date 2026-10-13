import Link from 'next/link'
import type { Metadata } from 'next'
import { Users, Gift, Bus, Check } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionHeader } from '@/components/home/section-header'
import { BackgroundVideo } from '@/components/background-video'
import { YouTubeFacade } from '@/components/youtube-facade'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import { CLUB_CONTACT } from '@/lib/content/cities'

// Dedykowana, stylizowana podstrona Air Meeting (slug /airmeeting) — zastępuje
// generyczny EventView, spójny wygląd z resztą serwisu + hero z filmem w tle
// (decyzja 2026-10-13). /airmeeting to CHRONIONY historyczny URL (SEO), dlatego:
//  • AIRMEETING_EVENT ZOSTAJE w FALLBACK_EVENTS — zasila listę /wydarzenia i sitemapę,
//  • z app/[slug]/generateStaticParams WYKLUCZAMY 'airmeeting' (ten jawny route ma
//    pierwszeństwo; bez wykluczenia build eksportu wywala zdublowaną ścieżkę).
const HERO_YOUTUBE_ID = 'w4_uA0wOyak'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Air Meeting — klubowy zlot akrobatyczny',
  description:
    'Air Meeting — doroczny zlot klubu Air Squad: wspólne warsztaty akrobatyki, tumblingu, trickingu i szarf, wewnętrzne zawody, medale i integracja wszystkich sekcji. Edycja 2027 w przygotowaniu.',
  canonical: '/airmeeting/',
  keywords: 'air meeting, air squad, zlot akrobatyczny, zawody klubowe, integracja',
})

const PROGRAM = [
  {
    num: '01',
    title: 'Warsztaty w sześciu dyscyplinach',
    desc: 'Tumbling, akrobatyka, tricking, taniec, szarfy i longboardy. Uczestnicy sami wybierają, w czym biorą udział.',
    accent: 'var(--cyan)',
  },
  {
    num: '02',
    title: 'Wewnętrzne zawody',
    desc: 'Rywalizacja w gronie klubowiczów, zakończona dekoracją. Udział dobrowolny — zgłoszenia u trenera.',
    accent: 'var(--violet-soft)',
  },
  {
    num: '03',
    title: 'Integracja wszystkich sekcji',
    desc: 'Wspólna rozgrzewka, gry i konkursy. Okazja, żeby poznać osoby trenujące w pozostałych miastach.',
    accent: 'var(--primary)',
  },
] as const

// Przebieg dnia 1:1 z oryginalnej strony (blok „PLAN WYDARZENIA" starego WP).
const SCHEDULE: { time: string; title: string; desc?: string }[] = [
  { time: '9:00', title: 'Rozpoczęcie wydarzenia', desc: 'Rejestracja uczestników.' },
  { time: '9:30', title: 'Wspólna rozgrzewka' },
  { time: '10:00', title: 'Warsztaty — blok I', desc: 'Akrobatyka / tumbling / szarfy / tricking.' },
  { time: '11:00', title: 'Warsztaty — blok II', desc: 'Akrobatyka / tumbling / szarfy / tricking.' },
  { time: '12:30', title: 'Przerwa obiadowa', desc: 'Animacje i konkursy.' },
  { time: '14:30', title: 'Rozpoczęcie zawodów' },
  { time: '17:00', title: 'Wolny trening', desc: 'Konkursy.' },
  { time: '17:30', title: 'Dekoracja' },
  { time: '18:00', title: 'Zakończenie wydarzenia' },
]

const INCLUDES = [
  'Udział w warsztatach',
  'Wewnętrzne zawody',
  'Ciepły posiłek',
  'Pamiątkowy medal',
  'Koszulka AIR MEETING',
  'Gadżety niespodzianki',
] as const

const SHIRT_SIZES = [
  '7–8 · 128–134',
  '9–11 · 134–140',
  '12–14 · 146–152',
  'XS',
  'S',
  'M',
] as const

export default function AirMeetingPage() {
  const telHref = `tel:+48${CLUB_CONTACT.phoneTrainer.replace(/\s/g, '')}`

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* HERO z filmem w tle — wideo wypełnia cały obszar sekcji */}
        <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-background">
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 'max(100vw, calc(100vh * 16 / 9))',
                height: 'max(100vh, calc(100vw * 9 / 16))',
              }}
            >
              <BackgroundVideo
                youtubeId={HERO_YOUTUBE_ID}
                className="absolute inset-0 h-full w-full border-0"
                title="Air Meeting — tło wideo"
              />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, color-mix(in oklch, var(--background) 82%, transparent) 0%, color-mix(in oklch, var(--background) 34%, transparent) 42%, transparent 70%), linear-gradient(180deg, transparent 58%, color-mix(in oklch, var(--background) 68%, transparent) 88%, var(--background) 100%)',
              }}
            />
            <div
              aria-hidden
              className="halftone-overlay absolute inset-0 text-cyan opacity-[0.05]"
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 md:px-10 md:py-28">
            <SectionHeader
              as="h1"
              kicker="Wydarzenie klubowe"
              kickerColorClass="text-cyan"
              title="Air Meeting"
              gradientPart="zlot klubu."
              titleFontWeight={400}
              gradientFontWeight={400}
              tone="on-photo"
              className="mb-6"
            />

            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan" />
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white/90">
                Edycja 2027 w przygotowaniu
              </span>
            </div>

            <p className="max-w-2xl text-lg leading-relaxed text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
              Doroczny zlot całego klubu Air Squad: wspólne warsztaty, wewnętrzne
              zawody, medale i mnóstwo pozytywnej energii. Jedno spotkanie, na
              którym poznajesz osoby z pozostałych sekcji.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={telHref}
                className="rounded-full bg-gradient-to-r from-cyan to-primary px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white transition-transform hover:scale-[1.03]"
              >
                Zapytaj o termin
              </a>
              <Link
                href="/kontakt/"
                className="rounded-full border border-white/25 bg-white/5 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-colors hover:border-cyan/60 hover:text-cyan"
              >
                Kontakt ↗
              </Link>
            </div>
          </div>
        </section>

        {/* WIĘCEJ INFORMACJI — karta kontaktowa zamiast placeholderów
            Data/Miejsce/Dojazd (duplikat karty CTA z dołu strony). */}
        <section className="relative px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-6xl rounded-3xl border border-cyan/30 bg-gradient-to-br from-cyan/15 to-primary/10 p-6 md:p-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
              Więcej informacji
            </p>
            <h2
              className="display-bold mt-2 text-2xl text-foreground md:text-3xl"
              style={{ fontWeight: 400 }}
            >
              Edycja 2027 w przygotowaniu.
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
              Udział w Air Meeting zgłaszasz u swojego trenera. Daty, miejsce i
              szczegóły dojazdu najbliższej edycji podamy wkrótce — zapytaj
              trenera albo odezwij się do nas bezpośrednio.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm">
              <a href={telHref} className="text-cyan hover:underline">
                ☎ {CLUB_CONTACT.phoneTrainer} (trener)
              </a>
              <a
                href={`mailto:${CLUB_CONTACT.email}`}
                className="text-cyan hover:underline"
              >
                {CLUB_CONTACT.email}
              </a>
            </div>
          </div>
        </section>

        {/* CO TO JEST AIR MEETING — program */}
        <section className="relative px-6 py-10 md:px-10 md:py-14">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              kicker="Jak wygląda Air Meeting"
              kickerColorClass="text-violet-soft"
              title="Warsztaty, zawody"
              gradientPart="i integracja."
              titleFontWeight={400}
              gradientFontWeight={400}
              className="mb-8 md:mb-10"
            />
            <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">
              Air Meeting to przepełnione pozytywną energią spotkanie dla członków
              klubu. W programie wspólny trening, gry i zabawy integracyjne,
              wewnętrzne zawody oraz posiłek dla każdego uczestnika. Każdy dostaje
              pamiątkowy medal, a oprócz koszulki — meetingowe gadżety niespodzianki.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {PROGRAM.map((p) => (
                <div
                  key={p.num}
                  className="rounded-3xl border border-border bg-card p-6 md:p-7"
                >
                  <span
                    className="font-[family-name:var(--font-display)] text-4xl leading-none md:text-5xl"
                    style={{ color: p.accent, fontWeight: 400 }}
                  >
                    {p.num}
                  </span>
                  <h3
                    className="display-bold mt-4 text-xl text-foreground md:text-2xl"
                    style={{ fontWeight: 400 }}
                  >
                    {p.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROGRAM DNIA — harmonogram z poprzednich edycji */}
        <section className="relative px-6 py-10 md:px-10 md:py-14">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              kicker="Przebieg dnia"
              kickerColorClass="text-violet-soft"
              title="Program"
              gradientPart="wydarzenia."
              titleFontWeight={400}
              gradientFontWeight={400}
              className="mb-8 md:mb-10"
            />
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              {SCHEDULE.map((s) => (
                <div
                  key={s.time}
                  className="flex gap-4 border-b border-border/60 px-5 py-4 last:border-b-0 md:px-7"
                >
                  <span className="w-16 shrink-0 font-mono text-sm font-bold text-cyan">
                    {s.time}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{s.title}</p>
                    {s.desc && (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {s.desc}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Przykładowy przebieg z poprzednich edycji — dokładny harmonogram
              edycji 2027 podamy wkrótce.
            </p>
          </div>
        </section>

        {/* DLA KOGO / CO OTRZYMUJESZ / DOJAZD */}
        <section className="relative px-6 py-10 md:px-10 md:py-14">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 md:grid-cols-3">
            {/* Dla kogo */}
            <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-colors hover:border-cyan/40 md:p-7">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 bg-cyan/70"
              />
              <span className="inline-grid h-11 w-11 place-items-center rounded-2xl bg-cyan/15 text-cyan">
                <Users className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
                Dla kogo
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Dla osób trenujących w klubie. Grupy naborowe zapraszamy na
                kolejną edycję za rok — pierwszy sezon to czas na oswojenie się z
                treningami. Udział w zawodach jest dobrowolny; chętni zgłaszają
                się do swojego trenera.
              </p>
            </div>

            {/* Co otrzymujesz */}
            <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-colors hover:border-violet-soft/40 md:p-7">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 bg-violet-soft/70"
              />
              <span className="inline-grid h-11 w-11 place-items-center rounded-2xl bg-violet-soft/15 text-violet-soft">
                <Gift className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
                Co otrzymujesz
              </p>
              <ul className="mt-3 space-y-2">
                {INCLUDES.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-foreground/90"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  <span className="text-foreground">Płatność</span> u trenera
                  prowadzącego, najpóźniej 3 dni przed wydarzeniem.
                </p>
                <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Rozmiary koszulek
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {SHIRT_SIZES.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Dojazd */}
            <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-colors hover:border-emerald/40 md:p-7">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 bg-emerald/70"
              />
              <span className="inline-grid h-11 w-11 place-items-center rounded-2xl bg-emerald/15 text-emerald">
                <Bus className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald">
                Dojazd
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Z Jasła i Dębicy organizujemy wspólny dojazd autobusem z
                trenerami. Szczegóły u trenerów prowadzących.
              </p>
              <a
                href={telHref}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-4 py-2 font-mono text-xs font-bold tracking-[0.08em] text-emerald transition-colors hover:bg-emerald/20"
              >
                ☎ {CLUB_CONTACT.phoneTrainer}
              </a>
            </div>
          </div>
        </section>

        {/* POPRZEDNIE EDYCJE — 2026 / 2025 (filmy) + 2024 (film wkrótce) */}
        <section className="relative px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              kicker="Z poprzednich lat"
              kickerColorClass="text-cyan"
              title="Poprzednie"
              gradientPart="edycje."
              titleFontWeight={400}
              gradientFontWeight={400}
              className="mb-8 md:mb-10"
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* 2026 — z filmem */}
              <div>
                <div className="aspect-video overflow-hidden rounded-3xl border border-border bg-black">
                  <YouTubeFacade
                    youtubeId="w4_uA0wOyak"
                    title="Air Meeting 2026 — film"
                    ccLang="pl"
                  />
                </div>
                <h3
                  className="display-bold mt-5 text-2xl text-foreground"
                  style={{ fontWeight: 400 }}
                >
                  Air Meeting 2026
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Najnowsza edycja — warsztaty, zawody i wspólne emocje całego
                  klubu. Zobacz, jak było.
                </p>
              </div>

              {/* 2025 — z filmem */}
              <div>
                <div className="aspect-video overflow-hidden rounded-3xl border border-border bg-black">
                  <YouTubeFacade
                    youtubeId="uFobcH0aQ7g"
                    title="Air Meeting 2025 — film"
                    ccLang="pl"
                  />
                </div>
                <h3
                  className="display-bold mt-5 text-2xl text-foreground"
                  style={{ fontWeight: 400 }}
                >
                  Air Meeting 2025
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Wspólne warsztaty, wewnętrzne zawody i integracja wszystkich
                  sekcji. Zobacz, jak było — film z edycji 2025.
                </p>
              </div>

              {/* 2024 — film wkrótce */}
              <div>
                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-3xl border border-dashed border-border bg-card">
                  <span className="px-6 text-center font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Film wkrótce
                  </span>
                </div>
                <h3
                  className="display-bold mt-5 text-2xl text-foreground"
                  style={{ fontWeight: 400 }}
                >
                  Air Meeting 2024
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Kolejna edycja pełna emocji, zawodów i wspólnej zabawy. Materiał
                  wideo dodamy, gdy tylko go odnajdziemy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
