import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/seo/site'

// Sitemapa wystawia wyłącznie kanoniczne URL-e: historyczne slugi root-level
// ze slashem (zgodnie z trailingSlash i canonicalami z WordPressa) plus nowe huby.
// Wersje prefiksowane (/lokalizacje/rzeszow/) to duplikaty — celowo ich tu nie ma.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Fetch all dynamic content
  const [cityPages, events, disciplines, staticPages] = await Promise.all([
    supabase.from('city_pages').select('slug, updated_at').eq('is_published', true),
    supabase.from('events').select('slug, updated_at').eq('is_published', true),
    supabase.from('disciplines').select('slug, updated_at').eq('is_published', true),
    supabase.from('static_pages').select('slug, updated_at').eq('is_published', true),
  ])

  // Static pages
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/lokalizacje/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/dyscypliny/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/wydarzenia/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/grafik/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/trenerzy/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/obozy/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/sklep/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/kontakt/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/franczyza/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Historyczne slugi root-level — miasta mają najwyższy priorytet (lokalne SEO)
  const cityEntries: MetadataRoute.Sitemap = (cityPages.data || []).map(
    (page: any) => ({
      url: `${SITE_URL}/${page.slug}/`,
      lastModified: new Date(page.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })
  )

  const disciplineEntries: MetadataRoute.Sitemap = (disciplines.data || []).map(
    (discipline: any) => ({
      url: `${SITE_URL}/${discipline.slug}/`,
      lastModified: new Date(discipline.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })
  )

  const eventEntries: MetadataRoute.Sitemap = (events.data || []).map(
    (event: any) => ({
      url: `${SITE_URL}/${event.slug}/`,
      lastModified: new Date(event.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })
  )

  const staticPageEntries: MetadataRoute.Sitemap = (staticPages.data || []).map(
    (page: any) => ({
      url: `${SITE_URL}/${page.slug}/`,
      lastModified: new Date(page.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })
  )

  // Deduplikacja po URL — jeden slug może wystąpić tylko raz
  const seen = new Set<string>()
  return [
    ...staticEntries,
    ...cityEntries,
    ...disciplineEntries,
    ...eventEntries,
    ...staticPageEntries,
  ].filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
