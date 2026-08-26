/** @type {import('next').NextConfig} */
const nextConfig = {
  // Panel jest aplikacją serwerową (SSR + proxy auth po cookies) — świadomie
  // BEZ output: 'export'. Statyczny eksport wywala autoryzację (patrz
  // airsquad-web/next.config.mjs i docs/04-architektura.md).
  //
  // admin-app/ jest samowystarczalny: nie importuje niczego spoza swojego
  // katalogu, bo wdrażamy go z CLI wprost stąd (`vercel --prod`), a deploy
  // wysyła tylko ten katalog. Typy bazy są tu kopią pilnowaną przez
  // scripts/check-types-sync.mjs. Dlatego nie ma już turbopack.root ani
  // outputFileTracingRoot wskazujących na katalog nadrzędny.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
