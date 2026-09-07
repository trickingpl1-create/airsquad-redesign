'use client'

import { useEffect, useRef, useState } from 'react'
import type { TeamPhoto } from '@/lib/content/team-photos'

const INTERWAL_MS = 6000

/**
 * Tło hero na /trenerzy/ — zdjęcia grupowe kadry przechodzące jedno w drugie
 * pod nagłówkiem „Trenerzy, którym ufają rodzice".
 *
 * Dlaczego przenikanie, a nie slider przesuwany w bok: nagłówek stoi NAD
 * zdjęciem, więc każdy ruch w poziomie zabierałby uwagę tekstowi. Przenikanie
 * zmienia obraz, zostawiając kompozycję w miejscu.
 *
 * Ładowanie zdjęć — dwa cele naraz:
 * 1. W HTML-u z builda jest DOKŁADNIE JEDEN <img> (pierwszy kadr, fetchpriority
 *    high). Wcześniej wszystkie cztery siedziały w DOM od SSR jako
 *    `absolute inset-0`, czyli „w viewporcie" — `loading="lazy"` nic nie
 *    odraczało i wejście na stronę ściągało 2,3 MB.
 * 2. Zmiana kadru ma być samym `opacity`, bez dociągania pliku w trakcie
 *    animacji. Dlatego kadr NASTĘPNY w kolejce montuje się z wyprzedzeniem
 *    (opacity-0) już w przeglądarce, a kolejny — gdy sam staje się następnym.
 *    Raz zamontowany kadr zostaje w DOM: to najwyżej cztery elementy, plik
 *    i tak jest już w cache, a odmontowywanie wprowadzałoby wyścig z trwającą
 *    1000 ms animacją (poprzedni i bieżący kadr muszą być zamontowane przez
 *    cały czas przenikania).
 *
 * Stan `zamontowane` startuje od [0] po obu stronach (SSR i klient), więc
 * pierwszy <img> z HTML-a jest po hydratacji tym samym elementem — bez
 * ponownego pobrania i bez skoku.
 *
 * srcset ręcznie, zwykłym <img>: strona ma `images.unoptimized: true`
 * (wymuszone przez `output: 'export'`), więc next/image nie zrobiłby żadnych
 * wariantów, a `sizes` byłoby martwe. Warianty robi scripts/make-image-variants.mjs.
 */
export function TeamPhotoBackdrop({ photos }: { photos: TeamPhoto[] }) {
  const n = photos.length

  /** Kadr, który MA być widoczny (kropka / automat). */
  const [cel, setCel] = useState(0)
  /**
   * Kadr faktycznie pokazany. Różni się od `cel` tylko przez chwilę, gdy plik
   * celu jeszcze się ładuje — przenikanie rusza dopiero po `onLoad`, żeby
   * użytkownik nie oglądał zdjęcia wjeżdżającego pasami na poprzednie.
   */
  const [aktywne, setAktywne] = useState(0)
  /** Indeksy kadrów obecnych w DOM; rośnie, nigdy nie maleje (patrz nagłówek). */
  const [zamontowane, setZamontowane] = useState<number[]>([0])
  const [zatrzymane, setZatrzymane] = useState(false)
  /** Zwiększany po ręcznym wyborze kropki — restartuje odliczanie automatu od zera. */
  const [restart, setRestart] = useState(0)
  /** Kadry, których plik już się załadował. Ref, bo nie ma z tego nic do wyrenderowania. */
  const zaladowane = useRef(new Set([0]))

  // Automat. `restart` w zależnościach: kliknięcie kropki wcześniej wołało
  // clearInterval bez ponownego uruchomienia, więc jedno kliknięcie zabijało
  // rotację do końca życia strony.
  useEffect(() => {
    if (n < 2 || zatrzymane) return
    // Użytkownicy z ograniczoną animacją dostają pierwszy kadr i spokój.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => setCel((i) => (i + 1) % n), INTERWAL_MS)
    return () => clearInterval(id)
  }, [n, zatrzymane, restart])

  // Gdy zmienia się cel: dopilnuj, że cel i kadr PO nim są w DOM (ten drugi
  // ładuje się w tle na następne przejście), a jeśli plik celu jest już
  // gotowy — pokaż od razu. W przeciwnym razie zrobi to `onLoad` obrazka.
  useEffect(() => {
    const nastepny = (cel + 1) % n
    setZamontowane((prev) => {
      const nowe = [cel, nastepny].filter((i) => !prev.includes(i))
      return nowe.length ? [...prev, ...nowe] : prev
    })
    if (zaladowane.current.has(cel)) setAktywne(cel)
  }, [cel, n])

  if (n === 0) return null

  return (
    <>
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {zamontowane.map((i) => {
          const photo = photos[i]
          return (
            <img
              key={photo.src900}
              src={photo.src900}
              srcSet={`${photo.src900} 900w, ${photo.src1600} 1600w`}
              sizes="100vw"
              alt=""
              // Pierwszy kadr jest LCP hero — ma wyprzedzić fonty i resztę.
              fetchPriority={i === 0 ? 'high' : undefined}
              decoding="async"
              onLoad={() => {
                zaladowane.current.add(i)
                if (i === cel) setAktywne(i)
              }}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
                i === aktywne ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )
        })}

        {/* Dwie warstwy przyciemnienia zamiast jednej: pionowa domyka dół kadru
            pod podpisem, pozioma ratuje czytelność nagłówka na jasnych
            zdjęciach (piasek, hala) bez gaszenia całego zdjęcia. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, oklch(0.13 0.02 280 / 0.96) 0%, oklch(0.13 0.02 280 / 0.72) 38%, oklch(0.13 0.02 280 / 0.30) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, oklch(0.13 0.02 280 / 0.88) 0%, oklch(0.13 0.02 280 / 0.45) 55%, transparent 100%)',
          }}
        />
        <div className="halftone-overlay absolute inset-0 text-cyan opacity-[0.05]" />
      </div>

      {/* Podpis i kropki — jedyny element interaktywny, więc trzyma się dołu
          kadru, z dala od nagłówka.
          `z-10` jest konieczne: pasek stoi w DOM PRZED kontenerem treści hero
          (app/trenerzy/page.tsx), który też jest `relative` — bez z-index
          treść maluje się nad paskiem i na wąskich ekranach (gdzie jej pb-20
          nachodzi na kropki) przejmuje kliknięcia. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 pb-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 md:text-[11px]">
            {photos[aktywne].caption}
          </p>
          {n > 1 && (
            <div
              className="pointer-events-auto flex items-center"
              onMouseEnter={() => setZatrzymane(true)}
              onMouseLeave={() => setZatrzymane(false)}
            >
              {photos.map((photo, i) => (
                // Sama kreska ma 12×6 px; obszar klikalny robi min. 24×24 px
                // (WCAG 2.2 AA 2.5.8), wygląd kreski bez zmian.
                <button
                  key={photo.src900}
                  type="button"
                  onClick={() => {
                    setRestart((r) => r + 1)
                    setCel(i)
                  }}
                  aria-label={`Pokaż zdjęcie: ${photo.caption}`}
                  aria-current={i === cel}
                  className="group flex min-h-6 min-w-6 items-center justify-center px-0.5"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === cel ? 'w-7 bg-cyan' : 'w-3 bg-white/35 group-hover:bg-white/60'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
