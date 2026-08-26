'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, Trash2, MoreHorizontal, Package, Mail, Phone, MapPin, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { DataTable, Column } from '@/components/admin/data-table'
import { createClient } from '@/lib/supabase/client'
import type { Order, Location, OrderItem } from '@/lib/types/database'
import { ORDER_STATUSES } from '@/lib/types/database'

// ─── KOPIA treści ze sklepu publicznego ──────────────────────────────────────
// Oryginał: airsquad-web/lib/content/shop.ts (PAYMENT_NOTICE_SHORT,
// PAYMENT_NOTICE_LONG, PICKUP_INFO, ORDER_IS_RESERVATION).
// admin-app/ jest samowystarczalny — deploy z CLI wysyła tylko ten katalog,
// więc nie wolno importować niczego spoza niego. Po każdej zmianie treści
// w oryginale zaktualizuj tę kopię RĘCZNIE.
//
// Sposób płatności jest STAŁĄ modelu biznesowego, nie danymi per zamówienie:
// tabela `orders` nie ma i nie dostanie kolumny na płatność. Poniższe zdania są
// więc tekstem w interfejsie, a nie odczytem z bazy — nie da się z nich wnosić,
// czy konkretne zamówienie zostało opłacone.

/** Nagłówek bloku przy kwocie — wersja dla panelu (adresat: osoba z klubu). */
const PAYMENT_NOTICE_TITLE = 'Płatność u trenera przy odbiorze'

/** Rozwinięcie PAYMENT_NOTICE_LONG przepisane z perspektywy klubu. */
const PAYMENT_NOTICE_ADMIN =
  'Ta kwota NIE wpłynęła online — sklep nie przyjmuje płatności internetowych. Zamówienie jest wiążącą rezerwacją, a całość klient przekazuje trenerowi gotówką lub BLIK-iem dopiero przy wydaniu towaru.'

/** Kopia PICKUP_INFO, przepisana z perspektywy klubu. */
const PICKUP_INFO_ADMIN =
  'Odbiór osobisty u trenera na treningu — lokalizację i dni treningów klient podaje w polu „Uwagi”.'

/** Kopia PAYMENT_NOTICE_SHORT — dosłownie to zdanie widział klient w koszyku. */
const PAYMENT_NOTICE_SHORT =
  'Nie płacisz teraz. Całą kwotę przekazujesz trenerowi przy odbiorze.'

/** Kopia ORDER_IS_RESERVATION — dosłownie to zdanie widział klient w koszyku. */
const ORDER_IS_RESERVATION =
  'Zamówienie jest wiążącą rezerwacją — przygotowujemy towar specjalnie dla Ciebie.'

/** Krótka etykieta przy kwocie — na liście i w oknie szczegółów. */
const PAYMENT_BADGE_LABEL = 'Do zapłaty u trenera'
// ─────────────────────────────────────────────────────────────────────────────

function pluralizeProducts(count: number): string {
  if (count === 1) return 'produkt'
  const last = count % 10
  const lastTwo = count % 100
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'produkty'
  return 'produktów'
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(price)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type OrderWithLocation = Order & {
  preferred_location?: { id: string; name: string; city: string } | null
}

interface OrdersClientProps {
  initialData: OrderWithLocation[]
  locations: Pick<Location, 'id' | 'name' | 'city'>[]
}

export function OrdersClient({ initialData, locations }: OrdersClientProps) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialData)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithLocation | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingOrder, setDeletingOrder] = useState<OrderWithLocation | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleStatusChange(orderId: string, newStatus: string) {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      toast.error('Błąd podczas aktualizacji statusu')
      setLoading(false)
      return
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o))
    )
    
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus as Order['status'] } : null)
    }

    toast.success('Status zaktualizowany')
    setLoading(false)
    router.refresh()
  }

  async function handleDelete() {
    if (!deletingOrder) return

    const supabase = createClient()
    const { error } = await supabase.from('orders').delete().eq('id', deletingOrder.id)

    if (error) {
      toast.error('Błąd podczas usuwania')
      return
    }

    setOrders((prev) => prev.filter((o) => o.id !== deletingOrder.id))
    toast.success('Zamówienie usunięte')
    setDeleteDialogOpen(false)
    setDeletingOrder(null)
  }

  const columns: Column<OrderWithLocation>[] = [
    {
      key: 'order',
      header: 'Zamówienie',
      cell: (order) => (
        <div>
          <p className="font-medium">{order.order_number}</p>
          <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Klient',
      cell: (order) => (
        <div>
          <p className="font-medium">{order.customer_name}</p>
          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Produkty',
      cell: (order) => {
        const items = order.items as OrderItem[]
        return (
          <span className="text-muted-foreground">
            {items.length} {pluralizeProducts(items.length)}
          </span>
        )
      },
    },
    {
      key: 'total',
      header: 'Kwota',
      cell: (order) => (
        <div>
          <p className="font-medium">{formatPrice(order.total_amount)}</p>
          {/* Zasada stała: pieniądze bierze trener przy odbiorze, nic nie wpływa online. */}
          <p className="text-xs text-amber">{PAYMENT_BADGE_LABEL}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (order) => (
        <Select
          value={order.status}
          onValueChange={(value) => handleStatusChange(order.id, value)}
          disabled={loading}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ORDER_STATUSES).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (order) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              setSelectedOrder(order)
              setDetailsOpen(true)
            }}>
              <Eye className="mr-2 h-4 w-4" />
              Szczegóły
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setDeletingOrder(order)
                setDeleteDialogOpen(true)
              }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Usuń
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Zamówienia</h1>
        <p className="text-muted-foreground">Zarządzaj zamówieniami ze sklepu</p>
      </div>

      <DataTable
        data={orders}
        columns={columns}
        searchKey="customer_name"
        searchPlaceholder="Szukaj po nazwisku klienta..."
        emptyTitle="Brak zamówień"
        emptyDescription="Zamówienia pojawią się tutaj automatycznie."
      />

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Zamówienie {selectedOrder?.order_number}</DialogTitle>
            <DialogDescription>
              {selectedOrder && formatDate(selectedOrder.created_at)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-semibold">Dane klienta</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${selectedOrder.customer_email}`} className="hover:underline">
                      {selectedOrder.customer_email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${selectedOrder.customer_phone}`} className="hover:underline">
                      {selectedOrder.customer_phone}
                    </a>
                  </div>
                  {selectedOrder.preferred_location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        Odbiór: {selectedOrder.preferred_location.name} ({selectedOrder.preferred_location.city})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-semibold">Produkty</h3>
                <div className="divide-y">
                  {(selectedOrder.items as OrderItem[]).map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.size && `Rozmiar: ${item.size}`}
                            {item.size && item.color && ' | '}
                            {item.color && `Kolor: ${item.color}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 border-t pt-3">
                  <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-2">
                      <span>Razem</span>
                      <Badge className="border-amber/40 bg-amber/15 text-amber" variant="outline">
                        {PAYMENT_BADGE_LABEL}
                      </Badge>
                    </div>
                    <span className="text-lg">{formatPrice(selectedOrder.total_amount)}</span>
                  </div>

                  {/*
                    Zasada płatności stoi TUTAJ, przy kwocie — żeby nikt z klubu nie
                    wziął tej liczby za wpłatę, która już przyszła. W bazie nie ma
                    pola o płatności, więc to stały tekst, nie stan zamówienia.
                  */}
                  <div className="flex items-start gap-3 rounded-lg border border-amber/40 bg-amber/10 p-3">
                    <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
                    <div className="space-y-1.5">
                      <p className="text-sm font-semibold text-amber">{PAYMENT_NOTICE_TITLE}</p>
                      <p className="text-sm text-muted-foreground">{PAYMENT_NOTICE_ADMIN}</p>
                      <p className="text-sm text-muted-foreground">{PICKUP_INFO_ADMIN}</p>
                      <p className="text-xs text-muted-foreground">
                        Klient przeczytał w sklepie: „{PAYMENT_NOTICE_SHORT}” oraz „{ORDER_IS_RESERVATION}”
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="rounded-lg border p-4 space-y-2">
                  <h3 className="font-semibold">Uwagi</h3>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Status */}
              <div className="rounded-lg border p-4 space-y-3">
                <h3 className="font-semibold">Status zamówienia</h3>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => handleStatusChange(selectedOrder.id, value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ORDER_STATUSES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Zamknij
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć zamówienie?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć zamówienie &quot;{deletingOrder?.order_number}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
