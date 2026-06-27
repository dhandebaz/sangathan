import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redis } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET() {
  const start = Date.now()
  const status: Record<string, unknown> = {
    ok: false,
    timestamp: new Date().toISOString(),
  }

  try {
    const supabase = await createClient()

    const { error: dbError } = await supabase.from('organisations').select('count', { count: 'exact', head: true })
    if (dbError) {
      return NextResponse.json({ ...status, error: 'database_unhealthy' }, { status: 503 })
    }
    status.database = 'healthy'

    try {
      await redis.ping()
      status.redis = 'healthy'
    } catch {
      status.redis = 'unavailable'
    }

    const { data: storageOk } = await supabase.storage.listBuckets()
    status.storage = Array.isArray(storageOk) ? 'healthy' : 'unavailable'

    const latency = Date.now() - start

    return NextResponse.json({
      ok: true,
      latency,
      timestamp: status.timestamp,
      service: 'sangathan',
      version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'dev',
      checks: {
        database: status.database,
        redis: status.redis,
        storage: status.storage,
      },
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'internal_error', timestamp: status.timestamp }, { status: 500 })
  }
}
