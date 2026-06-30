import { createClient } from '@/lib/supabase/server'
import { OrdersClient } from './orders-client'

export const metadata = {
  title: 'Zamowienia',
}

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, preferred_location:locations(id, name, city)')
    .order('created_at', { ascending: false })

  const { data: locations } = await supabase
    .from('locations')
    .select('id, name, city')
    .eq('is_active', true)
    .order('display_order')

  return <OrdersClient initialData={orders || []} locations={locations || []} />
}
