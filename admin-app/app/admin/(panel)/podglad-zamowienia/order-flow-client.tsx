'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CartPreview,
  CheckoutFormPreview,
  OrderConfirmationPreview,
  ProductDetailPreview,
  SHOP_COPY,
  ShopSurface,
  formatShopPrice,
  type CheckoutValues,
  type PreviewCartItem,
} from '@/components/admin/shop-preview'
import type { Product } from '@/lib/types/database'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/*  Dane                                                                       */
/* -------------------------------------------------------------------------- */

type FlowProduct = Pick<
  Product,
  | 'id'
  | 'name'
  | 'description'
  | 'price'
  | 'category'
  | 'sizes'
  | 'colors'
  | 'image_url'
  | 'stock_status'
>

// Zapasowy katalog na wypadek pustej bazy — żeby podgląd ścieżki zakupu dało
// się obejrzeć, zanim ktokolwiek doda pierwszy produkt. Kształt i ceny
// realistyczne, ale to NIE są dane z bazy (podgląd mówi o tym wprost).
const SAMPLE_PRODUCTS: FlowProduct[] = [
  {
    id: 'przyklad-koszulka',
    name: 'Koszulka treningowa Air Squad',
    description:
      'Lekka, oddychająca koszulka na treningi akrobatyki i trickingu. Logo klubu z przodu, numer grupy z tyłu.',
    price: 89,
    category: 'odziez',
    sizes: ['128', '140', '152', 'S', 'M', 'L'],
    colors: ['Czarny', 'Fioletowy'],
    image_url: null,
    stock_status: 'available',
  },
  {
    id: 'przyklad-worek',
    name: 'Worek na strój',
    description: 'Wytrzymały worek na buty i strój — mieści się do niego cały zestaw na trening.',
    price: 45,
    category: 'akcesoria',
    sizes: [],
    colors: ['Czarny'],
    image_url: null,
    stock_status: 'low',
  },
]

// Numer zamówienia sklep składa w przeglądarce jako `ASQ-${Date.now()}`.
// Tutaj jest STAŁY — losowanie przy każdym renderze rozjeżdżałoby HTML
// serwera z HTML-em przeglądarki (błąd hydracji), a i tak chodzi o kształt.
const SAMPLE_ORDER_NUMBER = 'ASQ-1756200000000'

const SAMPLE_CUSTOMER: CheckoutValues = {
  name: 'Anna Kowalska',
  email: 'anna.kowalska@example.com',
  phone: '600 700 800',
  notes: 'Trenuję w Rzeszowie, wtorki i czwartki. Koszulka dla córki z grupy średniozaawansowanej.',
}

/* -------------------------------------------------------------------------- */
/*  Kroki                                                                      */
/* -------------------------------------------------------------------------- */

type StepId = 'produkt' | 'koszyk' | 'formularz' | 'potwierdzenie'

type Step = {
  id: StepId
  label: string
  /** Co się dzieje na ekranie — jednym zdaniem. */
  what: string
  /** Co ląduje w bazie na tym kroku. */
  db: string[]
  /** Zdanie o płatności u trenera; null, gdy na tym ekranie go nie ma. */
  payment: string | null
}

const STEPS: Step[] = [
  {
    id: 'produkt',
    label: 'Wybór produktu',
    what: 'Klient klika kafelek w siatce i dostaje okno na przyciemnionym, rozmytym tle. To jedyne miejsce, w którym sklep pokazuje KOLORY — na kafelku ich nie ma. Bez wybranego rozmiaru i koloru przycisk „Dodaj do koszyka” pokaże błąd i niczego nie doda.',
    db: [
      'Nic. Na tym etapie nie leci żaden zapis.',
      'Po dodaniu koszyk ląduje w localStorage przeglądarki pod kluczem „airsquad_cart” — przetrwa zamknięcie karty.',
      'Cena zapisuje się w koszyku w chwili dodania. Klient, który wróci po miesiącu, złoży zamówienie po STAREJ cenie — zmiana ceny w panelu nie odświeży jego koszyka.',
      'Sklep nie czyta pola „Galeria” i nie ma podstron produktów (/sklep/<slug>/) — całość dzieje się na /sklep/.',
    ],
    payment: null,
  },
  {
    id: 'koszyk',
    label: 'Koszyk',
    what: 'Panel koszyka: na desktopie lepki w prawej kolumnie, na telefonie pod katalogiem (plus pasek na dole ekranu z kwotą i przyciskiem „Zamawiam”). Klient może tu zmienić ilość i usunąć pozycję.',
    db: [
      'Nadal nic. Zmiana ilości i usunięcie pozycji zapisują się wyłącznie w localStorage.',
      'Kwota „Razem” liczy się w przeglądarce, z cen zapamiętanych w koszyku.',
    ],
    payment:
      'Blok „Płatność u trenera” jest tu obowiązkowy — klient musi wiedzieć o zasadzie ZANIM kliknie „Przejdź do zamówienia”.',
  },
  {
    id: 'formularz',
    label: 'Formularz zamówienia',
    what: 'Okno zamówienia z podsumowaniem pozycji i czterema polami. Klient widzi tu jeszcze raz, co zamawia — i za ile.',
    db: [
      'Wciąż nic — dopóki nie kliknie „Złóż zamówienie”.',
      'Formularz zbiera dokładnie cztery pola: imię i nazwisko, e-mail, telefon, uwagi.',
      'NIE MA wyboru miejsca odbioru — kolumna preferred_location_id zostanie NULL. Dlatego prosimy o lokalizację tekstem w polu „Uwagi”, a w szczegółach zamówienia w panelu linijka „Odbiór:” się nie pojawi.',
    ],
    payment:
      'Drugie, pełne wyjaśnienie zasady — przy samej kwocie, tuż nad przyciskiem wysyłki.',
  },
  {
    id: 'potwierdzenie',
    label: 'Potwierdzenie',
    what: 'Ekran po udanym zapisie. Zostaje na ekranie, dopóki klient sam go nie zamknie — z numerem zamówienia, listą pozycji i kwotą do zapłaty u trenera.',
    db: [
      'Jeden INSERT do tabeli orders z ośmioma polami: order_number, customer_name, customer_email, customer_phone, items, total_amount, notes, status („pending”).',
      'items to JSONB: product_id, product_name, quantity, size, color, price — po jednym wpisie na pozycję koszyka.',
      'total_amount liczy przeglądarka. Strona publiczna jest w pełni statyczna, więc nie ma serwera, który mógłby przeliczyć kwotę — traktuj ją jak deklarację klienta, nie jak fakt.',
      'Sposobu płatności NIE MA w bazie i nie będzie — „u trenera przy odbiorze” to stała modelu, a nie dane per zamówienie.',
      'Nikt nie dostaje maila: ani klient, ani klub. Nowe zamówienia sprawdzasz w zakładce „Zamówienia”.',
    ],
    payment: 'Trzecie powtórzenie zasady plus trzy kroki „co dalej”.',
  },
]

/* -------------------------------------------------------------------------- */
/*  Strona                                                                     */
/* -------------------------------------------------------------------------- */

export function OrderFlowClient({ products }: { products: Product[] }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState<CheckoutValues>(SAMPLE_CUSTOMER)

  const usingSample = products.length === 0
  const catalog: FlowProduct[] = usingSample ? SAMPLE_PRODUCTS : products

  // Do okna szczegółów bierzemy produkt, który ma jakikolwiek wariant —
  // inaczej podgląd nie pokazałby wyboru rozmiaru ani koloru.
  const hero = useMemo(() => {
    const withVariants = catalog.find(
      (product) => (product.sizes?.length ?? 0) > 0 || (product.colors?.length ?? 0) > 0
    )
    return withVariants ?? catalog[0]
  }, [catalog])

  const [size, setSize] = useState(() => hero?.sizes?.[0] ?? '')
  const [color, setColor] = useState(() => hero?.colors?.[0] ?? '')
  const [quantity, setQuantity] = useState(1)

  // Koszyk: pozycja wybrana w kroku 1 + drugi produkt z katalogu, żeby było
  // widać, jak wygląda lista z więcej niż jedną pozycją.
  const [extraQuantity, setExtraQuantity] = useState(1)
  const [extraRemoved, setExtraRemoved] = useState(false)

  const cart: PreviewCartItem[] = useMemo(() => {
    if (!hero) return []
    const items: PreviewCartItem[] = [
      {
        id: hero.id,
        name: hero.name,
        price: hero.price,
        quantity,
        size: size || undefined,
        color: color || undefined,
      },
    ]
    const extra = catalog.find((product) => product.id !== hero.id)
    if (extra && !extraRemoved) {
      items.push({
        id: extra.id,
        name: extra.name,
        price: extra.price,
        quantity: extraQuantity,
        size: extra.sizes?.[0],
        color: extra.colors?.[0],
      })
    }
    return items
  }, [catalog, hero, quantity, size, color, extraQuantity, extraRemoved])

  const step = STEPS[stepIndex]
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!hero) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <p className="rounded-lg border p-6 text-sm text-muted-foreground">
          Nie ma czego pokazać — w bazie nie ma ani jednego produktu, a dane
          przykładowe też się nie wczytały. Dodaj produkt w zakładce „Produkty”.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader />

      {usingSample && (
        <p className="rounded-lg border border-amber/40 bg-amber/5 p-4 text-sm text-amber">
          ⚠ W bazie nie ma aktywnych produktów, więc ścieżka jest pokazana na
          danych przykładowych wpisanych w kod panelu. Dodaj produkt w zakładce
          „Produkty”, a podgląd przełączy się na prawdziwy katalog.
        </p>
      )}

      {/* Lista kroków — klikalna, plus zaznaczony krok bieżący. */}
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((item, index) => {
          const active = index === stepIndex
          const done = index < stepIndex
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setStepIndex(index)}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                  active
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-muted/50'
                )}
              >
                <span
                  className={cn(
                    'grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : done
                        ? 'bg-emerald/20 text-emerald'
                        : 'bg-muted text-muted-foreground'
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    'text-sm font-medium',
                    active ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* Opis kroku */}
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Krok {stepIndex + 1} z {STEPS.length}
        </p>
        <h2 className="mt-1 text-xl font-semibold">{step.label}</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{step.what}</p>
      </div>

      {/* Ekran klienta */}
      <ShopSurface className="p-6 md:p-10">
        {step.id === 'produkt' && (
          <ProductDetailPreview
            product={hero}
            selection={{ size, color, quantity }}
            onSelectSize={setSize}
            onSelectColor={setColor}
            onQuantityChange={setQuantity}
          />
        )}

        {step.id === 'koszyk' && (
          <div className="mx-auto w-full max-w-[340px]">
            <CartPreview
              items={cart}
              onQuantityChange={(item, next) => {
                if (item.id === hero.id) setQuantity(next)
                else setExtraQuantity(next)
              }}
              onRemove={(item) => {
                if (item.id !== hero.id) setExtraRemoved(true)
              }}
            />
          </div>
        )}

        {step.id === 'formularz' && (
          <CheckoutFormPreview
            items={cart}
            values={values}
            onChange={(field, value) => setValues((prev) => ({ ...prev, [field]: value }))}
          />
        )}

        {step.id === 'potwierdzenie' && (
          <OrderConfirmationPreview orderNumber={SAMPLE_ORDER_NUMBER} items={cart} />
        )}
      </ShopSurface>

      {/* Podpis pod ekranem */}
      <p className="text-xs text-muted-foreground">
        {step.id === 'produkt' &&
          'W sklepie to okno leży na przyciemnionym, rozmytym tle katalogu. Zamyka je Escape, klik w tło albo ✕. Rozmiar i kolor możesz tu klikać — zmiana przeniesie się na kolejne kroki.'}
        {step.id === 'koszyk' &&
          'Kolumna ma 340 px — dokładnie tyle co w sklepie na desktopie. Na telefonie ten sam panel ląduje pod katalogiem, a nad nim jest przyklejony do dołu pasek z kwotą i przyciskiem „Zamawiam”.'}
        {step.id === 'formularz' &&
          'Pola są edytowalne — wpisz cokolwiek, żeby zobaczyć, jak zachowuje się układ przy długim nazwisku albo długich uwagach.'}
        {step.id === 'potwierdzenie' &&
          'Numer jest przykładowy. Sklep składa go w przeglądarce jako ASQ- i znacznik czasu w milisekundach.'}
      </p>

      {/* Co trafia do bazy */}
      <div className="space-y-3 rounded-lg border p-4">
        <h3 className="font-semibold">Co trafia do bazy</h3>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {step.db.map((line) => (
            <li key={line}>— {line}</li>
          ))}
        </ul>
      </div>

      {/* Płatność u trenera — powód, dla którego ten podgląd istnieje */}
      {step.payment && (
        <div className="space-y-2 rounded-lg border border-emerald/45 bg-emerald/5 p-4">
          <h3 className="font-semibold text-emerald">Płatność u trenera</h3>
          <p className="text-sm text-muted-foreground">{step.payment}</p>
          <p className="text-sm text-muted-foreground">
            Zdanie na ekranie klienta:{' '}
            <span className="text-foreground">
              „
              {step.id === 'koszyk'
                ? SHOP_COPY.PAYMENT_NOTICE_SHORT
                : step.id === 'formularz'
                  ? SHOP_COPY.PAYMENT_NOTICE_LONG
                  : SHOP_COPY.PAYMENT_NOTICE_CONFIRMATION}
              ”
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            Treść jest jedna dla całego sklepu (lib/content/shop.ts w aplikacji
            publicznej). Panel ma jej kopię w components/admin/shop-preview.tsx —
            po zmianie w sklepie trzeba ją tu przepisać ręcznie.
          </p>
        </div>
      )}

      {/* Nawigacja */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <Button
          variant="outline"
          onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
          disabled={stepIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Wstecz
        </Button>

        <span className="text-sm text-muted-foreground">
          Zamówienie w podglądzie: {formatShopPrice(total)}
        </span>

        <Button
          onClick={() => setStepIndex((index) => Math.min(STEPS.length - 1, index + 1))}
          disabled={stepIndex === STEPS.length - 1}
        >
          Dalej
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Podgląd odwzorowuje ekrany sklepu, ale niczego nie zapisuje — klikanie tu
        nie tworzy zamówień. Prawdziwe zamówienia są w zakładce „Zamówienia”.
      </p>
    </div>
  )
}

function PageHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Podgląd zamówienia</h1>
        <p className="text-muted-foreground">
          Cała ścieżka klienta krok po kroku — od kliknięcia w produkt do
          potwierdzenia. Widać tu, że klient nie płaci online i co dokładnie
          ląduje w bazie.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link href="/admin/produkty">
          <Pencil className="mr-2 h-4 w-4" />
          Edytuj produkty
        </Link>
      </Button>
    </div>
  )
}
