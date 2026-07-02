import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Cookieless, read-only Supabase client dla publicznych danych (strony
 * cache'owalne / ISR — bez `cookies()`, więc nie wymuszają dynamicznego renderu).
 *
 * Zwraca `null`, gdy env nie jest skonfigurowany lub wskazuje placeholder
 * (`placeholder.supabase.co` = domyślny, niewypełniony `.env.local`). Dzięki temu
 * strony renderują się natychmiast na fallbackach zamiast wisieć ~7 s na próbie
 * połączenia z nieistniejącym hostem. Na produkcji URL jest realny, więc klient
 * tworzy się jak dotychczas — zachowanie bez zmian.
 */
export function getPublicSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url.includes('placeholder')) {
    return null
  }

  return createClient(url, key)
}
