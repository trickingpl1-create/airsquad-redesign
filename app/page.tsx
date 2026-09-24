import { getPublicSupabaseClient } from '@/lib/supabase/public'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { CitiesSection } from '@/components/home/cities-section'
import { HowStepsSection } from '@/components/home/how-steps-section'
import { ENROL_CITIES } from '@/lib/content/enrol-cities'
import { MarqueeSection } from '@/components/home/marquee-section'
import { TrainingTypesSection } from '@/components/home/training-types-section'
import { DisciplinesSection } from '@/components/home/disciplines-section'
import { HowAudienceSection } from '@/components/home/how-audience-section'
import { SectionVideoBand } from '@/components/home/section-video-band'
import { CampsSection } from '@/components/home/camps-section'
import { TeamSection } from '@/components/home/team-section'
import { CTASection } from '@/components/home/cta-section'
import { PromoSection } from '@/components/home/promo-section'
import { StructuredData } from '@/lib/seo/metadata'
import { SITE_URL } from '@/lib/seo/site'
import { CLUB_CONTACT } from '@/lib/content/cities'

// Dane organizacji do JSON-LD (Organization + WebSite) — checklista publikacji
// wymaga ich na stronie głównej. Adres = siedziba stowarzyszenia ze stopki;
// telefon/e-mail z CLUB_CONTACT (te same, które widzi użytkownik — NAP musi
// się zgadzać z tym, co jest w treści). Sale treningowe mają własne
// SportsActivityLocation na landingach miast, więc tu nie dublujemy adresów sal.
const ORGANIZATION_JSONLD = {
  '@id': `${SITE_URL}/#organization`,
  name: 'Air Squad',
  legalName: 'Stowarzyszenie Air Squad',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/images/airsquad-logo.png`,
  image: `${SITE_URL}/opengraph-image`,
  telephone: CLUB_CONTACT.phoneSchema,
  email: CLUB_CONTACT.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ul. Wojtyły 227b/6',
    postalCode: '35-304',
    addressLocality: 'Rzeszów',
    addressRegion: 'Podkarpackie',
    addressCountry: 'PL',
  },
  areaServed: ['Rzeszów', 'Dębica', 'Jasło', 'Biecz', 'Brzostek', 'Pilzno'],
  sameAs: ['https://www.instagram.com/airsquad_akrobatyka/'],
  sport: ['Akrobatyka', 'Tricking', 'Tumbling', 'Longboard'],
}

// Tytuł i opis dziedziczone z app/layout.tsx — tu tylko canonical strony głównej
// (każda indeksowana strona musi wskazywać swój adres kanoniczny, docs/02-plan-seo.md).
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

// Strona główna jest cache'owalna (ISR) — publiczne dane, brak cookies().
// Na produkcji przyspiesza render; w dev bez skonfigurowanego Supabase
// (placeholder) pomija martwe zapytania i renderuje od razu na fallbackach.
export const revalidate = 3600

export default async function HomePage() {
  const supabase = getPublicSupabaseClient()

  // training_types nie ma fallbacku i sekcja świadomie chowa się przy pustych
  // danych (TrainingTypesSection → return null), bo DisciplinesSection pokazuje
  // już dyscypliny ze zdjęciami. Trenerzy i obozy idą przez gettery z fallbackiem
  // — inaczej przy pustej bazie znikała cała sekcja „Zespół".
  const [trainingTypes] = supabase
    ? await Promise.all([
        supabase
          .from('training_types')
          .select('*')
          .eq('is_active', true)
          .order('display_order'),
      ]).then((results) => results.map((result) => result.data ?? []))
    : [[]]

  // Sekcja „Zespół" czyta skład z lib/content/team.ts (tak samo jak /trenerzy/),
  // kafelek „KADRA" w hero liczy TEAM.length, a sekcja Air Camp wyprowadza
  // statystyki z LETNI_EVENT — strona główna nie potrzebuje więc żadnego
  // z getterów lib/seo/queries.ts. getCamps()/getCampLandingSlugs() dalej
  // obsługują /obozy/ i landingi turnusów; gettera trenerów już nie ma.

  return (
    <div className="flex min-h-screen flex-col">
      <StructuredData type="SportsOrganization" data={ORGANIZATION_JSONLD} />
      <StructuredData
        type="WebSite"
        data={{
          '@id': `${SITE_URL}/#website`,
          url: `${SITE_URL}/`,
          name: 'Air Squad',
          inLanguage: 'pl-PL',
          publisher: { '@id': `${SITE_URL}/#organization` },
        }}
      />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CitiesSection />
        <HowStepsSection cities={ENROL_CITIES} />
        <PromoSection />
        <MarqueeSection />
        <TeamSection />
        <TrainingTypesSection trainingTypes={trainingTypes} />
        <SectionVideoBand>
          <DisciplinesSection />
          <HowAudienceSection />
        </SectionVideoBand>
        <CampsSection />
        <CTASection cities={ENROL_CITIES} />
      </main>
      <Footer />
    </div>
  )
}
