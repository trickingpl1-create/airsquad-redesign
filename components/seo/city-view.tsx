import Link from 'next/link'
import { StructuredData, Breadcrumb } from '@/lib/seo/metadata'
import { SITE_URL } from '@/lib/seo/site'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionHeader } from '@/components/home/section-header'
import { PricingSection } from '@/components/home/pricing-section'
import { CityAipaxCalendar } from '@/components/seo/city-aipax-calendar'
import { CityVideo } from '@/components/seo/city-video'
import { CLUB_CONTACT, PAYMENT_INFO } from '@/lib/content/cities'
import { Calendar, MapPin, Phone, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CityPage } from '@/lib/types/database'

// Landing miasta (chroniony URL SEO, np. /rzeszow/ — docs/03-mapa-url.md).
// Renderuje wyłącznie przekazane dane (fallback z lib/content/cities.ts albo
// wiersz z DB) — zero zapytań i zero cookies(), żeby strona była statyczna.

const AIPAX_ENROLMENT_BASE = 'https://aipax.pro/pl/external/enrolment-form-v2'

interface BreadcrumbItem {
  name: string
  url: string
}

interface CityViewProps {
  data: CityPage
  /** Ścieżka, pod którą strona jest renderowana, np. `/rzeszow` */
  currentPath: string
  /** Okruszki nadrzędne (bez strony głównej i bez strony bieżącej) */
  parents?: BreadcrumbItem[]
}

interface CityGroup {
  name: string
  days?: string
  hours?: string
  schedule?: string
  age?: string
  level?: string
  enrolling?: boolean
}

// Akceptuje nowy kształt fallbacków ({name, days, hours, age, level, enrolling})
// ORAZ stary adminowy ({name, age, schedule, price, trainer}) — wiersze z DB
// edytowane w panelu nie mogą renderować pustych kart.
function normalizeGroups(raw: Record<string, unknown>[] = []): CityGroup[] {
  return raw
    .map((g) => ({
      name: String(g.name ?? ''),
      days: g.days ? String(g.days) : undefined,
      hours: g.hours ? String(g.hours) : undefined,
      schedule: g.schedule ? String(g.schedule) : undefined,
      age: g.age ? String(g.age) : undefined,
      level: g.level ? String(g.level) : undefined,
      enrolling: Boolean(g.enrolling),
    }))
    .filter((g) => g.name)
}

const CROSS_LINKS = [
  { href: '/akrobatyka/', label: 'Akrobatyka' },
  { href: '/tricking-akademia/', label: 'Tricking' },
  { href: '/tumbling/', label: 'Tumbling' },
  { href: '/letni/', label: 'Air Camp — obozy' },
  { href: '/grafik/', label: 'Grafik zajęć' },
  { href: '/trenerzy/', label: 'Trenerzy' },
] as const

export function CityPageView({ data: city, currentPath, parents = [] }: CityViewProps) {
  const cityName = city.city_name ?? city.h1_title.replace(/^Akrobatyka\s+/i, '')
  const cityLocative = city.city_locative ?? cityName
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Strona główna', url: '/' },
    ...parents,
    { name: cityName, url: currentPath },
  ]

  const groups = normalizeGroups(city.groups_info)
  const faqItems = (city.faq ?? [])
    .map((item) => ({
      question: String(item.question ?? ''),
      answer: String(item.answer ?? ''),
    }))
    .filter((f) => f.question && f.answer)
  const trainingDays = city.training_days_label ?? [...new Set(groups.map((g) => g.days).filter(Boolean))].join(', ')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pt-24">
        <StructuredData
          type="SportsActivityLocation"
          data={{
            name: city.h1_title,
            description: city.meta_description,
            url: `${SITE_URL}${currentPath}/`,
            image: city.hero_image_url ? `${SITE_URL}${city.hero_image_url}` : undefined,
            telephone: CLUB_CONTACT.phoneSchema,
            email: CLUB_CONTACT.email,
            address: city.hall
              ? {
                  '@type': 'PostalAddress',
                  streetAddress: city.hall.address,
                  addressLocality: city.hall.city,
                  addressCountry: 'PL',
                }
              : undefined,
            sport: 'Akrobatyka',
            parentOrganization: {
              '@type': 'SportsOrganization',
              name: 'Air Squad',
              url: SITE_URL,
            },
          }}
        />
        {faqItems.length > 0 && (
          <StructuredData
            type="FAQPage"
            data={{
              mainEntity: faqItems.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            }}
          />
        )}

        <div className="container mx-auto px-4 pt-6">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* Hero */}
        <section className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border border-primary/40">
            {city.hero_video_url ? (
              <>
                <div aria-hidden className="absolute inset-0" style={{ backgroundColor: 'var(--hero-scrim)' }} />
                <video
                  aria-hidden
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={city.hero_image_url ?? undefined}
                  src={city.hero_video_url}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 md:hidden"
                  style={{
                    background:
                      'linear-gradient(100deg, var(--hero-scrim) 0%, color-mix(in oklch, var(--hero-scrim) 95%, transparent) 45%, color-mix(in oklch, var(--hero-scrim) 70%, transparent) 65%, color-mix(in oklch, var(--hero-scrim) 25%, transparent) 82%, transparent 100%)',
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 hidden md:block"
                  style={{
                    background:
                      'linear-gradient(100deg, var(--hero-scrim) 0%, color-mix(in oklch, var(--hero-scrim) 92%, transparent) 28%, color-mix(in oklch, var(--hero-scrim) 55%, transparent) 46%, color-mix(in oklch, var(--hero-scrim) 15%, transparent) 62%, transparent 78%)',
                  }}
                />
              </>
            ) : (
              <>
                {city.hero_image_url && (
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url(${city.hero_image_url})`,
                      backgroundPosition: city.hero_image_position ?? 'center',
                      backgroundSize: city.hero_image_size ?? 'cover',
                      backgroundColor: 'var(--hero-scrim)',
                    }}
                  />
                )}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(100deg, color-mix(in oklch, var(--hero-scrim) 94%, transparent) 30%, color-mix(in oklch, var(--hero-scrim) 55%, transparent) 60%, color-mix(in oklch, var(--primary) 25%, transparent))',
                  }}
                />
              </>
            )}
            <div className="relative max-w-2xl px-8 py-14 md:px-14 md:py-16">
              <span className="rounded-full bg-primary px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-primary-foreground">
                {city.hall?.name ?? `Air Squad · ${cityName}`}
              </span>
              <h1 className="display-bold mt-6 text-5xl text-foreground md:text-7xl" style={{ fontWeight: 400 }}>
                {city.h1_title}
              </h1>
              {city.hero_content && (
                <div
                  className="mt-4 max-w-xl text-base leading-relaxed text-foreground/80 md:text-lg [&_strong]:text-foreground"
                  dangerouslySetInnerHTML={{ __html: city.hero_content }}
                />
              )}
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#zapisy"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}
                >
                  Zapisz dziecko {cityLocative} <span aria-hidden>→</span>
                </a>
                <Link
                  href="/grafik/"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/35 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-cyan hover:text-cyan"
                >
                  Sprawdź grafik
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/65">
                {city.hall && <span>◆ {city.hall.address}</span>}
                <span>◆ maty AirTrack</span>
                <span>◆ 2 trenerów na grupie</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pasek info */}
        <section className="container mx-auto px-4 pt-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {city.hall && (
              <div className="rounded-3xl border border-border bg-card p-5">
                <MapPin className="h-5 w-5 text-cyan" aria-hidden />
                <p className="mt-2 text-sm font-medium text-foreground">{city.hall.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{city.hall.address}</p>
              </div>
            )}
            {trainingDays && (
              <div className="rounded-3xl border border-border bg-card p-5">
                <Calendar className="h-5 w-5 text-amber" aria-hidden />
                <p className="mt-2 text-sm font-medium text-foreground">Dni treningów</p>
                <p className="font-mono text-[11px] text-muted-foreground">{trainingDays}</p>
              </div>
            )}
            <div className="rounded-3xl border border-border bg-card p-5">
              <Users className="h-5 w-5 text-pink" aria-hidden />
              <p className="mt-2 text-sm font-medium text-foreground">Małe grupy</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {city.group_ratio_label ?? 'dzieci · młodzież · dorośli'}
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5">
              <Phone className="h-5 w-5 text-emerald" aria-hidden />
              <p className="mt-2 text-sm font-medium text-foreground">
                <a href={`tel:+48${CLUB_CONTACT.phone.replace(/\s/g, '')}`} className="hover:text-emerald">
                  {CLUB_CONTACT.phone}
                </a>
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">{CLUB_CONTACT.email}</p>
            </div>
          </div>
        </section>

        {/* Grupy treningowe */}
        {groups.length > 0 && (
          <section className="container mx-auto px-4 pt-16">
            <SectionHeader
              kicker={`Grafik zajęć · ${cityName}`}
              kickerColorClass="text-cyan"
              title="Którą grupę"
              gradientPart="wybrać?"
              titleFontWeight={400}
              gradientFontWeight={400}
              meta={`[Grupy] // ${groups.length} ${groups.length === 1 ? 'grupa' : 'grup'}. Grafik może ulec zmianie — potwierdź w AIPAX.`}
              className="mb-8 md:mb-10"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => {
                const enrolUrl = city.aipax_form_id
                  ? `${AIPAX_ENROLMENT_BASE}/${city.aipax_form_id}`
                  : '#zapisy'
                return (
                  <a
                    key={group.name}
                    href={enrolUrl}
                    {...(city.aipax_form_id
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className={`group rounded-3xl border p-6 transition-transform hover:-translate-y-1 ${
                      group.enrolling
                        ? 'border-emerald/45 bg-emerald/5'
                        : 'border-border bg-card'
                    }`}
                  >
                    {group.enrolling ? (
                      <span className="rounded-full bg-emerald px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-950">
                        Nabór — wolne miejsca
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Kontynuacja
                      </span>
                    )}
                    <p className="display-bold mt-4 text-xl text-foreground" style={{ fontWeight: 500 }}>
                      {group.name}
                    </p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {group.schedule ?? [group.days, group.hours].filter(Boolean).join(' — ')}
                    </p>
                    {(group.age || group.level) && (
                      <p className="mt-1 font-mono text-xs text-cyan/80">
                        {[group.age, group.level].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-primary transition-colors group-hover:text-primary/80">
                      Zapisz się <span aria-hidden>→</span>
                    </p>
                  </a>
                )
              })}
            </div>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              ↳ O przydziale do grupy ostatecznie decyduje trener · tel. {CLUB_CONTACT.phoneTrainer}
            </p>
          </section>
        )}

        {/* Sala + trenerzy */}
        {(city.hall || city.trainers?.length) && (
          <section className="container mx-auto grid gap-4 px-4 pt-14 md:grid-cols-2">
            {city.hall && (
              <div className="overflow-hidden rounded-3xl border border-border bg-card">
                {city.hall.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={city.hall.image_url}
                    alt={`${city.hall.name} — sala treningowa`}
                    className="h-56 w-full object-cover"
                  />
                )}
                <div className="p-6">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-amber">
                    Gdzie trenujemy
                  </p>
                  <h2 className="display-bold mt-2 text-2xl text-foreground" style={{ fontWeight: 500 }}>
                    {city.hall.name}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {city.hall.address}, {city.hall.city}
                  </p>
                  {city.hall.note && (
                    <p className="mt-2 text-sm text-muted-foreground">{city.hall.note}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {city.hall.routes && city.hall.routes.length > 0 ? (
                      city.hall.routes.map((route) => (
                        <a
                          key={route.label}
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(route.mapQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            'inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors',
                            route.color === 'primary'
                              ? 'border-primary/40 text-primary hover:bg-primary/10'
                              : 'border-amber/40 text-amber hover:bg-amber/10',
                          )}
                        >
                          Wyznacz trasę — {route.label} <span aria-hidden>↗</span>
                        </a>
                      ))
                    ) : (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city.hall.mapQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-amber/40 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-amber transition-colors hover:bg-amber/10"
                      >
                        Wyznacz trasę (Google Maps) <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                  {city.hall.mapQuery && !city.hall.hideMap && (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                      <iframe
                        src={`https://www.google.com/maps?q=${encodeURIComponent(city.hall.mapQuery)}&output=embed`}
                        title={`Mapa — ${city.hall.name}`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="h-48 w-full border-0"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            {city.trainers && city.trainers.length > 0 && (
              <div className="overflow-hidden rounded-3xl border border-border bg-card">
                {city.trainers_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={city.trainers_image_url}
                    alt={`Trenerzy Air Squad — ${cityName}`}
                    className="h-56 w-full object-cover object-top"
                  />
                )}
                <div className="p-6">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-pink">
                    Trenerzy sekcji
                  </p>
                  <h2 className="display-bold mt-2 text-2xl text-foreground" style={{ fontWeight: 500 }}>
                    Kadra {cityName}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {city.trainers.map((t) => t.name).join(' · ')}
                  </p>
                  <Link
                    href="/trenerzy/"
                    className="mt-4 inline-block font-mono text-xs text-cyan hover:underline"
                  >
                    Poznaj całą kadrę → /trenerzy/
                  </Link>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Pierwszy trening + FAQ */}
        <section className="container mx-auto grid gap-4 px-4 pt-4 md:grid-cols-2">
          {city.first_training && city.first_training.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald">
                Jak wygląda pierwszy trening
              </p>
              <ol className="mt-4 space-y-3">
                {city.first_training.map((step, i) => (
                  <li key={step.title} className="flex gap-3 text-sm text-foreground/80">
                    <span className="font-mono text-xs font-bold text-emerald">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <strong className="font-medium text-foreground">{step.title}</strong>{' '}
                      — {step.desc}
                    </span>
                  </li>
                ))}
              </ol>
              {city.benefits && city.benefits.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {city.benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="rounded-full border border-cyan/30 px-3 py-1 font-mono text-[11px] text-cyan"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          {faqItems.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-pink">
                Najczęstsze pytania rodziców
              </p>
              <div className="mt-3 divide-y divide-border">
                {faqItems.map((faq) => (
                  <details key={faq.question} className="group py-3">
                    <summary className="cursor-pointer list-none text-sm font-medium text-foreground transition-colors hover:text-cyan [&::-webkit-details-marker]:hidden">
                      <span aria-hidden className="mr-2 inline-block transition-transform group-open:rotate-90">
                        ▸
                      </span>
                      {faq.question}
                    </summary>
                    <p className="mt-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Opis dyscyplin (oryginalna treść) */}
        {city.main_content && (
          <section className="container mx-auto px-4 pt-10">
            <div
              className="prose prose-invert max-w-3xl text-foreground/80 [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: city.main_content }}
            />
          </section>
        )}

        {/* Galeria */}
        {city.gallery && city.gallery.length > 0 && (
          <section className="container mx-auto px-4 pt-12">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
              Galeria z treningów
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {city.gallery.map((photo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={photo.url}
                  src={photo.url}
                  alt={photo.caption ? `${photo.caption} — akrobatyka ${cityName}` : `Akrobatyka ${cityName} — trening Air Squad`}
                  loading="lazy"
                  className="h-44 w-full rounded-2xl border border-border object-cover"
                />
              ))}
            </div>
          </section>
        )}

        {/* Cennik */}
        <PricingSection />

        {/* Zajawki + zapisy */}
        <section id="zapisy" className="container mx-auto grid gap-4 px-4 pt-12 md:grid-cols-2">
          {city.videos && city.videos.length > 0 && (
            <div>
              <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
                Nasze zajawki
              </p>
              <CityVideo
                url={city.videos[0].url}
                poster={city.videos[0].poster}
                label={city.videos[0].label}
              />
            </div>
          )}
          <div className={city.videos && city.videos.length > 0 ? '' : 'md:col-span-2'}>
            <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald">
              Zapisz dziecko {cityLocative}
            </p>
            <div className="overflow-hidden rounded-3xl border-2 border-dashed border-emerald/50 bg-emerald/5">
              <CityAipaxCalendar formId={city.aipax_form_id} cityName={cityName} />
            </div>
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {PAYMENT_INFO.deadline} {PAYMENT_INFO.lateFee} {PAYMENT_INFO.account} Pytania:{' '}
              {CLUB_CONTACT.phone} · {CLUB_CONTACT.email}
            </p>
          </div>
        </section>

        {/* Cross-linki */}
        <section className="container mx-auto px-4 pb-20 pt-12">
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Zobacz też:
            </span>
            {CROSS_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-cyan/30 px-4 py-1.5 font-mono text-[11px] text-cyan transition-colors hover:bg-cyan/10"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
