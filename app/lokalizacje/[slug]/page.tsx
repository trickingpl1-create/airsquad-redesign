import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import { getCityPage, getCityPages } from '@/lib/seo/queries'
import { CityPageView } from '@/components/seo/city-view'

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

// Eksport statyczny wymaga pełnej listy slugów w czasie builda — nie ma
// renderu on-demand. Ten hub jest duplikatem kanonicznego `/{slug}/`
// (docs/03-mapa-url.md), więc listę bierzemy z tego samego gettera.
export async function generateStaticParams() {
  const cityPages = await getCityPages()
  return cityPages.map((page) => ({ slug: page.slug }))
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
