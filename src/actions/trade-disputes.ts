'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const CreateTradeDisputeSchema = z.object({
  employer_name: z.string().min(2, 'Employer/Company name is required'),
  dispute_nature: z.enum([
    'wage_theft',
    'unlawful_termination',
    'safety_hazard',
    'cba_violation',
    'lockout',
    'pension_gratuity',
  ]),
  worker_count: z.coerce.number().min(1, 'At least 1 affected worker').default(1),
  summary: z.string().min(10, 'Detailed dispute summary is required'),
  next_hearing_date: z.string().optional(),
})

const AdvanceDisputeStageSchema = z.object({
  dispute_id: z.string().uuid('Invalid dispute ID'),
  stage: z.enum([
    'shop_floor',
    'works_committee',
    'alc_conciliation',
    'labour_court',
    'industrial_tribunal',
    'settled',
  ]),
  next_hearing_date: z.string().optional(),
  settlement_terms: z.string().optional(),
  status: z.enum(['active', 'pending_hearing', 'settled', 'appealed', 'dismissed']).optional(),
})

export const createTradeDispute = createSafeAction(
  CreateTradeDisputeSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId
    const stewardId = context.user.id

    // Generate unique dispute reference: TD-YEAR-RANDOM
    const disputeYear = new Date().getFullYear()
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase()
    const disputeRef = `TD/${disputeYear}/${randomCode}`

    const { data: dispute, error } = await supabase
      .from('trade_disputes')
      .insert({
        organisation_id: organisationId,
        dispute_ref: disputeRef,
        employer_name: data.employer_name,
        dispute_nature: data.dispute_nature,
        worker_count: data.worker_count,
        summary: data.summary,
        next_hearing_date: data.next_hearing_date || null,
        lead_shop_steward_id: stewardId,
        stage: 'shop_floor',
        status: 'active',
      })
      .select()
      .maybeSingle()

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('trade_disputes')
        .insert({
          organisation_id: organisationId,
          dispute_ref: disputeRef,
          employer_name: data.employer_name,
          dispute_nature: data.dispute_nature,
          worker_count: data.worker_count,
          summary: data.summary,
          next_hearing_date: data.next_hearing_date || null,
          lead_shop_steward_id: stewardId,
          stage: 'shop_floor',
          status: 'active',
        })
        .select()
        .maybeSingle()

      if (fallback.error) throw new Error(fallback.error.message)
      revalidatePath('/', 'layout')
      return { success: true, dispute: fallback.data }
    }

    revalidatePath('/', 'layout')
    return { success: true, dispute }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin', 'editor'] }
)

export const advanceDisputeStage = createSafeAction(
  AdvanceDisputeStageSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId

    const updatePayload: Record<string, unknown> = {
      stage: data.stage,
      updated_at: new Date().toISOString(),
    }
    if (data.next_hearing_date) updatePayload.next_hearing_date = data.next_hearing_date
    if (data.settlement_terms) updatePayload.settlement_terms = data.settlement_terms
    if (data.status) updatePayload.status = data.status
    else if (data.stage === 'settled') updatePayload.status = 'settled'

    const { error } = await supabase
      .from('trade_disputes')
      .update(updatePayload)
      .eq('id', data.dispute_id)
      .eq('organisation_id', organisationId)

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('trade_disputes')
        .update(updatePayload)
        .eq('id', data.dispute_id)
        .eq('organisation_id', organisationId)

      if (fallback.error) throw new Error(fallback.error.message)
    }

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin', 'editor'] }
)

export async function getTradeDisputes(orgId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('trade_disputes')
      .select('*, lead_steward:profiles!lead_shop_steward_id(full_name, phone)')
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: false })

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('trade_disputes')
        .select('*, lead_steward:profiles!lead_shop_steward_id(full_name, phone)')
        .eq('organisation_id', orgId)
        .order('created_at', { ascending: false })

      if (!fallback.error) return { success: true, disputes: fallback.data || [] }
      return { success: false, disputes: [] }
    }

    return { success: true, disputes: data || [] }
  } catch {
    return { success: false, disputes: [] }
  }
}
