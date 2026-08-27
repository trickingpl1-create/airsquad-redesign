import type { Metadata, Viewport } from 'next'
// Fonty self-hosted z paczek @fontsource (te same kroje co wcześniej z Google
// Fonts). Powody: build nie zależy od sieci (next/font/google pobiera CSS
// z fonts.googleapis.com w czasie builda i wywala się offline/za firewallem),
// a pliki i tak serwujemy z własnej domeny. Zmienne CSS ustawia globals.css.
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource/covered-by-your-grace'
import { ThemeProvider } from '@/components/theme-provider'
import { EnrolFab } from '@/components/enrol-fab'
import { ENROL_CITIES } from '@/lib/content/enrol-cities'
import { SITE_URL } from '@/lib/seo/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Air Squad — Akrobatyka, Tricking, Longboard',
    template: '%s | Air Squad',
  },
  description:
    'Klub akrobatyczny Air Squad — akrobatyka, tricking, tumbling, longboard i obozy dla dzieci od 4 lat, młodzieży i dorosłych. 8 lokalizacji na Podkarpaciu.',
  keywords: [
    'akrobatyka',
    'tricking',
    'tumbling',
    'longboard',
    'gimnastyka',
    'obozy sportowe',
    'Rzeszów',
    'Podkarpacie',
    'Air Squad',
    'zajęcia dla dzieci',
  ],
  authors: [{ name: 'Air Squad' }],
  icons: {
    icon: '/images/airsquad-logo.png',
    apple: '/images/airsquad-logo.png',
  },
  openGraph: {
    title: 'Air Squad — Akrobatyka, Tricking, Longboard',
    description: 'Dołącz do najlepszego klubu akrobatycznego w regionie. Pierwszy trening za 40 zł.',
    url: SITE_URL,
    siteName: 'Air Squad',
    locale: 'pl_PL',
    type: 'website',
    images: [
      {
        url: '/images/airsquad-logo.png',
        width: 1200,
        height: 630,
        alt: 'Air Squad — Akrobatyka, Tricking, Longboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Air Squad — Akrobatyka, Tricking, Longboard',
    description: 'Dołącz do najlepszego klubu akrobatycznego w regionie. Pierwszy trening za 40 zł.',
    images: ['/images/airsquad-logo.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0F' },
    { media: '(prefers-color-scheme: light)', color: '#F3F0FF' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pl"
      className="bg-background"
      suppressHydrationWarning
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <EnrolFab cities={ENROL_CITIES} />
        </ThemeProvider>
        {/* Bez <Analytics /> z @vercel/analytics — skrypt ładuje się z
            /_vercel/insights/script.js, które istnieje tylko na Vercelu.
            Na docelowym serwerze statycznym dawał 404 przy każdym wejściu.
            Statystyki: dołożyć skrypt hostowany osobno (Plausible/Umami/GA). */}
      </body>
    </html>
  )
}
