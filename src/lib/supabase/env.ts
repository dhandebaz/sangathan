/**
 * Supabase's current publishable key format with a legacy anon-key fallback.
 * The fallback keeps existing Vercel environments working during key rotation.
 */
export function getSupabasePublicKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export function hasSupabasePublicConfig(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && getSupabasePublicKey())
}
