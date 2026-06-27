'use server'

import { generateObject, generateText } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createSafeAction } from '@/lib/auth/actions'
import { nvidia, SMART_MODEL, checkAiAccess } from '@/lib/ai/nvidia'

const MeetingMinutesSchema = z.object({
  meetingId: z.string().uuid(),
  notes: z.string().min(10, 'Meeting notes must be at least 10 characters'),
})

const MinutesSchema = z.object({
  summary: z.string(),
  key_discussions: z.array(z.string()),
  decisions: z.array(z.string()),
  action_items: z.array(z.object({
    task: z.string(),
    assignee_hint: z.string().optional(),
    priority: z.enum(['high', 'medium', 'low']),
  })),
  next_steps: z.array(z.string()),
})

export const generateMeetingMinutes = createSafeAction(
  MeetingMinutesSchema,
  async (input, context) => {
    if (!(await checkAiAccess(context.organizationId))) return { error: 'AI features not available' }

    const supabase = await createClient()
    const { data: meeting } = await supabase
      .from('meetings')
      .select('title, date')
      .eq('id', input.meetingId)
      .eq('organisation_id', context.organizationId)
      .single()

    if (!meeting) return { error: 'Meeting not found' }

    const { object: minutes } = await generateObject({
      model: nvidia(SMART_MODEL),
      schema: MinutesSchema,
      prompt: `Generate structured meeting minutes from these notes.

Meeting title: ${meeting.title}
Date: ${meeting.date}
Notes: ${input.notes}

Extract: summary, key discussion points, decisions made, action items with priority, and next steps.`,
    })

    const { text: formattedMinutes } = await generateText({
      model: nvidia(SMART_MODEL),
      prompt: `Format the following meeting minutes as a clean markdown document with proper headings.

Meeting: ${meeting.title}
Date: ${meeting.date}

Summary: ${minutes.summary}

Key Discussions:
${minutes.key_discussions.map(d => `- ${d}`).join('\n')}

Decisions:
${minutes.decisions.map(d => `- ${d}`).join('\n')}

Action Items:
${minutes.action_items.map(a => `- [ ] ${a.task} (${a.priority} priority)${a.assignee_hint ? ` - ${a.assignee_hint}` : ''}`).join('\n')}

Next Steps:
${minutes.next_steps.map(n => `- ${n}`).join('\n')}`,
    })

    const { error: storeError } = await supabase.from('generated_content').insert({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      title: `Minutes: ${meeting.title}`,
      content_body: formattedMinutes,
      content_type: 'meeting_minutes',
      tone: 'formal',
      language: 'en',
      status: 'draft',
      source_summary: minutes.summary,
      model_used: SMART_MODEL,
    } as never)

    if (storeError) return { error: storeError.message }

    return {
      success: true,
      minutes: formattedMinutes,
      action_items: minutes.action_items,
    }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'ai_meeting_minutes' },
)

export const createTasksFromMinutes = createSafeAction(
  MeetingMinutesSchema,
  async (input, context) => {
    if (!(await checkAiAccess(context.organizationId))) return { error: 'AI features not available' }

    const supabase = await createClient()
    const { data: meeting } = await supabase
      .from('meetings')
      .select('title')
      .eq('id', input.meetingId)
      .eq('organisation_id', context.organizationId)
      .single()

    if (!meeting) return { error: 'Meeting not found' }

    const { object } = await generateObject({
      model: nvidia(SMART_MODEL),
      schema: z.object({
        tasks: z.array(z.object({
          title: z.string(),
          description: z.string(),
          priority: z.enum(['low', 'medium', 'high']),
        })),
      }),
      prompt: `Extract actionable tasks from these meeting notes. Each task must be specific and actionable.

Notes: ${input.notes}`,
    })

    const tasks = []
    for (const task of object.tasks) {
      const { data: created, error } = await supabase.from('tasks').insert({
        organisation_id: context.organizationId,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: 'open',
        created_by: context.user.id,
        visibility_level: 'members',
      } as never).select('id').single()

      if (!error && created) tasks.push(created.id)
    }

    return { success: true, tasksCreated: tasks.length, taskIds: tasks }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'ai_tasks_from_minutes' },
)
