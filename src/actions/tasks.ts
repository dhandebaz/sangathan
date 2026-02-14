'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// --- Schemas ---

export const TaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 chars"),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  visibility_level: z.enum(['members', 'volunteer', 'core', 'executive']),
  due_date: z.string().datetime().optional().nullable(),
})

export const CreateTaskSchema = TaskSchema.extend({
  organisation_id: z.string().uuid(),
  assignee_ids: z.array(z.string().uuid()).optional(),
})

export const UpdateTaskSchema = TaskSchema.partial().extend({
  id: z.string().uuid(),
  status: z.enum(['open', 'in_progress', 'completed', 'archived']).optional(),
})

export const LogHoursSchema = z.object({
  task_id: z.string().uuid(),
  hours: z.number().min(0.1),
  note: z.string().optional(),
})

// --- Actions ---

export async function createTask(input: z.infer<typeof CreateTaskSchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    // Check permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .single() as { data: { role: string; organisation_id: string } | null, error: { message: string } | null }

    if (!profile || profile.organisation_id !== input.organisation_id || !['admin', 'editor'].includes(profile.role)) {
      return { success: false, error: 'Permission denied' }
    }

    // Create Task
    const { data: task, error } = await (supabase
      .from('tasks') as any)
      .insert({
        organisation_id: input.organisation_id,
        title: input.title,
        description: input.description,
        priority: input.priority,
        visibility_level: input.visibility_level,
        due_date: input.due_date,
        created_by: user.id,
        status: 'open'
      })
      .select()
      .single()

    if (error) throw error

    // Create Assignments
    if (input.assignee_ids && input.assignee_ids.length > 0 && task) {
      const assignments = input.assignee_ids.map(id => ({
        task_id: task.id,
        member_id: id,
        assigned_at: new Date().toISOString()
      }))
      
      const { error: assignError } = await (supabase
        .from('task_assignments') as any)
        .insert(assignments)
      
      if (assignError) console.error('Assignment Error:', assignError)
    }

    revalidatePath('/dashboard/tasks')
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: errorMessage }
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  try {
    const supabase = await createClient()
    const { error } = await (supabase
      .from('tasks') as any)
      .update({ status })
      .eq('id', taskId)

    if (error) throw error
    revalidatePath('/dashboard/tasks')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function logHours(input: z.infer<typeof LogHoursSchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    // Log Hours
    const { error } = await (supabase
      .from('task_logs') as any)
      .insert({
        task_id: input.task_id,
        member_id: user.id,
        hours_logged: input.hours,
        note: input.note
      })

    if (error) throw error

    // Update Score (Simplified: +1 per hour)
    // We use a database function or trigger ideally, but here manual update
    const supabaseAdmin = createServiceClient()
    
    // Fetch current score
    const { data: profile } = await (supabaseAdmin
      .from('profiles') as any)
      .select('engagement_score')
      .eq('id', user.id)
      .single() as { data: { engagement_score: number | null } | null }
      
    if (profile) {
      await (supabaseAdmin
        .from('profiles') as any)
        .update({ engagement_score: (profile.engagement_score || 0) + Math.ceil(input.hours) })
        .eq('id', user.id)
    }

    revalidatePath('/dashboard/tasks')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function acceptAssignment(taskId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false }

    const { error } = await (supabase
      .from('task_assignments') as any)
      .update({ accepted: true })
      .eq('task_id', taskId)
      .eq('member_id', user.id)

    if (error) throw error
    revalidatePath('/dashboard/tasks')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}
