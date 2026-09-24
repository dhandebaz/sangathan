import { NextResponse, type NextRequest } from 'next/server'
import { processNextJob } from '@/lib/queue'
import { logger } from '@/lib/logger'
import { validateCronRequest } from '@/lib/cron-auth'

export async function GET(request: NextRequest) {
  const auth = await validateCronRequest(request)
  if (!auth.ok) return auth.response

  try {
    // Process one job per call, or loop for a few seconds
    // Serverless functions have timeouts, so we process just one for safety here
    const result = await processNextJob()
    
    if (result) {
      return NextResponse.json({ success: true, processed: true })
    }
    
    return NextResponse.json({ success: true, processed: false, message: 'No pending jobs' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    logger.error('cron', 'Job processing failed', { error: message })
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}