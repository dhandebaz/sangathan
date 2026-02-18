import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MembershipContext, Role, UserContext } from '@/types/auth'

const ORG_COOKIE_NAME = 'sangathan_org_id'

export async function getUserMemberships(userId: string): Promise<MembershipContext[]> {
  const supabase = await createClient()

  const {
    data: membershipRows,
    error: membershipError,
  } = await (supabase as unknown as {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (column: string, value: string) => Promise<{
          data: unknown
          error: { message?: string } | null
        }>
      }
    }
  })
    .from('members')
    .select('id, organisation_id, role, status, deleted_at, user_id')
    .eq('user_id', userId)

  if (membershipError) {
    throw new Error('Unauthorized: Failed to load memberships')
  }

  const memberships: MembershipContext[] = ((membershipRows || []) as {
    id: string
    organisation_id: string
    role: string
    status: MembershipContext['status']
    deleted_at: string | null
  }[])
    .filter((m) => !m.deleted_at)
    .map((m) => ({
      id: m.id,
      organisationId: m.organisation_id,
      role: m.role as Role,
      status: m.status,
    }))

  return memberships
}

export async function getMembershipForOrg(userId: string, organisationId: string): Promise<MembershipContext> {
  if (!organisationId) {
    throw new Error('Unauthorized: Missing organisation')
  }

  const memberships = await getUserMemberships(userId)

  const membership = memberships.find(
    (m) => m.organisationId === organisationId && m.status === 'active',
  )

  if (!membership) {
    throw new Error('Unauthorized: No active membership for this organisation')
  }

  return membership
}

export async function getSelectedOrganisationId(): Promise<string> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(ORG_COOKIE_NAME)
  if (cookie?.value) {
    return cookie.value
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user || !user.id) {
    throw new Error('Unauthorized: No valid session')
  }

  const memberships = await getUserMemberships(user.id)
  const activeMemberships = memberships.filter((m) => m.status === 'active')

  if (activeMemberships.length === 1) {
    const organisationId = activeMemberships[0].organisationId
    redirect(`/bootstrap-org?org=${encodeURIComponent(organisationId)}`)
  }

  if (activeMemberships.length === 0) {
    redirect('/onboarding')
  }

  redirect('/select-organisation')
}

export async function setSelectedOrganisationId(organisationId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(ORG_COOKIE_NAME, organisationId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
}

export async function clearSelectedOrganisationId(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ORG_COOKIE_NAME)
}

export async function getUserContext(organisationId: string): Promise<UserContext> {
  if (!organisationId) {
    throw new Error('Unauthorized: Missing organisation')
  }

  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user || !user.email) {
    throw new Error('Unauthorized: No valid session')
  }

  const memberships = await getUserMemberships(user.id)

  const activeMembership = memberships.find(
    (m) => m.organisationId === organisationId && m.status === 'active',
  )

  if (!activeMembership) {
    throw new Error('Unauthorized: No active membership for this organisation')
  }

  const role = activeMembership.role

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    organizationId: activeMembership.organisationId,
    role,
    memberships,
  }
}

/**
 * Requires the user to have one of the specified roles.
 * Returns the context if valid, otherwise throws.
 */
export async function requireRole(allowedRoles: Role[]): Promise<UserContext> {
  const organisationId = await getSelectedOrganisationId()
  const context = await getUserContext(organisationId)

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
