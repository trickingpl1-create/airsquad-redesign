import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import {
  getCityPages,
  getDisciplines,
  getEnrolmentCities,
  getEvents,
  getStaticPages,
  resolveRootSlug,
} from '@/lib/seo/queries'
import {
  CityPageView,
  DisciplineView,
  EventView,
  StaticPageView,
} from '@/components/seo/views'

// Historyczne URL-e WordPressa są root-level (/rzeszow/, /akrobatyka/, /airmeeting/)
// i wg planu SEO (docs/03-mapa-url.md) NIE mogą zmienić ścieżki. Ten catch-all
// rozwiązuje slug kaskadą: miasta → dyscypliny → wydarzenia → strony statyczne.

export const revalidate = 3600

interface RootSlugPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: RootSlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const resolved = await resolveRootSlug(slug)

  if (!resolved) {
    return {}
  }

  const canonical = `/${slug}/`

  switch (resolved.type) {
    case 'city':
      return generateSEOMetadata({
        title: resolved.data.meta_title || resolved.data.h1_title,
        description: resolved.data.meta_description || '',
        canonical,
        keywords: `akrobatyka ${slug}, zajęcia akrobatyki, Air Squad ${slug}`,
      })
    case 'discipline':
      return generateSEOMetadata({
        title:
          resolved.data.meta_title ||
          resolved.data.h1_title ||
          resolved.data.name,
        description:
          resolved.data.meta_description ||
          resolved.data.short_description ||
          '',
        canonical,
        keywords: `${resolved.data.name}, Air Squad, akrobatyka, trening`,
      })
    case 'event':
      return generateSEOMetadata({
        title: resolved.data.meta_title || resolved.data.title,
        description: resolved.data.meta_description || '',
        canonical,
        keywords: `${resolved.data.title}, Air Squad, Wydarzenia`,
      })
    case 'static':
      return generateSEOMetadata({
        title: resolved.data.meta_title || resolved.data.h1_title || '',
        description: resolved.data.meta_description || '',
        canonical,
        keywords: `Air Squad, ${slug}`,
      })
  }
}

export async function generateStaticParams() {
  const [cityPages, disciplines, events, staticPages] = await Promise.all([
    getCityPages(),
    getDisciplines(),
    getEvents(),
    getStaticPages(),
  ])

  const slugs = new Set<string>()
  for (const item of [...cityPages, ...disciplines, ...events, ...staticPages]) {
    if (item.slug) slugs.add(item.slug)
  }

  return Array.from(slugs).map((slug) => ({ slug }))
}

export default async function RootSlugPage({ params }: RootSlugPageProps) {
  const { slug } = await params
  const resolved = await resolveRootSlug(slug)

  if (!resolved) {
    notFound()
  }

  const currentPath = `/${slug}`

  switch (resolved.type) {
    case 'city':
      return <CityPageView data={resolved.data} currentPath={currentPath} />
    case 'discipline': {
      const cities = await getEnrolmentCities(resolved.data.name)
      return (
        <DisciplineView
          data={resolved.data}
          currentPath={currentPath}
          cities={cities}
        />
      )
    }
    case 'event':
      return <EventView data={resolved.data} currentPath={currentPath} />
    case 'static':
      return <StaticPageView data={resolved.data} currentPath={currentPath} />
  }
}
