import Link from 'next/link'
import { TEAM_FEATURED, TEAM_REST } from '@/lib/content/team'
import { TeamPortraitCard } from '@/components/team/team-portrait-card'
import { SectionHeader } from './section-header'

// Sekcja „Zespół" ma dwa poziomy, żeby nie powtórzyć błędu starej strony
// („za dużo osób małą czcionką" — docs/_archive/CONTENT_MIGRATION_STRATEGY.md):
//  1. cztery osoby prowadzące klub — duże zdjęcia portretowe,
//  2. reszta kadry — plakietki z samym imieniem i nazwiskiem.
// Skład i zdjęcia: lib/content/team.ts.
export function TeamSection() {
  if (TEAM_FEATURED.length === 0) return null

  return (
    <section
      id="zespol"
      className="relative overflow-hidden bg-secondary px-6 py-24 md:px-10 md:py-32"
    >
      <div
        aria-hidden
        className="halftone-overlay absolute inset-0 text-cyan opacity-[0.04]"
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          kicker="Trenerzy"
          kickerColorClass="text-cyan"
          title="Zespół, któremu"
          gradientPart="ufają rodzice."
          titleFontWeight={400}
          gradientFontWeight={400}
        />

        {/* Duże portrety — wspólny kafelek z /trenerzy/. Nazwisko jako div:
            nagłówkiem sekcji jest h2 z SectionHeader, kafelki nie budują
            osobnego poziomu konspektu. */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TEAM_FEATURED.map((m) => (
            <TeamPortraitCard key={m.name} member={m} headingAs="div" />
          ))}
        </div>

        {/* Plakietki — wizualnie tylko imię i nazwisko (decyzja użytkownika).
            Rola NIE jest tu wyświetlana; każda plakietka linkuje do /trenerzy/,
            gdzie rola jest widoczna, a `aria-label` dokłada ją do nazwy
            dostępnej linku. Nazwa dostępna zaczyna się od widocznego tekstu,
            więc sterowanie głosem („kliknij Maja Bieniek") nadal działa
            (WCAG 2.5.3). */}
        {TEAM_REST.length > 0 && (
          <div className="mt-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
              Pozostali trenerzy
            </p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {TEAM_REST.map((m) => (
                <li key={m.name}>
                  <Link
                    href="/trenerzy/"
                    aria-label={`${m.name} — ${m.role}`}
                    className="inline-flex min-h-6 items-center rounded-full border border-border bg-card px-4 py-2 font-mono text-[11px] tracking-[0.08em] text-foreground/75 transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    {m.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
