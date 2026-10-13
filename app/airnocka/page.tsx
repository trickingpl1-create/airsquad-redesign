import Link from 'next/link'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionHeader } from '@/components/home/section-header'
import { BackgroundVideo } from '@/components/background-video'
import { YouTubeFacade } from '@/components/youtube-facade'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import { CLUB_CONTACT } from '@/lib/content/cities'

// Dedykowana, stylizowana podstrona AkroNocek (slug /airnocka) — zastępuje
// generyczny EventView, bo klient chciał hero z filmem w tle i layout spójny
// z resztą serwisu (decyzja 2026-10-13). Dlatego AIRNOCKA_EVENT NIE jest już
// w FALLBACK_EVENTS — ten jawny route ma pierwszeństwo nad [slug], a dublowanie
// ścieżki wywaliłoby build eksportu statycznego. Wpis w sitemapie dodany ręcznie
// (app/sitemap.ts). Strona evergreen: bez stałej daty, kieruje do trenera.
const YOUTUBE_ID = 'HDsJ4MABaCk'

export const metadata: Metadata = generateSEOMetadata({
  title: 'AkroNocki — klubowa noc na sali treningowej',
  description:
    'AkroNocki Air Squad — noc na sali dla członków klubu: wieczorny i poranny trening, integracja, dyskoteka, karaoke i wspólny film. Zapytaj trenera o najbliższy termin.',
  canonical: '/airnocka/',
  keywords: 'akronocki, air squad, noc na sali, integracja klubowa, akrobatyka',
})

const ATTRACTIONS = [
  {
    num: '01',
    title: 'Trening wieczorem i rano',
    desc: 'Dwie luźniejsze, zabawowe sesje na macie w gronie klubowiczów — bez presji, za to z dużą dawką frajdy.',
    accent: 'var(--blue-deep)',
  },
  {
    num: '02',
    title: 'Dyskoteka i karaoke',
    desc: 'Gdy kończymy ćwiczyć, sala zamienia się w parkiet. Muzyka, taniec i wspólne karaoke do późna.',
    accent: 'var(--violet-soft)',
  },
  {
    num: '03',
    title: 'Wspólny film i nocowanie',
    desc: 'Seans z przekąskami i nocleg na sali. Rano śniadanie i druga sesja treningu przed powrotem do domu.',
    accent: 'var(--cyan)',
  },
] as const

const BRING = [
  'śpiwór',
  'karimata lub materac',
  'wygodny strój do ćwiczeń',
  'przybory toaletowe',
  'dobry humor',
] as const

export default function AirNockaPage() {
  const telHref = `tel:+48${CLUB_CONTACT.phoneTrainer.replace(/\s/g, '')}`

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* HERO z filmem w tle */}
        <section className="relative overflow-hidden bg-background">
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 'max(100vw, calc(100vh * 16 / 9))',
                height: 'max(100vh, calc(100vw * 9 / 16))',
              }}
            >
              <BackgroundVideo
                youtubeId={YOUTUBE_ID}
                className="absolute inset-0 h-full w-full border-0 opacity-95"
                title="AkroNocki — tło wideo"
              />
            </div>
            {/* Przyciemnienie — ku dołowi wtapia się w tło strony */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, color-mix(in oklch, var(--background) 55%, transparent) 0%, color-mix(in oklch, var(--background) 32%, transparent) 42%, color-mix(in oklch, var(--background) 92%, transparent) 88%, var(--background) 100%), linear-gradient(90deg, color-mix(in oklch, var(--background) 72%, transparent) 0%, transparent 62%)',
              }}
            />
            <div
              aria-hidden
              className="halftone-overlay absolute inset-0 text-blue-deep opacity-[0.05]"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-40 md:px-10 md:pb-28 md:pt-52">
            <SectionHeader
              as="h1"
              kicker="Wydarzenie klubowe"
              kickerColorClass="text-cyan"
              title="AkroNocki"
              gradientPart="noc na sali."
              titleFontWeight={400}
              gradientFontWeight={400}
              tone="on-photo"
              className="mb-6"
            />
            <p className="max-w-2xl text-lg leading-relaxed text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
              Cała noc spędzona razem na sali treningowej. Wieczorem i rano
              trenujemy, a między sesjami jest czas na dyskotekę, karaoke i
              wspólny film. Wydarzenie tylko dla członków klubu Air Squad.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={telHref}
                className="rounded-full bg-gradient-to-r from-blue-deep to-violet-soft px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white transition-transform hover:scale-[1.03]"
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

        {/* ATRAKCJE */}
        <section className="relative px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              kicker="Co robimy na AkroNockach"
              kickerColorClass="text-blue-deep"
              title="Atrakcje"
              gradientPart="i zajęcia."
              titleFontWeight={400}
              gradientFontWeight={400}
              className="mb-8 md:mb-10"
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {ATTRACTIONS.map((a) => (
                <div
                  key={a.num}
                  className="rounded-3xl border border-border bg-card p-6 md:p-7"
                >
                  <span
                    className="font-[family-name:var(--font-display)] text-4xl leading-none md:text-5xl"
                    style={{ color: a.accent, fontWeight: 400 }}
                  >
                    {a.num}
                  </span>
                  <h3
                    className="display-bold mt-4 text-xl text-foreground md:text-2xl"
                    style={{ fontWeight: 400 }}
                  >
                    {a.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {a.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CO ZABRAĆ + termin */}
        <section className="relative px-6 pb-12 md:px-10 md:pb-16">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 md:grid-cols-5">
            <div className="rounded-3xl border border-border bg-card p-6 md:col-span-2 md:p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
                Co zabrać
              </p>
              <ul className="mt-5 space-y-3">
                {BRING.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-foreground/90"
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-deep"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-blue-deep/30 bg-gradient-to-br from-blue-deep/20 to-violet-soft/10 p-6 md:col-span-3 md:p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-blue-deep">
                Kiedy najbliższa AkroNocka?
              </p>
              <h2
                className="display-bold mt-2 text-2xl text-foreground md:text-3xl"
                style={{ fontWeight: 400 }}
              >
                Terminy ogłaszamy sezonowo.
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                Każde miasto ma własny kalendarz. Zapytaj swojego trenera o
                najbliższą AkroNockę albo odezwij się do nas bezpośrednio.
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
          </div>
        </section>

        {/* FILM */}
        <section className="relative px-6 pb-24 md:px-10 md:pb-32">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              kicker="Zobacz na żywo"
              kickerColorClass="text-violet-soft"
              title="AkroNocki"
              gradientPart="w obiektywie."
              titleFontWeight={400}
              gradientFontWeight={400}
              className="mb-8 md:mb-10"
            />
            <div className="aspect-video overflow-hidden rounded-3xl border border-border bg-black">
              <YouTubeFacade youtubeId="HDsJ4MABaCk" title="AkroNocki — film" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
