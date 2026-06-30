import { createClient } from '@/lib/supabase/server'
import { TrainersClient } from './trainers-client'

export const metadata = {
  title: 'Trenerzy',
}

export default async function TrainersPage() {
  const supabase = await createClient()

  const { data: trainers } = await supabase
    .from('trainers')
    .select('*')
    .order('display_order')

  return <TrainersClient initialData={trainers || []} />
}
