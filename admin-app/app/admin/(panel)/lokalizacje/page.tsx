import { createClient } from '@/lib/supabase/server'
import { LocationsClient } from './locations-client'

export const metadata = {
  title: 'Lokalizacje',
}

export default async function LocationsPage() {
  const supabase = await createClient()

  const { data: locations, error } = await supabase
    .from('locations')
    .select('*')
    .order('display_order')

  if (error) {
    console.error('Error fetching locations:', error)
  }

  return <LocationsClient initialData={locations || []} />
}
