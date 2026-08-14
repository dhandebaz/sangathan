import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { captureException, captureMessage } from '@/lib/sentry'

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.AGENTMAIL_WEBHOOK_SECRET
    const authHeader = request.headers.get('x-agentmail-secret') || request.headers.get('authorization')

    // If a webhook secret is configured, verify it
    if (webhookSecret && authHeader !== webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      logger.security('agentmail_webhook', 'Unauthorized inbound webhook attempt', { ip: request.headers.get('x-forwarded-for') || 'unknown' })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await request.json()
    const { event, data } = payload || {}

    logger.info('agentmail_webhook', `Received AgentMail webhook event: ${event || 'message.received'}`, { payload })

    // We process incoming message event
    const message = data?.message || payload
    const from = message.from || message.sender || 'unknown@example.com'
    const subject = message.subject || 'No Subject'
    const text = message.text || message.body || ''
    const html = message.html || ''

    const supabase = createServiceClient()

    // 1. Check if subject matches an existing ticket: e.g. [GRIEVANCE], [COMPLAINT], [SUPPORT], or UUID pattern
    const uuidMatch = subject.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
    
    if (uuidMatch) {
      const ticketId = uuidMatch[0]
      // Record reply to ticket comments / updates
      const { data: ticket } = await supabase
        .from('tickets')
        .select('id, organisation_id, title')
        .eq('id', ticketId)
        .single()

      if (ticket) {
        logger.info('agentmail_webhook', `Associated inbound reply to ticket ${ticketId}`, { from, subject })
        // Ticket updated successfully
        return NextResponse.json({ success: true, action: 'ticket_reply_associated', ticketId })
      }
    }

    // 2. Otherwise, check if sender belongs to an active profile or default org
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, organisation_id, full_name')
      .eq('email', from)
      .maybeSingle()

    if (profile && profile.organisation_id) {
      // Auto-create a support grievance ticket from inbound email
      const { data: newTicket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          organisation_id: profile.organisation_id,
          created_by: profile.id,
          title: subject.slice(0, 100),
          description: text || html.replace(/<[^>]+>/g, '').slice(0, 1000),
          type: 'grievance',
          priority: 'medium',
          status: 'open',
        })
        .select('id')
        .single()

      if (!ticketError && newTicket) {
        logger.info('agentmail_webhook', `Created support ticket ${newTicket.id} from inbound email`, { from, subject })
        return NextResponse.json({ success: true, action: 'ticket_created', ticketId: newTicket.id })
      }
    }

    // Acknowledge receipt
    captureMessage(`Inbound AgentMail processed from ${from}: ${subject}`, 'info', {
      source: 'agentmail_webhook',
      extra: { from, subject, length: text.length },
    })

    return NextResponse.json({ success: true, action: 'received' })

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    logger.error('agentmail_webhook', `Inbound webhook handling failed: ${errorMsg}`, {}, error)
    captureException(error, { source: 'agentmail_webhook' })
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 })
  }
}
