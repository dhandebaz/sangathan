'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createGrantSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  status: z.enum(['draft', 'submitted', 'awarded', 'rejected']),
  deadline: z.string().optional(),
})

export const createGrant = createSafeAction(
  'create_grant',
  createGrantSchema,
  async (data, { supabase, organisationId, profileId }) => {
    const { error } = await supabase
      .from('grants')
      .insert({
        organisation_id: organisationId,
        title: data.title,
        amount: data.amount,
        status: data.status,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        created_by: profileId
      })

    if (error) throw new Error(error.message)
    revalidatePath('/[lang]/dashboard/grants', 'page')
    return { success: true }
  }
)

const updateGrantStatusSchema = z.object({
  grant_id: z.string().uuid(),
  status: z.enum(['draft', 'submitted', 'awarded', 'rejected'])
})

export const updateGrantStatus = createSafeAction(
  'update_grant_status',
  updateGrantStatusSchema,
  async (data, { supabase, organisationId }) => {
    const { error } = await supabase
      .from('grants')
      .update({ status: data.status })
      .eq('id', data.grant_id)
      .eq('organisation_id', organisationId)

    if (error) throw new Error(error.message)
    revalidatePath('/[lang]/dashboard/grants', 'page')
    return { success: true }
  }
)
