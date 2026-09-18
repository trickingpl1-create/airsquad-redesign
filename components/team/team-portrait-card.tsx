import type { TeamMember } from '@/lib/content/team'

/** Inicjały jako zastępnik portretu — bez zdjęcia karta i tak ma trzymać rytm siatki. */
export function initials(name: string): string {
  return name
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

/**
 * Ścieżka wariantu obrazu o zadanej szerokości. Konwencja z
 * scripts/make-image-variants.mjs: obok `<base>.jpg` leży `<base>-w<szer>.jpg`.
 * Oryginał (768×1365) zostaje jako największy kandydat w srcset.
 */
export function photoVariant(photo: string, width: number): string {
  return photo.replace(/\.jpg$/, `-w${width}.jpg`)
}

type TeamPortraitCardProps = {
  member: TeamMember
  /**
   * Element nagłówka z nazwiskiem. Na /trenerzy/ nazwiska są nagłówkami
   * sekcji (h2), na stronie głównej sekcja ma własny h2 z SectionHeader,
   * a karta jest tylko kafelkiem — stąd 'div', żeby nie mnożyć poziomów.
   */
  headingAs?: 'h2' | 'h3' | 'div'
  /** Atrybut `sizes` dla srcset — domyślnie siatka 2 kolumny → 4 kolumny od lg. */
  sizes?: string
}

/**
 * Duży kafelek portretowy (3:4) dla osób prowadzących klub. Jeden komponent
 * dla strony głównej i /trenerzy/, żeby poprawki (gradient, srcset) nie
 * rozjeżdżały się między dwiema kopiami.
 *
 * Zwykły <img> zamiast next/image: przy `images.unoptimized` (eksport
 * statyczny) next/image i tak nie generuje srcset, a wariant -w480 (28–44 kB)
 * wystarcza na telefonach zamiast pełnego oryginału (~300 kB).
 */
export function TeamPortraitCard({
  member,
  headingAs: Heading = 'div',
  sizes = '(max-width: 1024px) 50vw, 25vw',
}: TeamPortraitCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-card">
      {/* Zdjęcia są pionowe 768×1365, więc kadr 3:4 obcina je od dołu —
          `object-top` trzyma twarz w kadrze niezależnie od wzrostu osoby. */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {member.photo ? (
          <img
            src={member.photo}
            srcSet={`${photoVariant(member.photo, 480)} 480w, ${member.photo} 768w`}
            sizes={sizes}
            width={768}
            height={1365}
            alt={`${member.name} — ${member.role}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span
            aria-hidden
            className="display-bold grid h-full w-full place-items-center text-4xl text-foreground/45"
            style={{ fontWeight: 400 }}
          >
            {initials(member.name)}
          </span>
        )}
        {/* Podpis niesie własne przyciemnienie: gradient jest tłem tego bloku,
            a nie osobną warstwą o stałej wysokości — przy długiej roli na
            wąskim ekranie blok rośnie i ciemne tło rośnie razem z nim.
            Górne 4rem (pt-16) to samo przejście z przezroczystości; treść
            zaczyna się dopiero tam, gdzie tło jest już niemal kryjące. */}
        <div
          className="absolute inset-x-0 bottom-0 p-4 pt-16 md:p-5 md:pt-20"
          style={{
            background:
              'linear-gradient(to top, oklch(0.13 0.02 280 / 0.96) 0%, oklch(0.13 0.02 280 / 0.92) calc(100% - 4rem), oklch(0.13 0.02 280 / 0.5) calc(100% - 2rem), transparent 100%)',
          }}
        >
          <Heading
            className="display-bold text-lg leading-tight text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] md:text-xl"
            style={{ fontWeight: 400 }}
          >
            {member.name}
          </Heading>
          <p className="mt-1.5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.1em] text-white/85 [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">
            {member.role}
          </p>
        </div>
      </div>
    </article>
  )
}
