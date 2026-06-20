'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const TaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 chars'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  visibility_level: z.enum(['members', 'volunteer', 'core', 'executive']).optional(),
  due_date: z.string().datetime().optional().nullable(),
})

const CreateTaskSchema = TaskSchema.extend({
  assignee_ids: z.array(z.string().uuid()).optional(),
})

const UpdateTaskSchema = TaskSchema.extend({
  id: z.string().uuid(),
})

const UpdateStatusSchema = z.object({
  taskId: z.string().uuid(),
  status: z.string(),
})

const LogHoursSchema = z.object({
  task_id: z.string().uuid(),
  hours: z.number().min(0.1),
  note: z.string().optional(),
})

const AcceptSchema = z.object({
  taskId: z.string().uuid(),
})

export const createTask = createSafeAction(
  CreateTaskSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        organisation_id: context.organizationId,
        title: input.title,
        description: input.description,
        priority: input.priority,
        visibility_level: input.visibility_level,
        due_date: input.due_date,
        created_by: context.user.id,
        status: 'open',
      } as never)
      .select()
      .single()

    if (error) return { error: error.message }

    if (input.assignee_ids?.length && task) {
      const assignments = input.assignee_ids.map((id) => ({
        task_id: task.id,
        member_id: id,
        assigned_by: context.user.id,
        assigned_at: new Date().toISOString(),
      }))

      const { error: assignError } = await supabase
        .from('task_assignments')
        .insert(assignments as never)

      if (assignError) console.error('Assignment Error:', assignError)
    }

    await context.logAction({
      action: 'TASK_CREATED',
      resourceTable: 'tasks',
      resourceId: task.id,
      details: { title: input.title },
    })

    revalidatePath('/', 'layout')
    return { success: true, taskId: task.id }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'create_task' },
)

export const updateTask = createSafeAction(
  UpdateTaskSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('tasks')
      .update({
        title: input.title,
        description: input.description,
        priority: input.priority,
        visibility_level: input.visibility_level,
        due_date: input.due_date,
      } as never)
      .eq('id', input.id)
      .eq('organisation_id', context.organizationId)

    if (error) return { error: error.message }

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'update_task' },
)

export const updateTaskStatus = createSafeAction(
  UpdateStatusSchema,
  async (input, context) => {
    const supabase = await createClient()
    const { data: task } = await supabase
      .from('tasks')
      .select('id, task_assignments(member_id), organisation_id')
      .eq('id', input.taskId)
      .single() as { data: { id: string; task_assignments: { member_id: string }[] | null; organisation_id: string } | null }

    if (!task) return { error: 'Task not found' }
    if (task.organisation_id !== context.organizationId) return { error: 'Permission denied' }

    const isAssignee = task.task_assignments?.some((a) => a.member_id === context.user.id)
    const isAdmin = ['admin', 'executive', 'editor'].includes(context.role)

    if (!isAdmin && !isAssignee) {
      return { error: 'Permission denied' }
    }

    const supabaseAdmin = createServiceClient()
    const { error } = await supabaseAdmin
      .from('tasks')
      .update({ status: input.status } as never)
      .eq('id', input.taskId)

    if (error) return { error: error.message }

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { actionName: 'update_task_status' },
)

export const logHours = createSafeAction(
  LogHoursSchema,
  async (input, context) => {
    const supabaseAdmin = createServiceClient()

    const { error } = await supabaseAdmin
      .from('task_logs')
      .insert({
        task_id: input.task_id,
        member_id: context.user.id,
        hours: input.hours,
        note: input.note,
      } as never)

    if (error) return { error: error.message }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('engagement_score')
      .eq('id', context.user.id)
      .single() as { data: { engagement_score: number | null } | null }

    if (profile) {
      await supabaseAdmin
        .from('profiles')
        .update({ engagement_score: (profile.engagement_score || 0) + Math.ceil(input.hours) })
        .eq('id', context.user.id)
    }

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { actionName: 'log_hours' },
)

export const acceptAssignment = createSafeAction(
  AcceptSchema,
  async (input, context) => {
    const supabase = await createClient()
    const { error } = await supabase
      .from('task_assignments')
      .update({ accepted: true })
      .eq('task_id', input.taskId)
      .eq('member_id', context.user.id)

    if (error) return { error: error.message }

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { actionName: 'accept_assignment' },
)
