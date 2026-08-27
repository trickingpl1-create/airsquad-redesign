'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
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
 * Wszystkie zdjęcia są w DOM od początku (jest ich cztery) — dzięki temu
 * zmiana kadru to sam `opacity`, bez dociągania pliku w trakcie animacji.
 */
export function TeamPhotoBackdrop({ photos }: { photos: TeamPhoto[] }) {
  const [aktywne, setAktywne] = useState(0)
  const [zatrzymane, setZatrzymane] = useState(false)
  const licznik = useRef<ReturnType<typeof setInterval> | null>(null)

  const wyczysc = useCallback(() => {
    if (licznik.current) clearInterval(licznik.current)
    licznik.current = null
  }, [])

  useEffect(() => {
    if (photos.length < 2 || zatrzymane) return
    // Użytkownicy z ograniczoną animacją dostają pierwszy kadr i spokój.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    licznik.current = setInterval(() => {
      setAktywne((i) => (i + 1) % photos.length)
    }, INTERWAL_MS)
    return wyczysc
  }, [photos.length, zatrzymane, wyczysc])

  if (photos.length === 0) return null

  const biezace = photos[aktywne]

  return (
    <>
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {photos.map((photo, i) => (
          <Image
            key={photo.file}
            src={photo.file}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i === aktywne ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

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
          kadru, z dala od nagłówka. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 pb-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 md:text-[11px]">
            {biezace.caption}
          </p>
          {photos.length > 1 && (
            <div
              className="pointer-events-auto flex items-center gap-2"
              onMouseEnter={() => setZatrzymane(true)}
              onMouseLeave={() => setZatrzymane(false)}
            >
              {photos.map((photo, i) => (
                <button
                  key={photo.file}
                  type="button"
                  onClick={() => {
                    wyczysc()
                    setAktywne(i)
                  }}
                  aria-label={`Pokaż zdjęcie: ${photo.caption}`}
                  aria-current={i === aktywne}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === aktywne ? 'w-7 bg-cyan' : 'w-3 bg-white/35 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
