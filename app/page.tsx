import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { MarqueeSection } from '@/components/home/marquee-section'
import { TrainingTypesSection } from '@/components/home/training-types-section'
import { DisciplinesSection } from '@/components/home/disciplines-section'
import { HowAudienceSection } from '@/components/home/how-audience-section'
import { CampsSection } from '@/components/home/camps-section'
import { PricingSection } from '@/components/home/pricing-section'
import { LocationsSection } from '@/components/home/locations-section'
import { TeamSection } from '@/components/home/team-section'
import { CTASection } from '@/components/home/cta-section'
import { PromoSection } from '@/components/home/promo-section'

export default async function HomePage() {
  const supabase = await createClient()

  const [trainingTypesResult, locationsResult, campsResult, trainersResult] =
    await Promise.all([
      supabase
        .from('training_types')
        .select('*')
        .eq('is_active', true)
        .order('display_order'),
      supabase
        .from('locations')
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
    ])

  const trainingTypes = trainingTypesResult.data ?? []
  const locations = locationsResult.data ?? []
  const camps = campsResult.data ?? []
  const trainers = trainersResult.data ?? []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PromoSection />
        <MarqueeSection />
        <TrainingTypesSection trainingTypes={trainingTypes} />
        <DisciplinesSection />
        <HowAudienceSection />
        <CampsSection camps={camps} />
        <PricingSection />
        <LocationsSection locations={locations} />
        <TeamSection trainers={trainers} />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
