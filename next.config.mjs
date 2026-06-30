/** @type {import('next').NextConfig} */
const nextConfig = {
  // WordPress na airsquad.pl używa URL-i ze slashem; canonicale wskazują wersję ze slashem.
  // Bez tego każdy stary URL dostaje 308 i część SEO equity wycieka (docs/02-plan-seo.md).
  trailingSlash: true,
  turbopack: {
    root: import.meta.dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
