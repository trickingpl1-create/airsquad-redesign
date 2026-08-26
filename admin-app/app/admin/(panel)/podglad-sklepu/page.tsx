import { createClient } from '@/lib/supabase/server'
import { ShopPreviewClient } from './shop-preview-client'

export const metadata = {
  title: 'Podgląd sklepu',
}

export default async function ShopPreviewPage() {
  const supabase = await createClient()

  // Celowo BEZ filtra is_active — panel pokazuje też produkty ukryte,
  // przygaszone i opisane. Sklep filtruje je zapytaniem; tutaj chodzi
  // właśnie o to, żeby było widać, czego klient nie zobaczy.
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('display_order')

  return <ShopPreviewClient products={products || []} />
}
