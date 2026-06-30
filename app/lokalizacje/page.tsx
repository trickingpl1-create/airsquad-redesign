import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MapPin, Navigation, Phone } from 'lucide-react'
import { Sticker } from '@/components/ui/sticker'
import Link from 'next/link'

export const metadata = {
  title: 'Lokalizacje | Air Squad',
  description:
    'Znajdź salę treningową Air Squad najbliżej siebie. 7 lokalizacji w regionie Podkarpacia.',
}

const TILE_GRADIENTS = [
  'from-primary to-accent',
  'from-accent to-cyan',
  'from-cyan to-primary',
  'from-primary via-cyan to-accent',
]

export default async function LocationsPage() {
  const supabase = await createClient()

  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pt-24">
        {/* Hero band */}
        <section className="relative overflow-hidden border-b-2 border-foreground bg-gradient-to-br from-primary via-accent to-primary">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-cyan/30 blur-3xl"
          />
          <div className="container relative mx-auto px-4 py-20 md:py-28">
            <Sticker variant="cyan" rotate="right" size="sm" className="mb-6">
              {locations?.length || 7} miast w regionie
            </Sticker>
            <h1 className="font-[family-name:var(--font-display)] text-6xl font-black uppercase leading-[0.9] tracking-tighter text-primary-foreground sm:text-7xl md:text-8xl lg:text-9xl">
              lokalizacje
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium text-primary-foreground/85 md:text-xl">
              Znajdź najbliższą salę. Każda z dedykowaną przestrzenią treningową, matami i opieką trenerską.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          {/* Locations grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locations?.map((location, idx) => (
              <article
                key={location.id}
                id={location.city.toLowerCase()}
                className="group relative overflow-hidden border-2 border-foreground bg-card shadow-sticker transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-sticker-lg"
              >
                {/* Visual */}
                <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${TILE_GRADIENTS[idx % TILE_GRADIENTS.length]}`}>
                  {location.image_url ? (
                    <img
                      src={location.image_url || '/placeholder.svg'}
                      alt={location.name}
                      className="h-full w-full object-cover mix-blend-luminosity opacity-60 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-[family-name:var(--font-display)] text-6xl font-black uppercase tracking-tighter text-primary-foreground/40">
                        {location.city}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="border-t-2 border-foreground p-6">
                  <h2 className="font-[family-name:var(--font-display)] text-2xl font-black uppercase tracking-tighter text-foreground">
                    {location.city}
                  </h2>
                  <p className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {location.address}
                  </p>
                  {location.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {location.description}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {location.maps_url && (
                      <a
                        href={location.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border-2 border-foreground bg-card px-3 py-2 text-xs font-black uppercase tracking-wider text-foreground transition-all hover:bg-foreground hover:text-background"
                      >
                        <Navigation className="h-3.5 w-3.5" aria-hidden />
                        Nawiguj
                      </a>
                    )}
                    <Link
                      href={`/lokalizacje/${location.slug || location.city.toLowerCase()}`}
                      className="inline-flex items-center gap-2 border-2 border-foreground bg-primary px-3 py-2 text-xs font-black uppercase tracking-wider text-primary-foreground transition-all hover:bg-foreground"
                    >
                      Szczegóły →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-20 border-2 border-foreground bg-foreground p-12 text-center text-background shadow-sticker-xl md:p-16">
            <p className="text-xs font-black uppercase tracking-widest text-cyan">Masz pytania?</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-black uppercase leading-none tracking-tighter md:text-6xl">
              Zadzwoń lub napisz
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/kontakt"
                className="inline-block border-2 border-cyan bg-cyan px-10 py-4 font-black uppercase tracking-wider text-cyan-foreground transition-all hover:bg-background hover:text-foreground"
              >
                Napisz do nas
              </Link>
              <a
                href="tel:+48728559101"
                className="inline-flex items-center gap-2 border-2 border-background px-10 py-4 font-black uppercase tracking-wider text-background transition-all hover:bg-background hover:text-foreground"
              >
                <Phone className="h-4 w-4" aria-hidden />
                728 559 101
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
