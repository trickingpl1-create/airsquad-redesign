'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn(
          'h-10 w-10 animate-pulse rounded-xl bg-card',
          className,
        )}
        aria-hidden
      />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Przełącz na jasny tryb' : 'Przełącz na ciemny tryb'}
      className={cn(
        'group relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-border/80 bg-card/80 backdrop-blur-sm text-foreground/80 transition-all duration-300 hover:border-primary/60 hover:bg-primary/10 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:hover:border-cyan/50 dark:hover:bg-cyan/10',
        className,
      )}
    >
      {/* Subtle gradient glow behind icon */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          isDark
            ? 'bg-gradient-to-br from-cyan/10 to-transparent'
            : 'bg-gradient-to-br from-amber/15 to-transparent'
        )}
      />
      <Sun
        className={cn(
          'absolute h-5 w-5 transition-all duration-500 ease-out',
          isDark
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100 text-amber',
        )}
      />
      <Moon
        className={cn(
          'absolute h-5 w-5 transition-all duration-500 ease-out',
          isDark
            ? 'rotate-0 scale-100 opacity-100 text-cyan'
            : '-rotate-90 scale-0 opacity-0',
        )}
      />
    </button>
  )
}
