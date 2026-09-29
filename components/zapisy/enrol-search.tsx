'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { SectionHeader } from '@/components/home/section-header'
import type { Audience, EnrolCityCard } from '@/lib/content/enrol-cities'

// Normalizacja pod wyszukiwarkę: bez ogonków i wielkości liter, ł→l — żeby
// „debica", „Dębica" i „DĘBICA" trafiały tak samo. NFD rozkłada znak na literę
// bazową + znak diakrytyczny, który usuwamy; ł nie rozkłada się przez NFD.
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')

const plural = (n: number) =>
  n === 1 ? 'lokalizacja' : n >= 2 && n <= 4 ? 'lokalizacje' : 'lokalizacji'

// Akcent obwódki karty — cyklicznie z palety marki (jak w makiecie).
const ACCENTS = [
  'var(--primary)',
  'var(--violet-soft)',
  'var(--cyan)',
  'var(--pink)',
  'var(--amber)',
  'var(--emerald)',
] as const

function AudiencePills({ audience }: { audience: readonly Audience[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {audience.map((a) => (
        <span
          key={a}
          className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] ${
            a === 'Dorośli'
              ? 'bg-cyan/15 text-cyan'
              : 'bg-primary/15 text-violet-soft'
          }`}
        >
          {a}
        </span>
      ))}
    </div>
  )
}

export function EnrolSearch({ cities }: { cities: EnrolCityCard[] }) {
  const [q, setQ] = useState('')
  const inputId = useId()
  const nq = norm(q.trim())
  const shown = nq
    ? cities.filter((c) => norm(c.haystack).includes(nq))
    : cities

  return (
    <section id="miasta" className="mt-4">
      {/* Wyszukiwarka miejscowości — „Wpisz miejscowość, a zobaczysz grupy" */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-wrap items-center gap-3"
        role="search"
      >
        <label htmlFor={inputId} className="sr-only">
          Wpisz miejscowość
        </label>
        <div className="flex h-14 flex-1 basis-80 items-center gap-3 rounded-full border border-border bg-card px-5">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[18px] w-[18px] flex-none text-muted-foreground"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id={inputId}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Wpisz miejscowość, np. Dębica"
            autoComplete="off"
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <span
          aria-live="polite"
          className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
        >
          <b className="font-bold text-foreground">{shown.length}</b>{' '}
          {plural(shown.length)} {nq ? `dla „${q.trim()}”` : 'na Podkarpaciu'}
        </span>
      </form>

      <SectionHeader
        kicker="Wszystkie sekcje"
        kickerColorClass="text-cyan"
        title="Nasze"
        gradientPart="lokalizacje."
        titleFontWeight={400}
        gradientFontWeight={400}
        className="mb-6 mt-12 md:mb-8"
      />

      {shown.length > 0 ? (
        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c, i) => (
            <li key={c.slug}>
              <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-border bg-card p-6 transition-colors hover:border-violet-soft/50">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full opacity-[0.16]"
                  style={{
                    background: `radial-gradient(circle, ${ACCENTS[i % ACCENTS.length]} 0%, transparent 68%)`,
                  }}
                />
                <AudiencePills audience={c.audience} />
                <h3
                  className="display-bold text-3xl text-foreground"
                  style={{ fontWeight: 400 }}
                >
                  {c.name}
                </h3>
                <div className="grid gap-1 font-mono text-xs leading-relaxed text-muted-foreground">
                  {c.hallName && (
                    <span className="flex gap-2">
                      <span aria-hidden className="flex-none text-cyan">
                        ↳
                      </span>
                      {c.hallName}
                    </span>
                  )}
                  {c.hallAddress && (
                    <span className="flex gap-2">
                      <span aria-hidden className="flex-none text-cyan">
                        ↳
                      </span>
                      {c.hallAddress}
                    </span>
                  )}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                  <Link
                    href={`/${c.slug}/#zapisy`}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-primary-foreground transition-transform hover:-translate-y-0.5"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--primary), var(--accent))',
                      boxShadow:
                        '0 8px 24px color-mix(in oklch, var(--primary) 30%, transparent)',
                    }}
                  >
                    Zapisz się <span aria-hidden>→</span>
                  </Link>
                  <Link
                    href={`/${c.slug}/`}
                    className="font-mono text-[11px] uppercase tracking-[0.12em] text-cyan transition-transform hover:translate-x-0.5"
                  >
                    Więcej informacji <span aria-hidden>↗</span>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Brak lokalizacji dla „<b className="text-foreground">{q.trim()}</b>”.
          Najbliższą salę podpowie trener.
        </div>
      )}
    </section>
  )
}
