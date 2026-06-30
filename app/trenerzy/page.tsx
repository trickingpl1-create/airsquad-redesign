import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Sticker } from '@/components/ui/sticker'
import { Instagram, User } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Trenerzy | Air Squad',
  description:
    'Poznaj zespół trenerów Air Squad. Doświadczeni instruktorzy akrobatyki, trickingu i tumblingu.',
}

const TILE_GRADIENTS = [
  'from-primary to-accent',
  'from-accent to-cyan',
  'from-cyan to-primary',
  'from-primary via-cyan to-accent',
  'from-accent via-primary to-cyan',
]

export default async function TrainersPage() {
  const supabase = await createClient()

  const { data: trainers } = await supabase
    .from('trainers')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pt-24">
        {/* Hero band */}
        <section className="relative overflow-hidden border-b-2 border-foreground bg-gradient-to-br from-accent via-primary to-primary">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-cyan/30 blur-3xl"
          />
          <div className="container relative mx-auto px-4 py-20 md:py-28">
            <Sticker variant="cyan" rotate="right" size="sm" className="mb-6">
              {trainers?.length || 'Pasjonaci'} · 12+ lat doświadczenia
            </Sticker>
            <h1 className="font-[family-name:var(--font-display)] text-6xl font-black uppercase leading-[0.9] tracking-tighter text-primary-foreground sm:text-7xl md:text-8xl lg:text-9xl">
              trenerzy
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium text-primary-foreground/85 md:text-xl">
              Pasjonaci akrobatyki, którzy pamiętają jak to jest być początkującym.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {trainers?.map((trainer, idx) => (
              <article
                key={trainer.id}
                className="group overflow-hidden border-2 border-foreground bg-card shadow-sticker transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-sticker-lg"
              >
                {/* Avatar block */}
                <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${TILE_GRADIENTS[idx % TILE_GRADIENTS.length]}`}>
                  {trainer.photo_url ? (
                    <img
                      src={trainer.photo_url || '/placeholder.svg'}
                      alt={trainer.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <User className="h-20 w-20 text-primary-foreground/40" aria-hidden />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="border-t-2 border-foreground p-6">
                  <h2 className="font-[family-name:var(--font-display)] text-2xl font-black uppercase tracking-tighter text-foreground">
                    {trainer.name}
                  </h2>
                  <p className="mt-1 text-xs font-black uppercase tracking-widest text-primary">
                    {trainer.role || 'Trener'}
                  </p>
                  {trainer.bio && (
                    <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                      {trainer.bio}
                    </p>
                  )}

                  {trainer.specializations && trainer.specializations.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {trainer.specializations.slice(0, 4).map((spec: string) => (
                        <span
                          key={spec}
                          className="border border-foreground bg-card px-2 py-1 text-[10px] font-black uppercase tracking-wider text-foreground"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  {trainer.instagram_url && (
                    <a
                      href={trainer.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 border-2 border-foreground px-3 py-2 text-xs font-black uppercase tracking-wider text-foreground transition-all hover:bg-foreground hover:text-background"
                    >
                      <Instagram className="h-3.5 w-3.5" aria-hidden />
                      Instagram
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          {!trainers?.length && (
            <div className="border-2 border-dashed border-foreground/30 bg-card p-12 text-center">
              <User className="mx-auto h-12 w-12 text-muted-foreground/50" aria-hidden />
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-black uppercase tracking-tighter text-foreground">
                Wkrótce
              </h3>
            </div>
          )}

          {/* Join CTA */}
          <div className="mt-20 border-2 border-foreground bg-foreground p-12 text-center text-background shadow-sticker-xl md:p-16">
            <p className="text-xs font-black uppercase tracking-widest text-cyan">
              Dołącz do zespołu
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-black uppercase leading-none tracking-tighter md:text-6xl">
                Aplikuj na trenera
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-background/70">
              Pasjonujesz się akrobatyką i chcesz dzielić się wiedzą? Napisz do nas.
            </p>
            <Link
              href="/kontakt"
              className="mt-8 inline-block border-2 border-cyan bg-cyan px-10 py-4 font-black uppercase tracking-wider text-cyan-foreground transition-all hover:bg-background hover:text-foreground"
            >
              Aplikuj
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
