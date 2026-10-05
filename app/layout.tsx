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
// razu; auto-blokada wstrzymywałaby je do czasu akceptacji. Konsekwencja: każdy
// skrypt zbierający dane musi sam pilnować zgody — patrz GTM niżej.
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
        {/* Google Tag Manager — ten sam kontener, co na starej stronie WordPress
            (sprawdzone w jej HTML przed podmianą 2026-10-05). Wnosi z powrotem
            Google Analytics 4 i Meta Pixel skonfigurowane w panelu GTM, bez
            zakładania nowej usługi — dzięki temu dane lecą do TEJ SAMEJ usługi
            GA4 i historia sprzed podmiany się nie rozjeżdża.

            Zgoda: Cookiebot działa w trybie "manual", więc NIE blokuje skryptów
            sam z siebie — GTM ładuje się dopiero, gdy użytkownik zaakceptuje
            kategorię „statistics". Ładowanie jest w funkcji odpalanej dwa razy:
            raz od razu (gdy zgoda była zapisana we wcześniejszej wizycie), raz na
            zdarzeniu CookiebotOnAccept (gdy klika teraz). Guard __gtmLoaded
            pilnuje, żeby kontener nie wszedł dwa razy i nie dublował odsłon.

            Świadomie NIE tagujemy skryptu przez type="text/plain"
            + data-cookieconsent: next/script wstrzykuje element po hydracji, a
            Cookiebot przepisuje typy przy swoim starcie — przy tej kolejności
            skrypt potrafi nigdy nie wystartować. Jawny warunek jest pewniejszy. */}
        <Script id="gtm-consented" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function airsquadLoadGTM() {
            if (window.__gtmLoaded) return;
            window.__gtmLoaded = true;
            (function(w,d,s,l,i){
              w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
              var f = d.getElementsByTagName(s)[0],
                  j = d.createElement(s),
                  dl = l != 'dataLayer' ? '&l=' + l : '';
              j.async = true;
              j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
              f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-W44NNPZ');
          }
          if (window.Cookiebot && window.Cookiebot.consent && window.Cookiebot.consent.statistics) {
            airsquadLoadGTM();
          }
          window.addEventListener('CookiebotOnAccept', function () {
            if (window.Cookiebot && window.Cookiebot.consent && window.Cookiebot.consent.statistics) {
              airsquadLoadGTM();
            }
          });
        `}</Script>
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
            Statystyki idą przez GTM wyżej (GA4 + Meta Pixel z panelu GTM). */}
      </body>
    </html>
  )
}
