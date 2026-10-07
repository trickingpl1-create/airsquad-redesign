import { Metadata } from 'next'

interface SEOMetadata {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  keywords?: string
  author?: string
  noindex?: boolean
}

// Wspólne wartości Open Graph. Next.js NIE scala obiektu openGraph z layoutem —
// strona, która ustawia własne openGraph, zastępuje go w całości. Dlatego każda
// strona dostaje komplet (obraz, url, siteName, locale) z tego jednego miejsca;
// wcześniej 29 stron traciło og:image, a huby dziedziczyły og:url i tytuł
// strony głównej (audyt 2026-10-06, F30/F31).
export const SITE_NAME = 'Air Squad'
export const DEFAULT_SOCIAL = {
  title: 'Air Squad — Akrobatyka, Tricking, Longboard',
  description: 'Dołącz do najlepszego klubu akrobatycznego w regionie. Pierwszy trening za 40 zł.',
}
// /opengraph-image = PNG 1200×630 z app/opengraph-image.tsx (eksport statyczny:
// out/opengraph-image; Content-Type nadaje ForceType w .htaccess).
export const DEFAULT_OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: DEFAULT_SOCIAL.title,
}

export function generateSEOMetadata(seo: SEOMetadata): Metadata {
  // Tytuł strony dostaje sufiks „| Air Squad” z szablonu w layoucie; og:title
  // szablonu nie dziedziczy, więc markę dopisujemy tu (bez dublowania).
  const socialTitle = seo.title.includes(SITE_NAME) ? seo.title : `${seo.title} | ${SITE_NAME}`
  const images = seo.ogImage ? [{ url: seo.ogImage }] : [DEFAULT_OG_IMAGE]

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: seo.author ? [{ name: seo.author }] : undefined,
    robots: {
      index: !seo.noindex,
      follow: true,
      nocache: false,
    },
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      title: socialTitle,
      description: seo.description,
      type: (seo.ogType as any) || 'website',
      url: seo.canonical,
      siteName: SITE_NAME,
      locale: 'pl_PL',
      images,
    },
    twitter: {
      card: (seo.twitterCard as any) || 'summary_large_image',
      title: socialTitle,
      description: seo.description,
      images: images.map((image) => image.url),
    },
  }
}

interface StructuredDataProps {
  type:
    | 'LocalBusiness'
    | 'Event'
    | 'Course'
    | 'WebPage'
    | 'BreadcrumbList'
    | 'SportsActivityLocation'
    | 'FAQPage'
    // Organization + WebSite na stronie głównej i ContactPage na /kontakt/ —
    // wymagane przez checklistę publikacji (_referencje/analizy-seo/14) i plan
    // SEO; do audytu 2026-09-06 strona główna nie miała żadnego JSON-LD.
    | 'Organization'
    | 'SportsOrganization'
    | 'WebSite'
    | 'ContactPage'
  data: Record<string, any>
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbList({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbs = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://airsquad.pl'}${item.url}`,
  }))

  return (
    <StructuredData
      type="BreadcrumbList"
      data={{
        itemListElement: breadcrumbs,
      }}
    />
  )
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <>
      <BreadcrumbList items={items} />
      <nav className="mb-6 flex flex-wrap gap-2 text-sm" aria-label="Breadcrumb">
        {items.map((item, index) => (
          <div key={item.url} className="flex items-center gap-2">
            {index > 0 && <span className="text-muted-foreground">/</span>}
            {index === items.length - 1 ? (
              <span className="font-semibold text-foreground">{item.name}</span>
            ) : (
              <a
                href={item.url}
                className="text-primary hover:underline"
              >
                {item.name}
              </a>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}
