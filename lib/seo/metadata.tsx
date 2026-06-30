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

export function generateSEOMetadata(seo: SEOMetadata): Metadata {
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
      title: seo.title,
      description: seo.description,
      type: (seo.ogType as any) || 'website',
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      card: (seo.twitterCard as any) || 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  }
}

interface StructuredDataProps {
  type: 'LocalBusiness' | 'Event' | 'Course' | 'WebPage' | 'BreadcrumbList'
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
