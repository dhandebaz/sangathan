import { createClient as createSupabaseClient } from '@supabase/supabase-js'
// import { Database } from '@/types/database'

export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase Service Role configuration')
  }

  // Use the service role key to bypass RLS.
  // This client should ONLY be used in:
  // 1. Webhooks (e.g. Stripe, Razorpay)
  // 2. Cron jobs
  // 3. Admin-specific server actions that need to bypass normal RLS rules
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
