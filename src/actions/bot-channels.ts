'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { revalidatePath } from 'next/cache'
import {
  testTelegramBotToken,
  registerTelegramWebhookUrl,
  sendTelegramDirectMessage,
} from '@/lib/bot/telegram-client'
import { generateSecureString } from '@/lib/utils'

function getAppBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'https://sangathan.space'
}

/**
 * Connect Telegram Bot using grammY & Auto-Webhook Registration
 */
export async function connectTelegramBotAction(botToken: string) {
  try {
    if (!botToken || botToken.trim().length < 15) {
      return { success: false, error: 'Please provide a valid Telegram Bot Token from @BotFather.' }
    }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not selected' }

    // 1. Verify token with Telegram Bot API
    const testRes = await testTelegramBotToken(botToken.trim())
    if (!testRes.success || !testRes.bot) {
      return { success: false, error: testRes.error || 'Failed to authenticate with Telegram. Please check token.' }
    }

    // 2. Set Webhook URL
    const baseUrl = getAppBaseUrl()
    const webhookUrl = `${baseUrl}/api/bot/webhook/telegram?orgId=${orgId}`
    const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET || generateSecureString(32)

    const webhookRes = await registerTelegramWebhookUrl({
      botToken: botToken.trim(),
      webhookUrl,
      secretToken,
    })

    if (!webhookRes.success) {
      return { success: false, error: webhookRes.error || 'Failed to register webhook with Telegram.' }
    }

    // 3. Store in database
    const adminClient = createServiceClient()
    await adminClient.from('bot_channel_configs').upsert({
      organisation_id: orgId,
      channel: 'telegram',
      is_enabled: true,
      status: 'connected',
      credentials: {
        bot_token: botToken.trim(),
        bot_id: testRes.bot.id,
        bot_username: testRes.bot.username,
        bot_first_name: testRes.bot.firstName,
        webhook_url: webhookUrl,
      },
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'organisation_id,channel' })

    revalidatePath('/', 'layout')
    revalidatePath('/', 'layout')

    return {
      success: true,
      botInfo: testRes.bot,
      webhookUrl,
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to connect Telegram Bot'
    return { success: false, error: errorMsg }
  }
}

/**
 * Disconnect a Bot Channel
 */
export async function disconnectBotChannelAction(channel: 'telegram' = 'telegram') {
  try {
    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not selected' }

    const adminClient = createServiceClient()
    await adminClient
      .from('bot_channel_configs')
      .update({
        is_enabled: false,
        status: 'disconnected',
        credentials: {},
        updated_at: new Date().toISOString(),
      })
      .eq('organisation_id', orgId)
      .eq('channel', channel)

    revalidatePath('/', 'layout')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to disconnect channel'
    return { success: false, error: errorMsg }
  }
}

/**
 * Send a Test Outbound Message to Telegram Chat
 */
export async function sendTestOutboundMessageAction(params: {
  channel: 'telegram'
  recipientId: string
  messageText: string
}) {
  try {
    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not selected' }

    const adminClient = createServiceClient()
    const { data: config } = await adminClient
      .from('bot_channel_configs')
      .select('*')
      .eq('organisation_id', orgId)
      .eq('channel', 'telegram')
      .maybeSingle()

    const botToken = config?.credentials?.bot_token || process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) return { success: false, error: 'Telegram Bot Token not configured' }

    const res = await sendTelegramDirectMessage({
      botToken,
      chatId: params.recipientId,
      text: `🏛️ <b>[Sangathan Test Dispatch]</b>\n\n${params.messageText}`,
    })

    if (res.ok || res.success) {
      await adminClient.from('bot_outbound_messages').insert({
        organisation_id: orgId,
        channel: 'telegram',
        recipient_id: params.recipientId,
        message_text: params.messageText,
        status: 'sent',
        provider_message_id: String(res.result?.message_id || res.messageId || 'tg_sent'),
        sent_at: new Date().toISOString(),
      })
      return { success: true, messageId: String(res.result?.message_id || res.messageId || '') }
    } else {
      return { success: false, error: res.description || res.error || 'Failed to dispatch Telegram message' }
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to send outbound message'
    return { success: false, error: errorMsg }
  }
}

/**
 * Fetch all channel configs & recent outbound logs
 */
export async function getChannelConfigsAction(orgId: string) {
  try {
    const adminClient = createServiceClient()

    const { data: configs } = await adminClient
      .from('bot_channel_configs')
      .select('*')
      .eq('organisation_id', orgId)

    const { data: outboundLogs } = await adminClient
      .from('bot_outbound_messages')
      .select('*')
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: false })
      .limit(30)

    return {
      success: true,
      configs: configs || [],
      outboundLogs: outboundLogs || [],
    }
  } catch {
    return { success: true, configs: [], outboundLogs: [] }
  }
}

/**
 * Fetch Unified Communications Feed (Conversations on Telegram + Analytics)
 */
export async function getOrgUnifiedCommunicationsAction(orgId: string) {
  try {
    const adminClient = createServiceClient()

    // 1. Fetch connected channels
    const { data: configs } = await adminClient
      .from('bot_channel_configs')
      .select('*')
      .eq('organisation_id', orgId)

    // 2. Fetch all member conversations
    const { data: conversations } = await adminClient
      .from('bot_conversations')
      .select(`
        id,
        channel,
        sender_id,
        sender_name,
        last_command,
        last_state,
        created_at,
        updated_at,
        member:members(id, full_name, email, phone, role)
      `)
      .eq('organisation_id', orgId)
      .order('updated_at', { ascending: false })
      .limit(100)

    // 3. Calculate statistics
    const { count: totalInbound } = await adminClient
      .from('bot_logs')
      .select('*', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .eq('direction', 'incoming')

    const { count: totalGrievances } = await adminClient
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .ilike('title', '%BOT%')

    const { count: totalSosAlerts } = await adminClient
      .from('emergency_sos_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('organisation_id', orgId)

    return {
      success: true,
      configs: configs || [],
      conversations: conversations || [],
      stats: {
        totalConversations: conversations?.length || 0,
        totalInboundMessages: totalInbound || 0,
        totalBotGrievances: totalGrievances || 0,
        totalSosAlerts: totalSosAlerts || 0,
      },
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch communications'
    return { success: false, error: errorMsg, configs: [], conversations: [], stats: { totalConversations: 0, totalInboundMessages: 0, totalBotGrievances: 0, totalSosAlerts: 0 } }
  }
}

/**
 * Fetch full chat history for a specific conversation
 */
export async function getConversationHistoryAction(conversationId: string) {
  try {
    const adminClient = createServiceClient()
    let queryId = conversationId
    if (conversationId.startsWith('direct-')) {
      const memberId = conversationId.replace('direct-', '')
      const { data: conv } = await adminClient
        .from('bot_conversations')
        .select('id')
        .eq('sender_id', memberId)
        .maybeSingle()
      if (conv) queryId = conv.id
      else return { success: true, logs: [] }
    }

    const { data: logs } = await adminClient
      .from('bot_logs')
      .select('*')
      .eq('conversation_id', queryId)
      .order('created_at', { ascending: true })

    return { success: true, logs: logs || [] }
  } catch {
    return { success: false, logs: [] }
  }
}

/**
 * Send a 2-way Admin Direct Reply from Dashboard to a member on Telegram
 */
export async function sendAdminDirectReplyAction(params: {
  conversationId: string
  replyText: string
}) {
  try {
    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not selected' }

    const adminClient = createServiceClient()
    let conversationId = params.conversationId
    let conv: { id: string; channel?: string | null; sender_id?: string | null } | null = null

    // 1. Handle direct member conversations dynamically
    if (conversationId.startsWith('direct-')) {
      const targetMemberId = conversationId.replace('direct-', '')
      const { data: member } = await adminClient
        .from('profiles')
        .select('id, full_name, phone, role')
        .eq('id', targetMemberId)
        .eq('organisation_id', orgId)
        .maybeSingle()

      // Check if conversation already exists
      const { data: existingConv } = await adminClient
        .from('bot_conversations')
        .select('*')
        .eq('organisation_id', orgId)
        .eq('sender_id', targetMemberId)
        .maybeSingle()

      if (existingConv) {
        conv = existingConv
        conversationId = existingConv.id
      } else {
        const { data: newConv } = await adminClient
          .from('bot_conversations')
          .insert({
            organisation_id: orgId,
            channel: 'direct',
            sender_id: targetMemberId,
            sender_name: member?.full_name || 'Member',
            last_command: 'DIRECT_CHAT',
            last_state: 'admin_replied',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as never)
          .select('*')
          .maybeSingle()

        conv = newConv
        if (newConv) conversationId = newConv.id
      }
    } else {
      const { data: fetchedConv } = await adminClient
        .from('bot_conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('organisation_id', orgId)
        .maybeSingle()

      conv = fetchedConv
    }

    if (!conv) {
      return { success: false, error: 'Conversation could not be initialized or found' }
    }

    // 2. Fetch org channel config
    const { data: config } = await adminClient
      .from('bot_channel_configs')
      .select('*')
      .eq('organisation_id', orgId)
      .eq('channel', 'telegram')
      .maybeSingle()

    // 3. Dispatch message through Telegram if telegram conversation
    let dispatchSuccess = false
    let providerMsgId = `reply_${Date.now()}`

    if (!conv) {
      return { success: false, error: 'Conversation not found' }
    }

    const botToken = config?.credentials?.bot_token || process.env.TELEGRAM_BOT_TOKEN
    if (botToken && conv.channel === 'telegram' && conv.sender_id) {
      const res = await sendTelegramDirectMessage({
        botToken,
        chatId: conv.sender_id,
        text: `💬 <b>[Sangathan Admin Response]</b>\n\n${params.replyText}`,
      })
      dispatchSuccess = res.ok || res.success
      if (res.result?.message_id || res.messageId) {
        providerMsgId = String(res.result?.message_id || res.messageId)
      }
    } else {
      dispatchSuccess = true
    }

    // 4. Log message to bot_logs
    await adminClient.from('bot_logs').insert({
      conversation_id: conv.id,
      organisation_id: orgId,
      channel: conv.channel || 'direct',
      direction: 'outgoing',
      message_text: params.replyText,
      command_recognized: 'ADMIN_REPLY',
      status: dispatchSuccess ? 'processed' : 'failed',
      payload: { replyTo: conv.sender_id, directAdminResponse: true },
    })

    // 5. Update conversation timestamp
    await adminClient
      .from('bot_conversations')
      .update({ updated_at: new Date().toISOString(), last_state: 'admin_replied' })
      .eq('id', conv.id)

    revalidatePath('/', 'layout')

    return { success: true, messageId: providerMsgId }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to send reply'
    return { success: false, error: errorMsg }
  }
}

/**
 * Send an Org-wide Mass Broadcast via Master Telegram Bot
 */
export async function sendOrgMassBroadcastAction(params: {
  channel?: 'telegram' | 'all'
  broadcastMessage: string
}) {
  try {
    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not selected' }

    const adminClient = createServiceClient()

    // 1. Fetch channel config
    const { data: config } = await adminClient
      .from('bot_channel_configs')
      .select('*')
      .eq('organisation_id', orgId)
      .eq('channel', 'telegram')
      .maybeSingle()

    const botToken = config?.credentials?.bot_token || process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return { success: false, error: 'Telegram Bot is not connected. Please connect your bot in Channels hub.' }
    }

    // 2. Fetch active Telegram conversations / subscribers
    const { data: conversations } = await adminClient
      .from('bot_conversations')
      .select('sender_id, sender_name')
      .eq('organisation_id', orgId)
      .eq('channel', 'telegram')
      .limit(300)

    let sentCount = 0

    if (conversations && conversations.length > 0) {
      for (const conv of conversations) {
        if (conv.sender_id) {
          try {
            await sendTelegramDirectMessage({
              botToken,
              chatId: conv.sender_id,
              text: `📢 <b>[Sangathan Collective Announcement]</b>\n\n${params.broadcastMessage}`,
            })
            sentCount++
          } catch {
            // continue dispatching to others
          }
        }
      }
    }

    // 3. Log broadcast to outbound logs
    await adminClient.from('bot_outbound_messages').insert({
      organisation_id: orgId,
      channel: 'telegram',
      recipient_id: `BROADCAST_${sentCount}_SUBSCRIBERS`,
      recipient_name: 'Telegram Broadcast',
      message_text: params.broadcastMessage,
      status: 'sent',
      sent_at: new Date().toISOString(),
    })

    revalidatePath('/', 'layout')
    return { success: true, sentCount }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Broadcast failed'
    return { success: false, error: errorMsg }
  }
}

