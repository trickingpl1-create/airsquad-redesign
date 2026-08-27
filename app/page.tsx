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
import { CampsSection } from '@/components/home/camps-section'
import { TeamSection } from '@/components/home/team-section'
import { CTASection } from '@/components/home/cta-section'
import { PromoSection } from '@/components/home/promo-section'

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
  // a sekcja Air Camp nie pokazuje już karty turnusu — strona główna nie
  // potrzebuje więc żadnego z getterów. getCamps()/getCampLandingSlugs() dalej
  // obsługują /obozy/ i landingi turnusów. getTrainers() nie ma już natomiast
  // ani jednego wywołania — zostaje jako część API zapytań, do usunięcia razem
  // z FALLBACK_TRAINERS, jeśli tabela `trainers` ma zniknąć z modelu.

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CitiesSection />
        <HowStepsSection cities={ENROL_CITIES} />
        <PromoSection />
        <MarqueeSection />
        <TrainingTypesSection trainingTypes={trainingTypes} />
        <DisciplinesSection />
        <HowAudienceSection />
        <CampsSection />
        <TeamSection />
        <CTASection cities={ENROL_CITIES} />
      </main>
      <Footer />
    </div>
  )
}
