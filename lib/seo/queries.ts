import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { CityPage, Event, Discipline, StaticPage } from '@/lib/types/database'
import type { EnrolmentCity } from '@/components/akrobatyka/city-enrolment'
import {
  FALLBACK_DISCIPLINES,
  FALLBACK_ENROLMENT_CITIES,
} from '@/lib/content/akrobatyka'
import { FALLBACK_EVENTS } from '@/lib/content/letni'

function getSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// City Pages
export async function getCityPage(slug: string): Promise<CityPage | null> {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('city_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error) console.error('Error fetching city page:', error)
  return data
}

export async function getCityPages(): Promise<CityPage[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('city_pages')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching city pages:', error)
  return data || []
}

// Lista miast do sekcji zapisów (chipy + per-city form-id AIPAX). Etykietę chipa
// wyznaczamy z h1_title, ucinając prefiks nazwy dyscypliny ("Akrobatyka Rzeszów" → "Rzeszów").
export async function getEnrolmentCities(
  disciplineName: string
): Promise<EnrolmentCity[]> {
  const pages = await getCityPages()
  // Brak danych z bazy (Supabase placeholder) → fallback 7 miast z kodu.
  if (pages.length === 0) return FALLBACK_ENROLMENT_CITIES
  const prefix = `${disciplineName} `.toLowerCase()
  return pages
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
