import Image from 'next/image'
import Link from 'next/link'
import { StructuredData, Breadcrumb } from '@/lib/seo/metadata'
import { SITE_URL } from '@/lib/seo/site'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionHeader } from '@/components/home/section-header'
import { CityAipaxCalendar } from '@/components/seo/city-aipax-calendar'
import { CityVideo } from '@/components/seo/city-video'
import { ExpandableGallery } from '@/components/seo/expandable-gallery'
import { CLUB_CONTACT } from '@/lib/content/cities'
import type { Event } from '@/lib/types/database'

// Landing /letni/ (Air Camp, chroniony URL SEO — docs/03-mapa-url.md).
// Zaimportowany z Claude Design ("Air Squad - Letni (Obóz).dc.html") — dedykowany
// widok zamiast generycznego EventView, bo treść (galeria, wideo, 2 progi cenowe,
// FAQ) jest zbyt specyficzna dla tego jednego wydarzenia. Renderuje wyłącznie
// przekazane dane (fallback z lib/content/letni.ts albo wiersz z DB).

interface BreadcrumbItem {
  name: string
  url: string
}

interface CampViewProps {
  data: Event
  currentPath: string
  parents?: BreadcrumbItem[]
}

interface PricingTier {
  badge: string
  dates: string
  price: string
  accent: string
  features: string[]
}

const ACCENT_COLORS: Record<string, string> = {
  cyan: 'var(--cyan)',
  primary: 'var(--primary)',
}

function normalizePricing(raw: Record<string, unknown>[] = []): PricingTier[] {
  return raw
    .map((p) => ({
      badge: String(p.badge ?? ''),
      dates: String(p.dates ?? ''),
      price: String(p.price ?? ''),
      accent: ACCENT_COLORS[String(p.accent ?? '')] ?? 'var(--primary)',
      features: Array.isArray(p.features) ? p.features.map(String) : [],
    }))
    .filter((p) => p.badge && p.price)
}

export function CampView({ data: camp, currentPath, parents = [] }: CampViewProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Strona główna', url: '/' },
    ...parents,
    { name: 'Letni', url: currentPath },
  ]

  const pricingTiers = normalizePricing(camp.pricing)
  const gallery = camp.gallery ?? []
  const featuredGallery = gallery.slice(0, 4).map((g) => g.url)
  const extraGallery = gallery.slice(4).map((g) => g.url)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <StructuredData
          type="Event"
          data={{
            name: camp.title,
            description: camp.meta_description || camp.description,
            image: camp.image_url ? `${SITE_URL}${camp.image_url}` : undefined,
            startDate: camp.event_date,
            endDate: camp.event_date,
            url: `${SITE_URL}${currentPath}/`,
            eventLocation: {
              '@type': 'Place',
              name: camp.location,
            },
            organizer: {
              '@type': 'Organization',
              name: 'Air Squad',
              url: SITE_URL,
            },
          }}
        />
        {camp.faq && camp.faq.length > 0 && (
          <StructuredData
            type="FAQPage"
            data={{
              mainEntity: camp.faq.map((f) => ({
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
        <section className="relative mt-6 overflow-hidden">
          {camp.image_url && (
            <div
              aria-hidden
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${camp.image_url})` }}
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 20% 30%, color-mix(in oklch, var(--primary) 55%, transparent), transparent 55%), radial-gradient(ellipse at 85% 75%, color-mix(in oklch, var(--cyan) 45%, transparent), transparent 55%), linear-gradient(180deg, rgba(10,8,16,0.35) 0%, rgba(10,8,16,0.55) 55%, var(--background) 100%)',
            }}
          />
          <div className="relative mx-auto max-w-5xl px-6 py-28 text-center md:py-36">
            {camp.editionBadge && (
              <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-5 py-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ping rounded-full bg-emerald opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald" />
                </span>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                  {camp.editionBadge}
                </span>
              </div>
            )}
            <Image
              src="/images/aircamp-2026-logo.png"
              alt="Air Camp 2026"
              width={280}
              height={140}
              className="mx-auto mb-5 h-[110px] w-auto object-contain drop-shadow-[0_0_34px_rgba(16,185,129,0.45)]"
              priority
            />
            <h1
              className="display-italic m-0 text-5xl leading-[1] text-white md:text-7xl"
              style={{ fontWeight: 400 }}
            >
              {camp.heroLine1 ?? camp.title}
              {camp.heroLine2 && (
                <>
                  <br />
                  <span className="gradient-text">{camp.heroLine2}</span>
                </>
              )}
            </h1>
            {camp.heroSubtitle && (
              <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-white/85">
                {camp.heroSubtitle}
              </p>
            )}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <a
                href="#zapisy"
                className="rounded-full px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.1em] text-emerald-950"
                style={{
                  background: 'linear-gradient(135deg, var(--emerald), var(--cyan))',
                  boxShadow: '0 14px 36px rgba(16,185,129,0.35)',
                }}
              >
                Zapisz dziecko teraz →
              </a>
              <a
                href="#program"
                className="flex items-center gap-2 rounded-full border border-white/35 bg-white/5 px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.1em] text-white"
              >
                Zobacz program →
              </a>
            </div>
          </div>
        </section>

        {/* Intro + Stats */}
        <section className="relative bg-background px-6 pb-16 pt-2">
          <div className="mx-auto max-w-3xl text-center">
            <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
              Co to takiego?
            </p>
            <h2 className="display-bold m-0 mt-2.5 text-4xl" style={{ fontWeight: 500 }}>
              9 dni <span className="gradient-text">pełnych przygody.</span>
            </h2>
            {camp.description && (
              <div
                className="prose prose-invert mx-auto mt-5 max-w-2xl text-[15px] leading-[1.8] text-muted-foreground [&_p]:mt-4 [&_p:first-child]:mt-0 [&_strong]:text-foreground"
                dangerouslySetInnerHTML={{ __html: camp.description }}
              />
            )}
          </div>
          {camp.stats && camp.stats.length > 0 && (
            <div className="mx-auto mt-12 flex max-w-5xl flex-wrap items-end justify-center gap-14">
              {camp.stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="stat-number text-5xl text-foreground" style={{ fontWeight: 500 }}>
                    {s.value}
                  </div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Atrakcje */}
        {camp.activityCards && camp.activityCards.length > 0 && (
          <section id="program" className="relative overflow-hidden bg-secondary px-6 py-20">
            <div
              aria-hidden
              className="absolute -left-56 -top-56 h-[560px] w-[560px] rounded-full opacity-25"
              style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 65%)' }}
            />
            <div
              aria-hidden
              className="absolute -bottom-64 -right-56 h-[520px] w-[520px] rounded-full opacity-[0.18]"
              style={{ background: 'radial-gradient(circle, var(--emerald) 0%, transparent 70%)' }}
            />
            <div className="relative mx-auto max-w-7xl">
              <SectionHeader
                kicker="Program"
                kickerColorClass="text-amber"
                title="Co czeka na"
                gradientPart="obozie?"
                titleFontWeight={400}
                gradientFontWeight={400}
                className="mb-10"
              />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {camp.activityCards.map((card) => (
                  <div
                    key={card.label}
                    className="relative overflow-hidden rounded-[20px] border p-6"
                    style={{ borderColor: `color-mix(in oklch, ${card.accent} 40%, transparent)` }}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-cover bg-center opacity-55"
                      style={{ backgroundImage: `url(${card.img})` }}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(180deg, rgba(10,8,16,0.05), rgba(10,8,16,0.7))' }}
                    />
                    <div className="relative">
                      <div className="display-bold text-lg" style={{ fontWeight: 500 }}>
                        {card.label}
                      </div>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-white/75">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Filmy z obozu */}
        {camp.videos && camp.videos.length > 0 && (
          <section className="relative bg-background px-6 pb-2 pt-16">
            <div className="mx-auto max-w-7xl">
              <SectionHeader
                kicker="Zobacz akcję"
                kickerColorClass="text-pink"
                title="Filmy"
                gradientPart="z obozu."
                titleFontWeight={400}
                gradientFontWeight={400}
                className="mb-7"
              />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {camp.videos.map((v) => (
                  <div key={v.url} className="aspect-[9/16] overflow-hidden rounded-[20px]">
                    <CityVideo url={v.url} label={v.label} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Galeria */}
        {featuredGallery.length > 0 && (
          <section className="relative bg-background px-6 py-20">
            <div className="mx-auto max-w-7xl">
              <SectionHeader
                kicker="Z poprzednich turnusów"
                kickerColorClass="text-pink"
                title="Galeria"
                gradientPart="z obozu."
                titleFontWeight={400}
                gradientFontWeight={400}
                className="mb-8"
              />
              <ExpandableGallery featured={featuredGallery} extra={extraGallery} cityLabel="Air Camp" />
            </div>
          </section>
        )}

        {/* Turnusy / Cennik */}
        {pricingTiers.length > 0 && (
          <section
            className="relative overflow-hidden px-6 py-24"
            style={{
              background:
                'radial-gradient(ellipse at 25% 30%, color-mix(in oklch, var(--primary) 32%, transparent), transparent 50%), radial-gradient(ellipse at 75% 70%, color-mix(in oklch, var(--emerald) 25%, transparent), transparent 50%), var(--secondary)',
            }}
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="mb-11 text-center">
                <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald">
                  Turnusy 2026
                </p>
                <h2 className="display-bold m-0 mt-2.5 text-4xl" style={{ fontWeight: 500 }}>
                  Ten obóz jest sportowo <span className="gradient-text">rekreacyjny.</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
                  Jeśli to <strong className="text-foreground">Twój kolejny raz</strong> z nami — napisz do
                  nas, a <strong className="text-foreground">otrzymasz rabat 100 zł.</strong> Zachęcamy
                  również do wystawienia opinii na Facebooku lub Google.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {pricingTiers.map((tier) => (
                  <div
                    key={tier.badge}
                    className="relative overflow-hidden rounded-3xl border bg-white/[0.03]"
                    style={{ borderColor: `color-mix(in oklch, ${tier.accent} 35%, transparent)` }}
                  >
                    <div
                      aria-hidden
                      className="h-[3px]"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${tier.accent}, transparent)`,
                      }}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3 p-6 pb-0">
                      <span
                        className="inline-flex rounded-full border px-4 py-2 font-mono text-[11px] font-black uppercase tracking-[0.1em]"
                        style={{
                          background: `color-mix(in oklch, ${tier.accent} 16%, transparent)`,
                          borderColor: `color-mix(in oklch, ${tier.accent} 40%, transparent)`,
                          color: tier.accent,
                        }}
                      >
                        {tier.badge}
                      </span>
                      <span className="font-mono text-[11px] opacity-85" style={{ color: tier.accent }}>
                        {tier.dates}
                      </span>
                    </div>
                    <div className="px-7 pb-8 pt-6 text-center">
                      <div className="stat-number text-6xl text-white" style={{ fontWeight: 500 }}>
                        {tier.price}
                        <span className="ml-1.5 font-mono text-lg" style={{ color: tier.accent }}>
                          PLN
                        </span>
                      </div>
                      <div className="mt-0.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        9 dni
                      </div>
                      <div className="mt-6 flex flex-col gap-3.5 text-left">
                        {tier.features.map((f) => (
                          <div
                            key={f}
                            className="flex items-start gap-2.5 border-b border-white/[0.06] pb-3.5 text-[13.5px] text-muted-foreground"
                          >
                            <span
                              aria-hidden
                              className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                              style={{ background: tier.accent }}
                            />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                      <a
                        href="#zapisy"
                        className="mt-6 block rounded-full py-4 text-center font-mono text-xs font-black uppercase tracking-[0.1em] text-white"
                        style={{
                          background: `color-mix(in oklch, ${tier.accent} 22%, transparent)`,
                          border: `1px solid color-mix(in oklch, ${tier.accent} 55%, transparent)`,
                        }}
                      >
                        Zapisz się →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Cena zawiera nocleg, wyżywienie, opiekę trenerów, sprzęt i wszystkie atrakcje.
              </p>
            </div>
          </section>
        )}

        {/* Zapisy */}
        <section id="zapisy" className="relative bg-background px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald">
              Zapisy
            </p>
            <h2 className="display-bold m-0 mt-2.5 text-4xl" style={{ fontWeight: 500 }}>
              Zapisz dziecko <span className="gradient-text">na Air Camp.</span>
            </h2>
          </div>
          <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-3xl border-2 border-dashed border-emerald/50 bg-emerald/5">
            <CityAipaxCalendar formId={camp.aipaxFormId} cityName="Air Camp 2026" />
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-center font-mono text-[11px] leading-relaxed text-muted-foreground">
            Pytania: {CLUB_CONTACT.phone} · {CLUB_CONTACT.email}
          </p>
        </section>

        {/* Film */}
        {camp.youtubeId && (
          <section className="relative bg-secondary px-6 py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
                Na żywo
              </p>
              <h2 className="display-bold m-0 mt-2.5 text-4xl" style={{ fontWeight: 500 }}>
                Zobacz <span className="gradient-text">film.</span>
              </h2>
              <div className="mx-auto mt-9 aspect-video max-w-2xl overflow-hidden rounded-3xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                <iframe
                  src={`https://www.youtube.com/embed/${camp.youtubeId}`}
                  title="Air Camp — film"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="block h-full w-full border-0"
                />
              </div>
            </div>
          </section>
        )}

        {/* FAQ + Instagram */}
        <section className="relative bg-background px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.2fr_1fr]">
            {camp.faq && camp.faq.length > 0 && (
              <div>
                <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-amber">
                  Pytania rodziców
                </p>
                <h2 className="display-bold m-0 mt-2.5 text-4xl" style={{ fontWeight: 500 }}>
                  Najczęstsze <span className="gradient-text">pytania.</span>
                </h2>
                <div className="mt-8 flex flex-col gap-3">
                  {camp.faq.map((fq) => (
                    <details
                      key={fq.question}
                      className="group rounded-2xl border border-border bg-card p-5"
                    >
                      <summary className="cursor-pointer list-none text-sm font-bold [&::-webkit-details-marker]:hidden">
                        {fq.question}
                      </summary>
                      <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{fq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
                Na żywo
              </p>
              <h2 className="display-bold m-0 mt-2.5 text-4xl" style={{ fontWeight: 500 }}>
                Zajrzyj na <span className="gradient-text">Instagram.</span>
              </h2>
              <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                <div className="flex items-center gap-3.5 border-b border-border p-5">
                  <div className="h-[52px] w-[52px] flex-shrink-0 rounded-full bg-gradient-to-br from-primary via-accent to-amber p-0.5">
                    <Image
                      src="/images/airsquad-logo.png"
                      alt="Air Squad Akrobatyka"
                      width={52}
                      height={52}
                      className="h-full w-full rounded-full bg-background object-cover p-1.5"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-[15px] font-bold text-foreground">@airsquad_akrobatyka</div>
                    <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      1893 obserwujących · 254 posty
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-0.5">
                  {[
                    '/images/bg-tricking.jpg',
                    '/images/bg-showdance.jpg',
                    '/images/bg-tumbling.jpg',
                    '/images/bg-akrobatyka.jpg',
                    '/images/old-site/dzieci-airtrack.jpg',
                    '/images/old-site/hala-airspace.jpg',
                  ].map((src) => (
                    <a
                      key={src}
                      href="https://instagram.com/airsquad_akrobatyka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block aspect-square bg-cover bg-center"
                      style={{ backgroundImage: `url(${src})` }}
                    />
                  ))}
                </div>
                <a
                  href="https://instagram.com/airsquad_akrobatyka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-primary to-accent py-4 text-center font-mono text-[11px] font-black uppercase tracking-[0.08em] text-white"
                >
                  Obserwuj →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-cyan px-6 py-20">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="display-bold m-0 text-4xl" style={{ fontWeight: 400 }}>
              Wakacje, o których dziecko
              <br />
              będzie mówić cały rok.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed opacity-90">
              Limitowana liczba miejsc na każdy turnus. Zapisy online, potwierdzenie w 24h.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#zapisy"
                className="rounded-full bg-white px-8 py-4 font-mono text-xs font-black uppercase tracking-[0.1em] text-primary"
              >
                Zapisz dziecko na Air Camp →
              </a>
              <Link
                href="/kontakt"
                className="rounded-full border border-white/50 px-7 py-4 font-mono text-xs font-black uppercase tracking-[0.1em] text-white"
              >
                Zapytaj o regulamin
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
