import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingBag,
  ClipboardList,
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { ORDER_STATUSES } from '@/lib/types/database'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Liczniki tylko dla tego, czym panel zarządza. Lokalizacje, trenerzy, typy
  // zajęć i obozy są zapiekane w buildzie statycznym — nie ma ich gdzie edytować,
  // a training_sessions nie jest czytana nigdzie na stronie publicznej.
  const [productsResult, ordersResult, pendingOrdersResult, instagramResult] =
    await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabase.from('instagram_posts').select('id', { count: 'exact', head: true }),
    ])

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    {
      label: 'Produkty',
      value: productsResult.count || 0,
      icon: ShoppingBag,
      href: '/admin/produkty',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
    {
      label: 'Zamówienia',
      value: ordersResult.count || 0,
      icon: ClipboardList,
      href: '/admin/zamowienia',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Posty Instagram',
      value: instagramResult.count || 0,
      icon: ImageIcon,
      href: '/admin/instagram',
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Sklep, zamówienia i Instagram. Treść stron edytuje się w kodzie.
        </p>
      </div>

      {/* Alert for pending orders */}
      {(pendingOrdersResult.count || 0) > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {pendingOrdersResult.count} nowych zamówień do realizacji
                </p>
                <p className="text-sm text-muted-foreground">
                  Sprawdź i potwierdź zamówienia
                </p>
              </div>
            </div>
            <Link href="/admin/zamowienia">
              <Button>
                Zobacz zamówienia
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Ostatnie zamowienia</CardTitle>
            <CardDescription>
              {ordersResult.count || 0} zamowien lacznie
            </CardDescription>
          </div>
          <Link href="/admin/zamowienia">
            <Button variant="outline" size="sm">
              Zobacz wszystkie
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer_name} - {order.customer_email}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">
                      {new Intl.NumberFormat('pl-PL', {
                        style: 'currency',
                        currency: 'PLN',
                      }).format(order.total_amount)}
                    </p>
                    <Badge
                      variant={
                        order.status === 'pending' ? 'default' :
                        order.status === 'confirmed' ? 'secondary' :
                        order.status === 'ready' ? 'outline' :
                        order.status === 'completed' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">Brak zamowien</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
