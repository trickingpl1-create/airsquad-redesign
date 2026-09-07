import type { Camp, Location } from '@/lib/types/database'
import { FALLBACK_CITY_PAGES } from '@/lib/content/cities'
import { LETNI_EVENT } from '@/lib/content/letni'

// Fallbacki dla hubów /lokalizacje/ i /obozy/ — te strony czytały wcześniej
// surowe tabele (locations / camps) przez klienta server-side i bez Supabase
// renderowały się puste. W statycznym eksporcie „puste" oznacza pusty HTML
// wgrany na serwer, więc każda z nich dostaje fallback wg wzorca
// z lib/seo/queries.ts (dane z DB zawsze nadpisują fallback).
//
// Treść nie jest przepisywana ręcznie — wyprowadzamy ją z już zatwierdzonych
// fallbacków miast (FALLBACK_CITY_PAGES) i obozu (LETNI_EVENT), żeby nie
// utrzymywać dwóch kopii tych samych danych.
//
// Kadra NIE jest już tutaj: /trenerzy/ i sekcja „Zespół" czytają kanoniczny
// skład z lib/content/team.ts (z rolami, zdjęciami i flagą `featured`),
// a tabela `trainers` nie jest czytana przez stronę publiczną. Dawny
// FALLBACK_TRAINERS wyprowadzany z miast dawał tylko osoby przypisane do sal
// — bez koordynatorki logistyki, bez zdjęć, z rolami skleconymi z przecinków.

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
