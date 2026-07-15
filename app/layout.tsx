import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Covered_By_Your_Grace } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { SITE_URL } from '@/lib/seo/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
})

const coveredByYourGrace = Covered_By_Your_Grace({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-covered-by-your-grace',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '700'],
})

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
    { media: '(prefers-color-scheme: light)', color: '#FAF8F2' },
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
      className={`${inter.variable} ${coveredByYourGrace.variable} ${jetbrainsMono.variable} bg-background`}
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
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
