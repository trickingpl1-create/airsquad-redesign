import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Sticker } from '@/components/ui/sticker'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wydarzenia | Air Squad',
  description:
    'Nadchodzące wydarzenia Air Squad — AirMeeting, spotkania akrobatyczne i Gravity Jam.',
}

const EVENT_TYPE_LABELS = {
  airmeeting: 'AirMeeting',
  spotkanie: 'Spotkania akrobatyczne',
  gravityjam: 'Gravity Jam',
} as const

const TILE_GRADIENTS = [
  'from-primary to-accent',
  'from-accent to-cyan',
  'from-cyan to-primary',
]

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function EventsPage() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .eq('is_active', true)
    .order('event_date', { ascending: true })

  const eventsByType = {
    airmeeting: events?.filter((e) => e.event_type === 'airmeeting') || [],
    spotkanie: events?.filter((e) => e.event_type === 'spotkanie') || [],
    gravityjam: events?.filter((e) => e.event_type === 'gravityjam') || [],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pt-24">
        {/* Hero band */}
        <section className="relative overflow-hidden border-b-2 border-foreground bg-gradient-to-br from-primary via-accent to-cyan">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-cyan/30 blur-3xl"
          />
          <div className="container relative mx-auto px-4 py-20 md:py-28">
            <Sticker variant="white" rotate="left" size="sm" className="mb-6">
              {events?.length || 0} wydarzeń · 2026
            </Sticker>
            <h1 className="font-[family-name:var(--font-display)] text-6xl font-black uppercase leading-[0.9] tracking-tighter text-primary-foreground sm:text-7xl md:text-8xl lg:text-9xl">
              wydarzenia
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium text-primary-foreground/85 md:text-xl">
              AirMeeting, spotkania akrobatyczne, Gravity Jam. Środowisko, które pcha do przodu.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          {Object.entries(EVENT_TYPE_LABELS).map(([type, label]) => {
            const typeEvents = eventsByType[type as keyof typeof eventsByType]
            if (!typeEvents.length) return null

            return (
              <div key={type} className="mb-20">
                <h2 className="mb-8 font-[family-name:var(--font-display)] text-3xl font-black uppercase tracking-tighter text-foreground md:text-5xl">
                  {label}
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {typeEvents.map((event, idx) => (
                    <article
                      key={event.id}
                      className="group overflow-hidden border-2 border-foreground bg-card shadow-sticker transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-sticker-lg"
                    >
                      <div
                        className={`relative aspect-video overflow-hidden bg-gradient-to-br ${TILE_GRADIENTS[idx % TILE_GRADIENTS.length]}`}
                      >
                        {event.image_url ? (
                          <img
                            src={event.image_url || '/placeholder.svg'}
                            alt={event.title}
                            className="h-full w-full object-cover mix-blend-luminosity opacity-70 transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Calendar className="h-16 w-16 text-primary-foreground/40" aria-hidden />
                          </div>
                        )}
                      </div>
                      <div className="border-t-2 border-foreground p-6">
                        <h3 className="font-[family-name:var(--font-display)] text-xl font-black uppercase tracking-tighter text-foreground">
                          {event.title}
                        </h3>
                        {event.event_date && (
                          <p className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                            <Calendar className="h-3.5 w-3.5" aria-hidden />
                            {formatDate(event.event_date)}
                          </p>
                        )}
                        {event.location && (
                          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" aria-hidden />
                            {event.location}
                          </p>
                        )}
                        {event.description && (
                          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                            {event.description}
                          </p>
                        )}
                        <div className="mt-5 flex gap-2">
                          <Link
                            href={`/wydarzenia/${event.slug}`}
                            className="inline-flex flex-1 items-center justify-center gap-2 border-2 border-foreground bg-primary px-3 py-2 text-xs font-black uppercase tracking-wider text-primary-foreground transition-all hover:bg-foreground"
                          >
                            Więcej
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                          </Link>
                          {event.form_url && (
                            <a
                              href={event.form_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 border-2 border-foreground bg-card px-3 py-2 text-xs font-black uppercase tracking-wider text-foreground transition-all hover:bg-foreground hover:text-background"
                            >
                              Zapisy
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )
          })}

          {!events?.length && (
            <div className="border-2 border-dashed border-foreground/30 bg-card p-12 text-center md:p-20">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" aria-hidden />
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-black uppercase tracking-tighter text-foreground">
                Brak wydarzeń
              </h3>
              <p className="mt-2 text-muted-foreground">Sprawdź ponownie wkrótce.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
