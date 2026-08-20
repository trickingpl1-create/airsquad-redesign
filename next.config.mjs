/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strona publiczna jest w pełni statyczna — build wypluwa katalog `out/`
  // do wgrania na zwykły serwer (nginx/Apache), bez Node.js. Konsekwencje:
  // brak ISR, brak middleware/proxy, brak route handlerów i renderu on-demand,
  // więc każdy URL musi być znany w czasie builda (generateStaticParams).
  // Panel admina jest osobną aplikacją serwerową w admin-app/.
  output: 'export',
  // WordPress na airsquad.pl używa URL-i ze slashem; canonicale wskazują wersję ze slashem.
  // Bez tego każdy stary URL dostaje 308 i część SEO equity wycieka (docs/02-plan-seo.md).
  // W eksporcie statycznym daje to katalogi z index.html — dokładnie to,
  // czego potrzebuje serwer plików, żeby /rzeszow/ działało bez przepisywania.
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
