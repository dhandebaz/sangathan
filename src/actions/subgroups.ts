'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const CreateSubgroupSchema = z.object({
  organisationId: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  type: z.enum(['department', 'committee', 'chapter', 'branch', 'team']),
  parentId: z.string().uuid().optional().nullable(),
})

const UpdateSubgroupSchema = CreateSubgroupSchema.extend({
  id: z.string().uuid(),
})

export async function createSubgroup(input: z.infer<typeof CreateSubgroupSchema>) {
  try {
    const result = CreateSubgroupSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid subgroup data' }
    }

    const supabase = await createClient()

    const { error } = await supabase.from('org_subgroups').insert({
      organisation_id: result.data.organisationId,
      name: result.data.name,
      description: result.data.description,
      type: result.data.type,
      parent_id: result.data.parentId || null,
    } as never)

    if (error) {
      console.error('Create Subgroup Error:', error)
      return { success: false, error: error.message || 'Failed to create subgroup' }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Create Subgroup Exception:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create subgroup' }
  }
}

export async function updateSubgroup(input: z.infer<typeof UpdateSubgroupSchema>) {
  try {
    const result = UpdateSubgroupSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid subgroup data' }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('org_subgroups')
      .update({
        name: result.data.name,
        description: result.data.description,
        type: result.data.type,
        parent_id: result.data.parentId || null,
      })
      .eq('id', result.data.id)
      .eq('organisation_id', result.data.organisationId)

    if (error) {
      console.error('Update Subgroup Error:', error)
      return { success: false, error: error.message || 'Failed to update subgroup' }
    }

    revalidatePath('/', 'layout')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Update Subgroup Exception:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update subgroup' }
  }
}

export async function deleteSubgroup(subgroupId: string, organisationId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('org_subgroups')
      .delete()
      .eq('id', subgroupId)
      .eq('organisation_id', organisationId)

    if (error) {
      console.error('Delete Subgroup Error:', error)
      return { success: false, error: error.message || 'Failed to delete subgroup' }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Delete Subgroup Exception:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete subgroup' }
  }
}

export async function getSubgroups(organisationId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('org_subgroups')
      .select(`
        id, name, description, type, parent_id, created_at,
        org_subgroup_members (count)
      `)
      .eq('organisation_id', organisationId)
      .order('name')

    if (error) {
      console.error('Fetch Subgroups Error:', error)
      return { success: false, error: error.message || 'Failed to fetch subgroups', data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Fetch Subgroups Exception:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch subgroups', data: [] }
  }
}

export async function getSubgroup(subgroupId: string, organisationId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('org_subgroups')
      .select(`
        *,
        org_subgroup_members (
          profile_id,
          role,
          joined_at,
          profiles (
            full_name,
            email
          )
        )
      `)
      .eq('id', subgroupId)
      .eq('organisation_id', organisationId)
      .maybeSingle()

    if (error) {
      console.error('Fetch Subgroup Error:', error)
      return { success: false, error: error.message || 'Failed to fetch subgroup' }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Fetch Subgroup Exception:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch subgroup' }
  }
}

export async function addSubgroupMember(subgroupId: string, profileId: string, role: string = 'member') {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('org_subgroup_members').insert({
      subgroup_id: subgroupId,
      profile_id: profileId,
      role
    } as never)

    if (error) {
      console.error('Add Member Error:', error)
      return { success: false, error: error.message || 'Failed to add member to subgroup' }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Add Subgroup Member Exception:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add member to subgroup' }
  }
}

export async function updateSubgroupMemberRole(subgroupId: string, profileId: string, role: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('org_subgroup_members')
      .update({ role })
      .eq('subgroup_id', subgroupId)
      .eq('profile_id', profileId)

    if (error) {
      console.error('Update Member Role Error:', error)
      return { success: false, error: error.message || 'Failed to update member role' }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Update Member Role Exception:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update member role' }
  }
}

export async function removeSubgroupMember(subgroupId: string, profileId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('org_subgroup_members')
      .delete()
      .eq('subgroup_id', subgroupId)
      .eq('profile_id', profileId)

    if (error) {
      console.error('Remove Member Error:', error)
      return { success: false, error: error.message || 'Failed to remove member from subgroup' }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Remove Member Exception:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove member from subgroup' }
  }
}

