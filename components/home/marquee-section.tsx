const items = [
  'AKROBATYKA',
  'TRICKING',
  'LONGBOARD',
  'TUMBLING',
  'SHOWDANCE',
  'SNOWBOARD',
  'AIRCAMP',
  'AIRMEETING',
  'GRAVITY JAM',
]

// Triplicate to make the loop seamless (animation translates by -1/3)
const tripled = [...items, ...items, ...items]

const colorRotation = ['text-cyan', 'text-violet-soft', 'text-foreground']

export function MarqueeSection() {
  return (
    <div
      className="relative overflow-hidden whitespace-nowrap border-y border-border bg-muted py-5"
      aria-label="Lista dyscyplin i wydarzeń"
    >
      <div
        aria-hidden
        className="halftone-overlay absolute inset-0 text-primary opacity-[0.03]"
      />
      <div className="display-italic animate-marquee relative inline-block text-2xl md:text-3xl">
        {tripled.map((item, i) => (
          <span key={`${item}-${i}`} className={`mr-12 ${colorRotation[i % 3]}`}>
            <span className="mr-3 opacity-60">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
