import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { getSupabasePublicKey } from '@/lib/supabase/env'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabasePublicKey = getSupabasePublicKey()

  if (!supabaseUrl || !supabasePublicKey) {
    throw new Error('Missing Supabase public configuration')
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabasePublicKey,
  )
}
