import type { ReactNode } from 'react'
import { BackgroundVideo } from '@/components/background-video'

const YOUTUBE_ID = 'w4_uA0wOyak' // AIRMEETING 2026 (poziomy 16:9)

/**
 * Pas sekcji z filmem w tle — ten sam efekt co hero na stronie głównej
 * (parallax), ale ograniczony do jednego bloku. Wideo jest PRZYPIĘTE (sticky):
 * „stoi" w viewport podczas przewijania sekcji będących w środku, a gdy blok się
 * kończy, sticky puszcza i kolejna (nieprzezroczysta) sekcja je zakrywa.
 * `-mb-[100vh]` zdejmuje wysokość warstwy wideo z układu, więc treść (z-10)
 * nachodzi na film zamiast lądować pod nim. Sticky, a nie fixed — żeby nie
 * kolidować z fixed-wideo hero (dwa fixed inset-0 z-0 nachodziłyby na siebie).
 *
 * Sekcje w środku muszą mieć przezroczyste tło (bez bg-*), inaczej zasłonią film.
 */
export function SectionVideoBand({ children }: { children: ReactNode }) {
  return (
    <div className="relative bg-black">
      <div
        aria-hidden
        className="pointer-events-none sticky top-0 -mb-[100vh] h-screen overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.4]"
          style={{
            width: 'max(100vw, calc(100vh * 16 / 9))',
            height: 'max(100vh, calc(100vw * 9 / 16))',
          }}
        >
          <BackgroundVideo
            youtubeId={YOUTUBE_ID}
            className="absolute inset-0 h-full w-full border-0 opacity-95"
            title="Air Squad — tło sekcji: AIRMEETING 2026"
          />
        </div>
        {/* Przyciemnienie dla czytelności treści nad filmem (jak w hero). */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in oklch, var(--background) 88%, transparent) 0%, color-mix(in oklch, var(--background) 60%, transparent) 45%, color-mix(in oklch, var(--background) 88%, transparent) 100%)',
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
