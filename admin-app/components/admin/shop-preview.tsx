// Podgląd tego, co klient realnie zobaczy w sklepie.
//
// Znaczniki są odwzorowaniem app/sklep/store-client.tsx z aplikacji publicznej.
// Panel jest samowystarczalny (deploy z CLI wysyła tylko admin-app/), więc nie da
// się tamtych komponentów zaimportować — stąd kopia. Kopiujemy 1:1, także wtedy,
// gdy coś w sklepie wygląda gorzej niż mogłoby: podgląd ma odwzorowywać sklep,
// nie upiększać go.
//
// KOLORY: panel chodzi na tej samej ciemnej palecie co sklep, więc bez wymuszenia
// tokenów podgląd zlewałby się z tłem panelu i kłamałby, gdyby panel kiedyś
// przeszedł na jasny motyw (strona logowania już na nim chodzi — patrz
// app/admin/login/layout.tsx). Dlatego ShopSurface przypina wartości z bloku
// :root w app/globals.css strony publicznej — wszystkie klasy Tailwinda w środku
// (bg-card, text-cyan, border-emerald/45, …) rozwiązują się wtedy do kolorów
// sklepu niezależnie od motywu panelu.
//
// KROJE: panel nie ładuje w layoucie kroju display (Covered By Your Grace) —
// klasy .display-bold i .stat-number same z siebie spadłyby na Inter i podgląd
// pokazywałby złą typografię. ShopSurface dokłada zmienną --font-covered-by-your-grace
// lokalnie, tylko dla swojej zawartości.
//
// UWAGA przy zmianach w sklepie: jeśli store-client.tsx się zmieni, ten plik
// trzeba poprawić ręcznie. Nie ma tu automatycznego strażnika — rozjazd objawi
// się tym, że podgląd kłamie.

import { Covered_By_Your_Grace } from 'next/font/google'
import type { Product } from '@/lib/types/database'
import { PRODUCT_CATEGORIES } from '@/lib/types/database'

// Krój display sklepu. Layout panelu celowo go nie ładuje (komentarz w
// app/layout.tsx), więc ładujemy go tutaj — wyłącznie na potrzeby podglądu.
const coveredByYourGrace = Covered_By_Your_Grace({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-covered-by-your-grace',
})

/* -------------------------------------------------------------------------- */
/*  Treści sklepu — KOPIA lib/content/shop.ts ze strony publicznej             */
/* -------------------------------------------------------------------------- */

// ORYGINAŁ: airsquad-web/lib/content/shop.ts. Panel nie może go zaimportować
// (samowystarczalność admin-app/), więc trzyma własną kopię. Po zmianie treści
// w oryginale — zaktualizuj tutaj ręcznie, inaczej podgląd pokaże inne zdania
// niż sklep. Sposób płatności jest STAŁĄ modelu biznesowego, nie kolumną
// w tabeli `orders` — i podgląd nie ma prawa sugerować, że jest inaczej.
export const SHOP_COPY = {
  PAYMENT_NOTICE_SHORT:
    'Nie płacisz teraz. Całą kwotę przekazujesz trenerowi przy odbiorze.',
  PAYMENT_NOTICE_LONG:
    'W tym sklepie nie ma płatności online. Klikając „Złóż zamówienie” rezerwujesz towar — nic nie płacisz przez internet i nie podajesz danych karty. Umówioną kwotę przekazujesz trenerowi gotówką lub BLIK-iem dopiero przy odbiorze, na treningu.',
  PAYMENT_NOTICE_CONFIRMATION:
    'Nic nie płacisz online. Kwotę przekazujesz trenerowi przy odbiorze zamówienia na treningu.',
  PICKUP_INFO:
    'Odbiór osobisty u trenera na treningu — w polu „Uwagi” napisz, w której lokalizacji i w jakie dni trenujesz, żebyśmy wiedzieli, gdzie dowieźć zamówienie.',
  ORDER_IS_RESERVATION:
    'Zamówienie jest wiążącą rezerwacją — przygotowujemy towar specjalnie dla Ciebie.',
  ORDER_NEXT_STEPS: [
    'Potwierdzamy zamówienie telefonicznie lub mailowo.',
    'Trener przywozi towar na Twój trening.',
    'Płacisz przy odbiorze i zabierasz swoje rzeczy.',
  ],
} as const

/* -------------------------------------------------------------------------- */
/*  Powierzchnia sklepu                                                        */
/* -------------------------------------------------------------------------- */

/** Tokeny motywu ciemnego ze strony publicznej (app/globals.css, blok :root). */
const SHOP_THEME = {
  '--background': 'oklch(0.13 0.02 275)',
  '--foreground': 'oklch(0.98 0 0)',
  '--card': 'oklch(0.18 0.025 275)',
  '--card-foreground': 'oklch(0.98 0 0)',
  '--popover': 'oklch(0.16 0.025 275)',
  '--popover-foreground': 'oklch(0.98 0 0)',
  '--primary': 'oklch(0.58 0.24 290)',
  '--primary-foreground': 'oklch(0.98 0 0)',
  '--accent': 'oklch(0.66 0.18 250)',
  '--accent-foreground': 'oklch(0.98 0 0)',
  '--cyan': 'oklch(0.85 0.13 195)',
  '--violet-soft': 'oklch(0.74 0.16 295)',
  '--pink': 'oklch(0.74 0.22 340)',
  '--amber': 'oklch(0.84 0.15 75)',
  '--emerald': 'oklch(0.74 0.17 165)',
  '--rose': 'oklch(0.7 0.2 18)',
  '--secondary': 'oklch(0.21 0.03 275)',
  '--secondary-foreground': 'oklch(0.98 0 0)',
  '--muted': 'oklch(0.19 0.025 275)',
  '--muted-foreground': 'oklch(0.7 0.01 275)',
  '--destructive': 'oklch(0.58 0.22 25)',
  '--border': 'oklch(1 0 0 / 0.08)',
  '--input': 'oklch(0.22 0.025 275)',
  '--ring': 'oklch(0.58 0.24 290)',

  // Aliasy --sp-* z pierwszej wersji tego pliku. Nadal używa ich strona
  // /admin/podglad-sklepu (text-[var(--sp-muted)]), więc zostają.
  '--sp-bg': 'oklch(0.13 0.02 275)',
  '--sp-fg': 'oklch(0.98 0 0)',
  '--sp-card': 'oklch(0.18 0.025 275)',
  '--sp-secondary': 'oklch(0.21 0.03 275)',
  '--sp-muted': 'oklch(0.7 0.01 275)',
  '--sp-primary': 'oklch(0.58 0.24 290)',
  '--sp-border': 'oklch(1 0 0 / 0.08)',
} as React.CSSProperties

/** Ciemne tło sklepu — wszystko w środku dziedziczy jego tokeny i krój display. */
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
      className={`${coveredByYourGrace.variable} rounded-xl bg-background p-6 text-foreground ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Okno modalne sklepu. W sklepie panel leży na rozmytej nakładce
 * (`fixed inset-0 bg-background/80 backdrop-blur-md`) — tutaj nakładki nie ma,
 * bo podgląd jest osadzony w stronie panelu. Sam panel jest 1:1.
 */
export function ShopModalFrame({
  children,
  wide = false,
  className = '',
}: {
  children: React.ReactNode
  wide?: boolean
  className?: string
}) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[0_20px_60px_oklch(0.55_0.28_295/0.2)] md:p-8 ${
        wide ? 'max-w-xl' : 'max-w-lg'
      } ${className}`}
    >
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Pomocnicze — przepisane ze sklepu                                          */
/* -------------------------------------------------------------------------- */

// Sklep formatuje ceny przez Intl (129,00 zł). Panel w tabeli produktów robi to
// tak samo, ale to osobna kopia — tutaj liczy się zgodność ze sklepem.
const priceFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
})

export function formatShopPrice(value: number): string {
  return priceFormatter.format(value)
}

/** Polska odmiana sztuk — kopia z app/sklep/store-client.tsx. */
export function plItems(count: number): string {
  if (count === 1) return '1 sztuka'
  const rest10 = count % 10
  const rest100 = count % 100
  if (rest10 >= 2 && rest10 <= 4 && (rest100 < 12 || rest100 > 14)) return `${count} sztuki`
  return `${count} sztuk`
}

/** Pozycja koszyka w kształcie, w jakim sklep trzyma ją w localStorage. */
export type PreviewCartItem = {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
}

function itemKey(item: PreviewCartItem): string {
  return `${item.id}-${item.size ?? ''}-${item.color ?? ''}`
}

function cartTotal(items: PreviewCartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function cartCount(items: PreviewCartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

/** Nazwa produktu bywa pusta w trakcie pisania w formularzu panelu. */
function ProductName({ name }: { name: string }) {
  if (name) return <>{name}</>
  return <span className="text-muted-foreground">Bez nazwy</span>
}

/* -------------------------------------------------------------------------- */
/*  Elementy wspólne                                                           */
/* -------------------------------------------------------------------------- */

/** Pigułka dostępności. Sklep czyta `stock_status` — patrz StockPill w sklepie. */
export function StockPill({ status }: { status: Product['stock_status'] }) {
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

function ModalCloseButton({ label }: { label: string }) {
  return (
    <span
      aria-label={label}
      className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-border bg-card font-mono text-sm text-muted-foreground"
    >
      <span aria-hidden>✕</span>
    </span>
  )
}

/** Wybór wariantu. Bez `onChange` pigułki są tylko obrazkiem stanu. */
function OptionPills({
  legend,
  options,
  value,
  onChange,
  invalid = false,
}: {
  legend: string
  options: string[]
  value: string
  onChange?: (next: string) => void
  invalid?: boolean
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
            onClick={onChange ? () => onChange(option) : undefined}
            aria-pressed={value === option}
            className={`rounded-full px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${
              value === option
                ? 'bg-primary text-primary-foreground'
                : `border text-muted-foreground ${invalid ? 'border-destructive/60' : 'border-border'}`
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

/** Stepper ilości — w oknie produktu 10×10, w koszyku 8×8. */
function QuantityStepper({
  quantity,
  size = 'lg',
  onChange,
  label,
}: {
  quantity: number
  size?: 'lg' | 'sm'
  onChange?: (next: number) => void
  label: string
}) {
  const box = size === 'lg' ? 'h-10 w-10' : 'h-8 w-8'
  const value = size === 'lg' ? 'w-8 text-sm' : 'w-7 text-xs'

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card">
      <button
        type="button"
        aria-label={`Zmniejsz ilość: ${label}`}
        onClick={onChange ? () => onChange(Math.max(1, quantity - 1)) : undefined}
        className={`grid ${box} place-items-center rounded-full font-mono text-sm text-muted-foreground transition-colors`}
      >
        <span aria-hidden>−</span>
      </button>
      <span className={`${value} text-center font-mono font-bold text-foreground`}>{quantity}</span>
      <button
        type="button"
        aria-label={`Zwiększ ilość: ${label}`}
        onClick={onChange ? () => onChange(Math.min(99, quantity + 1)) : undefined}
        className={`grid ${box} place-items-center rounded-full font-mono text-sm text-muted-foreground transition-colors`}
      >
        <span aria-hidden>+</span>
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  1. Kafelek w siatce                                                        */
/* -------------------------------------------------------------------------- */

type CardProduct = Pick<
  Product,
  'name' | 'description' | 'price' | 'category' | 'sizes' | 'image_url' | 'stock_status'
>

/** Placeholder dla produktu bez zdjęcia — sklep rysuje gradient, nie pustkę. */
function ProductThumb({ product }: { product: Pick<CardProduct, 'name' | 'image_url'> }) {
  if (product.image_url) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={product.image_url}
        alt={product.name}
        className="h-56 w-full object-cover"
      />
    )
  }
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

/**
 * Karta produktu w siatce sklepu. `hidden` rysuje ją przygaszoną z etykietą —
 * produkt nieaktywny w ogóle nie trafia do sklepu (zapytanie filtruje
 * `is_active`), a bez tego oznaczenia podgląd sugerowałby, że jednak tam jest.
 *
 * Produkt `out_of_stock` sklep rysuje wygaszony i NIEKLIKALNY — nie da się go
 * dodać do koszyka. To odwzorowane niżej przez `soldOut`.
 */
export function ProductCardPreview({
  product,
  hidden = false,
}: {
  product: CardProduct
  hidden?: boolean
}) {
  const sizes = product.sizes ?? []
  const soldOut = product.stock_status === 'out_of_stock'

  return (
    <div className="relative">
      <div
        className={`flex h-full flex-col overflow-hidden rounded-3xl border bg-card ${
          soldOut ? 'border-border/70 opacity-60' : 'border-border'
        } ${hidden ? 'opacity-40 grayscale' : ''}`}
      >
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
            <ProductName name={product.name} />
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
              {formatShopPrice(product.price)}
            </span>
            {soldOut ? (
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Niedostępne
              </span>
            ) : (
              <span aria-hidden className="font-mono text-sm text-muted-foreground">
                →
              </span>
            )}
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

/* -------------------------------------------------------------------------- */
/*  2. Okno szczegółów produktu                                                */
/* -------------------------------------------------------------------------- */

type DetailProduct = Pick<
  Product,
  | 'name'
  | 'description'
  | 'price'
  | 'category'
  | 'sizes'
  | 'colors'
  | 'image_url'
  | 'stock_status'
>

export type DetailSelection = {
  size: string
  color: string
  quantity: number
  error?: string | null
}

/**
 * To, co klient widzi po kliknięciu w kafelek. Jedyne miejsce, w którym sklep
 * pokazuje KOLORY — w siatce ich nie ma. Bez `onChange` podgląd jest statyczny
 * (pigułki klikają się tylko wtedy, gdy rodzic trzyma stan).
 */
export function ProductDetailPreview({
  product,
  selection = { size: '', color: '', quantity: 1, error: null },
  onSelectSize,
  onSelectColor,
  onQuantityChange,
}: {
  product: DetailProduct
  selection?: DetailSelection
  onSelectSize?: (next: string) => void
  onSelectColor?: (next: string) => void
  onQuantityChange?: (next: number) => void
}) {
  const sizes = product.sizes ?? []
  const colors = product.colors ?? []
  const error = selection.error ?? null

  return (
    <ShopModalFrame>
      <ModalCloseButton label="Zamknij okno produktu" />

      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
        {PRODUCT_CATEGORIES[product.category] ?? product.category}
      </p>
      <h2 className="display-bold mt-2 pr-10 text-3xl text-foreground" style={{ fontWeight: 500 }}>
        <ProductName name={product.name} />
      </h2>

      {product.image_url && (
        /* eslint-disable-next-line @next/next/no-img-element */
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
          {formatShopPrice(product.price)}
        </span>
        <StockPill status={product.stock_status} />
      </div>

      {colors.length > 0 && (
        <OptionPills
          legend="Kolor"
          options={colors}
          value={selection.color}
          onChange={onSelectColor}
          invalid={error === 'Wybierz kolor.'}
        />
      )}

      {sizes.length > 0 && (
        <OptionPills
          legend="Rozmiar"
          options={sizes}
          value={selection.size}
          onChange={onSelectSize}
          invalid={error === 'Wybierz rozmiar.'}
        />
      )}

      <div className="mt-5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Ilość
        </span>
        <div className="mt-2">
          <QuantityStepper
            quantity={selection.quantity}
            onChange={onQuantityChange}
            label={product.name || 'produkt'}
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-destructive">
          {error}
        </p>
      )}

      <div className="mt-6 border-t border-border pt-6">
        <span
          className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
        >
          Dodaj do koszyka <span aria-hidden>→</span>
        </span>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
          ↳ {SHOP_COPY.PAYMENT_NOTICE_SHORT}
        </p>
      </div>
    </ShopModalFrame>
  )
}

/* -------------------------------------------------------------------------- */
/*  3. Koszyk                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Panel koszyka — na desktopie lepki w prawej kolumnie, na mobile pod katalogiem.
 * Blok „Płatność u trenera” jest tu obowiązkowy (wymaganie: klient ma wiedzieć
 * o płatności ZANIM przejdzie do zamówienia).
 */
export function CartPreview({
  items,
  onRemove,
  onQuantityChange,
}: {
  items: PreviewCartItem[]
  onRemove?: (item: PreviewCartItem) => void
  onQuantityChange?: (item: PreviewCartItem, quantity: number) => void
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-violet-soft/50 bg-violet-soft/5 p-8 text-center">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-violet-soft">
          Koszyk jest pusty
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Wybierz coś z listy — rozmiar i kolor ustawisz w oknie produktu.
        </p>
        <p className="mt-4 border-t border-violet-soft/30 pt-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
          ↳ {SHOP_COPY.PAYMENT_NOTICE_SHORT}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
        Koszyk
      </p>
      <h2 className="display-bold mt-2 text-2xl text-foreground" style={{ fontWeight: 500 }}>
        {plItems(cartCount(items))}
      </h2>

      <ul className="mt-5 max-h-96 divide-y divide-border overflow-y-auto">
        {items.map((item) => (
          <li key={itemKey(item)} className="flex items-start justify-between gap-3 py-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {[item.size ? `rozm. ${item.size}` : null, item.color ? item.color : null]
                  .filter(Boolean)
                  .join(' · ') || 'bez wariantu'}
              </p>
              <div className="mt-2">
                <QuantityStepper
                  quantity={item.quantity}
                  size="sm"
                  label={item.name}
                  onChange={
                    onQuantityChange ? (next) => onQuantityChange(item, next) : undefined
                  }
                />
              </div>
            </div>
            <div className="shrink-0 text-right">
              <span className="stat-number text-lg text-foreground" style={{ fontWeight: 500 }}>
                {formatShopPrice(item.price * item.quantity)}
              </span>
              <button
                type="button"
                onClick={onRemove ? () => onRemove(item) : undefined}
                className="mt-1 block w-full font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground transition-colors"
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
          {formatShopPrice(cartTotal(items))}
        </span>
      </div>

      {/* Płatność u trenera — punkt 1: zanim klient przejdzie do zamówienia. */}
      <div className="mt-4 rounded-2xl border border-emerald/45 bg-emerald/5 p-4">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-emerald">
          Płatność u trenera
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {SHOP_COPY.PAYMENT_NOTICE_SHORT}
        </p>
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
          ↳ {SHOP_COPY.ORDER_IS_RESERVATION}
        </p>
      </div>

      <span
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_36px_oklch(0.58_0.24_290/0.35)]"
        style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
      >
        Przejdź do zamówienia <span aria-hidden>→</span>
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  4. Formularz zamówienia                                                    */
/* -------------------------------------------------------------------------- */

const FIELD_CLASS =
  'mt-2 w-full rounded-xl border border-border bg-input/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70'
const LABEL_CLASS =
  'block font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground'

export type CheckoutValues = {
  name: string
  email: string
  phone: string
  notes: string
}

/** Lista pozycji w kasie i na potwierdzeniu — ten sam układ w obu miejscach. */
function ItemLines({ items }: { items: PreviewCartItem[] }) {
  return (
    <ul className="mt-3 divide-y divide-border">
      {items.map((item) => (
        <li key={itemKey(item)} className="flex items-start justify-between gap-3 py-2.5">
          <span className="min-w-0 text-sm text-foreground">
            {item.name}
            <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              {item.quantity} szt.
              {item.size ? ` · ${item.size}` : ''}
              {item.color ? ` · ${item.color}` : ''}
            </span>
          </span>
          <span
            className="stat-number shrink-0 text-base text-foreground"
            style={{ fontWeight: 500 }}
          >
            {formatShopPrice(item.price * item.quantity)}
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Okno zamówienia. Formularz zbiera DOKŁADNIE cztery pola — nie ma tu wyboru
 * lokalizacji odbioru, bo sklep go nie ma (kolumna `preferred_location_id`
 * zostaje NULL, a lokalizacja idzie tekstem w „Uwagach”).
 */
export function CheckoutFormPreview({
  items,
  values,
  onChange,
}: {
  items: PreviewCartItem[]
  values: CheckoutValues
  onChange?: (field: keyof CheckoutValues, value: string) => void
}) {
  const readOnly = !onChange
  const total = cartTotal(items)

  return (
    <ShopModalFrame wide>
      <ModalCloseButton label="Zamknij okno zamówienia" />

      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
        Zamówienie
      </p>
      <h2 className="display-bold mt-2 pr-10 text-3xl text-foreground" style={{ fontWeight: 500 }}>
        Bez płatności online.
      </h2>

      <div className="mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <span className={LABEL_CLASS}>Imię i nazwisko</span>
            <input
              className={FIELD_CLASS}
              value={values.name}
              readOnly={readOnly}
              onChange={onChange ? (e) => onChange('name', e.target.value) : undefined}
            />
          </div>
          <div>
            <span className={LABEL_CLASS}>E-mail</span>
            <input
              className={FIELD_CLASS}
              value={values.email}
              readOnly={readOnly}
              onChange={onChange ? (e) => onChange('email', e.target.value) : undefined}
            />
          </div>
          <div>
            <span className={LABEL_CLASS}>Telefon</span>
            <input
              className={FIELD_CLASS}
              value={values.phone}
              readOnly={readOnly}
              onChange={onChange ? (e) => onChange('phone', e.target.value) : undefined}
            />
          </div>
          <div className="md:col-span-2">
            <span className={LABEL_CLASS}>Uwagi</span>
            <textarea
              className={`${FIELD_CLASS} min-h-24 resize-y leading-relaxed`}
              placeholder="Np. trenuję w Rzeszowie, wtorki i czwartki"
              value={values.notes}
              readOnly={readOnly}
              onChange={onChange ? (e) => onChange('notes', e.target.value) : undefined}
            />
            <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
              ↳ {SHOP_COPY.PICKUP_INFO}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Podsumowanie
          </p>
          <ItemLines items={items} />
          <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Razem
            </span>
            <span className="stat-number text-3xl text-foreground" style={{ fontWeight: 500 }}>
              {formatShopPrice(total)}
            </span>
          </div>

          {/* Płatność u trenera — punkt 2: przy podsumowaniu kwoty. */}
          <div className="mt-4 rounded-2xl border border-emerald/45 bg-emerald/5 p-4">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-emerald">
              Płatność u trenera przy odbiorze
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {SHOP_COPY.PAYMENT_NOTICE_LONG}
            </p>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
              ↳ {SHOP_COPY.ORDER_IS_RESERVATION}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row-reverse">
          <span
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_36px_oklch(0.58_0.24_290/0.35)] sm:w-auto sm:flex-1"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            Złóż zamówienie <span aria-hidden>→</span>
          </span>
          <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-foreground/35 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-foreground sm:w-auto">
            Wróć do zakupów
          </span>
        </div>
      </div>
    </ShopModalFrame>
  )
}

/* -------------------------------------------------------------------------- */
/*  5. Potwierdzenie zamówienia                                                */
/* -------------------------------------------------------------------------- */

/**
 * Ekran po udanym zapisie. Numer zamówienia generuje przeglądarka
 * (`ASQ-${Date.now()}`) — klient widzi go tylko tutaj, bo sklep nie wysyła
 * żadnego maila (strona publiczna to eksport statyczny, nie ma serwera).
 */
export function OrderConfirmationPreview({
  orderNumber,
  items,
}: {
  orderNumber: string
  items: PreviewCartItem[]
}) {
  return (
    <ShopModalFrame wide>
      <div className="rounded-3xl border-2 border-dashed border-emerald/50 bg-emerald/5 p-6 text-center md:p-8">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald">
          <span aria-hidden>✓ </span>Zamówienie przyjęte
        </p>
        <h2
          className="display-bold mt-3 text-2xl text-foreground md:text-3xl"
          style={{ fontWeight: 500 }}
        >
          Rezerwujemy to dla Ciebie.
        </h2>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Numer zamówienia
        </p>
        <p
          className="stat-number mt-1 text-3xl text-foreground md:text-4xl"
          style={{ fontWeight: 500 }}
        >
          {orderNumber}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Zapisz go albo zrób zrzut ekranu — podaj przy odbiorze.
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card p-5">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Zamawiasz
        </p>
        <ItemLines items={items} />
        <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Do zapłaty u trenera
          </span>
          <span className="stat-number text-2xl text-foreground" style={{ fontWeight: 500 }}>
            {formatShopPrice(cartTotal(items))}
          </span>
        </div>
      </div>

      {/* Płatność u trenera — punkt 3: powtórzenie zasady po złożeniu. */}
      <div className="mt-5 rounded-2xl border border-emerald/45 bg-emerald/5 p-5">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-emerald">
          Płatność u trenera
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {SHOP_COPY.PAYMENT_NOTICE_CONFIRMATION}
        </p>
        <ol className="mt-3 space-y-1.5">
          {SHOP_COPY.ORDER_NEXT_STEPS.map((step, index) => (
            <li key={step} className="font-mono text-[11px] leading-relaxed text-muted-foreground">
              <span className="text-emerald">{String(index + 1).padStart(2, '0')}</span> — {step}
            </li>
          ))}
        </ol>
      </div>

      <span className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-foreground/35 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-foreground">
        Rozumiem, zamknij
      </span>
    </ShopModalFrame>
  )
}

/* -------------------------------------------------------------------------- */
/*  Uwagi do produktu                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Rzeczy, których po samym podglądzie nie widać: co sklep z danego pola robi,
 * a czego nie czyta wcale. Aktualizuj razem ze sklepem — to jedyne miejsce,
 * w którym panel mówi wprost, że jakieś pole jest ozdobą.
 */
export function PreviewNotices({
  product,
}: {
  product: Pick<
    Product,
    'description' | 'image_url' | 'stock_status' | 'is_active' | 'colors' | 'sizes'
  >
}) {
  const notices: { tone: 'warn' | 'info'; text: string }[] = []
  const colors = product.colors ?? []
  const sizes = product.sizes ?? []

  if (!product.is_active) {
    notices.push({
      tone: 'warn',
      text: 'Produkt jest nieaktywny — nie pojawi się w sklepie w ogóle.',
    })
  }
  if (product.stock_status === 'out_of_stock') {
    notices.push({
      tone: 'warn',
      text: 'Dostępność „Niedostępny” — sklep pokaże kartę wygaszoną i NIEKLIKALNĄ. Klient nie doda tego do koszyka.',
    })
  }
  if (product.stock_status === 'low') {
    notices.push({
      tone: 'info',
      text: 'Dostępność „Ostatnie sztuki” — na karcie i w oknie szczegółów pojawi się bursztynowa pigułka. Sklep nie liczy sztuk, to tylko etykieta.',
    })
  }
  if (!product.image_url) {
    notices.push({
      tone: 'warn',
      text: 'Brak zdjęcia — na kafelku będzie gradientowy placeholder z napisem „Air Squad”, a w oknie szczegółów nie będzie obrazka wcale.',
    })
  }
  if (!product.description) {
    notices.push({ tone: 'warn', text: 'Brak opisu — pod nazwą zostanie pusto.' })
  }
  if (colors.length > 0) {
    notices.push({
      tone: 'info',
      text: 'Kolory widać dopiero w oknie szczegółów — na kafelku w siatce ich nie ma. Przełącz podgląd, żeby je zobaczyć.',
    })
  }
  if (sizes.length === 0 && colors.length === 0) {
    notices.push({
      tone: 'info',
      text: 'Brak rozmiarów i kolorów — klient doda produkt jednym kliknięciem, bez wyboru wariantu.',
    })
  }
  notices.push({
    tone: 'info',
    text: 'Sklep nie czyta pola „Galeria” ani slugu — nie ma podstron produktów (/sklep/<slug>/), wszystko dzieje się na /sklep/.',
  })

  if (notices.length === 0) return null

  return (
    <ul className="space-y-1.5 text-sm">
      {notices.map((notice) => (
        <li
          key={notice.text}
          className={
            // Panel chodzi na ciemnej palecie — brandowy token amber czyta się
            // na niej lepiej niż amber-600 z domyślnej skali Tailwinda.
            notice.tone === 'warn' ? 'text-amber' : 'text-muted-foreground'
          }
        >
          {notice.tone === 'warn' ? '⚠ ' : 'ℹ '}
          {notice.text}
        </li>
      ))}
    </ul>
  )
}
