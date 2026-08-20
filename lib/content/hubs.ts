import type { Camp, Location, Trainer } from '@/lib/types/database'
import { FALLBACK_CITY_PAGES } from '@/lib/content/cities'
import { LETNI_EVENT } from '@/lib/content/letni'

// Fallbacki dla hubów /lokalizacje/, /trenerzy/ i /obozy/ — te trzy strony
// czytały wcześniej surowe tabele (locations / trainers / camps) przez klienta
// server-side i bez Supabase renderowały się puste. W statycznym eksporcie
// „puste" oznacza pusty HTML wgrany na serwer, więc każda z nich dostaje
// fallback wg wzorca z lib/seo/queries.ts (dane z DB zawsze nadpisują fallback).
//
// Treść nie jest przepisywana ręcznie — wyprowadzamy ją z już zatwierdzonych
// fallbacków miast (FALLBACK_CITY_PAGES) i obozu (LETNI_EVENT), żeby nie
// utrzymywać dwóch kopii tych samych danych.

function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

/** Lokalizacje = sale treningowe z fallbacków miast (pole `hall`). */
export const FALLBACK_LOCATIONS: Location[] = Object.values(FALLBACK_CITY_PAGES)
  .filter((page) => page.hall)
  .map((page, index) => {
    const hall = page.hall!
    return {
      id: `fallback-location-${page.slug}`,
      name: hall.name,
      address: hall.address,
      city: hall.city,
      maps_url: mapsUrl(hall.mapQuery),
      image_url: hall.image_url ?? page.hero_image_url ?? null,
      description: hall.note ?? null,
      is_active: true,
      display_order: index,
      created_at: '',
      updated_at: '',
      slug: page.slug,
    }
  })

// Zbiorczy wpis kadry Brzostku — to nie jest osoba, tylko zastępnik na liście
// trenerów miasta, więc na /trenerzy/ (galeria ludzi) go nie pokazujemy.
const COLLECTIVE_TRAINER_ENTRY = 'Zespół trenerski Air Squad'

/**
 * Trenerzy = unikalne osoby wymienione na podstronach miast. Rola pochodzi
 * z pierwszego miasta, w którym dana osoba występuje; specjalizacje zbieramy
 * ze wszystkich miast (np. „akrobatyka, tricking" + „instruktor akrobatyki").
 */
export const FALLBACK_TRAINERS: Trainer[] = (() => {
  const byName = new Map<string, Trainer>()

  for (const page of Object.values(FALLBACK_CITY_PAGES)) {
    for (const person of page.trainers ?? []) {
      if (person.name === COLLECTIVE_TRAINER_ENTRY) continue

      const existing = byName.get(person.name)
      const roles = person.role?.split(',').map((r) => r.trim()) ?? []

      if (existing) {
        for (const role of roles) {
          if (!existing.specializations.includes(role)) {
            existing.specializations.push(role)
          }
        }
        continue
      }

      byName.set(person.name, {
        id: `fallback-trainer-${byName.size}`,
        name: person.name,
        role: person.role ?? null,
        bio: null,
        photo_url: null,
        instagram_url: null,
        specializations: roles,
        is_active: true,
        display_order: byName.size,
        created_at: '',
        updated_at: '',
      })
    }
  }

  return Array.from(byName.values())
})()

/**
 * Obozy = Air Camp z fallbacku /letni/ przemapowany na wiersz tabeli `camps`.
 * `description` musi być czystym tekstem (widok renderuje ją bez dangerouslySetInnerHTML),
 * dlatego nie bierzemy HTML-owego opisu z LETNI_EVENT.
 */
export const FALLBACK_CAMPS: Camp[] = [
  {
    id: 'fallback-camp-letni',
    name: LETNI_EVENT.title,
    slug: LETNI_EVENT.slug,
    type: 'letni',
    start_date: '2026-07-25',
    end_date: '2026-08-02',
    location: LETNI_EVENT.location,
    description:
      'Obóz sportowo-rekreacyjny Air Squad: akrobatyka, tricking, kajaki, SUP, longboardy i paintball. Kadra trenerska z klubu, małe grupy, opieka 24 h.',
    price: 2600,
    spots_total: null,
    spots_taken: 0,
    image_url: LETNI_EVENT.image_url,
    gallery: [],
    is_featured: true,
    registration_open: true,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
]
