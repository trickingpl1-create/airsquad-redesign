import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StoreClient } from './store-client'

export const metadata: Metadata = {
  alternates: { canonical: '/sklep/' },
  title: 'Sklep',
  description:
    'Oficjalne gadżety i odzież Air Squad. Zamawiasz online, płacisz u trenera przy odbiorze na treningu.',
}

export default function StorePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* Rytm jak na pozostałych podstronach: fixed header (pasek 28px + 58px)
          wymaga górnego oddechu, stąd pt-32 / md:pt-40. */}
      <main className="flex-1 bg-background pb-24 pt-32 md:pb-32 md:pt-40">
        <StoreClient />
      </main>
      <Footer />
    </div>
  )
}
