'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingBag, Moon, Sun, ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const eventLinks = [
  { href: '/letni', label: 'Air Camp' },
  { href: '/airmeeting', label: 'Air Meeting' },
  { href: '/gravityjam', label: 'Gravity Jam' },
]

const cityLinks = [
  { href: '/rzeszow', label: 'Rzeszów' },
  { href: '/debica', label: 'Dębica' },
  { href: '/jaslo', label: 'Jasło' },
  { href: '/biecz', label: 'Biecz' },
  { href: '/brzostek', label: 'Brzostek' },
  { href: '/pilzno', label: 'Pilzno' },
  { href: '/tyczyn', label: 'Tyczyn' },
]

type NavLink =
  | { href: string; label: string }
  | { label: string; badge?: string; items: { href: string; label: string }[] }

const navLinks: NavLink[] = [
  { href: '/', label: 'STRONA GŁÓWNA' },
  { href: '/aktualnosci', label: 'AKTUALNOŚCI' },
  { label: 'OBOZY I WYDARZENIA', badge: 'LATO 2026', items: eventLinks },
  { label: 'LOKALIZACJE', items: cityLinks },
  { href: '/sklep', label: 'SKLEP' },
  { href: '/kontakt', label: 'KONTAKT' },
]

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5" />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Zmień motyw"
      className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground/70 transition-colors hover:border-white/20 hover:text-foreground"
    >
      {theme === 'dark' ? <Sun className="h-[15px] w-[15px]" /> : <Moon className="h-[15px] w-[15px]" />}
    </button>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top status bar */}
      <div className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/85 backdrop-blur-md">
        <div className="container mx-auto flex h-7 items-center justify-between px-4 font-mono text-[10px] tracking-[0.2em]">
          {/* Left — live indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-pulse-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
            </span>
            <span className="font-bold uppercase text-cyan">Live</span>
            <span className="text-foreground/30">·</span>
            <span className="uppercase text-foreground/55">Zapisy 2025/26 trwają</span>
          </div>
          {/* Right — phone + region */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="tel:+48728559101"
              className="text-foreground/55 transition-colors hover:text-foreground"
            >
              728 559 101
            </a>
            <span className="text-foreground/25">·</span>
            <span className="text-foreground/45">/ Lokalizacji w regionie</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          'fixed top-7 z-40 w-full transition-all duration-300',
          scrolled
            ? 'border-b border-white/8 bg-background/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="container mx-auto flex h-[58px] items-center justify-between px-4">

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <Image
              src="/images/airsquad-logo.png"
              alt="Air Squad"
              width={110}
              height={52}
              className="h-[42px] w-auto object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
              priority
            />
            <span className="hidden font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/40 xl:inline">
              // Est. 2003 · Podkarpacie
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-5 lg:flex"
            aria-label="Główna nawigacja"
          >
            {navLinks.map((link) =>
              'items' in link ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold tracking-[0.16em] text-foreground/65 outline-none transition-colors hover:text-cyan focus-visible:text-cyan">
                    {link.label}
                    {'badge' in link && (
                      <span className="inline-flex h-5 items-center rounded-full bg-emerald px-2 py-0.5 text-[8px] font-black text-emerald-950">
                        {link.badge}
                      </span>
                    )}
                    <ChevronDown className="h-3 w-3" aria-hidden />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[180px]">
                    {link.items.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="font-mono text-[11px] font-bold tracking-[0.1em]"
                        >
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative font-mono text-[10.5px] font-bold tracking-[0.16em] text-foreground/65 transition-colors hover:text-cyan focus-visible:text-cyan focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop right */}
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggleButton />
            <Link
              href="/sklep"
              aria-label="Sklep"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground/70 transition-colors hover:border-white/20 hover:text-foreground"
            >
              <ShoppingBag className="h-[15px] w-[15px]" />
            </Link>
            <Link
              href="/kontakt"
              className="flex items-center gap-1.5 rounded-full px-5 py-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-white transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              }}
            >
              Zapisz dziecko
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <ThemeToggleButton />
            <Link
              href="/sklep"
              aria-label="Sklep"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground/70 hover:text-foreground"
            >
              <ShoppingBag className="h-[15px] w-[15px]" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
              aria-expanded={mobileMenuOpen}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground/70 hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        <div
          className={cn(
            'absolute inset-x-0 top-[58px] border-b border-white/8 bg-background/98 backdrop-blur-xl lg:hidden',
            mobileMenuOpen ? 'block' : 'hidden',
          )}
        >
          <nav
            className="container mx-auto flex flex-col px-4 py-4"
            aria-label="Mobilna nawigacja"
          >
            {navLinks.map((link) =>
              'items' in link ? (
                <div key={link.label} className="border-b border-white/6 py-3.5">
                  <span className="font-mono text-[10.5px] font-bold tracking-[0.16em] text-foreground/65">
                    {link.label}
                    {'badge' in link && (
                      <span className="ml-2 inline-block rounded-full bg-emerald px-2 py-0.5 text-[8px] font-black text-emerald-950">
                        {link.badge}
                      </span>
                    )}
                  </span>
                  <div className="mt-3 flex flex-col gap-3 pl-3">
                    {link.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="font-mono text-[10px] font-bold tracking-[0.14em] text-foreground/55 transition-colors hover:text-cyan"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative border-b border-white/6 py-3.5 font-mono text-[10.5px] font-bold tracking-[0.16em] text-foreground/65 transition-colors hover:text-cyan"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ),
            )}
            <Link
              href="/kontakt"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 rounded-full px-5 py-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-white"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              }}
            >
              Zapisz dziecko →
            </Link>
          </nav>
        </div>
      </header>
    </>
  )
}
