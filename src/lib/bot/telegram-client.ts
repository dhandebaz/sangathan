import { Bot, InlineKeyboard } from 'grammy'
import { processIncomingBotMessage } from '@/actions/bot'

/**
 * Creates and initializes a grammY Bot instance with standard Sangathan command handlers
 */
export function getTelegramBot(botToken: string, organisationId?: string) {
  const bot = new Bot(botToken)

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
      organisationId: organisationId || process.env.DEFAULT_ORG_ID || '00000000-0000-0000-0000-000000000000',
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
      organisationId: organisationId || process.env.DEFAULT_ORG_ID || '00000000-0000-0000-0000-000000000000',
      channel: 'telegram',
      senderId: String(ctx.from?.id),
      senderName: [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') || 'Telegram User',
      messageText: `CHECKIN ${text}`,
    })
    await ctx.reply(res.replyText, { parse_mode: 'HTML' })
  })

  bot.command(['dues', 'bakaya'], async (ctx) => {
    const res = await processIncomingBotMessage({
      organisationId: organisationId || process.env.DEFAULT_ORG_ID || '00000000-0000-0000-0000-000000000000',
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
      organisationId: organisationId || process.env.DEFAULT_ORG_ID || '00000000-0000-0000-0000-000000000000',
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
      organisationId: organisationId || process.env.DEFAULT_ORG_ID || '00000000-0000-0000-0000-000000000000',
      channel: 'telegram',
      senderId: String(ctx.from?.id),
      senderName: [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') || 'Telegram User',
      messageText: `SOS ${text}`,
    })
    await ctx.reply(`🚨 <b>EMERGENCY ESCALATION TRANSMITTED</b>\n\n${res.replyText}`, { parse_mode: 'HTML' })
  })

  bot.command(['status', 'sthiti'], async (ctx) => {
    const res = await processIncomingBotMessage({
      organisationId: organisationId || process.env.DEFAULT_ORG_ID || '00000000-0000-0000-0000-000000000000',
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
      organisationId: organisationId || process.env.DEFAULT_ORG_ID || '00000000-0000-0000-0000-000000000000',
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
      organisationId: organisationId || process.env.DEFAULT_ORG_ID || '00000000-0000-0000-0000-000000000000',
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
 * Sends a real message to a Telegram Chat / User
 */
export async function sendTelegramDirectMessage(params: {
  botToken: string
  chatId: string | number
  text: string
  parseMode?: 'HTML' | 'MarkdownV2'
}) {
  try {
    const bot = new Bot(params.botToken)
    const result = await bot.api.sendMessage(params.chatId, params.text, {
      parse_mode: params.parseMode || 'HTML',
    })
    return { success: true, messageId: result.message_id }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to send Telegram message'
    return { success: false, error: errorMsg }
  }
}

/**
 * Validates bot token and returns details from Telegram getMe
 */
export async function testTelegramBotToken(botToken: string) {
  try {
    const bot = new Bot(botToken)
    const me = await bot.api.getMe()
    const webhookInfo = await bot.api.getWebhookInfo()
    return {
      success: true,
      bot: {
        id: me.id,
        username: me.username,
        firstName: me.first_name,
        canJoinGroups: me.can_join_groups,
      },
      webhook: {
        url: webhookInfo.url,
        hasCustomCertificate: webhookInfo.has_custom_certificate,
        pendingUpdateCount: webhookInfo.pending_update_count,
        lastErrorDate: webhookInfo.last_error_date,
        lastErrorMessage: webhookInfo.last_error_message,
      },
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid Bot Token'
    return { success: false, error: errorMsg }
  }
}

/**
 * Registers Sangathan webhook URL directly with Telegram Bot API
 */
export async function registerTelegramWebhookUrl(params: {
  botToken: string
  webhookUrl: string
  secretToken?: string
}) {
  try {
    const bot = new Bot(params.botToken)
    await bot.api.setWebhook(params.webhookUrl, {
      secret_token: params.secretToken,
      drop_pending_updates: false,
      allowed_updates: ['message', 'callback_query'],
    })
    const info = await bot.api.getWebhookInfo()
    return { success: true, webhookUrl: info.url }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to set Telegram webhook'
    return { success: false, error: errorMsg }
  }
}
