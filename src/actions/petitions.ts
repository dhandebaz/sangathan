'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { z } from 'zod'

const CreatePetitionSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug required').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric and hyphens'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  target_decision_maker: z.string().min(2, 'Target authority/decision maker required'),
  signature_goal: z.number().min(10).default(500),
  volunteer_prompt_enabled: z.boolean().default(true),
  volunteer_cta_text: z.string().default('Join the Movement & Volunteer for this cause'),
})

const SignPetitionSchema = z.object({
  petition_id: z.string().uuid(),
  supporter_name: z.string().min(2, 'Name is required'),
  supporter_email: z.string().email('Valid email required'),
  supporter_phone: z.string().optional(),
  supporter_locality: z.string().optional(),
  comment: z.string().optional(),
  wants_to_volunteer: z.boolean().default(false),
})

const EndorsePetitionSchema = z.object({
  petition_id: z.string().uuid(),
  statement: z.string().optional(),
})

export async function createPetitionAction(input: z.infer<typeof CreatePetitionSchema>) {
  try {
    const validated = CreatePetitionSchema.parse(input)
    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not selected' }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('petitions')
      .insert({
        organisation_id: orgId,
        title: validated.title,
        slug: validated.slug,
        description: validated.description,
        target_decision_maker: validated.target_decision_maker,
        signature_goal: validated.signature_goal,
        volunteer_prompt_enabled: validated.volunteer_prompt_enabled,
        volunteer_cta_text: validated.volunteer_cta_text,
        status: 'published',
        created_by: user.id,
      })
      .select()
      .maybeSingle()

    if (error) throw error

    revalidatePath('/', 'layout')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create petition'
    return { success: false, error: message }
  }
}

export async function signPetitionAction(input: z.infer<typeof SignPetitionSchema>) {
  try {
    const validated = SignPetitionSchema.parse(input)
    const adminClient = createServiceClient()

    // 1. Check if already signed
    const { data: existing } = await adminClient
      .from('petition_signatures')
      .select('id')
      .eq('petition_id', validated.petition_id)
      .eq('supporter_email', validated.supporter_email.toLowerCase().trim())
      .maybeSingle()

    if (existing) {
      return { success: false, error: 'You have already signed this petition with this email.' }
    }

    // 2. Fetch petition to get org id
    const { data: petition, error: petitionErr } = await adminClient
      .from('petitions')
      .select('id, organisation_id, title, current_signatures')
      .eq('id', validated.petition_id)
      .maybeSingle()

    if (petitionErr || !petition) {
      return { success: false, error: 'Petition not found' }
    }

    // 3. Insert signature
    const { data: signature, error: sigErr } = await adminClient
      .from('petition_signatures')
      .insert({
        petition_id: validated.petition_id,
        supporter_name: validated.supporter_name.trim(),
        supporter_email: validated.supporter_email.toLowerCase().trim(),
        supporter_phone: validated.supporter_phone || null,
        supporter_locality: validated.supporter_locality || null,
        comment: validated.comment || null,
        wants_to_volunteer: validated.wants_to_volunteer,
      })
      .select()
      .maybeSingle()

    if (sigErr) throw sigErr

    // 4. Update live signature count
    await adminClient
      .from('petitions')
      .update({ current_signatures: (petition.current_signatures || 0) + 1 })
      .eq('id', validated.petition_id)

    // 5. If user opted to volunteer/join, automatically create or link a member record
    let convertedMemberId: string | null = null
    if (validated.wants_to_volunteer) {
      const { data: memberData } = await adminClient
        .from('profiles')
        .insert({
          organisation_id: petition.organisation_id,
          full_name: validated.supporter_name.trim(),
          email: validated.supporter_email.toLowerCase().trim(),
          phone: validated.supporter_phone || null,
          role: 'member',
        })
        .select('id')
        .maybeSingle()

      if (memberData) {
        convertedMemberId = memberData.id
        await adminClient
          .from('petition_signatures')
          .update({
            is_converted_to_member: true,
            converted_member_id: convertedMemberId,
          })
          .eq('id', signature.id)
      }
    }

    return {
      success: true,
      data: {
        signatureId: signature.id,
        converted: !!convertedMemberId,
        petitionTitle: petition.title,
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to record signature'
    return { success: false, error: message }
  }
}

export async function convertSignerToMemberAction(signatureId: string) {
  try {
    const adminClient = createServiceClient()

    const { data: sig, error: sigErr } = await adminClient
      .from('petition_signatures')
      .select('*, petition:petitions(organisation_id)')
      .eq('id', signatureId)
      .maybeSingle()

    if (sigErr || !sig) return { success: false, error: 'Signature not found' }

    const orgId = sig.petition?.organisation_id
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const { data: newMember, error: memErr } = await adminClient
      .from('profiles')
      .insert({
        organisation_id: orgId,
        full_name: sig.supporter_name,
        email: sig.supporter_email,
        phone: sig.supporter_phone,
        role: 'member',
      })
      .select('id')
      .maybeSingle()

    if (memErr || !newMember) throw new Error(memErr?.message || 'Failed to create member record')

    await adminClient
      .from('petition_signatures')
      .update({
        is_converted_to_member: true,
        converted_member_id: newMember.id,
      })
      .eq('id', signatureId)

    return { success: true, memberId: newMember.id }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to convert supporter to member'
    return { success: false, error: message }
  }
}

export async function endorsePetitionAction(input: z.infer<typeof EndorsePetitionSchema>) {
  try {
    const validated = EndorsePetitionSchema.parse(input)
    const endorsingOrgId = await getSelectedOrganisationId()
    if (!endorsingOrgId) return { success: false, error: 'Please select an endorsing organisation' }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('petition_endorsements')
      .upsert({
        petition_id: validated.petition_id,
        endorsing_organisation_id: endorsingOrgId,
        endorsed_by_profile_id: user.id,
        statement: validated.statement || 'In full solidarity with this democratic initiative.',
        status: 'approved',
      })
      .select()
      .maybeSingle()

    if (error) throw error
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to endorse petition'
    return { success: false, error: message }
  }
}

export async function getPetitionDetails(orgSlug: string, petitionIdOrSlug: string) {
  try {
    const adminClient = createServiceClient()

    // 1. Get org
    const { data: org, error: orgErr } = await adminClient
      .from('organisations')
      .select('id, name, slug, logo_url, org_type')
      .eq('slug', orgSlug)
      .maybeSingle()

    if (orgErr || !org) return null

    // 2. Get petition
    let query = adminClient
      .from('petitions')
      .select('*')
      .eq('organisation_id', org.id)

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(petitionIdOrSlug)
    if (isUuid) {
      query = query.eq('id', petitionIdOrSlug)
    } else {
      query = query.eq('slug', petitionIdOrSlug)
    }

    const { data: petition, error: petitionErr } = await query.maybeSingle()
    if (petitionErr || !petition) return null

    // 3. Get recent signatures
    const { data: recentSignatures } = await adminClient
      .from('petition_signatures')
      .select('id, supporter_name, supporter_locality, comment, signed_at')
      .eq('petition_id', petition.id)
      .order('signed_at', { ascending: false })
      .limit(10)

    // 4. Get endorsements
    const { data: endorsements } = await adminClient
      .from('petition_endorsements')
      .select('*, endorsing_org:organisations(name, slug, logo_url)')
      .eq('petition_id', petition.id)
      .eq('status', 'approved')

    return {
      org,
      petition,
      recentSignatures: recentSignatures || [],
      endorsements: endorsements || [],
    }
  } catch {
    return null
  }
}

export async function getOrgPetitions(orgSlug: string) {
  try {
    const adminClient = createServiceClient()

    const { data: org, error: orgErr } = await adminClient
      .from('organisations')
      .select('id, name, slug, logo_url, org_type')
      .eq('slug', orgSlug)
      .maybeSingle()

    if (orgErr || !org) return null

    const { data: petitions, error: petitionsErr } = await adminClient
      .from('petitions')
      .select('*')
      .eq('organisation_id', org.id)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (petitionsErr) return { org, petitions: [] }

    return {
      org,
      petitions: petitions || [],
    }
  } catch {
    return null
  }
}

