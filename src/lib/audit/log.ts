import { createServiceClient } from '@/lib/supabase/service'
import type { Json } from '@/types/database'

interface LogActionParams {
  organisation_id: string
  user_id?: string
  action: string
  resource_table: string
  resource_id: string
  details?: Json
}

export async function logAction(params: LogActionParams) {
  try {
    // Use service client to bypass RLS - audit_logs has no INSERT policy for RLS client
    // Fallback to regular client if service key missing (e.g. local dev without env)
    let supabase: ReturnType<typeof createServiceClient>
    try {
      supabase = createServiceClient()
    } catch {
      // Fallback: try to use server client if service not configured
      const { createClient } = await import('@/lib/supabase/server')
      supabase = createClient() as unknown as ReturnType<typeof createServiceClient>
    }
    
    // We fire this asynchronously but we need a valid client.
    // Since this runs in Server Actions, we can await it.
    // To avoid blocking, we could use `waitUntil` if available, but for safety/consistency we'll await.
    // The "Never block" requirement means we wrap in try/catch and swallow errors.

    const { error } = await supabase.from('audit_logs').insert({
      organisation_id: params.organisation_id,
      actor_id: params.user_id, // Can be null if system action
      action: params.action,
      resource_table: params.resource_table,
      resource_id: params.resource_id,
      details: params.details ?? null
    })

    if (error) {
      console.error('Audit Log Failed:', error)
    }
  } catch (err) {
    console.error('Audit Log Exception:', err)
  }
}
