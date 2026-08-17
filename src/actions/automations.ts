'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { AutomationRule, PREBUILT_AUTOMATION_RECIPES } from '@/lib/automations/engine'
import { z } from 'zod'

const CreateAutomationSchema = z.object({
  name: z.string().min(3, 'Name required'),
  description: z.string().optional(),
  triggerEvent: z.enum([
    'member_joined',
    'donation_received',
    'grievance_filed',
    'emergency_sos_triggered',
    'petition_signed',
    'event_rsvp_submitted',
  ]),
  conditions: z.array(z.any()).default([]),
  actions: z.array(z.any()).default([]),
})

export async function createAutomationAction(input: z.infer<typeof CreateAutomationSchema>) {
  try {
    const validated = CreateAutomationSchema.parse(input)
    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('workflow_automations')
      .insert({
        organisation_id: orgId,
        name: validated.name,
        description: validated.description || '',
        trigger_event: validated.triggerEvent,
        conditions: validated.conditions,
        actions: validated.actions,
        is_active: true,
        created_by: user.id,
      })
      .select()
      .maybeSingle()

    if (error) throw error

    revalidatePath('/[lang]/dashboard/automations', 'page')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create automation rule'
    return { success: false, error: message }
  }
}

export async function toggleAutomationAction(automationId: string, isActive: boolean) {
  try {
    const adminClient = createServiceClient()
    const { error } = await adminClient
      .from('workflow_automations')
      .update({ is_active: isActive })
      .eq('id', automationId)

    if (error) throw error
    revalidatePath('/[lang]/dashboard/automations', 'page')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to toggle automation'
    return { success: false, error: message }
  }
}

export async function deleteAutomationAction(automationId: string) {
  try {
    const adminClient = createServiceClient()
    const { error } = await adminClient
      .from('workflow_automations')
      .delete()
      .eq('id', automationId)

    if (error) throw error
    revalidatePath('/[lang]/dashboard/automations', 'page')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete automation'
    return { success: false, error: message }
  }
}

export async function installPrebuiltRecipeAction(recipeIndex: number) {
  try {
    const recipe = PREBUILT_AUTOMATION_RECIPES[recipeIndex]
    if (!recipe) return { success: false, error: 'Recipe not found' }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('workflow_automations')
      .insert({
        organisation_id: orgId,
        name: recipe.name,
        description: recipe.description,
        trigger_event: recipe.triggerEvent,
        conditions: recipe.conditions,
        actions: recipe.actions,
        is_active: true,
      })
      .select()
      .maybeSingle()

    if (error) throw error
    revalidatePath('/[lang]/dashboard/automations', 'page')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to install recipe'
    return { success: false, error: message }
  }
}

export async function getAutomationsAction(orgId: string) {
  try {
    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('workflow_automations')
      .select('*')
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch automations'
    return { success: false, error: message }
  }
}
