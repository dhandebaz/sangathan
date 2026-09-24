import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { validateCronRequest } from '@/lib/cron-auth'

export async function GET(request: NextRequest) {
  const auth = await validateCronRequest(request)
  if (!auth.ok) return auth.response

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase.rpc('purge_old_audit_logs', { retention_days: 90 })

    if (error) throw error

    logger.info('cron', `Purged ${data} audit log records older than 90 days`)
    return NextResponse.json({ success: true, purged: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    logger.error('cron', 'Audit log purge failed', { error: message })
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}