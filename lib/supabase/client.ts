import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Klient Supabase dla przeglądarki — do danych, które mają być świeże bez
 * przebudowy strony (`/sklep`, `/media`). W eksporcie statycznym to jedyna
 * ścieżka na aktualne dane, bo HTML jest zapieczony w czasie builda.
 *
 * Zwraca `null`, gdy env nie jest skonfigurowany lub wskazuje placeholder —
 * ten sam guard co w lib/supabase/public.ts. Bez niego fetch leci na martwy
 * host `placeholder.supabase.co`, dostaje ERR_NAME_NOT_RESOLVED, a komponenty
 * zostają na „Ładowanie…" w nieskończoność. Wołający MUSI obsłużyć `null`
 * i pokazać stan pusty.
 */
export function getBrowserSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url.includes('placeholder')) {
    return null
  }

  return createBrowserClient(url, key)
}
