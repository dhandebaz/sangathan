import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const start = Date.now()
  const status = {
    ok: false,
    timestamp: new Date().toISOString(),
  }

  try {
    const supabase = await createClient()

    const { error: dbError } = await supabase.from('organisations').select('count', { count: 'exact', head: true })
    if (dbError) {
      return NextResponse.json({ ...status, error: 'database_unhealthy' }, { status: 503 })
    }

    const latency = Date.now() - start

    return NextResponse.json({ ok: true, latency, timestamp: status.timestamp })
  } catch {
    return NextResponse.json({ ok: false, error: 'internal_error', timestamp: status.timestamp }, { status: 500 })
  }
}
