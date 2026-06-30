import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Users, 
  Dumbbell, 
  Calendar,
  Tent,
  ShoppingBag,
  ClipboardList,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { ORDER_STATUSES } from '@/lib/types/database'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch counts in parallel
  const [
    locationsResult,
    trainersResult,
    trainingTypesResult,
    sessionsResult,
    campsResult,
    productsResult,
    ordersResult,
    pendingOrdersResult,
  ] = await Promise.all([
    supabase.from('locations').select('id', { count: 'exact', head: true }),
    supabase.from('trainers').select('id', { count: 'exact', head: true }),
    supabase.from('training_types').select('id', { count: 'exact', head: true }),
    supabase.from('training_sessions').select('id', { count: 'exact', head: true }),
    supabase.from('camps').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { 
      label: 'Lokalizacje', 
      value: locationsResult.count || 0, 
      icon: MapPin, 
      href: '/admin/lokalizacje',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    { 
      label: 'Trenerzy', 
      value: trainersResult.count || 0, 
      icon: Users, 
      href: '/admin/trenerzy',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    { 
      label: 'Typy zajec', 
      value: trainingTypesResult.count || 0, 
      icon: Dumbbell, 
      href: '/admin/typy-zajec',
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
    },
    { 
      label: 'Zajecia w grafiku', 
      value: sessionsResult.count || 0, 
      icon: Calendar, 
      href: '/admin/grafik',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    { 
      label: 'Obozy', 
      value: campsResult.count || 0, 
      icon: Tent, 
      href: '/admin/obozy',
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
    },
    { 
      label: 'Produkty', 
      value: productsResult.count || 0, 
      icon: ShoppingBag, 
      href: '/admin/produkty',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
    { 
      label: 'Dyscypliny', 
      value: 6, 
      icon: Sparkles, 
      href: '/admin/dyscypliny',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Przegladaj statystyki i zarzadzaj trescia strony Air Squad
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
                  {pendingOrdersResult.count} nowych zamowien do realizacji
                </p>
                <p className="text-sm text-muted-foreground">
                  Sprawdz i potwierdz zamowienia
                </p>
              </div>
            </div>
            <Link href="/admin/zamowienia">
              <Button>
                Zobacz zamowienia
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
