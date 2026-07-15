import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Sticker } from '@/components/ui/sticker'
import Link from 'next/link'
import { Flame, Users, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dyscypliny | Air Squad',
  description:
    'Poznaj nasze dyscypliny treningowe — akrobatyka, tricking, tumbling i longboardy. Zajęcia dla każdego poziomu zaawansowania.',
}

const TILE_GRADIENTS = [
  'from-primary to-accent',
  'from-accent to-primary',
  'from-primary via-accent to-cyan',
  'from-cyan via-primary to-accent',
]

export default async function DisciplinesPage() {
  const supabase = await createClient()

  const { data: disciplines } = await supabase
    .from('disciplines')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pt-24">
        {/* Hero band */}
        <section className="relative overflow-hidden border-b-2 border-foreground bg-gradient-to-br from-primary via-primary to-accent">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-cyan/30 blur-3xl"
          />
          <div className="container relative mx-auto px-4 py-20 md:py-28">
            <Sticker variant="cyan" rotate="left" size="sm" className="mb-6">
              4 dyscypliny · 1 klub
            </Sticker>
            <h1 className="font-[family-name:var(--font-display)] text-6xl font-black uppercase leading-[0.9] tracking-tighter text-primary-foreground sm:text-7xl md:text-8xl lg:text-9xl">
              dyscypliny
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium text-primary-foreground/85 md:text-xl">
              Od akrobatyki dla 4-latków po tricking dla zaawansowanych. Znajdź swoje miejsce.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          {/* Disciplines grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {disciplines?.map((discipline, idx) => (
              <Link
                key={discipline.id}
                href={`/dyscypliny/${discipline.slug}`}
                className="group relative block overflow-hidden border-2 border-foreground bg-card shadow-sticker-lg transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-sticker-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
              >
                {/* Visual */}
                <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${TILE_GRADIENTS[idx % TILE_GRADIENTS.length]}`}>
                  {discipline.hero_image_url ? (
                    <img
                      src={discipline.hero_image_url || '/placeholder.svg'}
                      alt={discipline.name}
                      className="h-full w-full object-cover mix-blend-luminosity opacity-60 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Flame className="h-24 w-24 text-primary-foreground/40" aria-hidden />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                  {discipline.age_requirement && (
                    <div className="absolute right-4 top-4">
                      <Sticker variant="white" size="sm" rotate="right">
                        <Users className="mr-1 inline h-3 w-3" />
                        {discipline.age_requirement}
                      </Sticker>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="border-t-2 border-foreground bg-card p-6 md:p-8">
                  <h2 className="font-[family-name:var(--font-display)] text-3xl font-black uppercase tracking-tighter text-foreground transition-colors group-hover:text-primary md:text-4xl">
                    {discipline.name}
                  </h2>
                  {discipline.short_description && (
                    <p className="mt-3 text-muted-foreground">
                      {discipline.short_description}
                    </p>
                  )}
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-primary">
                      Dowiedz się więcej
                    </span>
                    <ArrowRight className="h-5 w-5 text-foreground transition-transform group-hover:translate-x-1" aria-hidden />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {!disciplines?.length && (
            <div className="border-2 border-dashed border-foreground/30 bg-card p-12 text-center">
              <Flame className="mx-auto h-12 w-12 text-muted-foreground/50" aria-hidden />
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-black uppercase tracking-tighter text-foreground">
                Brak dostępnych dyscyplin
              </h3>
              <p className="mt-2 text-muted-foreground">Sprawdź ponownie wkrótce.</p>
            </div>
          )}

          {/* CTA band */}
          <div className="mt-20 border-2 border-foreground bg-foreground p-12 text-center text-background shadow-sticker-xl md:p-16">
            <p className="text-xs font-black uppercase tracking-widest text-cyan">
              Pierwszy trening za 40 zł
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-black uppercase leading-none tracking-tighter md:text-6xl">
              Sprawdź na sobie
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-background/70">
              Bez ryzyka, bez zobowiązań. Przyjdź, spróbuj, decyduj sam.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/kontakt"
                className="inline-block border-2 border-cyan bg-cyan px-10 py-4 font-black uppercase tracking-wider text-cyan-foreground transition-all hover:bg-background hover:text-foreground"
              >
                Zapisz się
              </Link>
              <Link
                href="/lokalizacje"
                className="inline-block border-2 border-background px-10 py-4 font-black uppercase tracking-wider text-background transition-all hover:bg-background hover:text-foreground"
              >
                Lokalizacje
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
