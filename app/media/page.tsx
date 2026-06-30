import { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { InstagramFeed } from '@/components/integrations/instagram-feed'
import { YouTubeSection } from '@/components/integrations/youtube-section'

export const metadata: Metadata = {
  title: 'Media - Air Squad',
  description: 'Galeria wideo i zdjęcia z Air Squad. Śledź nas na Instagramie!',
}

export default function MediaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold font-display mb-2">Media</h1>
            <p className="text-muted-foreground">Wideo i zdjęcia z naszych treningów i eventów</p>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold font-display mb-6">Nasze wideo</h2>
            <YouTubeSection />
          </div>

          <div>
            <h2 className="text-3xl font-bold font-display mb-6">Instagram</h2>
            <p className="text-muted-foreground mb-6">
              Śledź nas na <a href="https://instagram.com/airsquad" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                @airsquad
              </a>
            </p>
            <InstagramFeed limit={12} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
