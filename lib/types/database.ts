// Database types for AirSquad

export interface Location {
  id: string
  name: string
  address: string | null
  city: string
  maps_url: string | null
  image_url: string | null
  description: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
  // SEO fields
  slug?: string | null
  meta_title?: string | null
  meta_description?: string | null
  h1_title?: string | null
  seo_content?: string | null
  faq?: Record<string, unknown>[]
}

export interface Trainer {
  id: string
  name: string
  role: string | null
  bio: string | null
  photo_url: string | null
  instagram_url: string | null
  specializations: string[]
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface TrainingType {
  id: string
  name: string
  slug: string
  description: string | null
  min_age: number | null
  max_age: number | null
  icon: string | null
  color: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface TrainingSession {
  id: string
  training_type_id: string | null
  location_id: string | null
  trainer_id: string | null
  day_of_week: number
  start_time: string
  end_time: string
  age_group: string | null
  spots_total: number | null
  spots_taken: number
  price_monthly: number | null
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
  // Joined relations
  training_type?: TrainingType
  location?: Location
  trainer?: Trainer
}

export interface Camp {
  id: string
  name: string
  slug: string
  type: 'letni' | 'zimowy' | 'weekendowy' | 'inny'
  start_date: string
  end_date: string
  location: string | null
  description: string | null
  price: number | null
  spots_total: number | null
  spots_taken: number
  image_url: string | null
  gallery: string[]
  is_featured: boolean
  registration_open: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  // SEO fields
  meta_title?: string | null
  meta_description?: string | null
  h1_title?: string | null
  program?: Record<string, unknown>[]
  pricing?: Record<string, unknown>[]
  includes?: string | null
  faq?: Record<string, unknown>[]
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category: 'odziez' | 'akcesoria' | 'inne'
  sizes: string[]
  colors: string[]
  image_url: string | null
  gallery: string[]
  stock_status: 'available' | 'low' | 'out_of_stock'
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  size: string | null
  color: string | null
  price: number
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  items: OrderItem[]
  total_amount: number
  preferred_location_id: string | null
  notes: string | null
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  // Joined relations
  preferred_location?: Location
}

export interface ContentBlock {
  id: string
  page: string
  section: string
  content: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InstagramPost {
  id: string
  post_url: string
  image_url: string
  caption: string | null
  is_active: boolean
  display_order: number
  created_at: string
}

// SEO-related types for cities, events, disciplines, and static pages

export interface CityPage {
  id: string
  location_id: string
  slug: string
  meta_title: string
  meta_description: string | null
  h1_title: string
  hero_content: string | null
  main_content: string | null
  schedule_content: string | null
  groups_info: Record<string, unknown>[]
  faq: Record<string, unknown>[]
  // ID formularza AIPAX dla tego miasta (kalendarz zapisów filtrowany do jego grup)
  aipax_form_id?: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  slug: string
  title: string
  meta_title: string | null
  meta_description: string | null
  event_type: 'airmeeting' | 'spotkanie' | 'gravityjam' | 'oboz'
  event_date: string | null
  event_time: string | null
  location: string | null
  description: string | null
  program: Record<string, unknown>[]
  pricing: Record<string, unknown>[]
  includes: string | null
  image_url: string | null
  form_url: string | null
  // Bogaty landing (obozy) — renderowane warunkowo przez EventView
  tagline?: string | null
  stats?: { value: string; label: string }[]
  attractions?: { icon?: string; title: string; desc: string }[]
  gallery?: { url: string; caption?: string }[]
  is_active: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Discipline {
  id: string
  slug: string
  name: string
  meta_title: string | null
  meta_description: string | null
  h1_title: string | null
  hero_tagline?: string | null
  hero_image_url: string | null
  hero_video_url: string | null
  short_description: string | null
  full_description: string | null
  age_requirement: string | null
  benefits: Record<string, unknown>[]
  // Bogata treść landingu — renderowana warunkowo (puste = sekcja pominięta)
  stats?: { value: string; label: string }[]
  levels?: { num: string; title: string; desc: string; tag?: string }[]
  session_flow?: { title: string; desc: string }[]
  age_groups?: { age: string; name: string; desc: string }[]
  gallery?: { url: string; caption?: string }[]
  faq: Record<string, unknown>[]
  is_published: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface StaticPage {
  id: string
  slug: string
  meta_title: string
  meta_description: string | null
  h1_title: string | null
  content: string | null
  page_type: 'zapisy' | 'aktualnosci' | 'airspace' | 'akrobatyka' | 'legal' | 'archiwum'
  is_published: boolean
  created_at: string
  updated_at: string
}

// Input types for forms
export type CityPageInput = Omit<CityPage, 'id' | 'created_at' | 'updated_at'>
export type EventInput = Omit<Event, 'id' | 'created_at' | 'updated_at'>
export type DisciplineInput = Omit<Discipline, 'id' | 'created_at' | 'updated_at'>
export type StaticPageInput = Omit<StaticPage, 'id' | 'created_at' | 'updated_at'>

// Helper types for forms
export type LocationInput = Omit<Location, 'id' | 'created_at' | 'updated_at'>
export type TrainerInput = Omit<Trainer, 'id' | 'created_at' | 'updated_at'>
export type TrainingTypeInput = Omit<TrainingType, 'id' | 'created_at' | 'updated_at'>
export type TrainingSessionInput = Omit<TrainingSession, 'id' | 'created_at' | 'updated_at' | 'training_type' | 'location' | 'trainer'>
export type CampInput = Omit<Camp, 'id' | 'created_at' | 'updated_at'>
export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>
export type OrderInput = Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at' | 'preferred_location'>
export type ContentBlockInput = Omit<ContentBlock, 'id' | 'created_at' | 'updated_at'>
export type InstagramPostInput = Omit<InstagramPost, 'id' | 'created_at'>

// Day names in Polish
export const DAY_NAMES = [
  'Niedziela',
  'Poniedzialek',
  'Wtorek',
  'Sroda',
  'Czwartek',
  'Piatek',
  'Sobota',
] as const

export const CAMP_TYPES = {
  letni: 'Letni',
  zimowy: 'Zimowy',
  weekendowy: 'Weekendowy',
  inny: 'Inny',
} as const

export const PRODUCT_CATEGORIES = {
  odziez: 'Odziez',
  akcesoria: 'Akcesoria',
  inne: 'Inne',
} as const

export const ORDER_STATUSES = {
  pending: 'Oczekuje',
  confirmed: 'Potwierdzone',
  ready: 'Gotowe do odbioru',
  completed: 'Zrealizowane',
  cancelled: 'Anulowane',
} as const

export const STOCK_STATUSES = {
  available: 'Dostepny',
  low: 'Ostatnie sztuki',
  out_of_stock: 'Niedostepny',
} as const
