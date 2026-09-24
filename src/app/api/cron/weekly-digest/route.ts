import { NextResponse, type NextRequest } from 'next/server'
import { sendWeeklyEngineeringDigestEmail } from '@/lib/digest/weekly-engineering-digest'
import { logger } from '@/lib/logger'
import { captureException } from '@/lib/sentry'
import { validateCronRequest } from '@/lib/cron-auth'

export async function GET(request: NextRequest) {
  const auth = await validateCronRequest(request)
  if (!auth.ok) return auth.response

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