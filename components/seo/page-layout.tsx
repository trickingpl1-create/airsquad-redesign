import { ReactNode } from 'react'
import { Breadcrumb } from '@/lib/seo/metadata'
import { Sticker } from '@/components/ui/sticker'

interface SEOPageLayoutProps {
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ name: string; url: string }>
  heroImage?: string
  eyebrow?: string
  children: ReactNode
}

export function SEOPageLayout({
  title,
  subtitle,
  breadcrumbs,
  heroImage,
  eyebrow,
  children,
}: SEOPageLayoutProps) {
  return (
    <main className="min-h-screen bg-background pt-24">
      {/* Hero band — gradient violet, brutal typo */}
      <div className="relative overflow-hidden border-b-2 border-foreground bg-gradient-to-br from-primary via-primary to-accent">
        {heroImage && (
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full bg-cyan/30 blur-3xl"
        />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-6 [&_*]:text-primary-foreground/70 [&_a:hover]:text-cyan">
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}
          {eyebrow && (
            <Sticker variant="cyan" rotate="left" size="sm" className="mb-4">
              {eyebrow}
            </Sticker>
          )}
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-black uppercase leading-[0.9] tracking-tighter text-primary-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-lg font-medium text-primary-foreground/80 md:text-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="prose prose-lg mx-auto max-w-3xl prose-headings:font-[family-name:var(--font-display)] prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-h2:text-4xl prose-h3:text-2xl prose-strong:text-foreground prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-li:my-1">
          {children}
        </div>
      </div>
    </main>
  )
}

interface FAQSectionProps {
  question: string
  answer: string
}

export function FAQSection({ items }: { items: FAQSectionProps[] }) {
  return (
    <div className="my-12 not-prose border-2 border-foreground bg-card p-8 shadow-sticker-lg">
      <h2 className="mb-6 font-[family-name:var(--font-display)] text-3xl font-black uppercase tracking-tighter text-foreground">
        Często zadawane pytania
      </h2>
      <div className="divide-y-2 divide-foreground/10">
        {items.map((item, index) => (
          <details key={index} className="group py-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold text-foreground transition-colors group-hover:text-primary">
              <span className="text-lg">{item.question}</span>
              <span className="shrink-0 text-2xl transition-transform group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="mt-3 text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

interface GroupInfo {
  name: string
  age: string
  schedule: string
  price: string
  trainer?: string
}

export function GroupsInfoSection({ groups }: { groups: GroupInfo[] }) {
  return (
    <div className="my-12 not-prose">
      <h2 className="mb-8 font-[family-name:var(--font-display)] text-3xl font-black uppercase tracking-tighter text-foreground">
        Grupy treningowe
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map((group, index) => (
          <div
            key={index}
            className="border-2 border-foreground bg-card p-6 shadow-sticker transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-sticker-lg"
          >
            <h3 className="mb-4 font-[family-name:var(--font-display)] text-2xl font-black uppercase tracking-tighter text-primary">
              {group.name}
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="font-bold uppercase tracking-wider text-foreground">Wiek</dt>
                <dd className="text-right text-muted-foreground">{group.age}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="font-bold uppercase tracking-wider text-foreground">Grafik</dt>
                <dd className="text-right text-muted-foreground">{group.schedule}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="font-bold uppercase tracking-wider text-foreground">Cena</dt>
                <dd className="text-right font-bold text-foreground">{group.price}</dd>
              </div>
              {group.trainer && (
                <div className="flex justify-between gap-4">
                  <dt className="font-bold uppercase tracking-wider text-foreground">Trener</dt>
                  <dd className="text-right text-muted-foreground">{group.trainer}</dd>
                </div>
              )}
            </dl>
            <button className="mt-6 w-full border-2 border-foreground bg-primary py-2 font-black uppercase tracking-wider text-primary-foreground transition-all hover:bg-foreground">
              Zapisz się
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
