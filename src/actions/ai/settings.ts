'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'

const ToggleAiSchema = z.object({
  enabled: z.boolean(),
})

export async function toggleAiAssistanceAction(enabled: boolean) {
  const parsed = ToggleAiSchema.safeParse({ enabled })
  if (!parsed.success) {
    return { success: false, error: 'Invalid input' }
  }
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('organisation_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile?.organisation_id) {
      return { success: false, error: 'Organisation not found' }
    }

    const allowedRoles = ['admin', 'owner', 'super_admin', 'executive']
    if (!allowedRoles.includes(profile.role)) {
      return { success: false, error: 'Insufficient permissions to change organisation AI settings' }
    }

    const orgId = profile.organisation_id
    const adminClient = createServiceClient()

    const { data: org } = await adminClient
      .from('organisations')
      .select('capabilities')
      .eq('id', orgId)
      .maybeSingle()

    const currentCaps = (org?.capabilities as Record<string, unknown>) || {}
    const updatedCaps = {
      ...currentCaps,
      ai_assistance_enabled: enabled,
    }

    const { error: updateError } = await adminClient
      .from('organisations')
      .update({ capabilities: updatedCaps })
      .eq('id', orgId)

    if (updateError) {
      throw updateError
    }

    // Record audit log
    await adminClient.from('audit_logs').insert({
      organisation_id: orgId,
      action: enabled ? 'AI_ASSISTANCE_ENABLED' : 'AI_ASSISTANCE_DISABLED',
      resource_table: 'organisations',
      resource_id: orgId,
      details: {
        ai_assistance_enabled: enabled,
        toggled_by: user.id,
      },
      actor_id: user.id,
    })

    revalidatePath('/', 'layout')
    revalidatePath('/', 'layout')

    return {
      success: true,
      enabled,
      message: enabled
        ? 'Sangathan AI Assistance is now active.'
        : 'Sangathan AI Assistance has been disabled for this organisation.',
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update AI settings'
    return { success: false, error: message }
  }
}
