import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StoreClient } from './store-client'

export const metadata: Metadata = {
  title: 'Sklep - Air Squad',
  description: 'Kup oficjalne gadżetki i odzież Air Squad.',
}

export default function StorePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <StoreClient />
      </main>
      <Footer />
    </>
  )
}
