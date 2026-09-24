import { NextResponse, type NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

/**
 * Validates an incoming cron/webhook request against CRON_SECRET.
 * If CRON_SECRET is not configured, the route refuses to run in production
 * (fail-closed, with a clear log) but is allowed in development so local
 * testing does not silently break.
 */
export async function validateCronRequest(request: NextRequest): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const secret = process.env.CRON_SECRET
  const authHeader = request.headers.get('x-cron-secret')
  const isDev = process.env.NODE_ENV !== 'production'

  if (!secret) {
    logger.error(
      'cron',
      'CRON_SECRET is not configured. Scheduled jobs (weekly digest, queue processing, audit purge) will not run in production.',
      {},
    )
    if (isDev) {
      return { ok: true }
    }
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Cron endpoints are disabled: CRON_SECRET is not configured' },
        { status: 503 },
      ),
    }
  }

  if (authHeader !== secret) {
    logger.security('cron', 'Unauthorized cron invocation', {
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      path: request.nextUrl.pathname,
    })
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  return { ok: true }
}