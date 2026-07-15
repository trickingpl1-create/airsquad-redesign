import { getPublicSupabaseClient } from '@/lib/supabase/public'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { CitiesSection } from '@/components/home/cities-section'
import { MarqueeSection } from '@/components/home/marquee-section'
import { TrainingTypesSection } from '@/components/home/training-types-section'
import { DisciplinesSection } from '@/components/home/disciplines-section'
import { HowAudienceSection } from '@/components/home/how-audience-section'
import { CampsSection } from '@/components/home/camps-section'
import { TeamSection } from '@/components/home/team-section'
import { CTASection } from '@/components/home/cta-section'
import { PromoSection } from '@/components/home/promo-section'

// Strona główna jest cache'owalna (ISR) — publiczne dane, brak cookies().
// Na produkcji przyspiesza render; w dev bez skonfigurowanego Supabase
// (placeholder) pomija martwe zapytania i renderuje od razu na fallbackach.
export const revalidate = 3600

export default async function HomePage() {
  const supabase = getPublicSupabaseClient()

  const [trainingTypes, camps, trainers] = supabase
    ? await Promise.all([
        supabase
          .from('training_types')
          .select('*')
          .eq('is_active', true)
          .order('display_order'),
        supabase
          .from('camps')
          .select('*')
          .eq('is_active', true)
          .eq('is_featured', true)
          .gte('end_date', new Date().toISOString().split('T')[0])
          .order('start_date')
          .limit(2),
        supabase
          .from('trainers')
          .select('*')
          .eq('is_active', true)
          .order('display_order')
          .limit(8),
      ]).then((results) => results.map((result) => result.data ?? []))
    : [[], [], []]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CitiesSection />
        <PromoSection />
        <MarqueeSection />
        <TrainingTypesSection trainingTypes={trainingTypes} />
        <DisciplinesSection />
        <HowAudienceSection />
        <CampsSection camps={camps} />
        <TeamSection trainers={trainers} />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
