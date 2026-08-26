'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getBrowserSupabaseClient } from '@/lib/supabase/client'
import { useCart, type CartItem } from '@/lib/hooks/use-cart'
import { PRODUCT_CATEGORIES, type OrderItem, type Product } from '@/lib/types/database'
import { SectionHeader } from '@/components/home/section-header'
import { cn } from '@/lib/utils'
import {
  ORDER_IS_RESERVATION,
  ORDER_NEXT_STEPS,
  PAYMENT_NOTICE_CONFIRMATION,
  PAYMENT_NOTICE_LONG,
  PAYMENT_NOTICE_SHORT,
  PICKUP_INFO,
  SHOP_PHONE,
  SHOP_PHONE_HREF,
  SHOP_UNAVAILABLE_NOTICE,
} from '@/lib/content/shop'

/* -------------------------------------------------------------------------- */
/*  Pomocnicze                                                                 */
/* -------------------------------------------------------------------------- */

const priceFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
})

function formatPrice(value: number) {
  return priceFormatter.format(value)
}

/** Polska odmiana: 1 produkt / 2 produkty / 5 produktów. */
function plProducts(count: number) {
  if (count === 1) return '1 produkt'
  const rest10 = count % 10
  const rest100 = count % 100
  if (rest10 >= 2 && rest10 <= 4 && (rest100 < 12 || rest100 > 14)) return `${count} produkty`
  return `${count} produktów`
}

function plItems(count: number) {
  if (count === 1) return '1 sztuka'
  const rest10 = count % 10
  const rest100 = count % 100
  if (rest10 >= 2 && rest10 <= 4 && (rest100 < 12 || rest100 > 14)) return `${count} sztuki`
  return `${count} sztuk`
}

const CATEGORY_ORDER = ['odziez', 'akcesoria', 'inne'] as const

/* -------------------------------------------------------------------------- */
/*  Modal — wspólna, dostępna powłoka okna                                     */
/* -------------------------------------------------------------------------- */

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Modal({
  titleId,
  onClose,
  children,
  wide = false,
  busy = false,
}: {
  titleId: string
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
  /**
   * Trwa operacja, której nie wolno przerwać zamknięciem okna (np. insert
   * zamówienia). Blokuje Escape i kliknięcie w tło — inaczej zamówienie
   * zapisuje się w bazie, koszyk się czyści, a klient nigdy nie zobaczy
   * numeru i zamawia drugi raz.
   */
  busy?: boolean
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  // onClose bywa nową funkcją przy każdym renderze rodzica — trzymamy go w ref,
  // żeby efekt (fokus, blokada scrolla) wykonał się dokładnie raz na otwarcie.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  // Ten sam powód co wyżej: handler keydown jest rejestrowany raz, więc aktualny
  // stan „trwa wysyłka" musi do niego docierać przez ref, nie przez domknięcie.
  const busyRef = useRef(busy)
  busyRef.current = busy

  useEffect(() => {
    const panel = panelRef.current
    const previouslyFocused = document.activeElement as HTMLElement | null

    // Fokus na otwarciu — pierwszy interaktywny element albo sam panel.
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
    ;(first ?? panel)?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        // Wysyłka w toku — okno zostaje otwarte, aż będzie co pokazać.
        if (busyRef.current) return
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !panel) return

      // Pułapka fokusu — tabem nie da się wyjść w tło.
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusable.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }
      const firstEl = focusable[0]
      const lastEl = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault()
        lastEl.focus()
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-background/80 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (busy) return
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative my-auto w-full overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[0_20px_60px_oklch(0.55_0.28_295/0.2)] outline-none md:p-8',
          wide ? 'max-w-xl' : 'max-w-lg',
        )}
      >
        {children}
      </div>
    </div>
  )
}

function ModalCloseButton({
  onClose,
  label,
  disabled = false,
}: {
  onClose: () => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClose}
      disabled={disabled}
      aria-label={label}
      className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-border bg-card font-mono text-sm text-muted-foreground transition-colors hover:border-cyan hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan disabled:pointer-events-none disabled:opacity-40"
    >
      <span aria-hidden>✕</span>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Sklep                                                                      */
/* -------------------------------------------------------------------------- */

type LoadState = 'loading' | 'ready' | 'unconfigured' | 'error'

export function StoreClient() {
  const supabase = getBrowserSupabaseClient()
  // JEDNA instancja koszyka na całą stronę — okno zamówienia dostaje wszystko
  // przez propsy. Dwa niezależne useCart() rozjeżdżały się po złożeniu
  // zamówienia (wyczyszczony koszyk „zmartwychwstawał" z localStorage).
  const { cart, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [justAdded, setJustAdded] = useState<{ name: string; nonce: number } | null>(null)

  useEffect(() => {
    // Brak skonfigurowanego Supabase — od razu stan pusty zamiast wiszącego
    // „Ładowanie produktów…" (fetch i tak poleciałby na martwy host).
    if (!supabase) {
      setLoadState('unconfigured')
      return
    }

    async function fetchProducts(client: NonNullable<typeof supabase>) {
      try {
        const { data, error } = await client
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) throw error
        setProducts(data ?? [])
        setLoadState('ready')
      } catch (error) {
        console.error('[air-squad] Nie udało się pobrać produktów:', error)
        setLoadState('error')
      } finally {
        // Zawsze — inaczej błąd zostawia stronę na „Ładowanie…" na zawsze.
        setLoadState((state) => (state === 'loading' ? 'error' : state))
      }
    }

    fetchProducts(supabase)
  }, [supabase])

  // Komunikat „dodano do koszyka" gaśnie sam, ale timer sprzątamy przy zmianie.
  useEffect(() => {
    if (!justAdded) return
    const timer = window.setTimeout(() => setJustAdded(null), 4000)
    return () => window.clearTimeout(timer)
  }, [justAdded])

  const categories = useMemo(() => {
    return CATEGORY_ORDER.filter((value) => products.some((p) => p.category === value)).map(
      (value) => ({
        value: value as string,
        label: PRODUCT_CATEGORIES[value],
        count: products.filter((p) => p.category === value).length,
      }),
    )
  }, [products])

  const filteredProducts = useMemo(
    () =>
      selectedCategory === 'all'
        ? products
        : products.filter((p) => p.category === selectedCategory),
    [products, selectedCategory],
  )

  const handleAddToCart = useCallback(
    (product: Product, quantity: number, size?: string, color?: string) => {
      addItem(product, quantity, size, color)
      setSelectedProduct(null)
      setJustAdded({ name: product.name, nonce: Date.now() })
    },
    [addItem],
  )

  const closeProduct = useCallback(() => setSelectedProduct(null), [])
  const closeCheckout = useCallback(() => setCheckoutOpen(false), [])

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10">
      <SectionHeader
        // Jedyny nagłówek na /sklep — musi być h1, bo Header i Footer go nie
        // dają, a stara wersja miała tu <h1>Sklep Air Squad</h1>.
        as="h1"
        kicker="Sklep"
        kickerColorClass="text-violet-soft"
        title="Gadżety"
        gradientPart="Air Squad."
        titleFontWeight={400}
        gradientFontWeight={400}
        className="mb-10 md:mb-12"
        meta={
          loadState === 'ready' && products.length > 0
            ? `[Sklep] // ${plProducts(products.length)} — odbiór i płatność u trenera.`
            : '[Sklep] // Odbiór i płatność u trenera, bez płatności online.'
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ---------------------------------------------------------------- */}
        {/*  Katalog                                                          */}
        {/* ---------------------------------------------------------------- */}
        <div>
          {categories.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Kategoria:
              </span>
              <CategoryPill
                label="Wszystko"
                count={products.length}
                active={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
              />
              {categories.map((category) => (
                <CategoryPill
                  key={category.value}
                  label={category.label}
                  count={category.count}
                  active={selectedCategory === category.value}
                  onClick={() => setSelectedCategory(category.value)}
                />
              ))}
            </div>
          )}

          {loadState === 'loading' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  aria-hidden
                  className="h-[26rem] animate-pulse rounded-3xl border border-border bg-muted/40"
                />
              ))}
              <p className="sr-only" role="status">
                Ładowanie produktów…
              </p>
            </div>
          ) : loadState === 'unconfigured' || loadState === 'error' ? (
            <EmptyPanel
              tone="amber"
              kicker={loadState === 'error' ? 'Błąd połączenia' : 'Sklep chwilowo offline'}
              title={
                loadState === 'error'
                  ? 'Nie udało się pobrać produktów.'
                  : 'Katalog jest chwilowo niedostępny.'
              }
              description={SHOP_UNAVAILABLE_NOTICE}
              action={
                <a
                  href={SHOP_PHONE_HREF}
                  className="inline-flex items-center gap-2 rounded-full border border-amber/40 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-amber transition-colors hover:bg-amber/10"
                >
                  Zadzwoń {SHOP_PHONE} <span aria-hidden>→</span>
                </a>
              }
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyPanel
              tone="neutral"
              kicker="Pusto"
              title={
                products.length === 0
                  ? 'Nie mamy teraz nic na stanie.'
                  : 'Brak produktów w tej kategorii.'
              }
              description={
                products.length === 0
                  ? 'Nowe rzeczy pojawiają się przed sezonem i przed obozami — zajrzyj za jakiś czas albo zapytaj trenera.'
                  : 'Zmień kategorię albo wróć do pełnej listy.'
              }
              action={
                products.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="inline-flex items-center gap-2 rounded-full border border-foreground/35 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-cyan hover:text-cyan"
                  >
                    Pokaż wszystko
                  </button>
                ) : null
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  Koszyk — na mobile ląduje pod katalogiem, na desktopie jest lepki */}
        {/* ---------------------------------------------------------------- */}
        <CartPanel
          cart={cart}
          total={total}
          itemCount={itemCount}
          justAdded={justAdded}
          onRemove={removeItem}
          onQuantityChange={updateQuantity}
          onCheckout={() => setCheckoutOpen(true)}
        />
      </div>

      {/* Pasek mobilny — nie zasłania treści, bo pod spodem jest podkładka. */}
      {cart.length > 0 && (
        <>
          <div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-md lg:hidden"
            role="region"
            aria-label="Podsumowanie koszyka"
          >
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {plItems(itemCount)} w koszyku
                </p>
                <p className="stat-number text-xl text-foreground" style={{ fontWeight: 500 }}>
                  {formatPrice(total)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                Zamawiam <span aria-hidden>→</span>
              </button>
            </div>
          </div>
          <div aria-hidden className="h-24 lg:hidden" />
        </>
      )}

      {selectedProduct && (
        <ProductDialog
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={closeProduct}
          onAdd={handleAddToCart}
        />
      )}

      {checkoutOpen && (
        <CheckoutDialog
          cart={cart}
          total={total}
          onClose={closeCheckout}
          onOrderPlaced={clearCart}
        />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Filtr kategorii — pigułki zamiast komponentu Tabs                          */
/* -------------------------------------------------------------------------- */

function CategoryPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan',
        active
          ? 'bg-primary text-primary-foreground'
          : 'border border-cyan/30 text-cyan hover:bg-cyan/10',
      )}
    >
      {label}
      <span className="ml-1.5 opacity-60">{count}</span>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Karta produktu                                                             */
/* -------------------------------------------------------------------------- */

function ProductThumb({ product }: { product: Product }) {
  if (product.image_url) {
    return (
      <img
        src={product.image_url}
        alt={product.name}
        loading="lazy"
        className="h-56 w-full object-cover"
      />
    )
  }
  // Placeholder — inaczej karty bez zdjęcia mają inną wysokość niż sąsiednie.
  return (
    <div
      aria-hidden
      className="grid h-56 w-full place-items-center bg-gradient-to-br from-primary/15 to-violet-soft/10"
    >
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
        Air Squad
      </span>
    </div>
  )
}

function StockPill({ status }: { status: Product['stock_status'] }) {
  if (status === 'low') {
    return (
      <span className="rounded-full border border-amber/40 bg-amber/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-amber">
        Ostatnie sztuki
      </span>
    )
  }
  if (status === 'out_of_stock') {
    return (
      <span className="rounded-full border border-foreground/25 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
        Wyprzedane
      </span>
    )
  }
  return null
}

function ProductCard({ product, onSelect }: { product: Product; onSelect: () => void }) {
  const sizes = product.sizes ?? []
  const soldOut = product.stock_status === 'out_of_stock'

  const body = (
    <>
      <ProductThumb product={product} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan/30 px-3 py-1 font-mono text-[11px] text-cyan">
            {PRODUCT_CATEGORIES[product.category] ?? product.category}
          </span>
          <StockPill status={product.stock_status} />
        </div>
        <p
          className="display-bold mt-3 text-xl text-foreground md:text-2xl"
          style={{ fontWeight: 500 }}
        >
          {product.name}
        </p>
        {sizes.length > 0 && (
          <p className="mt-1 font-mono text-xs text-muted-foreground">{sizes.join(' · ')}</p>
        )}
        {product.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <span className="stat-number text-2xl text-foreground" style={{ fontWeight: 500 }}>
            {formatPrice(product.price)}
          </span>
          {soldOut ? (
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Niedostępne
            </span>
          ) : (
            <span
              aria-hidden
              className="font-mono text-sm text-muted-foreground transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          )}
        </div>
      </div>
    </>
  )

  if (soldOut) {
    return (
      <div className="flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card opacity-60">
        {body}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card text-left transition-transform hover:-translate-y-1 hover:border-violet-soft/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
    >
      {body}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Stan pusty / awaryjny                                                      */
/* -------------------------------------------------------------------------- */

function EmptyPanel({
  tone,
  kicker,
  title,
  description,
  action,
}: {
  tone: 'neutral' | 'amber'
  kicker: string
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-3xl border-2 border-dashed p-10 text-center md:p-14',
        tone === 'amber' ? 'border-amber/50 bg-amber/5' : 'border-border bg-card',
      )}
    >
      <p
        className={cn(
          'font-mono text-[11px] font-bold uppercase tracking-[0.18em]',
          tone === 'amber' ? 'text-amber' : 'text-muted-foreground',
        )}
      >
        {kicker}
      </p>
      <p className="display-bold mt-3 text-2xl text-foreground md:text-3xl" style={{ fontWeight: 500 }}>
        {title}
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Koszyk                                                                     */
/* -------------------------------------------------------------------------- */

function CartPanel({
  cart,
  total,
  itemCount,
  justAdded,
  onRemove,
  onQuantityChange,
  onCheckout,
}: {
  cart: CartItem[]
  total: number
  itemCount: number
  justAdded: { name: string; nonce: number } | null
  onRemove: (productId: string, size?: string, color?: string) => void
  onQuantityChange: (productId: string, quantity: number, size?: string, color?: string) => void
  onCheckout: () => void
}) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <p className="sr-only" aria-live="polite">
        {justAdded ? `Dodano do koszyka: ${justAdded.name}.` : ''}
      </p>

      {cart.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-violet-soft/50 bg-violet-soft/5 p-8 text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-violet-soft">
            Koszyk jest pusty
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Wybierz coś z listy — rozmiar i kolor ustawisz w oknie produktu.
          </p>
          <p className="mt-4 border-t border-violet-soft/30 pt-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
            ↳ {PAYMENT_NOTICE_SHORT}
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
            Koszyk
          </p>
          <h2 className="display-bold mt-2 text-2xl text-foreground" style={{ fontWeight: 500 }}>
            {plItems(itemCount)}
          </h2>

          {justAdded && (
            <p className="mt-3 rounded-2xl border border-emerald/45 bg-emerald/5 px-3 py-2 font-mono text-[11px] leading-relaxed text-emerald">
              ✓ Dodano: {justAdded.name}
            </p>
          )}

          <ul className="mt-5 max-h-96 divide-y divide-border overflow-y-auto">
            {cart.map((item) => (
              <li
                key={`${item.id}-${item.size ?? ''}-${item.color ?? ''}`}
                className="flex items-start justify-between gap-3 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {[item.size ? `rozm. ${item.size}` : null, item.color ? item.color : null]
                      .filter(Boolean)
                      .join(' · ') || 'bez wariantu'}
                  </p>
                  <div className="mt-2 inline-flex items-center rounded-full border border-border bg-card">
                    <button
                      type="button"
                      aria-label={`Zmniejsz ilość: ${item.name}`}
                      onClick={() =>
                        onQuantityChange(item.id, item.quantity - 1, item.size, item.color)
                      }
                      className="grid h-8 w-8 place-items-center rounded-full font-mono text-sm text-muted-foreground transition-colors hover:text-cyan"
                    >
                      <span aria-hidden>−</span>
                    </button>
                    <span className="w-7 text-center font-mono text-xs font-bold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Zwiększ ilość: ${item.name}`}
                      onClick={() =>
                        onQuantityChange(item.id, item.quantity + 1, item.size, item.color)
                      }
                      className="grid h-8 w-8 place-items-center rounded-full font-mono text-sm text-muted-foreground transition-colors hover:text-cyan"
                    >
                      <span aria-hidden>+</span>
                    </button>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="stat-number text-lg text-foreground" style={{ fontWeight: 500 }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id, item.size, item.color)}
                    className="mt-1 block w-full font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-rose"
                  >
                    Usuń
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-end justify-between border-t border-border pt-5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Razem
            </span>
            <span className="stat-number text-3xl text-foreground" style={{ fontWeight: 500 }}>
              {formatPrice(total)}
            </span>
          </div>

          {/* Płatność u trenera — punkt 1: zanim klient przejdzie do zamówienia. */}
          <div className="mt-4 rounded-2xl border border-emerald/45 bg-emerald/5 p-4">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-emerald">
              Płatność u trenera
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {PAYMENT_NOTICE_SHORT}
            </p>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
              ↳ {ORDER_IS_RESERVATION}
            </p>
          </div>

          <button
            type="button"
            onClick={onCheckout}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_36px_oklch(0.58_0.24_290/0.35)] transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            Przejdź do zamówienia <span aria-hidden>→</span>
          </button>
        </div>
      )}
    </aside>
  )
}

/* -------------------------------------------------------------------------- */
/*  Okno produktu                                                              */
/* -------------------------------------------------------------------------- */

function OptionPills({
  legend,
  options,
  value,
  onChange,
  invalid,
}: {
  legend: string
  options: string[]
  value: string
  onChange: (next: string) => void
  invalid: boolean
}) {
  return (
    <fieldset className="mt-5">
      <legend className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {legend}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={cn(
              'rounded-full px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan',
              value === option
                ? 'bg-primary text-primary-foreground'
                : cn(
                    'border text-muted-foreground hover:border-cyan hover:text-cyan',
                    invalid ? 'border-destructive/60' : 'border-border',
                  ),
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function ProductDialog({
  product,
  onClose,
  onAdd,
}: {
  product: Product
  onClose: () => void
  onAdd: (product: Product, quantity: number, size?: string, color?: string) => void
}) {
  const sizes = product.sizes ?? []
  const colors = product.colors ?? []
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)

  function handleAdd() {
    // Bez tego dało się zamówić koszulkę bez rozmiaru — trener nie wiedział,
    // co przynieść.
    if (sizes.length > 0 && !size) {
      setError('Wybierz rozmiar.')
      return
    }
    if (colors.length > 0 && !color) {
      setError('Wybierz kolor.')
      return
    }
    onAdd(product, quantity, size || undefined, color || undefined)
  }

  return (
    <Modal titleId="produkt-tytul" onClose={onClose}>
      <ModalCloseButton onClose={onClose} label="Zamknij okno produktu" />

      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
        {PRODUCT_CATEGORIES[product.category] ?? product.category}
      </p>
      <h2
        id="produkt-tytul"
        className="display-bold mt-2 pr-10 text-3xl text-foreground"
        style={{ fontWeight: 500 }}
      >
        {product.name}
      </h2>

      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="mt-5 h-56 w-full rounded-2xl border border-border object-cover"
        />
      )}

      {product.description && (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
      )}

      <div className="mt-4 flex items-center gap-3">
        <span className="stat-number text-3xl text-foreground" style={{ fontWeight: 500 }}>
          {formatPrice(product.price)}
        </span>
        <StockPill status={product.stock_status} />
      </div>

      {colors.length > 0 && (
        <OptionPills
          legend="Kolor"
          options={colors}
          value={color}
          onChange={(next) => {
            setColor(next)
            setError(null)
          }}
          invalid={error === 'Wybierz kolor.'}
        />
      )}

      {sizes.length > 0 && (
        <OptionPills
          legend="Rozmiar"
          options={sizes}
          value={size}
          onChange={(next) => {
            setSize(next)
            setError(null)
          }}
          invalid={error === 'Wybierz rozmiar.'}
        />
      )}

      <div className="mt-5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Ilość
        </span>
        <div className="mt-2 inline-flex items-center rounded-full border border-border bg-card">
          <button
            type="button"
            aria-label="Zmniejsz ilość"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="grid h-10 w-10 place-items-center rounded-full font-mono text-sm text-muted-foreground transition-colors hover:text-cyan"
          >
            <span aria-hidden>−</span>
          </button>
          <span
            className="w-8 text-center font-mono text-sm font-bold text-foreground"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Zwiększ ilość"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="grid h-10 w-10 place-items-center rounded-full font-mono text-sm text-muted-foreground transition-colors hover:text-cyan"
          >
            <span aria-hidden>+</span>
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-destructive"
        >
          {error}
        </p>
      )}

      <div className="mt-6 border-t border-border pt-6">
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
        >
          Dodaj do koszyka <span aria-hidden>→</span>
        </button>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
          ↳ {PAYMENT_NOTICE_SHORT}
        </p>
      </div>
    </Modal>
  )
}

/* -------------------------------------------------------------------------- */
/*  Okno zamówienia                                                            */
/* -------------------------------------------------------------------------- */

const FIELD_CLASS =
  'mt-2 w-full rounded-xl border border-border bg-input/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-[3px] focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50'
const LABEL_CLASS =
  'block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground'

type Confirmation = {
  orderNumber: string
  items: CartItem[]
  total: number
}

function CheckoutDialog({
  cart,
  total,
  onClose,
  onOrderPlaced,
}: {
  cart: CartItem[]
  total: number
  onClose: () => void
  onOrderPlaced: () => void
}) {
  const supabase = getBrowserSupabaseClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' })

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!supabase) {
      setError(`${SHOP_UNAVAILABLE_NOTICE} Telefon: ${SHOP_PHONE}.`)
      return
    }
    if (cart.length === 0) {
      setError('Koszyk jest pusty — dodaj coś, zanim złożysz zamówienie.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const orderNumber = `ASQ-${Date.now()}`
      // Kształt zgodny z typem OrderItem — panel admina renderuje product_name.
      // Wcześniej leciał tu cały wiersz produktu (bez product_name), więc
      // w szczegółach zamówienia nazwy były puste.
      const items: OrderItem[] = cart.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        size: item.size ?? null,
        color: item.color ?? null,
        price: item.price,
      }))

      const { error: insertError } = await supabase.from('orders').insert({
        order_number: orderNumber,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        items,
        total_amount: total,
        notes: formData.notes,
        status: 'pending',
      })

      if (insertError) throw insertError

      // Snapshot przed czyszczeniem — potwierdzenie ma co pokazać.
      setConfirmation({ orderNumber, items: cart, total })
      onOrderPlaced()
    } catch (submitError) {
      console.error('[air-squad] Nie udało się złożyć zamówienia:', submitError)
      setError(
        `Nie udało się zapisać zamówienia. Spróbuj jeszcze raz albo zadzwoń: ${SHOP_PHONE}.`,
      )
    } finally {
      setLoading(false)
    }
  }

  /* ---------------------------- Potwierdzenie ---------------------------- */
  if (confirmation) {
    return (
      <Modal key="potwierdzenie" titleId="zamowienie-potwierdzenie" onClose={onClose} wide>
        <div className="rounded-3xl border-2 border-dashed border-emerald/50 bg-emerald/5 p-6 text-center md:p-8">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald">
            <span aria-hidden>✓ </span>Zamówienie przyjęte
          </p>
          <h2
            id="zamowienie-potwierdzenie"
            className="display-bold mt-3 text-2xl text-foreground md:text-3xl"
            style={{ fontWeight: 500 }}
          >
            Rezerwujemy to dla Ciebie.
          </h2>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Numer zamówienia
          </p>
          <p className="stat-number mt-1 text-3xl text-foreground md:text-4xl" style={{ fontWeight: 500 }}>
            {confirmation.orderNumber}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Zapisz go albo zrób zrzut ekranu — podaj przy odbiorze.
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-card p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Zamawiasz
          </p>
          <ul className="mt-3 divide-y divide-border">
            {confirmation.items.map((item) => (
              <li
                key={`${item.id}-${item.size ?? ''}-${item.color ?? ''}`}
                className="flex items-start justify-between gap-3 py-2.5"
              >
                <span className="min-w-0 text-sm text-foreground">
                  {item.name}
                  <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    {item.quantity} szt.
                    {item.size ? ` · ${item.size}` : ''}
                    {item.color ? ` · ${item.color}` : ''}
                  </span>
                </span>
                <span className="stat-number shrink-0 text-base text-foreground" style={{ fontWeight: 500 }}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Do zapłaty u trenera
            </span>
            <span className="stat-number text-2xl text-foreground" style={{ fontWeight: 500 }}>
              {formatPrice(confirmation.total)}
            </span>
          </div>
        </div>

        {/* Płatność u trenera — punkt 3: powtórzenie zasady po złożeniu. */}
        <div className="mt-5 rounded-2xl border border-emerald/45 bg-emerald/5 p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-emerald">
            Płatność u trenera
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {PAYMENT_NOTICE_CONFIRMATION}
          </p>
          <ol className="mt-3 space-y-1.5">
            {ORDER_NEXT_STEPS.map((step, index) => (
              <li key={step} className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                <span className="text-emerald">{String(index + 1).padStart(2, '0')}</span> — {step}
              </li>
            ))}
          </ol>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-foreground/35 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-cyan hover:text-cyan"
        >
          Rozumiem, zamknij
        </button>
      </Modal>
    )
  }

  /* ------------------------------ Formularz ------------------------------ */
  return (
    <Modal key="formularz" titleId="zamowienie-tytul" onClose={onClose} wide busy={loading}>
      <ModalCloseButton
        onClose={onClose}
        label="Zamknij okno zamówienia"
        disabled={loading}
      />

      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
        Zamówienie
      </p>
      <h2
        id="zamowienie-tytul"
        className="display-bold mt-2 pr-10 text-3xl text-foreground"
        style={{ fontWeight: 500 }}
      >
        Bez płatności online.
      </h2>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="zam-imie" className={LABEL_CLASS}>
              Imię i nazwisko
            </label>
            <input
              id="zam-imie"
              name="name"
              required
              autoComplete="name"
              className={FIELD_CLASS}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="zam-email" className={LABEL_CLASS}>
              E-mail
            </label>
            <input
              id="zam-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={FIELD_CLASS}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="zam-telefon" className={LABEL_CLASS}>
              Telefon
            </label>
            <input
              id="zam-telefon"
              name="phone"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              className={FIELD_CLASS}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="zam-uwagi" className={LABEL_CLASS}>
              Uwagi
            </label>
            <textarea
              id="zam-uwagi"
              name="notes"
              className={cn(FIELD_CLASS, 'min-h-24 resize-y leading-relaxed')}
              placeholder="Np. trenuję w Rzeszowie, wtorki i czwartki"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
            <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
              ↳ {PICKUP_INFO}
            </p>
          </div>
        </div>

        {/* Podsumowanie pozycji — klient w kasie musi widzieć, co zamawia. */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Podsumowanie
          </p>
          {cart.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Koszyk jest pusty. Zamknij okno i dodaj coś z listy.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {cart.map((item) => (
                <li
                  key={`${item.id}-${item.size ?? ''}-${item.color ?? ''}`}
                  className="flex items-start justify-between gap-3 py-2.5"
                >
                  <span className="min-w-0 text-sm text-foreground">
                    {item.name}
                    <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                      {item.quantity} szt.
                      {item.size ? ` · ${item.size}` : ''}
                      {item.color ? ` · ${item.color}` : ''}
                    </span>
                  </span>
                  <span className="stat-number shrink-0 text-base text-foreground" style={{ fontWeight: 500 }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Razem
            </span>
            <span className="stat-number text-3xl text-foreground" style={{ fontWeight: 500 }}>
              {formatPrice(total)}
            </span>
          </div>

          {/* Płatność u trenera — punkt 2: przy podsumowaniu kwoty. */}
          <div className="mt-4 rounded-2xl border border-emerald/45 bg-emerald/5 p-4">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-emerald">
              Płatność u trenera przy odbiorze
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {PAYMENT_NOTICE_LONG}
            </p>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
              ↳ {ORDER_IS_RESERVATION}
            </p>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-2xl border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm leading-relaxed text-destructive"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row-reverse">
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_36px_oklch(0.58_0.24_290/0.35)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:flex-1"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            {loading ? 'Wysyłam…' : 'Złóż zamówienie'} <span aria-hidden>→</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-foreground/35 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-cyan hover:text-cyan disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
          >
            Wróć do zakupów
          </button>
        </div>
      </form>
    </Modal>
  )
}
