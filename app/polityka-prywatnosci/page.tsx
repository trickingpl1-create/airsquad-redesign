import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { generateSEOMetadata } from '@/lib/seo/metadata'

// Historyczny URL WordPressa (był w sitemapie starej strony) + wymóg prawny:
// stopka linkuje do tej strony z każdej podstrony. Stara strona miała pod tym
// adresem pustą treść, więc tekst poniżej powstał od zera — przy zmianie
// zakresu przetwarzania (analityka, piksele, nowy system zapisów) zaktualizuj
// odpowiednią sekcję.
export const metadata: Metadata = generateSEOMetadata({
  title: 'Polityka prywatności | Air Squad',
  description:
    'Polityka prywatności serwisu airsquad.pl — kto jest administratorem danych, w jakim celu przetwarzamy dane z zapisów i kontaktu oraz jakie prawa przysługują Ci na gruncie RODO.',
  canonical: '/polityka-prywatnosci/',
})

const SECTIONS = [
  {
    heading: '1. Administrator danych',
    body: [
      'Administratorem danych osobowych jest Stowarzyszenie Air Squad z siedzibą przy ul. Wojtyły 227b/6, 35-304 Rzeszów („Klub", „my"). W sprawach dotyczących danych osobowych możesz się z nami skontaktować e-mailem na adres klub.airsquad@gmail.com lub telefonicznie pod numerem 728 559 101.',
    ],
  },
  {
    heading: '2. Jakie dane przetwarzamy i po co',
    body: [
      'Zapisy na zajęcia, obozy i wydarzenia: imię i nazwisko uczestnika oraz rodzica/opiekuna, wiek uczestnika, numer telefonu i adres e-mail, wybrana lokalizacja i grupa. Dane podajesz w formularzu zapisów obsługiwanym przez zewnętrzny system rezerwacyjny AIPAX (aipax.pro). Podstawa: niezbędność do zawarcia i wykonania umowy o udział w zajęciach (art. 6 ust. 1 lit. b RODO).',
      'Kontakt e-mailowy i telefoniczny: dane, które sam podasz w wiadomości. Podstawa: nasz prawnie uzasadniony interes, czyli obsługa korespondencji (art. 6 ust. 1 lit. f RODO).',
      'Rozliczenia składek i opłat: dane niezbędne do wystawienia dokumentów księgowych. Podstawa: obowiązek prawny (art. 6 ust. 1 lit. c RODO).',
      'Wizerunek uczestników (zdjęcia i nagrania z zajęć, obozów i wydarzeń publikowane na stronie i w social mediach): wyłącznie na podstawie odrębnej zgody rodzica/opiekuna (art. 6 ust. 1 lit. a RODO). Zgodę można wycofać w każdej chwili.',
    ],
  },
  {
    heading: '3. Komu przekazujemy dane',
    body: [
      'Dane trafiają wyłącznie do podmiotów, które pomagają nam prowadzić Klub: operatora systemu zapisów AIPAX, dostawcy hostingu strony i poczty (cyber_Folks S.A.), biura księgowego oraz — w zakresie e-maili — dostawcy skrzynki pocztowej (Google). Nie sprzedajemy danych i nie udostępniamy ich w celach marketingowych podmiotom trzecim.',
    ],
  },
  {
    heading: '4. Jak długo przechowujemy dane',
    body: [
      'Dane z zapisów — przez czas udziału w zajęciach oraz okres przedawnienia ewentualnych roszczeń. Dane rozliczeniowe — przez okres wymagany przepisami podatkowymi (5 lat). Korespondencję — do zakończenia sprawy, nie dłużej niż 2 lata. Wizerunek — do wycofania zgody.',
    ],
  },
  {
    heading: '5. Twoje prawa',
    body: [
      'Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz sprzeciwu wobec przetwarzania opartego na naszym prawnie uzasadnionym interesie. Zgodę (np. na wizerunek) możesz wycofać w każdej chwili — bez wpływu na zgodność z prawem przetwarzania sprzed wycofania. Przysługuje Ci też skarga do Prezesa Urzędu Ochrony Danych Osobowych (uodo.gov.pl).',
    ],
  },
  {
    heading: '6. Pliki cookies i usługi zewnętrzne',
    body: [
      'Strona airsquad.pl nie używa własnych plików cookies do śledzenia ani analityki. Elementy dostarczane przez podmioty zewnętrzne — widget zapisów AIPAX oraz osadzone treści z serwisów społecznościowych (Instagram, TikTok, YouTube, Facebook) — mogą zapisywać własne pliki cookies zgodnie z politykami tych serwisów. Możesz nimi zarządzać w ustawieniach przeglądarki.',
    ],
  },
  {
    heading: '7. Zmiany polityki',
    body: [
      'Politykę aktualizujemy, gdy zmienia się zakres przetwarzania danych (np. nowe narzędzia analityczne albo nowy system zapisów). Obowiązująca wersja jest zawsze publikowana pod tym adresem.',
    ],
  },
] as const

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pt-24">
        <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cyan">
            Dokumenty klubu
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-black uppercase leading-none tracking-tighter text-foreground md:text-6xl">
            Polityka prywatności
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Ostatnia aktualizacja: 26 sierpnia 2026
          </p>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold text-foreground">
                  {section.heading}
                </h2>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-3 leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <p className="mt-14 text-sm text-muted-foreground">
            Pytania o dane osobowe? Napisz:{' '}
            <a
              href="mailto:klub.airsquad@gmail.com"
              className="text-cyan underline underline-offset-4"
            >
              klub.airsquad@gmail.com
            </a>{' '}
            albo odwiedź stronę{' '}
            <Link href="/kontakt/" className="text-cyan underline underline-offset-4">
              kontaktu
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
