import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import { getDiscipline, getDisciplines, getEnrolmentCities } from '@/lib/seo/queries'
import { DisciplineView } from '@/components/seo/views'

interface DisciplinePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: DisciplinePageProps): Promise<Metadata> {
  const { slug } = await params
  const discipline = await getDiscipline(slug)

  if (!discipline) {
    return {}
  }

  return generateSEOMetadata({
    title: discipline.meta_title || discipline.h1_title || discipline.name,
    description: discipline.meta_description || discipline.short_description || '',
    // Historyczny URL root-level jest wersją kanoniczną (docs/03-mapa-url.md);
    // ten hub zostaje jako duplikat bez 301.
    canonical: `/${slug}/`,
    keywords: `${discipline.name}, Air Squad, akrobatyka, trening`,
  })
}

export async function generateStaticParams() {
  const disciplines = await getDisciplines()
  return disciplines.map((discipline) => ({
    slug: discipline.slug,
  }))
}

export default async function DisciplinePage({ params }: DisciplinePageProps) {
  const { slug } = await params
  const discipline = await getDiscipline(slug)

  if (!discipline) {
    notFound()
  }

  const cities = await getEnrolmentCities(discipline.name)

  return (
    <DisciplineView
      data={discipline}
      currentPath={`/dyscypliny/${slug}`}
      parents={[{ name: 'Dyscypliny', url: '/dyscypliny' }]}
      cities={cities}
    />
  )
}
