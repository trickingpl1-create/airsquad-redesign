'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShopSurface, ProductCardPreview } from '@/components/admin/shop-preview'
import type { Product } from '@/lib/types/database'

// Zakładki kategorii są przepisane ze sklepu (app/sklep/store-client.tsx) —
// te same wartości i ta sama kolejność, żeby filtrowanie w podglądzie dawało
// dokładnie ten sam wynik co u klienta.
const TABS = [
  { value: 'all', label: 'Wszystko' },
  { value: 'odziez', label: 'Odzież' },
  { value: 'akcesoria', label: 'Akcesoria' },
  { value: 'inne', label: 'Inne' },
] as const

export function ShopPreviewClient({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<string>('all')

  // Sklep bierze wyłącznie aktywne, posortowane po display_order.
  const visible = useMemo(
    () =>
      products
        .filter((product) => product.is_active)
        .filter((product) => category === 'all' || product.category === category),
    [products, category]
  )

  const hiddenCount = products.filter((product) => !product.is_active).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Podgląd sklepu</h1>
          <p className="text-muted-foreground">
            Tak siatka produktów wygląda dla klienta. Dane na żywo z bazy —
            zmiana w „Produktach" jest tu widoczna od razu, bez przebudowy strony.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/produkty">
            <Pencil className="mr-2 h-4 w-4" />
            Edytuj produkty
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setCategory(tab.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              category === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ShopSurface>
        {visible.length === 0 ? (
          <p className="py-12 text-center text-[var(--sp-muted)]">
            Brak produktów w tej kategorii
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => (
              <ProductCardPreview key={product.id} product={product} />
            ))}
          </div>
        )}
      </ShopSurface>

      {hiddenCount > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            Ukryte przed klientem ({hiddenCount})
          </h2>
          <p className="text-sm text-muted-foreground">
            Produkty z wyłączonym przełącznikiem „Aktywny". Nie trafiają do
            sklepu — klient nie zobaczy ich w żadnej kategorii.
          </p>
          <ShopSurface>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products
                .filter((product) => !product.is_active)
                .map((product) => (
                  <ProductCardPreview key={product.id} product={product} hidden />
                ))}
            </div>
          </ShopSurface>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Podgląd odwzorowuje siatkę sklepu. Koszyk, okno szczegółów i składanie
        zamówienia działają tylko na stronie publicznej.
      </p>
    </div>
  )
}
