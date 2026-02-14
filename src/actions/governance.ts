'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const AppealSchema = z.object({
  reason: z.string().min(10, "Reason must be detailed"),
  supporting_docs_url: z.string().url().optional().or(z.literal('')),
})

export async function submitAppeal(orgId: string, input: z.infer<typeof AppealSchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    // Check permissions
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, organization_id')
      .eq('id', user.id)
      .single() as { data: { role: string; organization_id: string } | null, error: { message: string } | null }

    const profile = profileData

    if (!profile || profile.organization_id !== orgId || !['admin', 'executive'].includes(profile.role)) {
      return { success: false, error: 'Permission denied' }
    }

    // Check existing pending appeal
    const { data: existing } = await supabase
      .from('appeals')
      .select('id')
      .eq('organisation_id', orgId)
      .in('status', ['pending', 'under_review'])
      .single()

    if (existing) return { success: false, error: 'An appeal is already pending.' }

    const { error } = await supabase
      .from('appeals')
      .insert({
        organisation_id: orgId,
        reason: input.reason,
        supporting_docs_url: input.supporting_docs_url || null,
        created_by: user.id
      })

    if (error) throw error

    revalidatePath('/dashboard/appeals')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return { success: false, error: message }
  }
}
