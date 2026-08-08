'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createSafeAction } from '@/lib/auth/actions'
import { checkAiAccess } from '@/lib/ai/nvidia'
import { generateResilientCompletion, generateStructuredCompletion } from '@/lib/ai/resilient-router'

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

    const minutesResult = await generateStructuredCompletion({
      prompt: `Generate structured meeting minutes from these notes.

Meeting title: ${meeting.title}
Date: ${meeting.date}
Notes: ${input.notes}

Extract: summary, key discussion points, decisions made, action items with priority, and next steps.`,
      maxTokens: 2_500,
    }, MinutesSchema)
    const minutes = minutesResult.object

    const formattedResult = await generateResilientCompletion({
      messages: [{ role: 'user', content: `Format the following meeting minutes as a clean markdown document with proper headings.

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
${minutes.next_steps.map(n => `- ${n}`).join('\n')}` }],
      maxTokens: 2_500,
    })
    const formattedMinutes = formattedResult.text

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
      model_used: formattedResult.providerUsed,
    } as never)

    if (storeError) return { error: storeError.message }

    return {
      success: true,
      minutes: formattedMinutes,
      action_items: minutes.action_items,
      providerUsed: formattedResult.providerUsed,
      latencyMs: minutesResult.latencyMs + formattedResult.latencyMs,
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

    const taskSchema = z.object({
        tasks: z.array(z.object({
          title: z.string(),
          description: z.string(),
          priority: z.enum(['low', 'medium', 'high']),
        })),
      })
    const taskResult = await generateStructuredCompletion({
      prompt: `Extract actionable tasks from these meeting notes. Each task must be specific and actionable.

Notes: ${input.notes}`,
      maxTokens: 2_000,
    }, taskSchema)
    const object = taskResult.object

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

    return { success: true, tasksCreated: tasks.length, taskIds: tasks, providerUsed: taskResult.providerUsed, latencyMs: taskResult.latencyMs }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'ai_tasks_from_minutes' },
)
