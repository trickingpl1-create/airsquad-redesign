// Podgląd tego, co klient realnie zobaczy w sklepie.
//
// Znaczniki są odwzorowaniem karty z app/sklep/store-client.tsx w aplikacji
// publicznej. Panel jest samowystarczalny (deploy z CLI wysyła tylko admin-app/),
// więc nie da się tamtego komponentu zaimportować — stąd kopia.
//
// Kolory też są przepisane z app/globals.css (motyw ciemny strony publicznej),
// bo panel ma własną, jasną paletę. Podgląd w kolorach panelu wprowadzałby
// w błąd co do wyglądu sklepu.
//
// UWAGA przy zmianach w sklepie: jeśli karta w store-client.tsx się zmieni,
// ten plik trzeba poprawić ręcznie. Nie ma tu automatycznego strażnika —
// rozjazd objawi się tym, że podgląd kłamie.

import type { Product } from '@/lib/types/database'

/** Tokeny motywu ciemnego ze strony publicznej (app/globals.css). */
const SHOP_THEME = {
  '--sp-bg': 'oklch(0.13 0.02 275)',
  '--sp-fg': 'oklch(0.98 0 0)',
  '--sp-card': 'oklch(0.18 0.025 275)',
  '--sp-secondary': 'oklch(0.21 0.03 275)',
  '--sp-muted': 'oklch(0.7 0.01 275)',
  '--sp-primary': 'oklch(0.58 0.24 290)',
  '--sp-border': 'oklch(1 0 0 / 0.08)',
} as React.CSSProperties

/** Ciemne tło sklepu — wszystko w środku dziedziczy jego tokeny. */
export function ShopSurface({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      style={SHOP_THEME}
      className={`rounded-xl bg-[var(--sp-bg)] p-6 text-[var(--sp-fg)] ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Karta produktu w siatce sklepu. `hidden` rysuje ją przygaszoną z etykietą —
 * produkt nieaktywny w ogóle nie trafia do sklepu (zapytanie filtruje
 * `is_active`), a bez tego oznaczenia podgląd sugerowałby, że jednak tam jest.
 */
export function ProductCardPreview({
  product,
  hidden = false,
}: {
  product: Pick<
    Product,
    'name' | 'description' | 'price' | 'category' | 'sizes' | 'image_url'
  >
  hidden?: boolean
}) {
  return (
    <div className="relative">
      <div
        className={`flex h-full flex-col overflow-hidden rounded-xl border border-[var(--sp-border)] bg-[var(--sp-card)] ${
          hidden ? 'opacity-40 grayscale' : ''
        }`}
      >
        <div className="px-6 pb-3 pt-6">
          <h3 className="text-lg leading-tight font-semibold">
            {product.name || <span className="text-[var(--sp-muted)]">Bez nazwy</span>}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-[var(--sp-muted)]">
            {product.description}
          </p>
        </div>

        <div className="flex flex-1 flex-col px-6 pb-6">
          {product.image_url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.image_url}
              alt={product.name}
              className="mb-4 h-40 w-full rounded object-cover"
            />
          )}

          <div className="mb-4 flex-1">
            <span className="mb-2 inline-block rounded-md bg-[var(--sp-secondary)] px-2 py-0.5 text-xs font-medium">
              {product.category}
            </span>
            {product.sizes && product.sizes.length > 0 && (
              <p className="text-sm text-[var(--sp-muted)]">
                Rozmiary: {product.sizes.join(', ')}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[var(--sp-primary)]">
              {product.price.toFixed(2)} zł
            </span>
            <span className="rounded-md bg-[var(--sp-primary)] px-3 py-1.5 text-sm font-medium text-white">
              Szczegóły
            </span>
          </div>
        </div>
      </div>

      {hidden && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-black/85 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white">
          Niewidoczny w sklepie
        </span>
      )}
    </div>
  )
}

/**
 * Uwagi do produktu — rzeczy, których po samej karcie nie widać.
 * Najważniejsza: sklep nie czyta `stock_status` ani `gallery`, więc ustawienie
 * dostępności w panelu nie zmienia niczego po stronie klienta.
 */
export function PreviewNotices({
  product,
}: {
  product: Pick<Product, 'description' | 'image_url' | 'stock_status' | 'is_active'>
}) {
  const notices: { tone: 'warn' | 'info'; text: string }[] = []

  if (!product.is_active) {
    notices.push({
      tone: 'warn',
      text: 'Produkt jest nieaktywny — nie pojawi się w sklepie w ogóle.',
    })
  }
  if (!product.image_url) {
    notices.push({ tone: 'warn', text: 'Brak zdjęcia — karta będzie sama treść.' })
  }
  if (!product.description) {
    notices.push({ tone: 'warn', text: 'Brak opisu — pod nazwą zostanie pusto.' })
  }
  if (product.stock_status !== 'available') {
    notices.push({
      tone: 'info',
      text: 'Sklep nie czyta pola „Dostępność" — produkt zostanie pokazany i będzie można go zamówić mimo tego ustawienia.',
    })
  }

  if (notices.length === 0) return null

  return (
    <ul className="space-y-1.5 text-sm">
      {notices.map((notice) => (
        <li
          key={notice.text}
          className={
            notice.tone === 'warn'
              ? 'text-amber-600 dark:text-amber-500'
              : 'text-muted-foreground'
          }
        >
          {notice.tone === 'warn' ? '⚠ ' : 'ℹ '}
          {notice.text}
        </li>
      ))}
    </ul>
  )
}
