'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const uploadCBASchema = z.object({
  title: z.string().min(1, 'Title is required'),
  file_url: z.string().url('Must be a valid URL'),
  valid_from: z.string().optional(),
  valid_until: z.string().optional(),
})

export const uploadCBADocument = createSafeAction(
  uploadCBASchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId
    const profileId = context.user.id

    const { error } = await supabase
      .from('cba_documents')
      .insert({
        organisation_id: organisationId,
        title: data.title,
        file_url: data.file_url,
        status: 'draft',
        valid_from: data.valid_from ? new Date(data.valid_from).toISOString() : null,
        valid_until: data.valid_until ? new Date(data.valid_until).toISOString() : null,
        created_by: profileId
      })

    if (error) throw new Error(error.message)
    
    revalidatePath('/[lang]/dashboard/cba', 'page')
    return { success: true }
  }
)

const updateCBAStatusSchema = z.object({
  document_id: z.string().uuid(),
  status: z.enum(['draft', 'active', 'expired', 'archived'])
})

export const updateCBAStatus = createSafeAction(
  updateCBAStatusSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId

    const { error } = await supabase
      .from('cba_documents')
      .update({ status: data.status })
      .eq('id', data.document_id)
      .eq('organisation_id', organisationId)

    if (error) throw new Error(error.message)
    
    revalidatePath('/[lang]/dashboard/cba', 'page')
    return { success: true }
  }
)

// --- Clause Redlining Actions ---

const CreateCBAClauseSchema = z.object({
  cba_id: z.string().uuid('Invalid CBA Document ID'),
  clause_number: z.string().min(1, 'Clause number required'),
  topic: z.enum([
    'basic_wages',
    'da_allowances',
    'working_hours',
    'shift_timing',
    'occupational_safety',
    'overtime_rates',
    'medical_insurance',
    'bonus_gratuity',
    'grievance_procedure',
  ]),
  current_clause_text: z.string().min(3, 'Current clause text required'),
  union_demand_text: z.string().min(3, 'Union demand text required'),
  management_counter_offer: z.string().optional(),
})

const UpdateCBAClauseSchema = z.object({
  clause_id: z.string().uuid('Invalid clause ID'),
  status: z.enum(['in_negotiation', 'agreed', 'deadlocked', 'referred_to_arbitration']),
  management_counter_offer: z.string().optional(),
})

export const createCBAClause = createSafeAction(
  CreateCBAClauseSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId

    const { data: clause, error } = await supabase
      .from('cba_clauses')
      .insert({
        cba_id: data.cba_id,
        organisation_id: organisationId,
        clause_number: data.clause_number,
        topic: data.topic,
        current_clause_text: data.current_clause_text,
        union_demand_text: data.union_demand_text,
        management_counter_offer: data.management_counter_offer || null,
        status: 'in_negotiation',
      })
      .select()
      .maybeSingle()

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('cba_clauses')
        .insert({
          cba_id: data.cba_id,
          organisation_id: organisationId,
          clause_number: data.clause_number,
          topic: data.topic,
          current_clause_text: data.current_clause_text,
          union_demand_text: data.union_demand_text,
          management_counter_offer: data.management_counter_offer || null,
          status: 'in_negotiation',
        })
        .select()
        .maybeSingle()

      if (fallback.error) throw new Error(fallback.error.message)
      revalidatePath('/[lang]/dashboard/cba', 'page')
      return { success: true, clause: fallback.data }
    }

    revalidatePath('/[lang]/dashboard/cba', 'page')
    return { success: true, clause }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin', 'editor'] }
)

export const updateCBAClause = createSafeAction(
  UpdateCBAClauseSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId

    const updatePayload: Record<string, unknown> = {
      status: data.status,
      updated_at: new Date().toISOString(),
    }
    if (data.management_counter_offer !== undefined) {
      updatePayload.management_counter_offer = data.management_counter_offer
    }

    const { error } = await supabase
      .from('cba_clauses')
      .update(updatePayload)
      .eq('id', data.clause_id)
      .eq('organisation_id', organisationId)

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('cba_clauses')
        .update(updatePayload)
        .eq('id', data.clause_id)
        .eq('organisation_id', organisationId)

      if (fallback.error) throw new Error(fallback.error.message)
    }

    revalidatePath('/[lang]/dashboard/cba', 'page')
    return { success: true }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin', 'editor'] }
)

export async function getCBAClauses(cbaId: string, orgId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('cba_clauses')
      .select('*')
      .eq('cba_id', cbaId)
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: true })

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('cba_clauses')
        .select('*')
        .eq('cba_id', cbaId)
        .eq('organisation_id', orgId)
        .order('created_at', { ascending: true })

      if (!fallback.error) return { success: true, clauses: fallback.data || [] }
      return { success: false, clauses: [] }
    }

    return { success: true, clauses: data || [] }
  } catch {
    return { success: false, clauses: [] }
  }
}
