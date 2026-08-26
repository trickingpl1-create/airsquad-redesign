'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Pencil, Trash2, MoreHorizontal, Package, CheckCircle, XCircle } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { DataTable, Column } from '@/components/admin/data-table'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  ShopSurface,
  ProductCardPreview,
  ProductDetailPreview,
  PreviewNotices,
} from '@/components/admin/shop-preview'
import type { Product } from '@/lib/types/database'
import { PRODUCT_CATEGORIES, STOCK_STATUSES } from '@/lib/types/database'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(price)
}

// Przełącznik podglądu. Brak components/ui/tabs w panelu (i brak paczki
// @radix-ui/react-tabs), więc zakładki są ręczne — ten sam wzorzec co na
// /admin/podglad-sklepu.
const PREVIEW_TABS = [
  { value: 'card', label: 'Kafelek w siatce' },
  { value: 'detail', label: 'Okno szczegółów' },
] as const

interface ProductsClientProps {
  initialData: Product[]
}

export function ProductsClient({ initialData }: ProductsClientProps) {
  const router = useRouter()
  const [products, setProducts] = useState(initialData)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  // Który podgląd sklepu jest na wierzchu w oknie edycji. Brak komponentu Tabs
  // w admin-app/components/ui — przełącznik jest z gołych <button>ów, tak samo
  // jak zakładki kategorii na /admin/podglad-sklepu.
  const [previewMode, setPreviewMode] = useState<'card' | 'detail'>('card')

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    category: 'odziez' as Product['category'],
    sizes: [] as string[],
    colors: [] as string[],
    image_url: '',
    stock_status: 'available' as Product['stock_status'],
    display_order: 0,
    is_active: true,
  })

  function resetForm() {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: 0,
      category: 'odziez',
      sizes: [],
      colors: [],
      image_url: '',
      stock_status: 'available',
      display_order: 0,
      is_active: true,
    })
  }

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const dataToSave = {
      ...formData,
      slug: formData.slug || generateSlug(formData.name),
    }

    if (editingProduct) {
      const { data, error } = await supabase
        .from('products')
        .update(dataToSave)
        .eq('id', editingProduct.id)
        .select()
        .single()

      if (error) {
        toast.error('Błąd podczas aktualizacji')
        setLoading(false)
        return
      }

      setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)))
      toast.success('Produkt zaktualizowany')
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert(dataToSave)
        .select()
        .single()

      if (error) {
        toast.error('Błąd podczas dodawania')
        setLoading(false)
        return
      }

      setProducts((prev) => [...prev, data])
      toast.success('Produkt dodany')
    }

    setLoading(false)
    setFormOpen(false)
    setEditingProduct(null)
    resetForm()
    router.refresh()
  }

  async function handleDelete() {
    if (!deletingProduct) return

    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', deletingProduct.id)

    if (error) {
      toast.error('Błąd podczas usuwania')
      return
    }

    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id))
    toast.success('Produkt usunięty')
    setDeleteDialogOpen(false)
    setDeletingProduct(null)
  }

  function handleEdit(product: Product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      category: product.category,
      sizes: product.sizes || [],
      colors: product.colors || [],
      image_url: product.image_url || '',
      stock_status: product.stock_status,
      display_order: product.display_order,
      is_active: product.is_active,
    })
    setFormOpen(true)
  }

  const columns: Column<Product>[] = [
    {
      key: 'product',
      header: 'Produkt',
      cell: (product) => (
        <div className="flex items-center gap-3">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              {PRODUCT_CATEGORIES[product.category]}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Cena',
      cell: (product) => (
        <span className="font-medium">{formatPrice(product.price)}</span>
      ),
    },
    {
      key: 'stock',
      header: 'Dostępność',
      cell: (product) => (
        <Badge
          variant={
            product.stock_status === 'available' ? 'default' :
            product.stock_status === 'low' ? 'secondary' :
            'destructive'
          }
        >
          {STOCK_STATUSES[product.stock_status]}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (product) => (
        <Badge variant={product.is_active ? 'outline' : 'secondary'}>
          {product.is_active ? 'Aktywny' : 'Nieaktywny'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (product) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(product)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edytuj
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setDeletingProduct(product)
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
        <h1 className="text-3xl font-bold tracking-tight">Produkty</h1>
        <p className="text-muted-foreground">Zarządzaj produktami w sklepie</p>
      </div>

      <DataTable
        data={products}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Szukaj produktów..."
        onAdd={() => {
          resetForm()
          setEditingProduct(null)
          setFormOpen(true)
        }}
        addLabel="Dodaj produkt"
        emptyTitle="Brak produktów"
        emptyDescription="Dodaj pierwszy produkt do sklepu."
      />

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={(open) => {
        if (!open) {
          setFormOpen(false)
          setEditingProduct(null)
          resetForm()
        }
      }}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edytuj produkt' : 'Nowy produkt'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Zaktualizuj dane produktu.' : 'Wypełnij dane nowego produktu.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nazwa</FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="slug">Slug (URL)</FieldLabel>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generowany z nazwy"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Opis</FieldLabel>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="price">Cena (PLN)</FieldLabel>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="category">Kategoria</FieldLabel>
                <Select
                  value={formData.category}
                  onValueChange={(value: 'odziez' | 'akcesoria' | 'inne') => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRODUCT_CATEGORIES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="sizes">Rozmiary (oddzielone przecinkiem)</FieldLabel>
                <Input
                  id="sizes"
                  value={formData.sizes.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    sizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })}
                  placeholder="np. S, M, L, XL"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="colors">Kolory (oddzielone przecinkiem)</FieldLabel>
                <Input
                  id="colors"
                  value={formData.colors.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    colors: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })}
                  placeholder="np. Czarny, Biały"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="image_url">URL zdjęcia</FieldLabel>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="stock_status">Dostępność</FieldLabel>
                <Select
                  value={formData.stock_status}
                  onValueChange={(value: 'available' | 'low' | 'out_of_stock') => setFormData({ ...formData, stock_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STOCK_STATUSES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field className="flex items-center justify-between">
                <div>
                  <FieldLabel htmlFor="is_active">Aktywny</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Nieaktywne produkty nie są widoczne w sklepie
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </Field>
            </FieldGroup>

            {/* Podgląd karmiony formData, nie zapisanym wierszem — pokazuje
                zmiany w trakcie pisania, zanim klikniesz „Zapisz". Dwa widoki,
                bo sklep pokazuje produkt w dwóch miejscach i pokazuje w nich
                CO INNEGO: kafelek nie ma kolorów, okno szczegółów nie ma listy
                rozmiarów pod nazwą. */}
            <aside className="space-y-3 lg:sticky lg:top-0 lg:self-start">
              <div>
                <p className="text-sm font-medium">Podgląd w sklepie</p>
                <p className="text-xs text-muted-foreground">
                  Tak zobaczy ten produkt klient.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PREVIEW_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setPreviewMode(tab.value)}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                      previewMode === tab.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {previewMode === 'card' ? (
                <ShopSurface className="p-4">
                  <ProductCardPreview
                    product={{
                      name: formData.name,
                      description: formData.description || null,
                      price: formData.price,
                      category: formData.category,
                      sizes: formData.sizes,
                      image_url: formData.image_url || null,
                      stock_status: formData.stock_status,
                    }}
                    hidden={!formData.is_active}
                  />
                </ShopSurface>
              ) : (
                <ShopSurface className="p-4">
                  <ProductDetailPreview
                    product={{
                      name: formData.name,
                      description: formData.description || null,
                      price: formData.price,
                      category: formData.category,
                      sizes: formData.sizes,
                      colors: formData.colors,
                      image_url: formData.image_url || null,
                      stock_status: formData.stock_status,
                    }}
                  />
                </ShopSurface>
              )}

              <p className="text-xs text-muted-foreground">
                {previewMode === 'card'
                  ? 'Kafelek jest klikalny — otwiera okno szczegółów. Wyjątek: produkt „Niedostępny”, którego sklep nie pozwala kliknąć.'
                  : 'Warianty pokazane w stanie startowym — klient otwiera okno z niczym niewybranym i bez wyboru nie doda produktu do koszyka. Szerokość jak na telefonie; na desktopie okno ma 512 px.'}
              </p>

              <PreviewNotices
                product={{
                  description: formData.description || null,
                  image_url: formData.image_url || null,
                  stock_status: formData.stock_status,
                  is_active: formData.is_active,
                  colors: formData.colors,
                  sizes: formData.sizes,
                }}
              />
            </aside>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} disabled={loading}>
                Anuluj
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Spinner className="mr-2 h-4 w-4" />}
                {editingProduct ? 'Zapisz' : 'Dodaj'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć produkt?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć produkt &quot;{deletingProduct?.name}&quot;?
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
