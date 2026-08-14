import { Bot, InlineKeyboard } from 'grammy'
import { processIncomingBotMessage } from '@/actions/bot'

/**
 * Creates and initializes a grammY Bot instance with standard Sangathan command handlers
 */
export function getTelegramBot(botToken: string, organisationId?: string) {
  const bot = new Bot(botToken)
  const resolvedOrgId = organisationId || process.env.DEFAULT_ORG_ID || ''

  // Configure command menu & handlers
  bot.command('start', async (ctx) => {
    const senderName = [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') || 'Activist'
    const keyboard = new InlineKeyboard()
      .text('🚨 Emergency SOS', 'cmd_sos')
      .text('📋 File Grievance', 'cmd_grievance')
      .row()
      .text('✅ Mark Attendance', 'cmd_checkin')
      .text('💳 Check Dues', 'cmd_dues')
      .row()
      .text('🗳️ Strike & Vote', 'cmd_vote')
      .text('ℹ️ Status', 'cmd_status')

    await ctx.reply(
      `🏛️ <b>Welcome to Sangathan Civic OS (${senderName})</b>\n\n` +
      `You are securely connected to your collective's automated command desk.\n\n` +
      `<b>Available Commands:</b>\n` +
      `• <code>/grievance &lt;details&gt;</code> - Log a workplace, campus, or civic issue\n` +
      `• <code>/checkin &lt;event_code&gt;</code> - Mark attendance for rallies/meetings\n` +
      `• <code>/dues</code> - View subscription, strike fund, or membership status\n` +
      `• <code>/vote &lt;ballot_id&gt; &lt;choice&gt;</code> - Cast a secure strike/resolution vote\n` +
      `• <code>/sos &lt;location&gt;</code> - Broadcast emergency legal defense alert\n` +
      `• <code>/status</code> - Check collective standing & digital ID status\n\n` +
      `<i>आप सीधे हिंदी में भी लिख सकते हैं (उदा. "शिकायत", "हाजिरी", "मदद")</i>`,
      { parse_mode: 'HTML', reply_markup: keyboard }
    )
  })

  // Command handlers
  bot.command(['grievance', 'shikayat'], async (ctx) => {
    const text = ctx.match || 'Campus / Workplace Issue'
    const res = await processIncomingBotMessage({
      organisationId: resolvedOrgId,
      channel: 'telegram',
      senderId: String(ctx.from?.id),
      senderName: [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') || 'Telegram User',
      messageText: `GRIEVANCE ${text}`,
    })
    await ctx.reply(res.replyText, { parse_mode: 'HTML' })
  })

  bot.command(['checkin', 'hajiri'], async (ctx) => {
    const text = ctx.match || 'GENERAL_RALLY'
    const res = await processIncomingBotMessage({
      organisationId: resolvedOrgId,
      channel: 'telegram',
      senderId: String(ctx.from?.id),
      senderName: [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') || 'Telegram User',
      messageText: `CHECKIN ${text}`,
    })
    await ctx.reply(res.replyText, { parse_mode: 'HTML' })
  })

  bot.command(['dues', 'bakaya'], async (ctx) => {
    const res = await processIncomingBotMessage({
      organisationId: resolvedOrgId,
      channel: 'telegram',
      senderId: String(ctx.from?.id),
      senderName: [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') || 'Telegram User',
      messageText: 'DUES',
    })
    await ctx.reply(res.replyText, { parse_mode: 'HTML' })
  })

  bot.command(['vote', 'matdan'], async (ctx) => {
    const text = ctx.match || 'YES'
    const res = await processIncomingBotMessage({
      organisationId: resolvedOrgId,
      channel: 'telegram',
      senderId: String(ctx.from?.id),
      senderName: [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') || 'Telegram User',
      messageText: `VOTE ${text}`,
    })
    await ctx.reply(res.replyText, { parse_mode: 'HTML' })
  })

  bot.command(['sos', 'madad', 'help'], async (ctx) => {
    const text = ctx.match || 'Protest Detention / Urgent Legal Aid'
    const res = await processIncomingBotMessage({
      organisationId: resolvedOrgId,
      channel: 'telegram',
      senderId: String(ctx.from?.id),
      senderName: [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') || 'Telegram User',
      messageText: `SOS ${text}`,
    })
    await ctx.reply(`🚨 <b>EMERGENCY ESCALATION TRANSMITTED</b>\n\n${res.replyText}`, { parse_mode: 'HTML' })
  })

  bot.command(['status', 'sthiti'], async (ctx) => {
    const res = await processIncomingBotMessage({
      organisationId: resolvedOrgId,
      channel: 'telegram',
      senderId: String(ctx.from?.id),
      senderName: [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') || 'Telegram User',
      messageText: 'STATUS',
    })
    await ctx.reply(res.replyText, { parse_mode: 'HTML' })
  })

  // Handle inline button clicks
  bot.on('callback_query:data', async (ctx) => {
    const data = ctx.callbackQuery.data
    await ctx.answerCallbackQuery()

    let cmdText = 'STATUS'
    if (data === 'cmd_sos') cmdText = 'SOS Emergency Protest Legal Aid'
    if (data === 'cmd_grievance') cmdText = 'GRIEVANCE Need Assistance'
    if (data === 'cmd_checkin') cmdText = 'CHECKIN GENERAL_MEETING'
    if (data === 'cmd_dues') cmdText = 'DUES'
    if (data === 'cmd_vote') cmdText = 'VOTE YES'
    if (data === 'cmd_status') cmdText = 'STATUS'

    const res = await processIncomingBotMessage({
      organisationId: resolvedOrgId,
      channel: 'telegram',
      senderId: String(ctx.from?.id),
      senderName: [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') || 'Telegram User',
      messageText: cmdText,
    })

    await ctx.reply(res.replyText, { parse_mode: 'HTML' })
  })

  // General text message fallback (NLP / Bilingual parser)
  bot.on('message:text', async (ctx) => {
    const text = ctx.message.text
    if (text.startsWith('/')) return // Already handled above

    const res = await processIncomingBotMessage({
      organisationId: resolvedOrgId,
      channel: 'telegram',
      senderId: String(ctx.from?.id),
      senderName: [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') || 'Telegram User',
      messageText: text,
    })

    await ctx.reply(res.replyText, { parse_mode: 'HTML' })
  })

  return bot
}

/**
 * Verifies a Telegram Bot Token by calling getMe API
 */
export async function testTelegramBotToken(botToken: string): Promise<{
  success: boolean
  bot?: {
    id: number
    username?: string
    firstName?: string
    isBot: boolean
  }
  error?: string
}> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
    const data = await res.json()
    if (data.ok && data.result) {
      return {
        success: true,
        bot: {
          id: data.result.id,
          username: data.result.username,
          firstName: data.result.first_name,
          isBot: data.result.is_bot ?? true,
        },
      }
    }
    return { success: false, error: data.description || 'Invalid Telegram Bot Token' }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network failure validating Telegram bot token'
    return { success: false, error: errorMsg }
  }
}

/**
 * Registers Webhook URL with Telegram API
 */
export async function registerTelegramWebhookUrl(params: {
  botToken: string
  webhookUrl: string
  secretToken?: string
}): Promise<{
  success: boolean
  description?: string
  error?: string
}> {
  try {
    const body: Record<string, string> = { url: params.webhookUrl }
    if (params.secretToken) body.secret_token = params.secretToken

    const res = await fetch(`https://api.telegram.org/bot${params.botToken}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (data.ok) {
      return { success: true, description: data.description }
    }
    return { success: false, error: data.description || 'Failed to register webhook' }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to register webhook'
    return { success: false, error: errorMsg }
  }
}

/**
 * Sends a real message to a Telegram Chat / User
 */
export async function sendTelegramDirectMessage(params: {
  botToken: string
  chatId: string | number
  text: string
  parseMode?: 'HTML' | 'MarkdownV2'
}) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${params.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: params.chatId,
        text: params.text,
        parse_mode: params.parseMode || 'HTML',
      }),
    })
    return await res.json()
  } catch (err) {
    console.error('Failed to send Telegram message:', err)
    return { ok: false, error: err }
  }
}
