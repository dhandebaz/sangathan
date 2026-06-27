'use server'

import { generateText } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createSafeAction } from '@/lib/auth/actions'
import { nvidia, FAST_MODEL, checkAiAccess } from '@/lib/ai/nvidia'
import { enqueueJob } from '@/lib/queue'
import { sendPushNotification } from '@/actions/push'

const NotificationTypeSchema = z.object({
  member_id: z.string().uuid(),
  notification_type: z.enum([
    'task_reminder',
    'event_reminder',
    'meeting_summary',
    'ticket_update',
    'engagement_milestone',
    'custom_announcement',
  ]),
  context: z.record(z.string(), z.any()).optional(),
})

async function generateNotification(
  input: z.infer<typeof NotificationTypeSchema>,
  orgId: string,
  userId: string,
) {
  const supabase = await createClient()
  const { data: member } = await supabase
    .from('profiles')
    .select('full_name, role, engagement_score')
    .eq('id', input.member_id)
    .single()

  if (!member) return { error: 'Member not found' }

  const prompts: Record<string, string> = {
    task_reminder: `Write a friendly 1-2 sentence push notification reminder for ${member.full_name} about their pending tasks. Keep it motivational.`,
    event_reminder: `Write a brief 1-2 sentence event reminder for ${member.full_name} that creates excitement.`,
    meeting_summary: `Write a concise 1-2 sentence notification for ${member.full_name} summarizing a recent meeting outcome and any action needed.`,
    ticket_update: `Write a brief 1-2 sentence notification for ${member.full_name} about a recent support ticket update.`,
    engagement_milestone: `Write a congratulatory 1-2 sentence notification for ${member.full_name} (engagement score: ${member.engagement_score || 0}) about reaching an engagement milestone.`,
    custom_announcement: `Write a clear 1-2 sentence notification for ${member.full_name} about: ${JSON.stringify(input.context)}`,
  }

  const prompt = prompts[input.notification_type] || prompts.custom_announcement

  const { text } = await generateText({
    model: nvidia(FAST_MODEL),
    prompt,
  })

  const [title, ...bodyParts] = text.split(/\.\s+/)
  const body = bodyParts.join('. ')

  const payload = {
    title: title?.trim() || 'Notification',
    body: body || text,
    url: `/${input.notification_type.replace('_', '-')}`,
  }

  await enqueueJob('send_email', {
    type: 'notification',
    userId: input.member_id,
    payload,
  } as never)

  try {
    await sendPushNotification(input.member_id, payload)
  } catch {
    // Push may not be configured; notification is queued
  }

  return { success: true, notification: payload }
}

export const generatePersonalizedNotification = createSafeAction(
  NotificationTypeSchema,
  async (input, context) => {
    if (!(await checkAiAccess(context.organizationId))) return { error: 'AI features not available' }

    return generateNotification(input, context.organizationId, context.user.id)
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'ai_personalized_notification' },
)

export const generateBulkNotifications = createSafeAction(
  z.object({
    member_ids: z.array(z.string().uuid()).min(1).max(50),
    notification_type: NotificationTypeSchema.shape.notification_type,
    context: z.record(z.string(), z.any()).optional(),
  }),
  async (input, context) => {
    if (!(await checkAiAccess(context.organizationId))) return { error: 'AI features not available' }

    const results = []
    for (const memberId of input.member_ids.slice(0, 10)) {
      const result = await generateNotification(
        {
          member_id: memberId,
          notification_type: input.notification_type,
          context: input.context,
        },
        context.organizationId,
        context.user.id,
      )

      results.push({ memberId, success: !('error' in result) })
    }

    return { success: true, sent: results.filter(r => r.success).length, total: results.length }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'ai_bulk_notifications' },
)
