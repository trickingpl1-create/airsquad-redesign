import { createClient } from '@/lib/supabase/server'
import { AipaxWidget } from '@/components/aipax-widget'
import { CityEnrolment, type EnrolmentCity } from '@/components/akrobatyka/city-enrolment'
import { StructuredData, Breadcrumb } from '@/lib/seo/metadata'
import { SITE_URL } from '@/lib/seo/site'
import { GroupsInfoSection, FAQSection } from '@/components/seo/page-layout'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Award,
  Calendar,
  CheckCircle,
  MapPin,
  Users,
  Zap,
} from 'lucide-react'
import type {
  CityPage,
  Discipline,
  Event,
  StaticPage,
} from '@/lib/types/database'

// Wspólne widoki stron SEO. Te same treści muszą być dostępne pod historycznym
// URL-em root-level (np. /rzeszow/) i pod nowym hubem (np. /lokalizacje/rzeszow/),
// dlatego ścieżka bieżąca i okruszki przychodzą z trasy (docs/03-mapa-url.md).

interface BreadcrumbItem {
  name: string
  url: string
}

interface ViewProps<T> {
  data: T
  /** Ścieżka, pod którą strona jest renderowana, np. `/rzeszow` */
  currentPath: string
  /** Okruszki nadrzędne (bez strony głównej i bez strony bieżącej) */
  parents?: BreadcrumbItem[]
}

function buildBreadcrumbs(
  title: string,
  currentPath: string,
  parents: BreadcrumbItem[] = []
): BreadcrumbItem[] {
  return [
    { name: 'Strona główna', url: '/' },
    ...parents,
    { name: title, url: currentPath },
  ]
}

export async function CityPageView({
  data: cityPage,
  currentPath,
  parents,
}: ViewProps<CityPage>) {
  // Fetch location details
  const supabase = await createClient()
  const { data: location } = await supabase
    .from('locations')
    .select('*')
    .eq('id', cityPage.location_id)
    .maybeSingle()

  const breadcrumbs = buildBreadcrumbs(cityPage.h1_title, currentPath, parents)

  const faqItems = cityPage.faq?.map((item: any) => ({
    question: item.question || '',
    answer: item.answer || '',
  })) || []

  const groupsInfo = cityPage.groups_info?.map((group: any) => ({
    name: group.name || '',
    age: group.age || '',
    schedule: group.schedule || '',
    price: group.price || '',
    trainer: group.trainer || '',
  })) || []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Structured Data */}
        <StructuredData
          type="LocalBusiness"
          data={{
            name: cityPage.h1_title,
            description: cityPage.meta_description,
            address: {
              '@type': 'PostalAddress',
              streetAddress: location?.address || '',
              addressLocality: location?.city || '',
              addressCountry: 'PL',
            },
            url: `${SITE_URL}${currentPath}/`,
            image: location?.image_url || '',
          }}
        />

        {/* Breadcrumb */}
        <div className="container pt-8">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* Hero Section */}
        {location?.image_url && (
          <div
            className="relative h-64 bg-cover bg-center md:h-96"
            style={{ backgroundImage: `url(${location.image_url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
            <div className="container relative flex h-full flex-col justify-center">
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                {cityPage.h1_title}
              </h1>
            </div>
          </div>
        )}
        {!location?.image_url && (
          <div className="relative h-48 bg-gradient-to-br from-primary to-accent md:h-64">
            <div className="container relative flex h-full flex-col justify-center">
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                {cityPage.h1_title}
              </h1>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="container space-y-12 py-12">
          {/* Hero Content */}
          {cityPage.hero_content && (
            <section className="prose prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: cityPage.hero_content }}
              />
            </section>
          )}

          {/* Main Content */}
          {cityPage.main_content && (
            <section className="prose prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: cityPage.main_content }}
              />
            </section>
          )}

          {/* Groups Info */}
          {groupsInfo.length > 0 && (
            <section>
              <GroupsInfoSection groups={groupsInfo} />
            </section>
          )}

          {/* Schedule */}
          {cityPage.schedule_content && (
            <section className="prose prose-invert max-w-none">
              <h2>Grafik zajęć</h2>
              <div
                dangerouslySetInnerHTML={{ __html: cityPage.schedule_content }}
              />
            </section>
          )}

          {/* FAQ */}
          {faqItems.length > 0 && (
            <section>
              <FAQSection items={faqItems} />
            </section>
          )}

          {/* CTA Section */}
          <section className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Gotów do przystąpienia do Air Squad?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Zapisy na bezpłatne zajęcia próbne dostępne teraz
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Zapisz się na zajęcia
              </Button>
              <Button variant="outline" size="lg">
                Skontaktuj się
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export function DisciplineView({
  data: discipline,
  currentPath,
  parents,
  cities = [],
}: ViewProps<Discipline> & { cities?: EnrolmentCity[] }) {
  const breadcrumbs = buildBreadcrumbs(discipline.name, currentPath, parents)

  const faqItems = discipline.faq?.map((item: any) => ({
    question: item.question || '',
    answer: item.answer || '',
  })) || []

  const benefits = discipline.benefits || []
  const stats = discipline.stats || []
  const levels = discipline.levels || []
  const sessionFlow = discipline.session_flow || []
  const ageGroups = discipline.age_groups || []
  const gallery = discipline.gallery || []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Structured Data */}
        <StructuredData
          type="Course"
          data={{
            name: discipline.name,
            description: discipline.meta_description || discipline.short_description,
            image: discipline.hero_image_url,
            url: `${SITE_URL}${currentPath}/`,
            provider: {
              '@type': 'Organization',
              name: 'Air Squad',
              url: SITE_URL,
            },
          }}
        />

        {/* Breadcrumb */}
        <div className="container pt-8">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* Hero Section */}
        {discipline.hero_image_url ? (
          <div
            className="relative h-64 bg-cover bg-center md:h-96"
            style={{ backgroundImage: `url(${discipline.hero_image_url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
            <div className="container relative flex h-full flex-col justify-center">
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                {discipline.h1_title || discipline.name}
              </h1>
              {discipline.hero_tagline && (
                <p
                  className="mt-3 text-2xl text-cyan md:text-3xl"
                  style={{ fontFamily: 'var(--font-covered-by-your-grace)' }}
                >
                  {discipline.hero_tagline}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="relative h-64 bg-gradient-to-br from-primary to-accent md:h-96">
            <div className="container relative flex h-full flex-col justify-center">
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                {discipline.h1_title || discipline.name}
              </h1>
              {discipline.hero_tagline && (
                <p
                  className="mt-3 text-2xl text-cyan md:text-3xl"
                  style={{ fontFamily: 'var(--font-covered-by-your-grace)' }}
                >
                  {discipline.hero_tagline}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="container space-y-12 py-12">
          {/* Pasek statystyk */}
          {stats.length > 0 && (
            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-border bg-card px-6 py-6"
                >
                  <div className="text-4xl font-bold text-primary">{s.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Short Description */}
          {discipline.short_description && (
            <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
              <p className="text-lg text-foreground">
                {discipline.short_description}
              </p>
            </section>
          )}

          {/* Ścieżka rozwoju (poziomy) */}
          {levels.length > 0 && (
            <section className="space-y-6">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-pink">
                  Ścieżka rozwoju
                </p>
                <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
                  Czego <span className="gradient-text">nauczysz się</span> u nas?
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                {levels.map((lvl, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-3xl border border-border bg-card p-6"
                  >
                    <div
                      className="text-5xl leading-none text-primary/30"
                      style={{ fontFamily: 'var(--font-covered-by-your-grace)' }}
                    >
                      {lvl.num}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">
                      {lvl.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{lvl.desc}</p>
                    {lvl.tag && (
                      <span className="mt-4 inline-block rounded-full border border-cyan/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan">
                        {lvl.tag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Jak wyglądają zajęcia */}
          {sessionFlow.length > 0 && (
            <section className="grid gap-10 md:grid-cols-2 md:items-center">
              {discipline.hero_image_url && (
                <div
                  className="min-h-[320px] rounded-3xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${discipline.hero_image_url})` }}
                />
              )}
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-amber">
                  Przebieg treningu
                </p>
                <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
                  Jak wyglądają <span className="gradient-text">zajęcia?</span>
                </h2>
                <ul className="mt-6">
                  {sessionFlow.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-3 border-b border-dashed border-border py-3"
                    >
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan" />
                      <div>
                        <span className="font-semibold text-foreground">
                          {step.title}
                        </span>{' '}
                        <span className="text-muted-foreground">— {step.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Grupy wiekowe */}
          {ageGroups.length > 0 && (
            <section className="space-y-6">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
                  Dla kogo
                </p>
                <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
                  Grupy <span className="gradient-text">wiekowe</span>.
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                {ageGroups.map((g, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-border bg-card p-6"
                  >
                    <div
                      className="text-4xl text-primary"
                      style={{ fontFamily: 'var(--font-covered-by-your-grace)' }}
                    >
                      {g.age}
                    </div>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">
                      {g.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{g.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Galeria */}
          {gallery.length > 0 && (
            <section className="space-y-6">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-pink">
                  Z naszych sal
                </p>
                <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
                  {discipline.name} <span className="gradient-text">na żywo</span>.
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {gallery.map((g, i) => (
                  <div
                    key={i}
                    className="relative h-72 overflow-hidden rounded-3xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${g.url})` }}
                  >
                    {g.caption && (
                      <span className="absolute bottom-3 left-3 right-3 font-mono text-xs text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                        {g.caption}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Age Requirement */}
          {discipline.age_requirement && (
            <section className="flex items-center gap-4 rounded-lg border border-border bg-card p-6">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">
                  Wymagany wiek
                </h3>
                <p className="text-muted-foreground">
                  {discipline.age_requirement}
                </p>
              </div>
            </section>
          )}

          {/* Benefits */}
          {benefits.length > 0 && (
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Award className="h-6 w-6 text-primary" />
                Korzyści treningu
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {benefits.map((benefit: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                  >
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {benefit.title || benefit.name}
                      </h3>
                      {benefit.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {benefit.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Full Description */}
          {discipline.full_description && (
            <section className="prose prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: discipline.full_description }}
              />
            </section>
          )}

          {/* Hero Video */}
          {discipline.hero_video_url && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Obejrzyj w akcji
              </h2>
              <div className="aspect-video overflow-hidden rounded-lg border border-border bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${
                    discipline.hero_video_url.includes('youtu')
                      ? discipline.hero_video_url.split('v=')[1] ||
                        discipline.hero_video_url
                      : discipline.hero_video_url
                  }`}
                  title="Wideo dyscypliny"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          {/* Wybór miasta + kalendarz zapisów AIPAX */}
          {cities.length > 0 && <CityEnrolment cities={cities} />}

          {/* FAQ */}
          {faqItems.length > 0 && (
            <section>
              <FAQSection items={faqItems} />
            </section>
          )}

          {/* CTA Section */}
          <section className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Chcesz spróbować {discipline.name}?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Bezpłatne zajęcia próbne czekają na Ciebie. Zapisz się teraz!
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Zapisz się na zajęcia
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/lokalizacje">Zobacz lokalizacje</a>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export function EventView({
  data: event,
  currentPath,
  parents,
}: ViewProps<Event>) {
  const breadcrumbs = buildBreadcrumbs(event.title, currentPath, parents)

  const faqItems = event.pricing?.map((item: any) => ({
    question: item.name || item.title || '',
    answer: item.description || item.price || '',
  })) || []

  const programItems = event.program || []
  const stats = event.stats || []
  const attractions = event.attractions || []
  const gallery = event.gallery || []
  const isCamp = event.event_type === 'oboz'

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Structured Data */}
        <StructuredData
          type="Event"
          data={{
            name: event.title,
            description: event.meta_description || event.description,
            image: event.image_url,
            startDate: event.event_date,
            endDate: event.event_date,
            url: `${SITE_URL}${currentPath}/`,
            eventLocation: {
              '@type': 'Place',
              name: event.location,
            },
            organizer: {
              '@type': 'Organization',
              name: 'Air Squad',
              url: SITE_URL,
            },
          }}
        />

        {/* Breadcrumb */}
        <div className="container pt-8">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* Hero Section */}
        <div className="relative h-64 bg-gradient-to-br from-primary to-accent md:h-96">
          {event.image_url && (
            <div
              className="absolute inset-0 opacity-30"
              style={{ backgroundImage: `url(${event.image_url})` }}
            />
          )}
          <div className="container relative flex h-full flex-col justify-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              {event.title}
            </h1>
            {event.tagline && (
              <p
                className="mt-3 text-2xl text-cyan md:text-3xl"
                style={{ fontFamily: 'var(--font-covered-by-your-grace)' }}
              >
                {event.tagline}
              </p>
            )}
            {event.event_date && (
              <p className="mt-2 flex items-center gap-2 text-lg text-white/90">
                <Calendar className="h-5 w-5" />
                {new Date(event.event_date).toLocaleDateString('pl-PL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="container space-y-12 py-12">
          {/* Event Info Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {event.event_date && (
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-semibold text-foreground">
                      {new Date(event.event_date).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {event.location && (
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Miejsce</p>
                    <p className="font-semibold text-foreground">{event.location}</p>
                  </div>
                </div>
              </div>
            )}
            {event.form_url && (
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rejestracja</p>
                    <p className="font-semibold text-foreground">Otwarta</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pasek statystyk */}
          {stats.length > 0 && (
            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-border bg-card px-6 py-6"
                >
                  <div className="text-4xl font-bold text-primary">{s.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Description */}
          {event.description && (
            <section className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: event.description }} />
            </section>
          )}

          {/* Atrakcje */}
          {attractions.length > 0 && (
            <section className="space-y-6">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
                  Co robimy na obozie
                </p>
                <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
                  Atrakcje <span className="gradient-text">i zajęcia</span>.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {attractions.map((a, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-border bg-card p-6"
                  >
                    {a.icon && <div className="mb-3 text-3xl">{a.icon}</div>}
                    <h3 className="font-semibold text-foreground">{a.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Includes */}
          {event.includes && (
            <section className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Zap className="h-6 w-6 text-primary" />
                Co zawiera to wydarzenie?
              </h2>
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: event.includes }}
              />
            </section>
          )}

          {/* Program */}
          {programItems.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Program</h2>
              <div className="space-y-2">
                {programItems.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <h3 className="font-semibold text-foreground">
                      {item.time} - {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pricing */}
          {faqItems.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Cennik</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {faqItems.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border bg-card p-6"
                  >
                    <h3 className="font-semibold text-foreground">
                      {item.question}
                    </h3>
                    <p className="mt-2 text-lg font-bold text-primary">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Galeria */}
          {gallery.length > 0 && (
            <section className="space-y-6">
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-pink">
                  Z poprzednich turnusów
                </p>
                <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
                  Obóz <span className="gradient-text">na żywo</span>.
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {gallery.map((g, i) => (
                  <div
                    key={i}
                    className="relative h-72 overflow-hidden rounded-3xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${g.url})` }}
                  >
                    {g.caption && (
                      <span className="absolute bottom-3 left-3 right-3 font-mono text-xs text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                        {g.caption}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {isCamp ? 'Zapisz dziecko na obóz' : 'Chcesz wziąć udział?'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isCamp
                ? 'Liczba miejsc na turnus jest ograniczona — wybierz termin i zarezerwuj miejsce w formularzu poniżej.'
                : 'Kliknij poniżej, aby zarejestrować się na to wydarzenie'}
            </p>
            <div className="mt-6 flex justify-center gap-4">
              {event.form_url && (
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <a href={event.form_url} target="_blank" rel="noopener noreferrer">
                    {isCamp ? 'Zarezerwuj turnus' : 'Zapisz się teraz'}
                  </a>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <a href="/kontakt">Skontaktuj się</a>
              </Button>
            </div>
          </section>

          {/* Zapisy online — widget AIPAX (obozy) */}
          {isCamp && (
            <section>
              <AipaxWidget />
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export function StaticPageView({
  data: page,
  currentPath,
  parents,
}: ViewProps<StaticPage>) {
  const breadcrumbs = buildBreadcrumbs(
    page.h1_title || page.meta_title || currentPath.replace('/', ''),
    currentPath,
    parents
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Structured Data */}
        <StructuredData
          type="WebPage"
          data={{
            name: page.meta_title || page.h1_title,
            description: page.meta_description,
            url: `${SITE_URL}${currentPath}/`,
          }}
        />

        {/* Breadcrumb */}
        <div className="container pt-8">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* Hero Section */}
        <div className="relative h-48 bg-gradient-to-br from-primary to-accent md:h-64">
          <div className="container relative flex h-full flex-col justify-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              {page.h1_title || page.meta_title}
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="container py-12">
          <div className="mx-auto max-w-3xl space-y-8">
            {page.content && (
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
              </div>
            )}

            {/* Strony zapisów dostają formularz AIPAX zamiast ogólnego CTA */}
            {page.page_type === 'zapisy' && (
              <section className="mt-8">
                <AipaxWidget />
              </section>
            )}

            {/* CTA Section - for non-legal pages */}
            {page.page_type !== 'legal' &&
              page.page_type !== 'archiwum' &&
              page.page_type !== 'zapisy' && (
              <section className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
                <h2 className="text-2xl font-bold text-foreground">
                  Chcesz wiedzieć więcej?
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Skontaktuj się z nami lub zarezerwuj bezpłatną lekcję próbną.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Skontaktuj się
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="/lokalizacje">
                      Znajdź lokalizację
                    </a>
                  </Button>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
