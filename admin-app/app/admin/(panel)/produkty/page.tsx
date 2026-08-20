import { createClient } from '@/lib/supabase/server'
import { ProductsClient } from './products-client'

export const metadata = {
  title: 'Produkty',
}

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('display_order')

  return <ProductsClient initialData={products || []} />
}
