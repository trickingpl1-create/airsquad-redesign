import { createClient } from '@/lib/supabase/server'
import { OrderFlowClient } from './order-flow-client'

export const metadata = {
  title: 'Podgląd zamówienia',
}

export default async function OrderFlowPreviewPage() {
  const supabase = await createClient()

  // Celowo Z filtrem is_active i sortowaniem po display_order — dokładnie tak
  // pyta sklep (app/sklep/store-client.tsx). Ścieżkę zakupu pokazujemy na tym,
  // co klient realnie może kupić; gdy baza jest pusta, klient bierze dane
  // przykładowe wpisane w kod.
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  return <OrderFlowClient products={products || []} />
}
