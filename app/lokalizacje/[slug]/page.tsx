import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import { getCityPage } from '@/lib/seo/queries'
import { CityPageView } from '@/components/seo/views'

// Enable dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic'

interface CityPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const cityPage = await getCityPage(slug)

    if (!cityPage) {
      return {}
    }

    return generateSEOMetadata({
      title: cityPage.meta_title || cityPage.h1_title,
      description: cityPage.meta_description || '',
      // Historyczny URL root-level jest wersją kanoniczną (docs/03-mapa-url.md);
      // ten hub zostaje jako duplikat bez 301.
      canonical: `/${slug}/`,
      keywords: `akrobatyka ${slug}, zajęcia akrobatyki, Air Squad ${slug}`,
    })
  } catch {
    return {}
  }
}

// Return empty array - pages will be generated on-demand
export async function generateStaticParams() {
  return []
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params
  const cityPage = await getCityPage(slug)

  if (!cityPage) {
    notFound()
  }

  return (
    <CityPageView
      data={cityPage}
      currentPath={`/lokalizacje/${slug}`}
      parents={[{ name: 'Lokalizacje', url: '/lokalizacje' }]}
    />
  )
}
