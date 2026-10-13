import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CampView } from '@/components/seo/camp-view'
import { getEvent } from '@/lib/seo/queries'
import { generateSEOMetadata } from '@/lib/seo/metadata'

// /aircamp/ to ten sam Air Camp co /letni/ — renderujemy DOKŁADNIE ten sam widok
// (CampView z danymi LETNI_EVENT), żeby obie ścieżki były spójne (decyzja
// użytkownika 2026-10-13). Kanoniczny pozostaje historyczny adres /letni/, więc
// Google konsoliduje duplikat. Logo Air Camp 2027 pochodzi z CampView (wspólny
// plik public/images/aircamp-2026-logo.webp).
export const metadata: Metadata = generateSEOMetadata({
  title: 'Air Camp 2027 — Obóz sportowo-rekreacyjny',
  description:
    'Letni obóz Air Squad — akrobatyka, longboard, kajaki, paintball. Zapisy dla dzieci i młodzieży.',
  canonical: '/letni/',
})

export default async function AircampPage() {
  const camp = await getEvent('letni')
  if (!camp) notFound()
  // currentPath = '/letni' — strona samoreferuje się do kanonicznego adresu
  // (breadcrumb, dane strukturalne), zgodnie z canonical powyżej.
  return <CampView data={camp} currentPath="/letni" />
}
