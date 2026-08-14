import { NextResponse, type NextRequest } from 'next/server'
import { sendWeeklyEngineeringDigestEmail } from '@/lib/digest/weekly-engineering-digest'
import { logger } from '@/lib/logger'
import { captureException } from '@/lib/sentry'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('x-cron-secret')
  if (authHeader !== process.env.CRON_SECRET) {
    logger.security('cron_weekly_digest', 'Unauthorized weekly digest cron invocation', {
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    logger.info('cron_weekly_digest', 'Executing automated weekly engineering & complaints digest cron')
    const result = await sendWeeklyEngineeringDigestEmail()

    if (!result.success) {
      throw new Error(result.error || 'Failed to dispatch weekly digest email')
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      dispatchedAt: new Date().toISOString(),
    })
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown cron error'
    logger.error('cron_weekly_digest', `Weekly digest cron failed: ${errorMsg}`, {}, error)
    captureException(error, { source: 'cron_weekly_digest' })
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 })
  }
}
