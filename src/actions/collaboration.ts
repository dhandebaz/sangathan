'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'

export async function createCollaborationRequest(targetOrgId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    // Check permissions
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .single() as { data: { role: string; organisation_id: string } | null, error: { message: string } | null }

    const profile = profileData

    if (!profile || !['admin', 'executive'].includes(profile.role)) {
      return { success: false, error: 'Permission denied' }
    }

    if (profile.organisation_id === targetOrgId) {
      return { success: false, error: 'Cannot collaborate with yourself' }
    }

    type OrganisationLinkStatus = {
      id: string
      status: string
    }

    const { data: existing } = (await supabase
      .from('organisation_links')
      .select('id, status')
      .or(`and(requester_org_id.eq.${profile.organisation_id},responder_org_id.eq.${targetOrgId}),and(requester_org_id.eq.${targetOrgId},responder_org_id.eq.${profile.organisation_id})`)
      .single()) as { data: OrganisationLinkStatus | null }

    if (existing) {
      if (existing.status === 'pending') return { success: false, error: 'Request already pending' }
      if (existing.status === 'active') return { success: false, error: 'Already collaborated' }
      // If rejected, maybe allow re-request? For now, block.
      return { success: false, error: 'Previous request exists' }
    }

    const { error } = await supabase
      .from('organisation_links')
      .insert({
        requester_org_id: profile.organisation_id as string,
        responder_org_id: targetOrgId,
        status: 'pending',
        created_by: user.id,
      } as never)

    if (error) throw error

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return { success: false, error: message }
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
      .select('role, organisation_id')
      .eq('id', user.id)
      .single() as { data: { role: string; organisation_id: string } | null, error: { message: string } | null }

    const profile = profileData

    if (!profile || !['admin', 'executive'].includes(profile.role)) {
      return { success: false, error: 'Permission denied' }
    }

    // Verify ownership of the request (must be responder)
    type OrganisationLinkRow = {
      id: string
      requester_org_id: string
      responder_org_id: string
      status: string
    }

    const { data: link, error: linkError } = (await supabase
      .from('organisation_links')
      .select('*')
      .eq('id', linkId)
      .single()) as { data: OrganisationLinkRow | null, error: { message: string } | null }

    if (linkError || !link) return { success: false, error: 'Request not found' }

    if (link.responder_org_id !== profile.organisation_id) {
       // Allow requester to cancel? Maybe only if pending.
       if (link.requester_org_id === profile.organisation_id && status === 'rejected') {
          // requester cancelling
       } else {
          return { success: false, error: 'Not authorized to respond' }
       }
    }

    const { error } = await supabase
      .from('organisation_links')
      .update({ status } as never)
      .eq('id', linkId)

    if (error) throw error

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return { success: false, error: message }
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
      
    type OrganisationSummary = {
      id: string
      name: string
      slug: string
    }

    type CollaborationLink = {
      id: string
      status: string
      requester: OrganisationSummary
      responder: OrganisationSummary
    }

    const partners =
      (links as CollaborationLink[] | null)?.map((link) =>
        link.requester.id === orgId ? link.responder : link.requester
      ) || []
    
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
