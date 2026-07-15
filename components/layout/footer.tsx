import Link from 'next/link'
import Image from 'next/image'

const linkGroups = [
  {
    label: '/treningi',
    links: [
      { href: '/akrobatyka', label: 'akrobatyka' },
      { href: '/dyscypliny', label: 'wszystkie dyscypliny' },
    ],
  },
  {
    label: '/obozy',
    links: [
      { href: '/letni', label: 'obozy' },
      { href: '/airmeeting', label: 'airmeeting' },
      { href: '/gravityjam', label: 'gravity jam' },
    ],
  },
  {
    label: '/klub',
    links: [
      { href: '/grafik', label: 'grafik' },
      { href: '/trenerzy', label: 'zespół' },
      { href: '/kontakt', label: 'kontakt' },
      { href: '/polityka-prywatnosci', label: 'polityka prywatności' },
    ],
  },
] as const

const socials = [
  { label: 'IG', href: 'https://instagram.com/airsquad' },
  { label: 'TT', href: 'https://tiktok.com/@airsquad' },
  { label: 'YT', href: 'https://youtube.com/@airsquad' },
  { label: 'FB', href: 'https://facebook.com/airsquad' },
] as const

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-border bg-muted px-6 pt-16 pb-9 dark:bg-secondary md:px-10">
      <div
        aria-hidden
        className="halftone-overlay absolute inset-0 text-primary opacity-[0.035]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/">
              <Image
                src="/images/airsquad-logo.png"
                alt="Air Squad"
                width={160}
                height={76}
                className="h-[64px] w-auto object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]"
              />
            </Link>
            <address className="mt-4 font-mono text-[11px] not-italic uppercase leading-[1.7] tracking-[0.1em] text-muted-foreground">
              ul. Wojtyły 227b/6
              <br />
              35-304 Rzeszów
              <br />
              <a
                href="mailto:klub.airsquad@gmail.com"
                className="transition-colors hover:text-cyan"
              >
                klub.airsquad@gmail.com
              </a>
              <br />
              <a
                href="tel:+48728559101"
                className="transition-colors hover:text-cyan"
              >
                ☎ 728 559 101
              </a>
            </address>
          </div>

          {/* Link groups */}
          {linkGroups.map((group) => (
            <div key={group.label}>
              <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-cyan">
                {group.label}
              </div>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-mono text-[13px] text-foreground/80 transition-colors hover:text-cyan"
                    >
                      → {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
            © {year} Air/Squad · Wszystkie prawa zastrzeżone
          </p>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border font-mono text-[11px] font-bold text-violet-soft transition-colors hover:border-cyan hover:text-cyan"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
