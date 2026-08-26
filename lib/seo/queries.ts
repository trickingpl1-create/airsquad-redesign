import type { SupabaseClient } from '@supabase/supabase-js'
import { getPublicSupabaseClient } from '@/lib/supabase/public'
import type {
  Camp,
  CityPage,
  Discipline,
  Event,
  Location,
  StaticPage,
  Trainer,
} from '@/lib/types/database'
import type { EnrolmentCity } from '@/components/akrobatyka/city-enrolment'
import {
  FALLBACK_DISCIPLINES,
  FALLBACK_ENROLMENT_CITIES,
} from '@/lib/content/akrobatyka'
import { FALLBACK_EVENTS } from '@/lib/content/letni'
import { FALLBACK_CITY_PAGES } from '@/lib/content/cities'
import { isWithdrawnLocation } from '@/lib/content/withdrawn-locations'
import {
  FALLBACK_CAMPS,
  FALLBACK_LOCATIONS,
  FALLBACK_TRAINERS,
} from '@/lib/content/hubs'

// Cookieless klient z guardem na placeholder (lib/supabase/public.ts):
// bez skonfigurowanego Supabase zwraca null i wszystkie gettery od razu
// serwują fallbacki, zamiast czekać ~7 s na timeout martwego hosta.
function getSupabaseClient(): SupabaseClient | null {
  return getPublicSupabaseClient()
}

// City Pages.
// Fallback w kodzie (FALLBACK_CITY_PAGES) odpala się tylko, gdy baza nic nie
// zwróci — /rzeszow/ itd. działają przed podłączeniem Supabase; po seedzie DB
// ma priorytet (ten sam wzorzec co dyscypliny i eventy).
export async function getCityPage(slug: string): Promise<CityPage | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return FALLBACK_CITY_PAGES[slug] ?? null

  const { data, error } = await supabase
    .from('city_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error) console.error('Error fetching city page:', error)
  return data ?? FALLBACK_CITY_PAGES[slug] ?? null
}

export async function getCityPages(): Promise<CityPage[]> {
  const fallback = Object.values(FALLBACK_CITY_PAGES)
  const supabase = getSupabaseClient()

  // Jedyne wąskie gardło stron miast: karmi sitemapę oraz generateStaticParams
  // w app/[slug] i app/lokalizacje/[slug]. Odcięcie wycofanych lokalizacji tutaj
  // sprawia, że ich strony przestają się budować, znikają z sitemapy i przestają
  // się rozwiązywać — a rekord zostaje w lib/content/cities.ts, więc przywrócenie
  // to usunięcie jednego wpisu z withdrawn-locations.json, bez odtwarzania treści.
  // Historyczny adres obsługuje 301 z .htaccess (scripts/emit-redirects.mjs).
  const withoutWithdrawn = (pages: CityPage[]) =>
    pages.filter((page) => !isWithdrawnLocation(page.slug))

  if (!supabase) return withoutWithdrawn(fallback)

  const { data, error } = await supabase
    .from('city_pages')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching city pages:', error)
  return withoutWithdrawn(data && data.length > 0 ? data : fallback)
}

// Lista miast do sekcji zapisów (chipy + per-city form-id AIPAX). Etykietę chipa
// wyznaczamy z h1_title, ucinając prefiks nazwy dyscypliny ("Akrobatyka Rzeszów" → "Rzeszów").
export async function getEnrolmentCities(
  disciplineName: string
): Promise<EnrolmentCity[]> {
  const pages = await getCityPages()
  // Brak danych z bazy (Supabase placeholder) → fallback 7 miast z kodu.
  // Wycofane lokalizacje odpadają w obu ścieżkach — i z bazy, i z fallbacku.
  if (pages.length === 0)
    return FALLBACK_ENROLMENT_CITIES.filter((c) => !isWithdrawnLocation(c.slug))
  const prefix = `${disciplineName} `.toLowerCase()
  return pages
    .filter((c) => !isWithdrawnLocation(c.slug))
    .map((c) => ({
      slug: c.slug,
      name: c.h1_title.toLowerCase().startsWith(prefix)
        ? c.h1_title.slice(prefix.length)
        : c.h1_title,
      aipaxFormId: c.aipax_form_id ?? null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'pl'))
}

// Events.
// Fallback w kodzie (FALLBACK_EVENTS) odpala się tylko, gdy baza nic nie zwróci
// — /letni/ (Air Camp) działa przed podłączeniem Supabase; po seedzie DB ma priorytet.
export async function getEvent(slug: string): Promise<Event | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return FALLBACK_EVENTS[slug] ?? null

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error) console.error('Error fetching event:', error)
  return data ?? FALLBACK_EVENTS[slug] ?? null
}

export async function getEventsByType(
  eventType: 'airmeeting' | 'spotkanie' | 'gravityjam'
): Promise<Event[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_type', eventType)
    .eq('is_published', true)
    .eq('is_active', true)
    .order('event_date', { ascending: true })

  if (error) console.error('Error fetching events:', error)
  return data || []
}

export async function getEvents(): Promise<Event[]> {
  const fallback = Object.values(FALLBACK_EVENTS)
  const supabase = getSupabaseClient()
  if (!supabase) return fallback

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .eq('is_active', true)
    .order('event_date', { ascending: true })

  if (error) console.error('Error fetching events:', error)
  return data && data.length > 0 ? data : fallback
}

// Disciplines.
// Fallback w kodzie (FALLBACK_DISCIPLINES) odpala się tylko, gdy baza nic nie zwróci
// — dzięki temu /akrobatyka/ działa przed podłączeniem Supabase, a po seedzie DB ma priorytet.
export async function getDiscipline(slug: string): Promise<Discipline | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return FALLBACK_DISCIPLINES[slug] ?? null

  const { data, error } = await supabase
    .from('disciplines')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error) console.error('Error fetching discipline:', error)
  return data ?? FALLBACK_DISCIPLINES[slug] ?? null
}

export async function getDisciplines(): Promise<Discipline[]> {
  const fallback = Object.values(FALLBACK_DISCIPLINES)
  const supabase = getSupabaseClient()
  if (!supabase) return fallback

  const { data, error } = await supabase
    .from('disciplines')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  if (error) console.error('Error fetching disciplines:', error)
  return data && data.length > 0 ? data : fallback
}

// Kaskada root-level slugów (docs/04-architektura.md): historyczne URL-e
// WordPressa (/rzeszow/, /akrobatyka/, /airmeeting/...) muszą działać bez prefiksów.
export type RootSlugResult =
  | { type: 'city'; data: CityPage }
  | { type: 'discipline'; data: Discipline }
  | { type: 'event'; data: Event }
  | { type: 'static'; data: StaticPage }
  | null

export async function resolveRootSlug(slug: string): Promise<RootSlugResult> {
  const [city, discipline, event, staticPage] = await Promise.all([
    getCityPage(slug),
    getDiscipline(slug),
    getEvent(slug),
    getStaticPage(slug),
  ])

  if (city) return { type: 'city', data: city }
  if (discipline) return { type: 'discipline', data: discipline }
  if (event) return { type: 'event', data: event }
  if (staticPage) return { type: 'static', data: staticPage }
  return null
}

// Huby /lokalizacje/, /trenerzy/ i /obozy/.
// Wcześniej te strony czytały tabele bezpośrednio przez cookie'owego klienta
// (lib/supabase/server.ts), co blokowało eksport statyczny. Teraz idą przez
// cookieless getPublicSupabaseClient() i zapiekają się w czasie builda;
// fallbacki z lib/content/hubs.ts trzymają je niepuste bez skonfigurowanej bazy.
export async function getLocations(): Promise<Location[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return FALLBACK_LOCATIONS

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  if (error) console.error('Error fetching locations:', error)
  return data && data.length > 0 ? data : FALLBACK_LOCATIONS
}

export async function getTrainers(): Promise<Trainer[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return FALLBACK_TRAINERS

  const { data, error } = await supabase
    .from('trainers')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  if (error) console.error('Error fetching trainers:', error)
  return data && data.length > 0 ? data : FALLBACK_TRAINERS
}

export async function getCamps(): Promise<Camp[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return FALLBACK_CAMPS

  const { data, error } = await supabase
    .from('camps')
    .select('*')
    .eq('is_active', true)
    .order('start_date')

  if (error) console.error('Error fetching camps:', error)
  return data && data.length > 0 ? data : FALLBACK_CAMPS
}

/**
 * Slugi obozów, dla których faktycznie istnieje landing.
 *
 * Trasa `/obozy/{slug}` nigdy nie istniała (nie ma `app/obozy/[slug]`), a landing
 * obozu żyje pod historycznym URL-em root-level — `/letni/` dla Air Campu
 * (docs/03-mapa-url.md) — obsługiwanym przez kaskadę w `app/[slug]`. Kaskada
 * rozwiązuje jednak tabelę `events`, nie `camps`, więc obóz bez odpowiadającego
 * wydarzenia nie ma dokąd linkować: w eksporcie statycznym taki URL to twardy 404,
 * bo strona nie zostanie w ogóle wygenerowana. Widoki pytają o ten zbiór i dla
 * obozów spoza niego po prostu nie renderują przycisku.
 */
export async function getCampLandingSlugs(): Promise<string[]> {
  const events = await getEvents()
  return events.map((event) => event.slug)
}

// Static Pages
export async function getStaticPage(slug: string): Promise<StaticPage | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('static_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error) console.error('Error fetching static page:', error)
  return data
}

export async function getStaticPages(
  pageType?: string
): Promise<StaticPage[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  let query = supabase
    .from('static_pages')
    .select('*')
    .eq('is_published', true)

  if (pageType) {
    query = query.eq('page_type', pageType)
  }

  const { data, error } = await query.order('created_at', {
    ascending: false,
  })

  if (error) console.error('Error fetching static pages:', error)
  return data || []
}
