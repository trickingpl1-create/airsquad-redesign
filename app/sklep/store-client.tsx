'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/lib/hooks/use-cart'
import type { Product } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShoppingCart, X, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export function StoreClient() {
  const supabase = createClient()
  const { cart, addItem, removeItem, updateQuantity, total } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('[v0] Error fetching products:', error)
        return
      }

      setProducts(data || [])
      setFilteredProducts(data || [])
      setLoading(false)
    }

    fetchProducts()
  }, [supabase])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory))
    }
  }, [selectedCategory, products])

  const handleAddToCart = () => {
    if (selectedProduct) {
      addItem(selectedProduct, quantity, selectedSize, selectedColor)
      setSelectedProduct(null)
      setSelectedSize('')
      setSelectedColor('')
      setQuantity(1)
      setShowCart(true)
    }
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-display mb-2">Sklep Air Squad</h1>
        <p className="text-muted-foreground">Oficjalne gadżetki i odzież klubu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Products Grid */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="all" onValueChange={setSelectedCategory} className="mb-8">
            <TabsList>
              <TabsTrigger value="all">Wszystko</TabsTrigger>
              <TabsTrigger value="odziez">Odzież</TabsTrigger>
              <TabsTrigger value="akcesoria">Akcesoria</TabsTrigger>
              <TabsTrigger value="inne">Inne</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Ładowanie produktów...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Brak produktów w tej kategorii</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card
                  key={product.id}
                  className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedProduct(product)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded mb-4"
                      />
                    )}
                    <div className="flex-1 mb-4">
                      <Badge variant="secondary" className="mb-2">
                        {product.category}
                      </Badge>
                      {product.sizes && product.sizes.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Rozmiary: {product.sizes.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">{product.price.toFixed(2)} zł</span>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); setSelectedProduct(product) }}>
                        Szczegóły
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Koszyk ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-sm">Koszyk jest pusty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {cart.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex justify-between items-start text-sm border-b pb-2">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Ilość: {item.quantity}</p>
                          {item.size && <p className="text-xs text-muted-foreground">Rozmiar: {item.size}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{(item.price * item.quantity).toFixed(2)} zł</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => removeItem(item.id, item.size, item.color)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Razem:</span>
                      <span className="text-primary">{total.toFixed(2)} zł</span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => setShowCheckout(true)}
                    >
                      Przejdź do zamówienia
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduct(null)}>
          <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{selectedProduct.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setSelectedProduct(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedProduct.image_url && (
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-48 object-cover rounded"
                />
              )}
              <p className="text-muted-foreground">{selectedProduct.description}</p>
              <div className="text-2xl font-bold text-primary">{selectedProduct.price.toFixed(2)} zł</div>

              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div>
                  <label className="text-sm font-medium block mb-2">Kolor</label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Wybierz kolor</option>
                    {selectedProduct.colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div>
                  <label className="text-sm font-medium block mb-2">Rozmiar</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Wybierz rozmiar</option>
                    {selectedProduct.sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium block mb-2">Ilość</label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <Button className="w-full" onClick={handleAddToCart}>
                Dodaj do koszyka
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutForm
          cart={cart}
          total={total}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false)
            setShowCart(true)
          }}
        />
      )}
    </div>
  )
}

function CheckoutForm({
  cart,
  total,
  onClose,
  onSuccess,
}: {
  cart: any[]
  total: number
  onClose: () => void
  onSuccess: () => void
}) {
  const supabase = createClient()
  const { clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const orderNumber = `ASQ-${Date.now()}`
      const { error } = await supabase.from('orders').insert({
        order_number: orderNumber,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        items: cart,
        total_amount: total,
        notes: formData.notes,
        status: 'pending',
      })

      if (error) throw error

      setSubmitted(true)
      setTimeout(() => {
        clearCart()
        onSuccess()
      }, 2000)
    } catch (error) {
      console.error('[v0] Error submitting order:', error)
      alert('Błąd przy tworzeniu zamówienia')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Zamówienie zostało złożone!</h2>
            <p className="text-muted-foreground mb-4">
              Dzięki za zakup. Skontaktujemy się z tobą wkrótce.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>Podsumowanie zamówienia</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Imię i nazwisko</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Telefon</label>
              <Input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Uwagi</label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Np. preferowana lokalizacja odboru"
              />
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Razem:</span>
                <span className="text-primary">{total.toFixed(2)} zł</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Płatność odbędzie się u trenera przy odbiorze towaru.
              </p>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Przetwarzanie...' : 'Złóż zamówienie'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
