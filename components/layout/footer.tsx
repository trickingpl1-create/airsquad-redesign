import Link from 'next/link'
import Image from 'next/image'
import { SOCIALS } from '@/lib/content/socials'
import { CookieSettingsButton } from '@/components/cookie-settings-button'

const linkGroups = [
  {
    label: '/treningi',
    links: [
      { href: '/akrobatyka/', label: 'akrobatyka' },
      { href: '/tricking-akademia/', label: 'tricking' },
      { href: '/tumbling/', label: 'tumbling' },
      { href: '/longboardy/', label: 'longboard' },
      { href: '/dyscypliny/', label: 'wszystkie dyscypliny' },
    ],
  },
  {
    label: '/obozy',
    links: [
      { href: '/letni/', label: 'air camp' },
      { href: '/obozy-sportowe/', label: 'obozy sportowe' },
      { href: '/airmeeting/', label: 'airmeeting' },
      { href: '/gravityjam/', label: 'gravity jam' },
    ],
  },
  {
    label: '/klub',
    links: [
      { href: '/zapisy/', label: 'zapisy' },
      { href: '/grafik/', label: 'grafik' },
      { href: '/trenerzy/', label: 'zespół' },
      { href: '/kontakt/', label: 'kontakt' },
      { href: '/polityka-prywatnosci/', label: 'polityka prywatności' },
    ],
  },
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
                src="/images/airsquad-logo.webp"
                alt="Air Squad"
                width={592}
                height={355}
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

        {/* md:pr-48 — miejsce na pływający przycisk „Zapisz się” (fixed, prawy dolny róg);
            bez tego na desktopie zasłaniał ikony social media. */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7 md:pr-48">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
            © {year} Air/Squad · Wszystkie prawa zastrzeżone
            {/* Zmiana/wycofanie zgody na cookies — polityka prywatności odsyła tutaj. */}
            <span aria-hidden> · </span>
            <CookieSettingsButton className="-my-2 inline-block cursor-pointer py-2 uppercase tracking-[0.16em] text-muted-foreground underline underline-offset-2 transition-colors hover:text-cyan" />
          </p>
          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.short}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.short} — ${s.name} Air Squad (nowa karta)`}
                title={s.name}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border font-mono text-[11px] font-bold text-violet-soft transition-colors hover:border-cyan hover:text-cyan"
              >
                <span aria-hidden>{s.short}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
