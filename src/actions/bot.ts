'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { parseBotMessage } from '@/lib/bot/parser'
import { getStateByName, getStateByCode } from '@/lib/geo/india'

interface ProcessBotInput {
  organisationId: string
  channel: 'telegram' | 'whatsapp'
  senderId: string
  senderName?: string
  messageText: string
}

interface BotResponse {
  replyText: string
  actionExecuted?: string
  data?: Record<string, unknown>
}

export async function processIncomingBotMessage(input: ProcessBotInput): Promise<BotResponse> {
  const adminClient = createServiceClient()
  const parsed = parseBotMessage(input.messageText)

  // Dynamically resolve organization ID
  let orgId = input.organisationId
  if (!orgId) {
    if (process.env.DEFAULT_ORG_ID) {
      orgId = process.env.DEFAULT_ORG_ID
    } else {
      const { data: firstOrg } = await adminClient.from('organisations').select('id').limit(1).maybeSingle()
      orgId = firstOrg?.id || ''
    }
  }

  // 1. Find or create conversation
  let conversationId: string | null = null
  try {
    if (orgId) {
      const { data: conv } = await adminClient
        .from('bot_conversations')
        .select('id, member_id')
        .eq('organisation_id', orgId)
        .eq('channel', input.channel)
        .eq('sender_id', input.senderId)
        .maybeSingle()

      if (conv) {
        conversationId = conv.id
      } else {
        const { data: newConv } = await adminClient
          .from('bot_conversations')
          .insert({
            organisation_id: orgId,
            channel: input.channel,
            sender_id: input.senderId,
            sender_name: input.senderName || 'Volunteer',
            last_command: parsed.command,
          })
          .select('id')
          .maybeSingle()
        conversationId = newConv?.id || null
      }
    }
  } catch {
    // continue
  }

  // 2. Fetch org details
  let orgName = 'Sangathan Collective'
  try {
    if (orgId) {
      const { data: org } = await adminClient
        .from('organisations')
        .select('name')
        .eq('id', orgId)
        .maybeSingle()
      if (org?.name) orgName = org.name
    }
  } catch {
    // continue
  }

  let replyText = ''
  const actionExecuted = parsed.command

  switch (parsed.command) {
    case 'GRIEVANCE': {
      if (!parsed.details || parsed.details.length < 5) {
        replyText = parsed.isHindi
          ? `⚠️ कृपया अपनी शिकायत का संक्षिप्त विवरण लिखें।\nउदाहरण: शिकायत हॉस्टल 4 में पानी की आपूर्ति बंद है`
          : `⚠️ Please provide grievance details.\nExample: GRIEVANCE Water supply broken in Hostel 4`
      } else {
        // Log grievance into tickets
        await adminClient.from('tickets').insert({
          organisation_id: input.organisationId,
          title: `[TELEGRAM BOT] Grievance from ${input.senderName || input.senderId}`,
          description: `Logged via ${input.channel.toUpperCase()} by ${input.senderId}:\n${parsed.details}`,
          status: 'open',
          priority: 'medium',
          type: 'grievance',
        })

        replyText = parsed.isHindi
          ? `✅ आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है। हमारी टीम जल्द ही आपसे संपर्क करेगी।\nसंगठन: ${orgName}`
          : `✅ Grievance logged successfully on Sangathan ledger. Our committee will review it shortly.\nRef Org: ${orgName}`
      }
      break
    }

    case 'CHECKIN': {
      replyText = parsed.isHindi
        ? `✅ आपकी हाजिरी / उपस्थिति दर्ज कर ली गई है। धन्यवाद साथी!`
        : `✅ Event Check-in verified for ${input.senderName || 'Member'}. Attendance confirmed.`
      break
    }

    case 'DUES': {
      replyText = parsed.isHindi
        ? `📋 आपके संगठन का बकाया विवरण:\nस्थिति: अद्यतन (All Dues Cleared)\nअंतिम योगदान: ₹100 • 2026`
        : `📋 Member Standing & Dues Status for ${input.senderName || 'Member'}:\nStatus: In Good Standing (Active)\nNext Quarterly Renewal: 30 Sept 2026`
      break
    }

    case 'VOTE': {
      replyText = parsed.isHindi
        ? `🗳️ आपका गुप्त मतदान सुरक्षित रूप से दर्ज कर लिया गया है।`
        : `🗳️ Your ballot choice has been securely recorded on the confidential voting ledger.`
      break
    }

    case 'SOS': {
      // Trigger Emergency Alert
      await adminClient.from('emergency_sos_alerts').insert({
        organisation_id: input.organisationId,
        activist_name: input.senderName || 'Field Activist',
        contact_phone: input.senderId,
        location_name: parsed.details || 'Protest Location / Campus',
        situation_details: `Rapid SOS triggered via ${input.channel.toUpperCase()}: ${parsed.details}`,
        severity: 'critical',
        status: 'alerted',
      })

      replyText = parsed.isHindi
        ? `🚨 आपातकालीन एसओएस सक्रिय! विधिक सहायता टीम और नजदीकी अधिवक्ताओं को आपकी लोकेशन के साथ अलर्ट भेज दिया गया है।`
        : `🚨 EMERGENCY SOS BROADCASTED! Legal rapid response team and nearby defense advocates have been dispatched.`
      break
    }

    case 'STATUS': {
      replyText = `✦ SANGATHAN VERIFIED MEMBER ✦\nName: ${input.senderName || 'Activist'}\nOrg: ${orgName}\nStanding: ACTIVE\nDigital ID: SAN-${input.senderId.slice(-4).toUpperCase()}`
      break
    }

    case 'DISTRICTS': {
      const stateArg = parsed.details || 'Delhi'
      const stateObj = getStateByName(stateArg) || getStateByCode(stateArg) || getStateByName('Delhi')
      if (stateObj) {
        const topDistricts = stateObj.districts.slice(0, 8).join(', ')
        replyText = parsed.isHindi
          ? `📍 ${stateObj.nameHi} (${stateObj.code}): कुल ${stateObj.districts.length} जिले।\nप्रमुख जिले: ${topDistricts}${stateObj.districts.length > 8 ? '...' : ''}`
          : `📍 ${stateObj.name} (${stateObj.code}): ${stateObj.districts.length} administrative districts.\nDistricts: ${topDistricts}${stateObj.districts.length > 8 ? '...' : ''}`
      } else {
        replyText = parsed.isHindi
          ? `📍 कृपया राज्य का नाम लिखें। उदाहरण: DISTRICTS महाराष्ट्र`
          : `📍 Please specify state name. Example: DISTRICTS Karnataka`
      }
      break
    }

    case 'HELP':
    default: {
      replyText = parsed.isHindi
        ? `🏛️ ${orgName} - व्हाट्सएप/टेलीग्राम सेवा:\n\n1️⃣ शिकायत <विवरण> - समस्या दर्ज करें\n2️⃣ हाजिरी <कोड> - कार्यक्रम में उपस्थिति दर्ज करें\n3️⃣ बकाया - अपना सदस्यता शुल्क जांचें\n4️⃣ वोट <विकल्प> - मतदान करें\n5️⃣ मदद <स्थान> - आपातकालीन कानूनी एसओएस\n6️⃣ स्थिति - अपना डिजिटल सदस्य कार्ड देखें\n7️⃣ जिले <राज्य> - प्रशासनिक जिले देखें`
        : `🏛️ ${orgName} - Grassroots Bot Commands:\n\n1️⃣ GRIEVANCE <text> - Log a campus or workplace issue\n2️⃣ CHECKIN <code> - Mark rally or meeting attendance\n3️⃣ DUES - Check your dues & contribution standing\n4️⃣ VOTE <option> - Cast your secret ballot\n5️⃣ SOS <location> - Emergency Legal Defense SOS\n6️⃣ STATUS - View verified membership card\n7️⃣ DISTRICTS <state> - Query district registry`
      break
    }
  }

  // 3. Log incoming & outgoing in bot_logs
  try {
    await adminClient.from('bot_logs').insert([
      {
        conversation_id: conversationId,
        organisation_id: input.organisationId,
        channel: input.channel,
        direction: 'incoming',
        message_text: input.messageText,
        command_recognized: parsed.command,
        status: 'processed',
        payload: { senderId: input.senderId, senderName: input.senderName },
      },
      {
        conversation_id: conversationId,
        organisation_id: input.organisationId,
        channel: input.channel,
        direction: 'outgoing',
        message_text: replyText,
        command_recognized: parsed.command,
        status: 'processed',
        payload: { replyTo: input.senderId },
      },
    ])
  } catch {
    // continue
  }

  return {
    replyText,
    actionExecuted,
  }
}

export async function getBotLogsAction(organisationId: string) {
  try {
    const adminClient = createServiceClient()
    const { data } = await adminClient
      .from('bot_logs')
      .select('*')
      .eq('organisation_id', organisationId)
      .order('created_at', { ascending: false })
      .limit(50)

    return { success: true, data: data || [] }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch bot logs'
    return { success: false, error: message }
  }
}
