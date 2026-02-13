import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const start = Date.now()
  const status = {
    database: 'unknown',
    queue: 'unknown',
    latency: 0,
    timestamp: new Date().toISOString()
  }

  try {
    const supabase = createServiceClient()
    
    // 1. Check DB
    const { error: dbError } = await supabase.from('organisations').select('count', { count: 'exact', head: true })
    status.database = dbError ? 'unhealthy' : 'healthy'

    // 2. Check Queue (Pending Jobs)
    const { count: pendingJobs, error: queueError } = await supabase
      .from('system_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lt('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Jobs pending > 5 mins
      
    status.queue = (queueError || (pendingJobs || 0) > 50) ? 'degraded' : 'healthy'

    status.latency = Date.now() - start

    const isHealthy = status.database === 'healthy' && status.queue !== 'degraded'
    
    return NextResponse.json(status, { status: isHealthy ? 200 : 503 })
  } catch (error) {
    return NextResponse.json({ 
      status: 'critical_failure', 
      error: error instanceof Error ? error.message : 'Unknown' 
    }, { status: 500 })
  }
}
