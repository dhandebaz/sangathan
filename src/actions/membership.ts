'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
// Removed custom email dependencies

// --- Schemas ---
const UpdatePolicySchema = z.object({
  orgId: z.string().uuid(),
  policy: z.enum(['open_auto', 'admin_approval', 'invite_only']),
})

const RequestJoinSchema = z.object({
  orgId: z.string().uuid(),
})

const ManageMemberSchema = z.object({
  memberId: z.string().uuid(),
})

const UpdateTransparencySchema = z.object({
  orgId: z.string().uuid(),
  enabled: z.boolean(),
})

// --- Actions ---

export async function updateTransparency(input: z.infer<typeof UpdateTransparencySchema>) {
  try {
    const result = UpdateTransparencySchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid transparency update' }
    }

    const data = result.data

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .single()

    const profile = profileData

    if (!profile || profile.organisation_id !== data.orgId || profile.role !== 'admin') {
      return { success: false, error: 'Permission denied' }
    }

    const { error } = await supabase
      .from('organisations')
      .update({ public_transparency_enabled: data.enabled } as never)
      .eq('id', data.orgId)

    if (error) throw error

    revalidatePath('/', 'layout')
    revalidatePath('/', 'layout') // This might not be specific enough for dynamic routes, but Next.js usually handles revalidation well.
    // Ideally we revalidate the specific org page if we knew the slug.
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: errorMessage }
  }
}

export async function updateMembershipPolicy(input: z.infer<typeof UpdatePolicySchema>) {
  try {
    const result = UpdatePolicySchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid membership policy' }
    }

    const data = result.data

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    // Check permissions (must be admin)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .single()

    if (!profile || profile.organisation_id !== data.orgId || profile.role !== 'admin') {
      return { success: false, error: 'Permission denied' }
    }

    const { error } = await supabase
      .from('organisations')
      .update({ membership_policy: data.policy } as never)
      .eq('id', data.orgId)

    if (error) throw error

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Update Policy Error:', error)
    return { success: false, error: errorMessage }
  }
}

export async function requestJoinOrganisation(input: z.infer<typeof RequestJoinSchema>) {
  try {
    const result = RequestJoinSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid join request' }
    }

    const data = result.data

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Please login to join' }

    // 1. Get Org Policy
    const supabaseAdmin = createServiceClient() // Use admin to bypass RLS if needed for reading policy public info? 
    // Actually organisations table RLS usually allows read for members. Non-members might not see it.
    // Public page uses service client usually or open RLS. 
    // Let's use service client to be safe for fetching policy.

    const { data: org, error: orgError } = await supabaseAdmin
      .from('organisations')
      .select('name, membership_policy, slug')
      .eq('id', data.orgId)
      .single()

    if (orgError || !org) return { success: false, error: 'Organisation not found' }

    if (org.membership_policy === 'invite_only') {
      return { success: false, error: 'This organisation is invite-only.' }
    }

    // 2. Check if already member
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('status')
      .eq('id', user.id)
      .single()

    if (existing) {
        // If user has a profile, they are already associated with *an* org.
        // Current constraint: User belongs to ONE org.
        // If we want to support switching, schema needs change.
        // Assuming 1-org constraint per user for now based on schema.
        return { success: false, error: 'You are already a member of an organisation.' }
    }

    // 3. Create Profile
    const status = org.membership_policy === 'open_auto' ? 'active' : 'pending'
    const approved_at = status === 'active' ? new Date().toISOString() : null
    
    // We need user metadata for name/email
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(user.id)
    const fullName = userData.user?.user_metadata?.full_name || 'Unknown User'
    const email = userData.user?.email ?? ''

    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: user.id,
        organisation_id: data.orgId,
        email: email,
        full_name: fullName,
        role: 'member', // Default role
        status: status,
        approved_at: approved_at
      })

    if (insertError) throw insertError

    // 4. Notifications
    if (status === 'pending') {
      // Notify Admins
      const { data: admins } = await supabaseAdmin
        .from('profiles')
        .select('email, full_name')
        .eq('organisation_id', data.orgId)
        .eq('role', 'admin')
      if (admins) {
        // Notifications can be handled by in-app system or Supabase webhooks in the future
      }
    } else {
      // Welcome notifications can be handled by in-app system
    }

    revalidatePath('/', 'layout')
    return { success: true, status }
  } catch (error) {
    console.error('Join Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function approveMember(input: z.infer<typeof ManageMemberSchema>) {
  try {
    const result = ManageMemberSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid member action' }
    }

    const data = result.data

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // Check admin
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .single()

    if (adminError || !adminProfile || adminProfile.role !== 'admin') {
      return { success: false, error: 'Permission denied' }
    }

    const supabaseAdmin = createServiceClient()

    // Get Member
    const { data: member, error: memberError } = await supabaseAdmin
      .from('profiles')
      .select('email, full_name, organisation_id')
      .eq('id', data.memberId)
      .single()

    if (memberError || !member || member.organisation_id !== adminProfile.organisation_id) {
        return { success: false, error: 'Member not found in your organisation' }
    }

    await supabaseAdmin
        .from('organisations')
        .select('name')
        .eq('id', adminProfile.organisation_id as string)
        .single()

    // Update
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        status: 'active',
        approved_at: new Date().toISOString()
      })
      .eq('id', data.memberId)

    if (updateError) throw updateError

    // Notify
    // In-app notifications or Supabase triggers could go here

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function rejectMember(input: z.infer<typeof ManageMemberSchema>) {
  try {
    const result = ManageMemberSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid member action' }
    }

    const data = result.data

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .single()

    if (adminError || !adminProfile || adminProfile.role !== 'admin') {
      return { success: false, error: 'Permission denied' }
    }

    const supabaseAdmin = createServiceClient()

     // Get Member
    const { data: member, error: memberError } = await supabaseAdmin
      .from('profiles')
      .select('email, full_name, organisation_id')
      .eq('id', data.memberId)
      .single()
      
    if (memberError || !member || member.organisation_id !== adminProfile.organisation_id) {
        return { success: false, error: 'Member not found' }
    }

    await supabaseAdmin
        .from('organisations')
        .select('name')
        .eq('id', adminProfile.organisation_id as string)
        .single()

    // Update
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        status: 'rejected'
      })
      .eq('id', data.memberId)

    if (updateError) throw updateError

    // Notify
    // In-app notifications or Supabase triggers could go here

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}
