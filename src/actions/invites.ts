'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { generateSecureString } from '@/lib/utils'
import { invalidateUserMembershipsCache } from '@/lib/auth/context'

import { checkMemberLimit } from '@/lib/plans/limits'

const CreateInviteSchema = z.object({
  email: z.string().email('Valid email required'),
  role: z.enum(['admin', 'editor', 'viewer', 'member']).default('member'),
})

const AcceptInviteSchema = z.object({
  token: z.string().min(10),
})

export const createInvite = createSafeAction(
  CreateInviteSchema,
  async (input, context) => {
    // Check organisation plan member capacity limit
    const limitCheck = await checkMemberLimit(context.organizationId, 1)
    if (!limitCheck.allowed) {
      return { error: limitCheck.error || 'Plan member limit reached. Please upgrade to invite more members.' }
    }

    const supabase = createServiceClient()
    const token = generateSecureString(32)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const { data, error } = await supabase
      .from('org_invites')
      .insert({
        organisation_id: context.organizationId,
        invited_by: context.user.id,
        email: input.email,
        role: input.role,
        token: token,
        expires_at: expiresAt.toISOString(),
        used: false,
      })
      .select('id, token, email, role, expires_at')
      .maybeSingle()

    if (error) {
      if ((error as { code?: string })?.code === '23505') {
        return { error: 'An invite has already been sent to this email.' }
      }
      return { error: error.message || 'Failed to create invite' }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://sangathan.space'
    const origin = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`
    const inviteLink = `${origin}/invite/${token}`

    revalidatePath('/', 'layout')
    return { success: true, invite: data, inviteLink }
  },
  { allowedRoles: ['admin', 'editor'] }
)

const BatchInviteSchema = z.object({
  invites: z.array(
    z.object({
      email: z.string().email('Valid email required'),
      role: z.enum(['admin', 'editor', 'viewer', 'member']).default('member'),
      name: z.string().optional(),
    })
  ).min(1, 'At least one invite is required'),
})

export const batchCreateInvites = createSafeAction(
  BatchInviteSchema,
  async (input, context) => {
    const rawInvites = input.invites
    const orgId = context.organizationId

    // Check capacity limit
    const limitCheck = await checkMemberLimit(orgId, rawInvites.length)
    if (!limitCheck.allowed) {
      return { error: limitCheck.error || `Plan limit exceeded. Cannot invite ${rawInvites.length} members.` }
    }

    const supabase = createServiceClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://sangathan.space'
    const origin = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch existing active invites to avoid duplicates
    const { data: existing } = await supabase
      .from('org_invites')
      .select('email')
      .eq('organisation_id', orgId)
      .eq('used', false)

    const existingEmails = new Set((existing || []).map((i) => i.email.toLowerCase()))

    const toInsert: Array<{
      organisation_id: string
      invited_by: string
      email: string
      role: 'admin' | 'editor' | 'viewer' | 'member'
      token: string
      expires_at: string
      used: boolean
    }> = []

    const skipped: string[] = []
    const seen = new Set<string>()

    for (const inv of rawInvites) {
      const email = inv.email.toLowerCase().trim()
      if (seen.has(email) || existingEmails.has(email)) {
        skipped.push(email)
        continue
      }
      seen.add(email)
      toInsert.push({
        organisation_id: orgId,
        invited_by: context.user.id,
        email,
        role: inv.role,
        token: generateSecureString(32),
        expires_at: expiresAt,
        used: false,
      })
    }

    if (toInsert.length === 0) {
      return {
        success: false,
        error: 'All selected contacts already have pending invitations.',
        skipped,
      }
    }

    const { data: inserted, error } = await supabase
      .from('org_invites')
      .insert(toInsert)
      .select('id, email, token, role')

    if (error) {
      return { error: error.message || 'Failed to create batch invites' }
    }

    const createdLinks = (inserted || []).map((i) => ({
      email: i.email,
      role: i.role,
      inviteLink: `${origin}/invite/${i.token}`,
    }))

    revalidatePath('/', 'layout')
    return {
      success: true,
      createdCount: toInsert.length,
      skippedCount: skipped.length,
      invites: createdLinks,
    }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'batch_create_invites' }
)

export const revokeInvite = createSafeAction(
  z.object({ inviteId: z.string().uuid() }),
  async (input, context) => {
    const supabase = createServiceClient()

    const { error } = await supabase
      .from('org_invites')
      .update({ used: true })
      .eq('id', input.inviteId)
      .eq('organisation_id', context.organizationId)

    if (error) {
      return { error: error.message || 'Failed to revoke invite' }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin'] }
)

export const getOrgInvites = createSafeAction(
  z.object({}),
  async (_input, context) => {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('org_invites')
      .select('id, email, role, token, used, expires_at, created_at')
      .eq('organisation_id', context.organizationId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return { error: error.message || 'Failed to fetch invites' }
    }

    return { success: true, invites: data }
  },
  { allowedRoles: ['admin', 'editor'] }
)

export async function validateInvite(token: string) {
  try {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('org_invites')
      .select('id, email, role, organisation_id, expires_at, used')
      .eq('token', token)
      .maybeSingle()

    if (error || !data) {
      return { valid: false, error: 'Invite not found' }
    }

    if (data.used) {
      return { valid: false, error: 'This invite has already been used' }
    }

    if (new Date(data.expires_at) < new Date()) {
      return { valid: false, error: 'This invite has expired' }
    }

    const { data: org } = await supabase
      .from('organisations')
      .select('name, slug, org_type')
      .eq('id', data.organisation_id)
      .maybeSingle()

    return {
      valid: true,
      invite: {
        id: data.id,
        email: data.email,
        role: data.role,
        organisation_id: data.organisation_id,
        organisationName: org?.name || '',
        organisationSlug: org?.slug || '',
        organisationType: org?.org_type || '',
      },
    }
  } catch (err: unknown) {
    console.error('Validate invite exception:', err)
    return { valid: false, error: err instanceof Error ? err.message : 'Failed to validate invite' }
  }
}

export async function acceptInvite(token: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return { success: false, error: 'Please login or sign up to accept this invite' }
    }

    const validation = await validateInvite(token)
    if (!validation.valid || !validation.invite) {
      return { success: false, error: validation.error }
    }

    const invite = validation.invite

    if (user.email !== invite.email) {
      return { success: false, error: `This invite was sent to ${invite.email}` }
    }

    const supabaseAdmin = createServiceClient()

    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, organisation_id')
      .eq('id', user.id)
      .maybeSingle()

    if (existingProfile?.organisation_id && existingProfile.organisation_id !== invite.organisation_id) {
      return { success: false, error: 'You are already an active member of another organisation' }
    }

    if (existingProfile) {
      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({
          organisation_id: invite.organisation_id,
          role: invite.role,
          status: 'active',
          approved_at: new Date().toISOString(),
          onboarding_completed: true,
        })
        .eq('id', user.id)

      if (profileUpdateError) {
        return { success: false, error: profileUpdateError.message || 'Failed to update member profile' }
      }
    } else {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: user.id,
          organisation_id: invite.organisation_id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0] || 'Member',
          role: invite.role,
          status: 'active',
          approved_at: new Date().toISOString(),
          onboarding_completed: true,
        })

      if (profileError) {
        return { success: false, error: profileError.message || 'Failed to join organisation' }
      }
    }

    // Also add to members table if available
    try {
      await supabaseAdmin
        .from('profiles')
        .insert({
          organisation_id: invite.organisation_id,
          user_id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split('@')[0] || 'Member',
          role: invite.role,
          status: 'active',
        })
    } catch {
      // optional table entry
    }

    await supabaseAdmin
      .from('org_invites')
      .update({ used: true })
      .eq('id', invite.id)

    try {
      const cookieStore = await cookies()
      cookieStore.set('sangathan_org_id', invite.organisation_id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      })
    } catch (cookieErr) {
      console.warn('Could not set org cookie:', cookieErr)
    }

    await invalidateUserMembershipsCache(user.id)

    return { success: true, organisationId: invite.organisation_id }
  } catch (err: unknown) {
    console.error('Accept invite exception:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Failed to accept invitation' }
  }
}
