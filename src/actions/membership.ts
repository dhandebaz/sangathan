'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { sendEmail } from '@/lib/email/sender'
import { newMemberRequestEmail, membershipApprovedEmail, membershipRejectedEmail } from '@/lib/email/templates'

// --- Schemas ---
export const UpdatePolicySchema = z.object({
  orgId: z.string().uuid(),
  policy: z.enum(['open_auto', 'admin_approval', 'invite_only']),
})

export const RequestJoinSchema = z.object({
  orgId: z.string().uuid(),
})

export const ManageMemberSchema = z.object({
  memberId: z.string().uuid(),
})

export const UpdateTransparencySchema = z.object({
  orgId: z.string().uuid(),
  enabled: z.boolean(),
})

// --- Actions ---

export async function updateTransparency(input: z.infer<typeof UpdateTransparencySchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .single()

    const profile = profileData as { role: string; organisation_id: string } | null

    if (!profile || profile.organisation_id !== input.orgId || profile.role !== 'admin') {
      return { success: false, error: 'Permission denied' }
    }

    const { error } = await supabase
      .from('organisations')
      .update({ public_transparency_enabled: input.enabled })
      .eq('id', input.orgId)

    if (error) throw error

    revalidatePath('/dashboard/settings')
    revalidatePath(`/org`) // This might not be specific enough for dynamic routes, but Next.js usually handles revalidation well.
    // Ideally we revalidate the specific org page if we knew the slug.
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: errorMessage }
  }
}

export async function updateMembershipPolicy(input: z.infer<typeof UpdatePolicySchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    // Check permissions (must be admin)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .single() as { data: { role: string; organisation_id: string } | null, error: { message: string } | null }

    if (!profile || profile.organisation_id !== input.orgId || profile.role !== 'admin') {
      return { success: false, error: 'Permission denied' }
    }

    const { error } = await supabase
      .from('organisations')
      .update({ membership_policy: input.policy })
      .eq('id', input.orgId)

    if (error) throw error

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Update Policy Error:', error)
    return { success: false, error: errorMessage }
  }
}

export async function requestJoinOrganisation(input: z.infer<typeof RequestJoinSchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Please login to join' }

    // 1. Get Org Policy
    const supabaseAdmin = createServiceClient() // Use admin to bypass RLS if needed for reading policy public info? 
    // Actually organisations table RLS usually allows read for members. Non-members might not see it.
    // Public page uses service client usually or open RLS. 
    // Let's use service client to be safe for fetching policy.

    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('organisations')
      .select('name, membership_policy, slug')
      .eq('id', input.orgId)
      .single() as { data: { name: string; membership_policy: string; slug: string } | null, error: { message: string } | null }

    const org = orgData

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

    const { error: insertError } = await (supabaseAdmin
      .from('profiles') as any)
      .insert({
        id: user.id,
        organisation_id: input.orgId,
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
      const { data: admins } = await (supabaseAdmin
        .from('profiles') as any)
        .select('email, full_name')
        .eq('organisation_id', input.orgId)
        .eq('role', 'admin')
      
      const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/membership-requests`
      
      if (admins) {
        for (const admin of (admins as { email: string; full_name: string | null }[])) {
           await sendEmail({
             to: admin.email,
             subject: `New Membership Request: ${fullName}`,
             html: newMemberRequestEmail(admin.full_name || 'Admin', fullName, org.name, dashboardUrl),
             tags: ['membership', 'request']
           })
        }
      }
    } else {
      // Notify User (Welcome)
       // reuse existing welcome email or new one?
       // The existing welcomeAdminEmail is specific to "Workspace ready".
       // Let's use membershipApprovedEmail for consistency even if auto-approved.
       const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
       await sendEmail({
         to: email,
         subject: `Welcome to ${org.name}`,
         html: membershipApprovedEmail(fullName, org.name, dashboardUrl),
         tags: ['welcome', 'joined']
       })
    }

    revalidatePath('/dashboard')
    return { success: true, status }
  } catch (error) {
    console.error('Join Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function approveMember(input: z.infer<typeof ManageMemberSchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // Check admin
    const { data: adminProfileData } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .single() as { data: { role: string; organisation_id: string } | null, error: { message: string } | null }

    const adminProfile = adminProfileData

    if (!adminProfile || adminProfile.role !== 'admin') {
      return { success: false, error: 'Permission denied' }
    }

    const supabaseAdmin = createServiceClient()

    // Get Member
    const { data: memberData } = await (supabaseAdmin
      .from('profiles') as any)
      .select('email, full_name, organisation_id')
      .eq('id', input.memberId)
      .single() as { data: { email: string; full_name: string | null; organisation_id: string } | null, error: { message: string } | null }

    const member = memberData

    if (!member || member.organisation_id !== adminProfile.organisation_id) {
        return { success: false, error: 'Member not found in your organisation' }
    }

    // Get Org Name
    const { data: orgData } = await (supabaseAdmin
        .from('organisations') as any)
        .select('name')
        .eq('id', adminProfile.organisation_id)
        .single() as { data: { name: string } | null, error: { message: string } | null }

    const org = orgData

    // Update
    const { error } = await (supabaseAdmin
      .from('profiles') as any)
      .update({ 
        status: 'active',
        approved_at: new Date().toISOString()
      })
      .eq('id', input.memberId)

    if (error) throw error

    // Notify
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    await sendEmail({
        to: member.email,
        subject: `Membership Approved: ${org?.name}`,
        html: membershipApprovedEmail(member.full_name || 'Member', org?.name || 'Organisation', dashboardUrl),
        tags: ['membership', 'approved']
    })

    revalidatePath('/dashboard/membership-requests')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function rejectMember(input: z.infer<typeof ManageMemberSchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { data: adminProfileData } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .single() as { data: { role: string; organisation_id: string } | null, error: { message: string } | null }

    const adminProfile = adminProfileData

    if (!adminProfile || adminProfile.role !== 'admin') {
      return { success: false, error: 'Permission denied' }
    }

    const supabaseAdmin = createServiceClient()

     // Get Member
    const { data: memberData } = await (supabaseAdmin
      .from('profiles') as any)
      .select('email, full_name, organisation_id')
      .eq('id', input.memberId)
      .single() as { data: { email: string; full_name: string | null; organisation_id: string } | null, error: { message: string } | null }
      
    const member = memberData

    if (!member || member.organisation_id !== adminProfile.organisation_id) {
        return { success: false, error: 'Member not found' }
    }

    // Get Org Name
    const { data: orgData } = await (supabaseAdmin
        .from('organisations') as any)
        .select('name')
        .eq('id', adminProfile.organisation_id)
        .single() as { data: { name: string } | null, error: { message: string } | null }

    const org = orgData

    // Update
    const { error } = await (supabaseAdmin
      .from('profiles') as any)
      .update({ 
        status: 'rejected'
      })
      .eq('id', input.memberId)

    if (error) throw error

    // Notify
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    await sendEmail({
        to: member.email,
        subject: `Membership Update: ${org?.name}`,
        html: membershipRejectedEmail(member.full_name || 'Member', org?.name || 'Organisation', dashboardUrl),
        tags: ['membership', 'rejected']
    })

    revalidatePath('/dashboard/membership-requests')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}
