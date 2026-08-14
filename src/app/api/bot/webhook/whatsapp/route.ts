import { NextResponse } from 'next/server'
import { processIncomingBotMessage } from '@/actions/bot'
import { sendWhatsAppCloudDirectMessage } from '@/lib/bot/whatsapp-client'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Meta WhatsApp Cloud API Webhook Handshake (hub.challenge)
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const expectedVerifyToken = process.env.WHATSAPP_VERIFY_TOKEN

  if (mode === 'subscribe' && expectedVerifyToken && token === expectedVerifyToken) {
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  return NextResponse.json({
    status: 'online',
    service: 'Sangathan WhatsApp Cloud & Linked Device Webhook Engine',
  })
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const adminClient = createServiceClient()

    // Dynamically resolve organization ID
    let orgId = url.searchParams.get('orgId') || process.env.DEFAULT_ORG_ID
    if (!orgId) {
      const { data: firstOrg } = await adminClient.from('organisations').select('id').limit(1).maybeSingle()
      orgId = firstOrg?.id || ''
    }

    const body = await request.json()

    // 1. Check if Meta WhatsApp Cloud Webhook format
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]?.value
    const message = changes?.messages?.[0]

    let senderId = ''
    let senderName = 'WhatsApp Activist'
    let messageText = ''

    if (message) {
      senderId = message.from
      senderName = changes.contacts?.[0]?.profile?.name || 'WhatsApp User'
      messageText = message.text?.body || message.interactive?.button_reply?.title || message.interactive?.list_reply?.title || 'HELP'
    } else if (body.senderId || body.from) {
      // Direct relay or QR Bridge payload format
      senderId = body.senderId || body.from
      senderName = body.senderName || 'WhatsApp User'
      messageText = body.text || body.message || 'HELP'
    } else {
      // Status update event (delivery receipt, read receipt)
      return NextResponse.json({ ok: true, event: 'status_ack' })
    }

    // 2. Process message through Sangathan NLP & action engine
    const result = await processIncomingBotMessage({
      organisationId: orgId || '',
      channel: 'whatsapp',
      senderId,
      senderName,
      messageText,
    })

    // 3. If WhatsApp Cloud API credentials exist, dispatch real reply back to user's phone
    const phoneNumberId = changes?.metadata?.phone_number_id || process.env.WHATSAPP_PHONE_NUMBER_ID
    const apiToken = process.env.WHATSAPP_API_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN

    if (phoneNumberId && apiToken && senderId) {
      await sendWhatsAppCloudDirectMessage({
        phoneNumberId,
        apiToken,
        recipientPhone: senderId,
        messageText: result.replyText,
        buttons: [
          { id: 'btn_sos', title: '🚨 Emergency SOS' },
          { id: 'btn_grievance', title: '📋 File Grievance' },
          { id: 'btn_checkin', title: '✅ Mark Attendance' },
        ],
      })
    }

    return NextResponse.json({
      success: true,
      reply: result.replyText,
      action: result.actionExecuted,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown webhook error'
    console.error('WhatsApp Webhook Error:', err)
    return NextResponse.json({ success: false, error: 'Internal processing error' }, { status: 500 })
  }
}
