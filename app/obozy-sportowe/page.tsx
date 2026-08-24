import Link from 'next/link'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionHeader } from '@/components/home/section-header'
import { generateSEOMetadata } from '@/lib/seo/metadata'

// Historyczny URL WordPressa, w docs/03-mapa-url.md oznaczony jako „zachowany
// hub obozów". Musi zwracać 200, ale nie może powielać treści `/obozy/` ani
// `/letni/` — duplikat kanibalizowałby własne wyniki. Dlatego krótki rozjazd
// do właściwych stron, z canonicalem na siebie (to ten adres ma historyczną
// widoczność w Google).
export const metadata: Metadata = generateSEOMetadata({
  title: 'Obozy sportowe',
  description:
    'Obozy sportowe Air Squad — Air Camp z akrobatyką, kajakami, longboardami i paintballem. Sprawdź terminy najbliższego turnusu i pozostałe wydarzenia klubu.',
  canonical: '/obozy-sportowe/',
  keywords: 'obozy sportowe, obóz akrobatyczny, Air Camp, obóz letni Podkarpacie',
})

const LINKS = [
  {
    href: '/letni/',
    label: 'Air Camp',
    desc: 'Letni obóz sportowo-rekreacyjny — akrobatyka i tricking, kajaki i SUP, longboardy, paintball. Kadra trenerska klubu, opieka całodobowa.',
  },
  {
    href: '/obozy/',
    label: 'Wszystkie turnusy',
    desc: 'Pełna lista obozów z terminami, cenami i liczbą wolnych miejsc.',
  },
  {
    href: '/airmeeting/',
    label: 'Air Meeting',
    desc: 'Zlot akrobatyczny klubu — spotkanie, zawody i wspólne emocje.',
  },
] as const

export default function SportsCampsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <SectionHeader
            kicker="Obozy"
            kickerColorClass="text-emerald"
            title="Obozy sportowe"
            gradientPart="Air Squad."
            titleFontWeight={400}
            gradientFontWeight={400}
          />

          <p className="-mt-4 mb-10 max-w-2xl leading-relaxed text-muted-foreground">
            Organizujemy obozy nieprzerwanie od 2016 roku. Sport i ruch zamiast
            siedzenia w stołówce, małe grupy i kadra, która zna dzieciaki
            z cotygodniowych treningów.
          </p>

          <div className="grid grid-cols-1 gap-3">
            {LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-violet-soft/50"
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="display-bold text-xl text-foreground md:text-2xl"
                    style={{ fontWeight: 500 }}
                  >
                    {item.label}
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-sm text-muted-foreground transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
                <p className="mb-0 mt-2 leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
