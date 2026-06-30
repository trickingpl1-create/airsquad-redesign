import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AipaxWidget } from '@/components/aipax-widget'
import { ScheduleClient } from './schedule-client'

export const metadata = {
  title: 'Grafik zajęć',
  description: 'Sprawdź grafik zajęć Air Squad. Akrobatyka, tricking, skoki na ścieżce w 7 lokalizacjach.',
}

export default async function SchedulePage() {
  const supabase = await createClient()

  const [sessionsResult, locationsResult, typesResult] = await Promise.all([
    supabase
      .from('training_sessions')
      .select(`
        *,
        training_type:training_types(*),
        location:locations(*),
        trainer:trainers(*)
      `)
      .eq('is_active', true)
      .order('day_of_week')
      .order('start_time'),
    supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('display_order'),
    supabase
      .from('training_types')
      .select('*')
      .eq('is_active', true)
      .order('display_order'),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-24">
        <ScheduleClient
          sessions={sessionsResult.data || []}
          locations={locationsResult.data || []}
          trainingTypes={typesResult.data || []}
        />

        {/* Zapisy online — widget AIPAX */}
        <section className="container mx-auto px-4 pb-16">
          <AipaxWidget />
        </section>
      </main>
      <Footer />
    </div>
  )
}
