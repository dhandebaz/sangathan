import { NextResponse } from 'next/server'
import { getTelegramBot } from '@/lib/bot/telegram-client'
import { processIncomingBotMessage } from '@/actions/bot'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    status: 'online',
    engine: 'grammY Telegram Webhook Engine',
    timestamp: new Date().toISOString(),
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

    const secretToken = request.headers.get('x-telegram-bot-api-secret-token')

    // Optional secret verification
    if (process.env.TELEGRAM_WEBHOOK_SECRET && secretToken && secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized secret token' }, { status: 401 })
    }

    const update = await request.json()

    // Determine bot token (from environment or per-org config)
    let botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken && orgId) {
      const { data: config } = await adminClient
        .from('bot_channel_configs')
        .select('credentials')
        .eq('organisation_id', orgId)
        .eq('channel', 'telegram')
        .maybeSingle()

      if (config?.credentials?.bot_token) {
        botToken = config.credentials.bot_token
      }
    }

    // If we have a bot token, run it through grammY engine
    if (botToken) {
      const bot = getTelegramBot(botToken, orgId)
      await bot.handleUpdate(update)
      return NextResponse.json({ ok: true })
    }

    // Fallback: Direct extraction if running standalone
    const message = update.message || update.channel_post || update.callback_query?.message
    if (message) {
      const senderId = String(update.callback_query?.from?.id || message.from?.id || message.chat?.id || 'telegram_user')
      const senderName = [message.from?.first_name, message.from?.last_name].filter(Boolean).join(' ') || 'Telegram Activist'
      const messageText = update.callback_query?.data || message.text || 'HELP'

      const result = await processIncomingBotMessage({
        organisationId: orgId || '',
        channel: 'telegram',
        senderId,
        senderName,
        messageText,
      })

      return NextResponse.json({
        method: 'sendMessage',
        chat_id: senderId,
        text: result.replyText,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Webhook update processing failed'
    console.error('Telegram Webhook Error:', err)
    return NextResponse.json({ success: false, error: 'Internal processing error' }, { status: 500 })
  }
}
