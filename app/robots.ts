import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

// Eksport statyczny — robots.txt zapieka się w czasie builda (out/robots.txt).
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
