'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit/log'

// --- Schemas ---

export const CreateCampaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  goal_description: z.string().min(10, "Goal description must be at least 10 characters"),
})

export const UpdateCampaignStatusSchema = z.object({
  campaignId: z.string().uuid("Invalid campaign ID"),
  status: z.enum(['draft', 'active', 'completed']),
})

export const DeleteCampaignSchema = z.object({
  campaignId: z.string().uuid("Invalid campaign ID"),
})

// --- Actions ---

export const createCampaign = createSafeAction(
  CreateCampaignSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        organisation_id: context.organizationId,
        created_by: context.user.id,
        title: input.title,
        goal_description: input.goal_description,
        status: 'draft',
      })
      .select('id')
      .single()

    if (error || !data) {
      return { error: error?.message || 'Failed to create campaign' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'CAMPAIGN_CREATED',
      resource_table: 'campaigns',
      resource_id: data.id,
      details: { title: input.title }
    })

    revalidatePath('/dashboard/campaigns')

    return { success: true, campaignId: data.id }
  },
  { actionName: 'createCampaign' }
)

export const updateCampaignStatus = createSafeAction(
  UpdateCampaignStatusSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('campaigns')
      .update({ status: input.status })
      .eq('id', input.campaignId)
      .eq('organisation_id', context.organizationId)

    if (error) {
      return { error: error.message }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'CAMPAIGN_STATUS_UPDATED',
      resource_table: 'campaigns',
      resource_id: input.campaignId,
      details: { status: input.status }
    })

    revalidatePath('/dashboard/campaigns')

    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'updateCampaignStatus' }
)

export const deleteCampaign = createSafeAction(
  DeleteCampaignSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', input.campaignId)
      .eq('organisation_id', context.organizationId)

    if (error) {
      return { error: error.message }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'CAMPAIGN_DELETED',
      resource_table: 'campaigns',
      resource_id: input.campaignId
    })

    revalidatePath('/dashboard/campaigns')

    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'deleteCampaign' }
)
