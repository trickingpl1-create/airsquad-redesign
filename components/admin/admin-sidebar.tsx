'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Dumbbell, 
  Calendar,
  Tent,
  ShoppingBag,
  ClipboardList,
  Image,
  Settings,
  ExternalLink,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/lokalizacje', icon: MapPin, label: 'Lokalizacje' },
  { href: '/admin/trenerzy', icon: Users, label: 'Trenerzy' },
  { href: '/admin/typy-zajec', icon: Dumbbell, label: 'Typy zajec' },
  { href: '/admin/grafik', icon: Calendar, label: 'Grafik zajec' },
  { href: '/admin/obozy', icon: Tent, label: 'Obozy' },
  { href: '/admin/dyscypliny', icon: Sparkles, label: 'Dyscypliny' },
  { href: '/admin/produkty', icon: ShoppingBag, label: 'Produkty' },
  { href: '/admin/zamowienia', icon: ClipboardList, label: 'Zamowienia' },
  { href: '/admin/instagram', icon: Image, label: 'Instagram' },
  { href: '/admin/ustawienia', icon: Settings, label: 'Ustawienia' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold text-sidebar-primary">AIR SQUAD</span>
          <span className="rounded bg-sidebar-primary/20 px-2 py-0.5 text-xs font-medium text-sidebar-primary">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <ExternalLink className="h-5 w-5" />
          Zobacz strone
        </Link>
      </div>
    </aside>
  )
}
