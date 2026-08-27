import Image from 'next/image'
import { TEAM_FEATURED, TEAM_REST } from '@/lib/content/team'
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

        {/* Duże portrety. Zdjęcia są pionowe 768×1365, więc kadr 3:4 obcina je
            od dołu — `object-top` trzyma twarz w kadrze niezależnie od wzrostu
            osoby na zdjęciu. */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TEAM_FEATURED.map((m) => (
            <article
              key={m.name}
              className="group overflow-hidden rounded-3xl border border-border bg-card"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                {m.photo && (
                  <Image
                    src={m.photo}
                    alt={`${m.name} — ${m.role}`}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                )}
                {/* Gradient pod podpisem — bez niego jasne tło zdjęcia zjada tekst */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/2"
                  style={{
                    background:
                      'linear-gradient(to top, oklch(0.13 0.02 280 / 0.92), transparent)',
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <div
                    className="display-bold text-lg leading-tight text-white md:text-xl"
                    style={{ fontWeight: 400 }}
                  >
                    {m.name}
                  </div>
                  <div className="mt-1.5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-white/70">
                    {m.role}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Plakietki — sama tożsamość, bez roli i bez zdjęcia. Rola żyje
            w atrybucie title, więc nie ginie dla czytników ekranu. */}
        {TEAM_REST.length > 0 && (
          <div className="mt-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-violet-soft">
              Pozostali trenerzy
            </p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {TEAM_REST.map((m) => (
                <li key={m.name}>
                  <span
                    title={m.role}
                    className="inline-block rounded-full border border-border bg-card px-4 py-2 font-mono text-[11px] tracking-[0.08em] text-foreground/75"
                  >
                    {m.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
