'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// --- Schemas ---

const LinkRequestSchema = z.object({
  target_org_id: z.string().uuid(),
})

const LinkResponseSchema = z.object({
  link_id: z.string().uuid(),
  status: z.enum(['active', 'rejected']),
})

// --- Actions ---

export async function createCollaborationRequest(targetOrgId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    // Check permissions
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, organization_id')
      .eq('id', user.id)
      .single()

    const profile = profileData as any

    if (!profile || !['admin', 'executive'].includes(profile.role)) {
      return { success: false, error: 'Permission denied' }
    }

    if (profile.organization_id === targetOrgId) {
      return { success: false, error: 'Cannot collaborate with yourself' }
    }

    // Check existing
    const { data: existingData } = await supabase
      .from('organisation_links')
      .select('id, status')
      .or(`and(requester_org_id.eq.${profile.organization_id},responder_org_id.eq.${targetOrgId}),and(requester_org_id.eq.${targetOrgId},responder_org_id.eq.${profile.organization_id})`)
      .single()

    const existing = existingData as any

    if (existing) {
      if (existing.status === 'pending') return { success: false, error: 'Request already pending' }
      if (existing.status === 'active') return { success: false, error: 'Already collaborated' }
      // If rejected, maybe allow re-request? For now, block.
      return { success: false, error: 'Previous request exists' }
    }

    const { error } = await (supabase
      .from('organisation_links') as any)
      .insert({
        requester_org_id: profile.organization_id,
        responder_org_id: targetOrgId,
        status: 'pending',
        created_by: user.id
      })

    if (error) throw error

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function respondToCollaborationRequest(linkId: string, status: 'active' | 'rejected') {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    // Check permissions
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, organization_id')
      .eq('id', user.id)
      .single()

    const profile = profileData as any

    if (!profile || !['admin', 'executive'].includes(profile.role)) {
      return { success: false, error: 'Permission denied' }
    }

    // Verify ownership of the request (must be responder)
    const { data: linkData } = await supabase
      .from('organisation_links')
      .select('*')
      .eq('id', linkId)
      .single()

    const link = linkData as any

    if (!link) return { success: false, error: 'Request not found' }

    if (link.responder_org_id !== profile.organization_id) {
       // Allow requester to cancel? Maybe only if pending.
       if (link.requester_org_id === profile.organization_id && status === 'rejected') {
          // requester cancelling
       } else {
          return { success: false, error: 'Not authorized to respond' }
       }
    }

    const { error } = await (supabase
      .from('organisation_links') as any)
      .update({ status })
      .eq('id', linkId)

    if (error) throw error

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getCollaboratingOrgs(orgId: string) {
    const supabase = createServiceClient()
    
    const { data: links } = await supabase
      .from('organisation_links')
      .select(`
        id, 
        status, 
        requester:requester_org_id(id, name, slug), 
        responder:responder_org_id(id, name, slug)
      `)
      .or(`requester_org_id.eq.${orgId},responder_org_id.eq.${orgId}`)
      .eq('status', 'active')
      
    // Transform to flat list of partners
    const partners = links?.map((link: any) => {
        return link.requester.id === orgId ? link.responder : link.requester
    }) || []
    
    return partners
}

export async function getPendingRequests(orgId: string) {
  const supabase = createServiceClient()
  
  const { data: incoming } = await supabase
    .from('organisation_links')
    .select(`
      id, 
      status, 
      requester:requester_org_id(id, name, slug)
    `)
    .eq('responder_org_id', orgId)
    .eq('status', 'pending')

  const { data: outgoing } = await supabase
    .from('organisation_links')
    .select(`
      id, 
      status, 
      responder:responder_org_id(id, name, slug)
    `)
    .eq('requester_org_id', orgId)
    .eq('status', 'pending')

  return { incoming: incoming || [], outgoing: outgoing || [] }
}

