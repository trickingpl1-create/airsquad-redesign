import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  kicker: string
  /** Tailwind text color class for the kicker, e.g. 'text-cyan' */
  kickerColorClass?: string
  /** First, plain part of the title */
  title: string
  /** Second part of the title — rendered with the gradient text effect */
  gradientPart: string
  /** Optional small meta text on the right (mono) */
  meta?: string
  className?: string
  /** Optional fontWeight for title */
  titleFontWeight?: number
  /** Optional fontWeight for gradient part */
  gradientFontWeight?: number
}

export function SectionHeader({
  kicker,
  kickerColorClass = 'text-violet-soft',
  title,
  gradientPart,
  meta,
  className,
  titleFontWeight,
  gradientFontWeight,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div>
        <p
          className={cn(
            'font-mono text-[11px] font-bold uppercase tracking-[0.18em] md:text-xs',
            kickerColorClass,
          )}
        >
          {kicker}
        </p>
        <h2 className="display-bold mt-3 text-balance text-4xl text-foreground md:text-5xl lg:text-6xl">
          <span style={titleFontWeight ? { fontWeight: titleFontWeight } : undefined}>{title}</span>{' '}
          <span className="gradient-text" style={gradientFontWeight ? { fontWeight: gradientFontWeight } : undefined}>{gradientPart}</span>
        </h2>
      </div>
      {meta && (
        <p className="max-w-xs font-mono text-xs text-muted-foreground md:text-right">
          {meta}
        </p>
      )}
    </div>
  )
}
