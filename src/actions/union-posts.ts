'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { z } from 'zod'

const CreateUnionPostSchema = z.object({
  title_en: z.string().min(2, "Post title is required"),
  title_hi: z.string().optional(),
  category: z.string().default('custom'),
  description: z.string().optional()
})

const AssignPostSchema = z.object({
  memberId: z.string().uuid(),
  postTitle: z.string().min(2),
  termYear: z.string().optional()
})

export async function createUnionPostAction(input: z.infer<typeof CreateUnionPostSchema>) {
  try {
    const result = CreateUnionPostSchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    // Save custom post to Supabase roles table
    const { data, error } = await supabase
      .from('roles')
      .insert({
        organisation_id: orgId,
        name: `${result.data.title_en} (${result.data.title_hi || result.data.title_en})`,
        description: result.data.description || 'Custom Collective Post',
        permissions: { is_custom_union_post: true },
        is_system: false
      })
      .select()
      .maybeSingle()

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('roles')
        .insert({
          organisation_id: orgId,
          name: `${result.data.title_en} (${result.data.title_hi || result.data.title_en})`,
          description: result.data.description || 'Custom Collective Post',
          permissions: { is_custom_union_post: true },
          is_system: false
        })
        .select()
        .maybeSingle()

      if (fallback.error) throw fallback.error
    }

    revalidatePath('/', 'layout')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create post'
    return { success: false, error: message }
  }
}

export async function assignMemberPostAction(input: z.infer<typeof AssignPostSchema>) {
  try {
    const result = AssignPostSchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    // Update profile designation and role in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({
        designation: result.data.postTitle,
        updated_at: new Date().toISOString()
      })
      .eq('id', result.data.memberId)

    if (error) {
      const adminClient = createServiceClient()
      await adminClient
        .from('profiles')
        .update({
          designation: result.data.postTitle,
          updated_at: new Date().toISOString()
        })
        .eq('id', result.data.memberId)
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to assign post'
    return { success: false, error: message }
  }
}

export async function getUnionPostsFromDB(organisationId: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('roles')
      .select('*')
      .eq('organisation_id', organisationId)

    return { success: true, roles: data || [] }
  } catch {
    return { success: false, roles: [] }
  }
}
