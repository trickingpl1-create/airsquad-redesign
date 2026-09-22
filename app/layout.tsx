import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
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

// Cookiebot — CMP zgód (RODO). Tryb "manual": baner zgód pokazuje się i zapisuje
// wybór użytkownika, ale NIE blokuje automatycznie skryptów ani iframe'ów. To
// świadoma decyzja — hero-filmy (YouTube) i widget zapisów AIPAX mają grać od
// razu; auto-blokada wstrzymywałaby je do czasu akceptacji. Jeśli w przyszłości
// dojdzie własna analityka (GA/Meta Pixel), trzeba ją otagować data-cookieconsent
// albo przełączyć na data-blockingmode="auto".
// CBID = Domain Group ID z konta manage.cookiebot.com. Dopóki jest placeholderem,
// skrypt się nie renderuje (guard niżej) — żadnego zapytania z błędnym ID.
// CBID przepięty z istniejącego konta Cookiebot starej strony airsquad.pl (tam
// ładowany przez GTM). To samo Domain Group obejmuje subdomeny, więc pokrywa
// new.airsquad.pl i docelowo airsquad.pl — nie zakładamy nowego konta.
// Adnotacja `: string` celowo — bez niej TS zawęża do typu literalnego i przy
// porównaniu w guardzie niżej zgłasza TS2367.
const COOKIEBOT_CBID: string = 'fc61955c-aa38-4593-aecc-45d2739b74ff'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Air Squad — Akrobatyka, Tricking, Longboard',
    template: '%s | Air Squad',
  },
  description:
    'Klub akrobatyczny Air Squad — akrobatyka, tricking, tumbling, longboard i obozy dla dzieci od 4 lat, młodzieży i dorosłych. 6 lokalizacji na Podkarpaciu.',
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
    // /opengraph-image to prawdziwy PNG 1200×630 generowany z app/opengraph-image.tsx
    // (w eksporcie statycznym ląduje jako out/opengraph-image). Wcześniej stało tu
    // logo 592×355 z fałszywie zadeklarowanym 1200×630 — i przykrywało wygenerowany
    // obraz na każdej podstronie, która dziedziczy openGraph z layoutu.
    // Serwer musi mu nadać Content-Type: scripts/make-deploy-zip.sh dopisuje
    // ForceType image/png do .htaccess (plik nie ma rozszerzenia).
    images: [
      {
        url: '/opengraph-image',
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
    images: ['/opengraph-image'],
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
        {/* Cookiebot: strategy="afterInteractive". W trybie manual nic nie jest
            automatycznie blokowane, więc CMP nie musi wystartować przed resztą —
            Next wstrzykuje <script id="Cookiebot"> z atrybutami data-* (uc.js sam
            je odczytuje) po hydracji. beforeInteractive w App Routerze/React 19
            renderuje surowy <script> w drzewie Reacta i sypie błędami hydracji
            („<script> cannot be a child of <html>"), więc świadomie afterInteractive.
            Renderowany dopiero po wpisaniu prawdziwego CBID (patrz stała wyżej). */}
        {COOKIEBOT_CBID !== 'TODO-WKLEJ-CBID' && (
          <Script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={COOKIEBOT_CBID}
            data-blockingmode="manual"
            strategy="afterInteractive"
          />
        )}
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
