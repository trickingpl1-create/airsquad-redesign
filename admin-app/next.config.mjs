import path from 'node:path'

// Katalog nadrzędny (airsquad-web) trzyma jedyne źródło typów bazy —
// lib/types/database.ts, re-eksportowane tutaj przez lib/types/database.ts.
// Turbopack i tracing plików muszą widzieć oba katalogi, stąd wspólny root.
// Na Vercelu wymaga to włączonego „Include files outside of the Root Directory
// in the Build Step" w ustawieniach projektu.
const repoRoot = path.join(import.meta.dirname, '..')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Panel jest aplikacją serwerową (SSR + proxy auth po cookies) — świadomie
  // BEZ output: 'export'. Statyczny eksport wywala autoryzację (patrz
  // airsquad-web/next.config.mjs i docs/04-architektura.md).
  trailingSlash: true,
  turbopack: {
    root: repoRoot,
  },
  outputFileTracingRoot: repoRoot,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
