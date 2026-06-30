import { cn } from '@/lib/utils'

type StickerProps = {
  children: React.ReactNode
  variant?: 'primary' | 'accent' | 'cyan' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  rotate?: number
  className?: string
}

const variantClasses = {
  primary: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground',
  cyan: 'bg-cyan text-cyan-foreground',
  dark: 'bg-foreground text-background',
}

const sizeClasses = {
  sm: 'px-3 py-1 text-[11px]',
  md: 'px-4 py-2 text-xs',
  lg: 'px-5 py-3 text-sm',
}

export function Sticker({
  children,
  variant = 'primary',
  size = 'md',
  rotate = -3,
  className,
}: StickerProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-full border-2 border-foreground font-mono font-bold uppercase tracking-wide shadow-sticker',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  )
}
