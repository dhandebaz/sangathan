import { createServiceClient } from '@/lib/supabase/service'
import type { Json } from '@/types/database'
import { hasPermission, canAssignRole, getAssignableRoles, isSystemRole, getSystemRolePermissions } from './capabilities'

/**
 * Permission checking utilities for RBAC
 */

// Check if user has a specific permission in their organisation
export async function checkUserPermission(
  orgId: string,
  userId: string,
  permission: string
): Promise<boolean> {
  const supabase = createServiceClient()
  
  // Get user's roles in the organisation
  const { data: profileRoles } = await supabase
    .from('profile_roles')
    .select('role_id, org_roles:org_roles(name, permissions, is_system)')
    .eq('profile_id', userId)
    .eq('organisation_id', orgId)
  
  if (!profileRoles || profileRoles.length === 0) {
    // Fallback to profile.role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .eq('organisation_id', orgId)
      .single()
    
    if (profile?.role) {
      return hasPermission(profile.role, permission)
    }
    return false
  }
  
  // Check each role for the permission
  for (const pr of profileRoles) {
    const role = Array.isArray(pr.org_roles) ? pr.org_roles[0] : pr.org_roles
    if (role && role.permissions && (role.permissions as Record<string, boolean>)[permission] === true) {
      return true
    }
    // Check system roles
    if (role && role.name && hasPermission(role.name, permission)) {
      return true
    }
  }
  
  return false
}

// Check if user can assign a target role
export async function checkCanAssignRole(
  orgId: string,
  actorId: string,
  targetRole: string
): Promise<boolean> {
  const supabase = createServiceClient()
  
  // Get actor's highest role
  const { data: profileRoles } = await supabase
    .from('profile_roles')
    .select('role_id, org_roles:org_roles(name, permissions, is_system)')
    .eq('profile_id', actorId)
    .eq('organisation_id', orgId)
  
  let actorRole = 'member'
  if (profileRoles && profileRoles.length > 0) {
    // Get highest level role
    for (const pr of profileRoles) {
      const role = Array.isArray(pr.org_roles) ? pr.org_roles[0] : pr.org_roles
      if (role?.name) {
        actorRole = role.name
        break
      }
    }
  } else {
    // Fallback to profile.role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', actorId)
      .eq('organisation_id', orgId)
      .single()
    if (profile?.role) actorRole = profile.role
  }
  
  return canAssignRole(actorRole, targetRole)
}

// Get user's effective permissions
export async function getUserPermissions(
  orgId: string,
  userId: string
): Promise<Record<string, boolean>> {
  const supabase = createServiceClient()
  
  const { data: profileRoles } = await supabase
    .from('profile_roles')
    .select('role_id, org_roles:org_roles(name, permissions, is_system)')
    .eq('profile_id', userId)
    .eq('organisation_id', orgId)
  
  const allPermissions: Record<string, boolean> = {}
  
  if (profileRoles && profileRoles.length > 0) {
    for (const pr of profileRoles) {
      const role = Array.isArray(pr.org_roles) ? pr.org_roles[0] : pr.org_roles
      if (role && role.permissions) {
        Object.assign(allPermissions, role.permissions)
      }
      if (role && role.name && isSystemRole(role.name)) {
        Object.assign(allPermissions, getSystemRolePermissions(role.name))
      }
    }
  } else {
    // Fallback to profile.role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .eq('organisation_id', orgId)
      .single()
    
    if (profile?.role) {
      Object.assign(allPermissions, getSystemRolePermissions(profile.role))
    }
  }
  
  return allPermissions
}

// Get assignable roles for a user
export async function getAssignableRolesForUser(
  orgId: string,
  actorId: string
): Promise<string[]> {
  const supabase = createServiceClient()
  
  // Get org plan
  const { data: org } = await supabase
    .from('organisations')
    .select('plan_name')
    .eq('id', orgId)
    .single()
  
  const planName = org?.plan_name || 'Community'
  
  // Get actor's role
  const { data: profileRoles } = await supabase
    .from('profile_roles')
    .select('role_id, org_roles:org_roles(name)')
    .eq('profile_id', actorId)
    .eq('organisation_id', orgId)
  
  let actorRole = 'member'
  if (profileRoles && profileRoles.length > 0) {
    const role = Array.isArray(profileRoles[0].org_roles) ? profileRoles[0].org_roles[0] : profileRoles[0].org_roles
    actorRole = role?.name || 'member'
  } else {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', actorId)
      .eq('organisation_id', orgId)
      .single()
    if (profile?.role) actorRole = profile.role
  }
  
  return getAssignableRoles(actorRole, planName)
}

// Check if user is primary admin
export async function isPrimaryAdmin(
  orgId: string,
  userId: string
): Promise<boolean> {
  const supabase = createServiceClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_primary_admin')
    .eq('id', userId)
    .eq('organisation_id', orgId)
    .single()
  
  return profile?.is_primary_admin === true
}