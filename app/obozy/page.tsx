import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Sticker } from '@/components/ui/sticker'
import { Calendar, MapPin, Users, ArrowRight, Tent } from 'lucide-react'
import Link from 'next/link'
import { CAMP_TYPES } from '@/lib/types/database'

export const metadata = {
  title: 'Obozy | Air Squad',
  description:
    'Obozy sportowe Air Squad — letnie i zimowe. Intensywne treningi, integracja i niezapomniane przygody.',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
  }).format(price)
}

export default async function CampsPage() {
  const supabase = await createClient()

  const { data: camps } = await supabase
    .from('camps')
    .select('*')
    .eq('is_active', true)
    .order('start_date')

  const upcomingCamps = camps?.filter((camp) => new Date(camp.end_date) >= new Date())
  const pastCamps = camps?.filter((camp) => new Date(camp.end_date) < new Date())

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pt-24">
        {/* Hero band */}
        <section className="relative overflow-hidden border-b-2 border-foreground bg-gradient-to-br from-accent via-primary to-accent">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-cyan/30 blur-3xl"
          />
          <div className="container relative mx-auto px-4 py-20 md:py-28">
            <Sticker variant="cyan" rotate="left" size="sm" className="mb-6">
              Aircamp 2026 · Lato
            </Sticker>
            <h1 className="font-[family-name:var(--font-display)] text-6xl font-black uppercase leading-[0.9] tracking-tighter text-primary-foreground sm:text-7xl md:text-8xl lg:text-9xl">
              obozy
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium text-primary-foreground/85 md:text-xl">
              7 dni intensywnego treningu, integracji i przygody. Akrobatyka, kajaki, paintball, gry, ognisko.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          {/* Upcoming */}
          {upcomingCamps && upcomingCamps.length > 0 && (
            <div className="mb-20">
              <div className="mb-8 flex items-end justify-between gap-4">
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-black uppercase tracking-tighter text-foreground md:text-5xl">
                  Nadchodzące
                </h2>
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  {upcomingCamps.length} {upcomingCamps.length === 1 ? 'obóz' : 'obozy'}
                </span>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {upcomingCamps.map((camp) => (
                  <article
                    key={camp.id}
                    className="group overflow-hidden border-2 border-foreground bg-card shadow-sticker-lg transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-sticker-xl"
                  >
                    <div className="relative aspect-[2/1] overflow-hidden bg-gradient-to-br from-primary to-accent">
                      {camp.image_url ? (
                        <img
                          src={camp.image_url || '/placeholder.svg'}
                          alt={camp.name}
                          className="h-full w-full object-cover mix-blend-luminosity opacity-70 transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Tent className="h-20 w-20 text-primary-foreground/40" aria-hidden />
                        </div>
                      )}
                      <div className="absolute left-4 top-4">
                        <Sticker variant="white" size="sm" rotate="left">
                          {CAMP_TYPES[camp.type as keyof typeof CAMP_TYPES]}
                        </Sticker>
                      </div>
                      {!camp.registration_open && (
                        <div className="absolute right-4 top-4">
                          <Sticker variant="primary" size="sm" rotate="right">
                            Brak miejsc
                          </Sticker>
                        </div>
                      )}
                    </div>
                    <div className="border-t-2 border-foreground p-6 md:p-8">
                      <h3 className="font-[family-name:var(--font-display)] text-2xl font-black uppercase tracking-tighter text-foreground md:text-3xl">
                        {camp.name}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-primary" aria-hidden />
                          {formatDate(camp.start_date)} – {formatDate(camp.end_date)}
                        </span>
                        {camp.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-primary" aria-hidden />
                            {camp.location}
                          </span>
                        )}
                      </div>
                      {camp.description && (
                        <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                          {camp.description}
                        </p>
                      )}
                      <div className="mt-6 flex items-end justify-between gap-4 border-t-2 border-foreground/10 pt-5">
                        <div>
                          {camp.price && (
                            <div className="font-[family-name:var(--font-display)] text-3xl font-black tracking-tighter text-foreground">
                              {formatPrice(camp.price)}
                            </div>
                          )}
                          {camp.spots_total && (
                            <span className="mt-1 flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground">
                              <Users className="h-3 w-3" aria-hidden />
                              {camp.spots_total - camp.spots_taken} z {camp.spots_total} miejsc
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/obozy/${camp.slug}`}
                          aria-disabled={!camp.registration_open}
                          className="inline-flex items-center gap-2 border-2 border-foreground bg-primary px-5 py-3 text-sm font-black uppercase tracking-wider text-primary-foreground transition-all hover:bg-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50"
                        >
                          {camp.registration_open ? 'Zapisy' : 'Brak'}
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Empty */}
          {(!upcomingCamps || upcomingCamps.length === 0) && (
            <div className="mb-20 border-2 border-dashed border-foreground/30 bg-card p-12 text-center md:p-20">
              <Tent className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" aria-hidden />
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-black uppercase tracking-tighter text-foreground">
                Brak nadchodzących obozów
              </h3>
              <p className="mt-2 text-muted-foreground">Śledź nas w social mediach po nowości.</p>
            </div>
          )}

          {/* Past */}
          {pastCamps && pastCamps.length > 0 && (
            <div>
              <h2 className="mb-8 font-[family-name:var(--font-display)] text-2xl font-black uppercase tracking-tighter text-muted-foreground md:text-3xl">
                Archiwum
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {pastCamps.map((camp) => (
                  <div
                    key={camp.id}
                    className="border-2 border-foreground/30 bg-card p-5 opacity-70"
                  >
                    <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      {CAMP_TYPES[camp.type as keyof typeof CAMP_TYPES]}
                    </div>
                    <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg font-black uppercase tracking-tighter text-foreground">
                      {camp.name}
                    </h3>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {formatDate(camp.start_date)} – {formatDate(camp.end_date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
