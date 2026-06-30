import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateSEOMetadata } from '@/lib/seo/metadata'
import { getEvent, getEvents } from '@/lib/seo/queries'
import { EventView } from '@/components/seo/views'

interface EventPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    return {}
  }

  return generateSEOMetadata({
    title: event.meta_title || event.title,
    description: event.meta_description || '',
    // Historyczny URL root-level jest wersją kanoniczną (docs/03-mapa-url.md);
    // ten hub zostaje jako duplikat bez 301.
    canonical: `/${slug}/`,
    keywords: `${event.title}, Air Squad, Wydarzenia`,
  })
}

export async function generateStaticParams() {
  const events = await getEvents()
  return events.map((event) => ({
    slug: event.slug,
  }))
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    notFound()
  }

  return (
    <EventView
      data={event}
      currentPath={`/wydarzenia/${slug}`}
      parents={[{ name: 'Wydarzenia', url: '/wydarzenia' }]}
    />
  )
}
