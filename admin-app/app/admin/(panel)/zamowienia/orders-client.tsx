'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, Trash2, MoreHorizontal, Package, Mail, Phone, MapPin } from 'lucide-react'
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
      toast.error('Blad podczas aktualizacji statusu')
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
      toast.error('Blad podczas usuwania')
      return
    }

    setOrders((prev) => prev.filter((o) => o.id !== deletingOrder.id))
    toast.success('Zamowienie usuniete')
    setDeleteDialogOpen(false)
    setDeletingOrder(null)
  }

  const columns: Column<OrderWithLocation>[] = [
    {
      key: 'order',
      header: 'Zamowienie',
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
            {items.length} {items.length === 1 ? 'produkt' : 'produktow'}
          </span>
        )
      },
    },
    {
      key: 'total',
      header: 'Kwota',
      cell: (order) => (
        <span className="font-medium">{formatPrice(order.total_amount)}</span>
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
              Szczegoly
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
              Usun
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Zamowienia</h1>
        <p className="text-muted-foreground">Zarzadzaj zamowieniami ze sklepu</p>
      </div>

      <DataTable
        data={orders}
        columns={columns}
        searchKey="customer_name"
        searchPlaceholder="Szukaj po nazwisku klienta..."
        emptyTitle="Brak zamowien"
        emptyDescription="Zamowienia pojawia sie tutaj automatycznie."
      />

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Zamowienie {selectedOrder?.order_number}</DialogTitle>
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
                        Odbior: {selectedOrder.preferred_location.name} ({selectedOrder.preferred_location.city})
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
                <div className="flex items-center justify-between border-t pt-3 font-semibold">
                  <span>Razem</span>
                  <span className="text-lg">{formatPrice(selectedOrder.total_amount)}</span>
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
                <h3 className="font-semibold">Status zamowienia</h3>
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
            <AlertDialogTitle>Usunac zamowienie?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunac zamowienie &quot;{deletingOrder?.order_number}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Usun
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
