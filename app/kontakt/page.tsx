import { Metadata } from 'next'
import { isWithdrawnLocation } from '@/lib/content/withdrawn-locations'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SectionHeader } from '@/components/home/section-header'
import { CLUB_CONTACT } from '@/lib/content/cities'
import { MapPin, Phone, Mail, Instagram } from 'lucide-react'

export const metadata: Metadata = {
  alternates: { canonical: '/kontakt/' },
  title: 'Kontakt',
  description:
    'Skontaktuj się z Air Squad — telefon, email, social media. Zapisy na zajęcia online przez kalendarz AIPAX na podstronie Twojego miasta.',
}

// Chipy miast — zapisy dzieci idą przez kalendarze AIPAX na podstronach
// (chronione root-slugi SEO), nie przez formularz kontaktowy.
const ALL_CITY_CHIPS = [
  { city: 'Rzeszów', slug: '/rzeszow/' },
  { city: 'Dębica', slug: '/debica/' },
  { city: 'Jasło', slug: '/jaslo/' },
  { city: 'Biecz', slug: '/biecz/' },
  { city: 'Brzostek', slug: '/brzostek/' },
  { city: 'Pilzno', slug: '/pilzno/' },
  { city: 'Tyczyn', slug: '/tyczyn/' },
] as const

// Wycofane lokalizacje znikają z listy, ale ich strony zostają pod adresami.
const CITY_CHIPS = ALL_CITY_CHIPS.filter(
  (chip) => !isWithdrawnLocation(chip.slug.replaceAll('/', ''))
)

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/airsquad_akrobatyka' },
  { label: 'TikTok', href: 'https://tiktok.com/@airsquad' },
  { label: 'YouTube', href: 'https://youtube.com/@airsquad' },
  { label: 'Facebook', href: 'https://facebook.com/airsquad' },
] as const

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background pt-24">
        <section className="container mx-auto px-4 pb-20 pt-12">
          <SectionHeader
            as="h1"
            kicker="Kontakt"
            kickerColorClass="text-cyan"
            title="Napisz."
            gradientPart="Zadzwoń."
            titleFontWeight={400}
            gradientFontWeight={400}
            meta="[Odpowiadamy w 24h] // pn–pt"
            className="mb-8 md:mb-10"
          />

          {/* Zapisy — kierujemy do kalendarzy AIPAX miast */}
          <div className="mb-6 rounded-3xl border-2 border-dashed border-violet-soft/50 bg-violet-soft/5 p-6 md:p-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
              Chcesz zapisać dziecko?
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Najszybciej przez kalendarz zapisów AIPAX na podstronie Twojego miasta — wybierasz
              grupę, wypełniasz formularz i gotowe. O ostatecznym przydziale do grupy decyduje
              trener.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {CITY_CHIPS.map((c) => (
                <Link
                  key={c.slug}
                  href={c.slug}
                  className="rounded-full border border-violet-soft/30 bg-violet-soft/10 px-4 py-1.5 font-mono text-xs text-violet-soft transition-colors hover:bg-violet-soft/20"
                >
                  {c.city}
                </Link>
              ))}
              <Link
                href="/grafik/"
                className="rounded-full border border-border px-4 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Pełny grafik →
              </Link>
            </div>
          </div>

          {/* Karty kontaktowe */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href={`tel:${CLUB_CONTACT.phoneSchema}`}
              className="group rounded-3xl border border-border bg-card p-6 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            >
              <Phone className="h-6 w-6 text-emerald" aria-hidden />
              <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-emerald">
                Telefon
              </p>
              <p className="display-bold mt-2 text-xl text-foreground" style={{ fontWeight: 500 }}>
                {CLUB_CONTACT.phone}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                klub · zapisy
              </p>
              <p className="mt-3 text-base text-foreground transition-colors group-hover:text-cyan">
                {CLUB_CONTACT.phoneTrainer}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                trener Gabriel
              </p>
            </a>

            <a
              href={`mailto:${CLUB_CONTACT.email}`}
              className="group rounded-3xl border border-border bg-card p-6 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            >
              <Mail className="h-6 w-6 text-violet-soft" aria-hidden />
              <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-violet-soft">
                Email
              </p>
              <p className="mt-2 break-all text-base text-foreground transition-colors group-hover:text-cyan">
                {CLUB_CONTACT.email}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                pytania · faktury · współpraca
              </p>
            </a>

            <div className="rounded-3xl border border-border bg-card p-6">
              <MapPin className="h-6 w-6 text-pink" aria-hidden />
              <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-pink">
                Siedziba
              </p>
              <p className="mt-2 text-base text-foreground">ul. Wojtyły 227b/6</p>
              <p className="text-base text-foreground">35-304 Rzeszów</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                Stowarzyszenie Air Squad
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <Instagram className="h-6 w-6 text-cyan" aria-hidden />
              <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cyan">
                Social media
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-cyan/25 bg-cyan/10 px-2 py-0.5 font-mono text-[11px] text-cyan transition-colors hover:bg-cyan/20"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                @airsquad_akrobatyka
              </p>
            </div>
          </div>

        </section>
      </main>
      <Footer />
    </div>
  )
}
