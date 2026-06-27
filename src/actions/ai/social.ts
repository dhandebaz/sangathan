'use server'

import { generateText } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createSafeAction } from '@/lib/auth/actions'
import { nvidia, FAST_MODEL, SMART_MODEL, checkAiAccess } from '@/lib/ai/nvidia'

const GenerateContentSchema = z.object({
  content_type: z.enum(['social_post', 'newsletter', 'announcement', 'report']),
  tone: z.enum(['professional', 'casual', 'motivational', 'formal']).default('professional'),
  topic: z.string().optional(),
  target_audience: z.string().optional(),
})

const DraftPostSchema = z.object({
  draft_text: z.string().min(1),
  tone: z.string(),
  interaction_id: z.string().uuid().optional(),
})

async function gatherOrgActivity(orgId: string) {
  const supabase = await createClient()
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  const [recentEvents, recentAnnouncements, recentTickets] = await Promise.all([
    supabase.from('events').select('title, start_time').eq('organisation_id', orgId).gte('start_time', sevenDaysAgo).limit(5),
    supabase.from('announcements').select('title, content').eq('organisation_id', orgId).eq('deleted_at', null).limit(5),
    supabase.from('tickets').select('title, status').eq('organisation_id', orgId).gte('created_at', sevenDaysAgo).limit(5),
  ])

  return { events: recentEvents.data || [], announcements: recentAnnouncements.data || [], tickets: recentTickets.data || [] }
}

export const generateContent = createSafeAction(
  GenerateContentSchema,
  async (input, context) => {
    if (!(await checkAiAccess(context.organizationId))) return { error: 'AI features not available' }

    const activity = await gatherOrgActivity(context.organizationId)

    const prompt = `You are a content strategist for a civic organization. Generate a ${input.tone} ${input.content_type} based on this recent activity:

Events: ${activity.events.map(e => e.title).join(', ') || 'None'}
Announcements: ${activity.announcements.map(a => a.title).join(', ') || 'None'}
Recent tickets: ${activity.tickets.map(t => `${t.title} (${t.status})`).join(', ') || 'None'}
${input.topic ? `Topic focus: ${input.topic}` : ''}
${input.target_audience ? `Target audience: ${input.target_audience}` : ''}

Write 2-3 paragraphs. Use a ${input.tone} tone.`

    const { text, usage } = await generateText({
      model: nvidia(SMART_MODEL),
      prompt,
    })

    const supabase = await createClient()
    const { error } = await supabase.from('generated_content').insert({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      title: `${input.content_type} - ${new Date().toLocaleDateString()}`,
      content_body: text,
      content_type: input.content_type,
      tone: input.tone,
      language: 'en',
      status: 'draft',
      model_used: SMART_MODEL,
      prompt_tokens: usage?.inputTokens || null,
      completion_tokens: usage?.outputTokens || null,
    } as never)

    if (error) return { error: error.message }
    return { success: true, content: text }
  },
  { allowedRoles: ['admin', 'editor', 'executive'], actionName: 'ai_generate_content' },
)

export const draftResponse = createSafeAction(
  DraftPostSchema,
  async (input, context) => {
    if (!(await checkAiAccess(context.organizationId))) return { error: 'AI features not available' }

    const prompt = `Rewrite the following draft in a ${input.tone} tone suitable for a civic organization's social media. Keep the core message intact but adjust the voice.

Draft: "${input.draft_text}"`

    const { text, usage } = await generateText({
      model: nvidia(FAST_MODEL),
      prompt,
    })

    return { success: true, rewritten: text, usage }
  },
  { allowedRoles: ['admin', 'editor', 'executive'], actionName: 'ai_draft_response' },
)
