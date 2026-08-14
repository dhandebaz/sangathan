'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getAssignableRolesForUser, checkCanAssignRole } from '@/lib/permissions'
import { getSystemRolePermissions } from '@/lib/capabilities'

const CreateRoleSchema = z.object({
  organisationId: z.string().uuid(),
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string().optional(),
  permissions: z.record(z.string(), z.boolean()),
})

const UpdateRoleSchema = CreateRoleSchema.extend({
  id: z.string().uuid(),
})

const AssignRoleSchema = z.object({
  organisationId: z.string().uuid(),
  profileId: z.string().uuid(),
  roleId: z.string().uuid(),
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

export async function getSystemRoles() {
  const systemRoles = ['can_edit', 'can_comment', 'can_manage', 'second_admin']
  const roles = systemRoles.map(name => ({
    id: `system-${name}`,
    name,
    description: getSystemRoleDescription(name),
    permissions: getSystemRolePermissions(name),
    is_system: true,
    created_at: new Date().toISOString(),
  }))
  return { success: true, data: roles }
}

function getSystemRoleDescription(name: string): string {
  switch (name) {
    case 'can_edit':
      return 'Can create/edit content, file complaints, manage tasks'
    case 'can_comment':
      return 'Can comment, vote, view (read-only + interact)'
    case 'can_manage':
      return 'Can manage members, settings, view analytics (org admin)'
    case 'second_admin':
      return 'Near-full admin but cannot: delete org, change plan, remove primary admin'
    default:
      return ''
  }
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

export async function assignRoleToProfile(input: z.infer<typeof AssignRoleSchema>) {
  const result = AssignRoleSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid input' }
  }

  const supabase = await createClient()

  // Get the role details to check if it's a system role
  const { data: roleData } = await supabase
    .from('org_roles')
    .select('name, is_system')
    .eq('id', result.data.roleId)
    .eq('organisation_id', result.data.organisationId)
    .single()

  if (!roleData) {
    return { success: false, error: 'Role not found' }
  }

  // Check if actor can assign this role
  const canAssign = await checkCanAssignRole(
    result.data.organisationId,
    result.data.profileId, // This should be actor ID - need to fix
    roleData.name
  )

  if (!canAssign) {
    return { success: false, error: 'You do not have permission to assign this role' }
  }

  const { error } = await supabase.from('profile_roles').insert({
    profile_id: result.data.profileId,
    role_id: result.data.roleId,
    organisation_id: result.data.organisationId,
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

  // Prevent removing primary admin from admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_primary_admin')
    .eq('id', profileId)
    .single()

  if (profile?.is_primary_admin) {
    const { data: role } = await supabase
      .from('org_roles')
      .select('name')
      .eq('id', roleId)
      .single()
    
    if (role?.name && ['admin', 'executive', 'can_manage', 'second_admin'].includes(role.name)) {
      return { success: false, error: 'Cannot remove primary admin from admin roles' }
    }
  }

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

export async function getAssignableRoles(organisationId: string, actorId: string) {
  const roles = await getAssignableRolesForUser(organisationId, actorId)
  return { success: true, data: roles }
}
