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
  /**
   * Poziom nagłówka. Domyślnie 'h2' — nagłówek sekcji.
   * 'h1' tylko tam, gdzie ten komponent jest JEDYNYM nagłówkiem strony
   * (np. /sklep) — każda podstrona musi mieć dokładnie jeden h1
   * (docs/02-plan-seo.md).
   */
  as?: 'h1' | 'h2'
  /**
   * 'on-photo' — nagłówek leży na przyciemnionym zdjęciu (hero /trenerzy/).
   * Oba człony tytułu są wtedy jednolicie białe, bez `.gradient-text`:
   * gradient (fiolet→cyjan przez background-clip) na ciemnej fotografii nie
   * dociąga do kontrastu 3:1, a `color` z zewnątrz go nie nadpisuje.
   * Kicker bez zmian — ma własną klasę koloru.
   */
  tone?: 'default' | 'on-photo'
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
  as: Heading = 'h2',
  tone = 'default',
}: SectionHeaderProps) {
  const onPhoto = tone === 'on-photo'
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
        <Heading
          className={cn(
            'display-bold mt-3 text-balance text-4xl md:text-5xl lg:text-6xl',
            onPhoto ? 'text-white' : 'text-foreground',
          )}
        >
          <span style={titleFontWeight ? { fontWeight: titleFontWeight } : undefined}>{title}</span>{' '}
          <span
            className={onPhoto ? undefined : 'gradient-text'}
            style={gradientFontWeight ? { fontWeight: gradientFontWeight } : undefined}
          >
            {gradientPart}
          </span>
        </Heading>
      </div>
      {meta && (
        <p className="max-w-xs font-mono text-xs text-muted-foreground md:text-right">
          {meta}
        </p>
      )}
    </div>
  )
}
