'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit/log'
import { checkMemberLimit } from '@/lib/plans/limits'
import { getAssignableRolesForUser, checkCanAssignRole } from '@/lib/permissions'
import { isSystemRole } from '@/lib/capabilities'
import { randomBytes } from 'crypto'

// --- Schemas ---

// Required: full_name, phone, joining_date, status
const AddMemberSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email().optional().or(z.literal('')),
  designation: z.string().optional(),
  area: z.string().optional(),
  joining_date: z.string().datetime().default(() => new Date().toISOString()),
  status: z.enum(['active', 'inactive']).default('active'),
  notes: z.string().optional(),
  role: z.enum(['admin', 'editor', 'viewer', 'member', 'can_edit', 'can_comment', 'can_manage', 'second_admin']).default('member'),
  role_id: z.string().uuid().optional(),
})

const ChangeStatusSchema = z.object({
  memberId: z.string().uuid(),
  status: z.enum(['active', 'inactive']),
})

const InviteMemberSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email().optional().or(z.literal('')),
  designation: z.string().optional(),
  area: z.string().optional(),
  joining_date: z.string().datetime().default(() => new Date().toISOString()),
  role: z.enum(['can_edit', 'can_comment', 'can_manage', 'second_admin']).default('can_comment'),
  role_id: z.string().uuid().optional(),
})

// --- Actions ---

export const addMember = createSafeAction(
  AddMemberSchema,
  async (input, context) => {
    // Check organisation plan member capacity limit
    const limitCheck = await checkMemberLimit(context.organizationId, 1)
    if (!limitCheck.allowed) {
      return { error: limitCheck.error || 'Plan member limit reached. Please upgrade to add more members.' }
    }

    // Check if actor can assign this role
    if (input.role && isSystemRole(input.role)) {
      const canAssign = await checkCanAssignRole(context.organizationId, context.user.id, input.role)
      if (!canAssign) {
        return { error: 'You do not have permission to assign this role' }
      }
    }

    const supabase = await createClient()

    // Resolve role_id if role is provided
    let roleId = input.role_id
    if (!roleId && input.role && isSystemRole(input.role)) {
      const { data: roleData } = await supabase
        .from('org_roles')
        .select('id')
        .eq('organisation_id', context.organizationId)
        .eq('name', input.role)
        .eq('is_system', true)
        .maybeSingle()
      roleId = roleData?.id
    }

    // We are adding to the 'members' table
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        organisation_id: context.organizationId,
        full_name: input.full_name,
        email: input.email || null,
        phone: input.phone,
        designation: input.designation,
        area: input.area,
        joining_date: input.joining_date,
        status: input.status,
        notes: input.notes,
        role: input.role,
        role_id: roleId,
      })
      .select('id')
      .maybeSingle()

    const member = data

    if (error || !member) {
      if ((error as { code?: string })?.code === '23505') {
        return { error: 'Phone number already exists in this organisation.' }
      }
      return { error: (error as { message?: string })?.message || 'Failed to add member' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'MEMBER_CREATED',
      resource_table: 'members',
      resource_id: member.id,
      details: { full_name: input.full_name, role: input.role }
    })

    revalidatePath('/', 'layout')
    return { success: true, memberId: member.id }
  },
  { allowedRoles: ['admin', 'editor', 'can_manage', 'second_admin'] }
)

export const inviteMember = createSafeAction(
  InviteMemberSchema,
  async (input, context) => {
    // Check organisation plan member capacity limit
    const limitCheck = await checkMemberLimit(context.organizationId, 1)
    if (!limitCheck.allowed) {
      return { error: limitCheck.error || 'Plan member limit reached. Please upgrade to add more members.' }
    }

    // Check if actor can assign this role
    const canAssign = await checkCanAssignRole(context.organizationId, context.user.id, input.role)
    if (!canAssign) {
      return { error: 'You do not have permission to assign this role' }
    }

    const supabase = await createClient()

    // Resolve role_id
    let roleId = input.role_id
    if (!roleId) {
      const { data: roleData } = await supabase
        .from('org_roles')
        .select('id')
        .eq('organisation_id', context.organizationId)
        .eq('name', input.role)
        .eq('is_system', true)
        .maybeSingle()
      roleId = roleData?.id
    }

    // Create invite token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    const { data: invite, error } = await supabase
      .from('org_invites')
      .insert({
        organisation_id: context.organizationId,
        invited_by: context.user.id,
        role: input.role,
        token,
        expires_at: expiresAt.toISOString(),
      })
      .select('id')
      .maybeSingle()

    if (error || !invite) {
      return { error: (error as { message?: string })?.message || 'Failed to create invite' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'MEMBER_INVITED',
      resource_table: 'org_invites',
      resource_id: invite.id,
      details: { full_name: input.full_name, role: input.role }
    })

    revalidatePath('/', 'layout')
    return { success: true, inviteId: invite.id, token }
  },
  { allowedRoles: ['admin', 'editor', 'can_manage', 'second_admin'] }
)

export const changeMemberStatus = createSafeAction(
  ChangeStatusSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('profiles')
      .update({ status: input.status })
      .eq('id', input.memberId)
      .eq('organisation_id', context.organizationId)

    if (error) {
      const err = error as { message?: string }
      return { error: err.message || 'Failed to update member status' }
    }
    
    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'MEMBER_STATUS_CHANGED',
      resource_table: 'members',
      resource_id: input.memberId,
      details: { status: input.status }
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor', 'can_manage', 'second_admin'] }
)

export async function getAssignableRolesForActor(organisationId: string, actorId: string) {
  try {
    const roles = await getAssignableRolesForUser(organisationId, actorId)
    return { success: true, data: roles }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get assignable roles', data: [] }
  }
}
