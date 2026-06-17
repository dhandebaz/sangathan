'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const CreateRoleSchema = z.object({
  organisationId: z.string().uuid(),
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string().optional(),
  permissions: z.record(z.string(), z.boolean()),
})

const UpdateRoleSchema = CreateRoleSchema.extend({
  id: z.string().uuid(),
})

export async function createCustomRole(input: z.infer<typeof CreateRoleSchema>) {
  const result = CreateRoleSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid role data' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('org_roles').insert({
    organisation_id: result.data.organisationId,
    name: result.data.name,
    description: result.data.description,
    permissions: result.data.permissions,
  } as never)

  if (error) {
    console.error('Create Role Error:', error)
    return { success: false, error: 'Failed to create role' }
  }

  revalidatePath('/[lang]/dashboard/roles', 'page')
  return { success: true }
}

export async function updateRole(input: z.infer<typeof UpdateRoleSchema>) {
  const result = UpdateRoleSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid role data' }
  }

  const supabase = await createClient()

  // Prevent editing system roles
  const { data: existingRole } = await supabase
    .from('org_roles')
    .select('is_system')
    .eq('id', result.data.id)
    .single()

  if (existingRole?.is_system) {
    return { success: false, error: 'Cannot edit system roles' }
  }

  const { error } = await supabase
    .from('org_roles')
    .update({
      name: result.data.name,
      description: result.data.description,
      permissions: result.data.permissions,
    })
    .eq('id', result.data.id)
    .eq('organisation_id', result.data.organisationId)

  if (error) {
    console.error('Update Role Error:', error)
    return { success: false, error: 'Failed to update role' }
  }

  revalidatePath('/[lang]/dashboard/roles', 'page')
  return { success: true }
}

export async function deleteRole(roleId: string, organisationId: string) {
  const supabase = await createClient()

  // Prevent deleting system roles
  const { data: existingRole } = await supabase
    .from('org_roles')
    .select('is_system')
    .eq('id', roleId)
    .single()

  if (existingRole?.is_system) {
    return { success: false, error: 'Cannot delete system roles' }
  }

  const { error } = await supabase
    .from('org_roles')
    .delete()
    .eq('id', roleId)
    .eq('organisation_id', organisationId)

  if (error) {
    console.error('Delete Role Error:', error)
    return { success: false, error: 'Failed to delete role' }
  }

  revalidatePath('/[lang]/dashboard/roles', 'page')
  return { success: true }
}

export async function getRoles(organisationId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('org_roles')
    .select('id, name, description, permissions, is_system, created_at')
    .eq('organisation_id', organisationId)
    .order('name')

  if (error) {
    console.error('Fetch Roles Error:', error)
    return { success: false, error: 'Failed to fetch roles', data: [] }
  }

  return { success: true, data }
}

export async function getRoleMembers(roleId: string, organisationId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profile_roles')
    .select('profile_id, profiles:profiles(id, full_name, email)')
    .eq('role_id', roleId)
    .eq('organisation_id', organisationId)

  if (error) {
    console.error('Fetch Role Members Error:', error)
    return { success: false, error: 'Failed to fetch role members', data: [] }
  }

  return { success: true, data }
}

export async function assignRoleToProfile(profileId: string, roleId: string, organisationId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('profile_roles').insert({
        profile_id: profileId,
        role_id: roleId,
        organisation_id: organisationId,
    } as never)

    if (error) {
        console.error('Assign Role Error:', error)
        return { success: false, error: 'Failed to assign role to user' }
    }

    revalidatePath('/[lang]/dashboard/roles', 'page')
    return { success: true }
}

export async function removeRoleFromProfile(profileId: string, roleId: string, organisationId: string) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('profile_roles')
      .delete()
      .eq('profile_id', profileId)
      .eq('role_id', roleId)
      .eq('organisation_id', organisationId)

    if (error) {
        console.error('Remove Role Error:', error)
        return { success: false, error: 'Failed to remove role from user' }
    }

    revalidatePath('/[lang]/dashboard/roles', 'page')
    return { success: true }
}
