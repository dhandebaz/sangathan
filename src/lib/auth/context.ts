import { createClient } from '@/lib/supabase/server'
import { Role, UserContext } from '@/types/auth'

/**
 * Retrieves the current authenticated user context, including organization and role.
 * This function is the single source of truth for authorization.
 *
 * @throws {Error} If user is not authenticated or lacks a profile/organization.
 */
export async function getUserContext(): Promise<UserContext> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user || !user.email) {
    // In server actions, we should throw or redirect.
    // Throwing allows the caller to catch and return a proper error object.
    throw new Error('Unauthorized: No valid session')
  }

  // Fetch Profile with Organization ID and Role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('organisation_id, role, full_name')
    .eq('id', user.id)
    .single()

  if (profileError || !profile || !profile.organisation_id) {
    // Edge case: User is authenticated but has no profile.
    // This could happen if signup failed halfway or data was corrupted.
    // We treat this as an unauthorized state for business logic.
    console.error('Profile fetch error:', profileError)
    throw new Error('Unauthorized: User has no profile or organization linked')
  }

  // Ensure role is a valid Role type
  const role = profile.role as Role
  if (!['admin', 'editor', 'viewer'].includes(role)) {
     throw new Error('Unauthorized: Invalid role detected')
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    organizationId: profile.organisation_id,
    role: role,
  }
}

/**
 * Requires the user to have one of the specified roles.
 * Returns the context if valid, otherwise throws.
 */
export async function requireRole(allowedRoles: Role[]): Promise<UserContext> {
  const context = await getUserContext()

  if (!allowedRoles.includes(context.role)) {
    throw new Error(`Forbidden: User role '${context.role}' is not authorized`)
  }

  return context
}

/**
 * Helper to ensure the user belongs to a specific organization (optional extra check).
 * In our architecture, the context *derives* the org ID, so this is implicitly handled,
 * but this can be used if we ever need to validate against a specific resource's org_id.
 */
export function validateOrganization(context: UserContext, resourceOrgId: string) {
  if (context.organizationId !== resourceOrgId) {
    throw new Error('Forbidden: Cross-organization access attempt detected')
  }
}
