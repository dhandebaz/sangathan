'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'

const CreateCollaborationSchema = z.object({
  targetOrgId: z.string(),
})

export const createCollaborationRequest = createSafeAction(
  CreateCollaborationSchema,
  async ({ targetOrgId }, context) => {
    const supabase = await createClient()
    const { user, organizationId: requesterOrgId } = context

    if (requesterOrgId === targetOrgId) {
      throw new Error('Cannot collaborate with yourself')
    }

    type OrganisationLinkStatus = {
      id: string
      status: string
    }

    const { data: existing } = (await supabase
      .from('organisation_links')
      .select('id, status')
      .or(`and(requester_org_id.eq.${requesterOrgId},responder_org_id.eq.${targetOrgId}),and(requester_org_id.eq.${targetOrgId},responder_org_id.eq.${requesterOrgId})`)
      .single()) as { data: OrganisationLinkStatus | null }

    if (existing) {
      if (existing.status === 'pending') throw new Error('Request already pending')
      if (existing.status === 'active') throw new Error('Already collaborated')
      throw new Error('Previous request exists')
    }

    const { error } = await supabase
      .from('organisation_links')
      .insert({
        requester_org_id: requesterOrgId,
        responder_org_id: targetOrgId,
        status: 'pending',
        created_by: user.id,
      } as never)

    if (error) throw error

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'executive'], actionName: 'createCollaborationRequest' }
)

const RespondCollaborationSchema = z.object({
  linkId: z.string(),
  status: z.enum(['active', 'rejected']),
})

export const respondToCollaborationRequest = createSafeAction(
  RespondCollaborationSchema,
  async ({ linkId, status }, context) => {
    const supabase = await createClient()
    const { organizationId: profileOrgId } = context

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

    if (linkError || !link) throw new Error('Request not found')

    if (link.responder_org_id !== profileOrgId) {
       // Allow requester to cancel? Maybe only if pending.
       if (link.requester_org_id === profileOrgId && status === 'rejected') {
          // requester cancelling
       } else {
          throw new Error('Not authorized to respond')
       }
    }

    const { error } = await supabase
      .from('organisation_links')
      .update({ status } as never)
      .eq('id', linkId)

    if (error) throw error

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'executive'], actionName: 'respondToCollaborationRequest' }
)

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
