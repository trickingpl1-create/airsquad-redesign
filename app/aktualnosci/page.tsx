import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionHeader } from '@/components/home/section-header'
import { CLUB_CONTACT } from '@/lib/content/cities'
import { NewsCard, type NewsItem } from '@/components/aktualnosci/news-card'

export const metadata = {
  alternates: { canonical: '/aktualnosci/' },
  title: 'Aktualności',
  description:
    'Ogłoszenia klubu Air Squad — wydarzenia, obozy, zapisy i bieżące informacje dla rodziców i zawodników.',
}

// Cztery aktualne ogłoszenia z airsquad.pl/aktualnosci/ (2026-09-22). „Tablica
// ogłoszeń", nie chronologiczny blog — aktualizowana ręcznie w kodzie, bez DB.
// Kafle rozwijają szczegóły po kliknięciu (wariant A, components/aktualnosci/news-card).
const news: NewsItem[] = [
  {
    kicker: 'Wydarzenie',
    accentClass: 'text-cyan',
    title: 'AIR Meeting 2026',
    short: 'Spotkanie, zawody i wspólne emocje — zapisy na edycję 2026 już otwarte.',
    photo: '/images/akrobatyka/hero-salto.jpg',
    full: 'Relacja z AIR Meeting 2025 już dostępna — niezapomniane, przepełnione pozytywną energią spotkanie dla członków klubu: zawody, pokazy i wspólna zabawa. Zapisy na edycję 2026 ruszyły, liczba miejsc ograniczona.',
    cta: 'Więcej informacji / zapisy',
    href: '/airmeeting',
  },
  {
    kicker: 'Lato 2026',
    accentClass: 'text-emerald',
    title: 'Air Camp — letni obóz',
    short: 'Połowa miejsc wyprzedana. Longboardy, kajaki, SUP, paintball, akrobatyka i tricking.',
    photo: '/images/old-site/aircamp-wodny.jpg',
    full: 'Sprawdzeni instruktorzy i program bez miejsca na nudę: longboardy, kajaki i SUP-y, paintball, akrobatyka / tricking / taniec, gry terenowe i wiele więcej. Zapisz się przez stronę lub zadzwoń — połowa miejsc już wyprzedana.',
    meta: `☎ ${CLUB_CONTACT.phone} · trener Gabriel`,
    cta: 'Zobacz turnusy',
    href: '/letni',
  },
  {
    kicker: 'Zapisy',
    accentClass: 'text-amber',
    title: 'Dane do przelewu',
    short: 'Numer konta i dane do wpłat za zajęcia oraz obozy.',
    photo: '/images/old-site/hala-airspace.jpg',
    meta: 'Stowarzyszenie Air Squad\n93 1600 1332 1710 4762 0000 0002\nul. Kard. Karola Wojtyły 227b/6, 35-304 Rzeszów\nTytułem wpłaty: imię i nazwisko uczestnika + sekcja.',
  },
  {
    kicker: 'Sklep klubowy',
    accentClass: 'text-violet-soft',
    title: 'Koszulki klubowe',
    short: 'Koszulka Air Squad 50 zł, nadruk imienia na plecach +10 zł.',
    photo: '/images/old-site/dorosli-ekipa.jpg',
    full: 'Do wyboru rozmiary dziecięce i dorosłe. Zamówienia SMS-em z podaniem rozmiaru i ewentualnego imienia do nadruku na plecach.',
    meta: `SMS: ${CLUB_CONTACT.phone}`,
  },
]

export default function NewsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <SectionHeader
            as="h1"
            kicker="Aktualności"
            kickerColorClass="text-emerald"
            title="Co słychać"
            gradientPart="w klubie."
            titleFontWeight={500}
            gradientFontWeight={500}
          />
          <div className="mt-2 grid grid-cols-1 gap-5 md:grid-cols-2">
            {news.map((item) => (
              <NewsCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
