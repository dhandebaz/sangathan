'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { VALID_LEGAL_TYPES, validateStatutoryId, STATUTORY_ID_CONFIG } from '@/lib/legal-entity-types'
import type { LegalEntityType, StatutoryIdType } from '@/lib/legal-entity-types'
import type { OrgType } from '@/lib/org-types'

/**
 * Statutory ID columns in the organisations table.
 * Maps StatutoryIdType → DB column name.
 */
const STATUTORY_COLUMNS = Object.fromEntries(
  Object.entries(STATUTORY_ID_CONFIG).map(([key, config]) => [key, config.dbColumn])
) as Record<StatutoryIdType, string>

/**
 * All statutory + legal columns we read from organisations.
 */
const LEGAL_COLUMNS = [
  'org_type',
  'legal_entity_type',
  'governing_law',
  'registrar_authority',
  'registration_state',
  'registration_status',
  'registration_number',
  'incorporation_date',
  // Existing compliance fields
  'tax_id',        // PAN
  'darpan_id',     // NGO Darpan UID
  // New statutory ID columns (from migration 20260815000002)
  'tan',
  'gstin',
  'cin',
  'fcra_registration',
  'certificate_12a',
  'certificate_12a_valid_till',
  'certificate_80g',
  'certificate_80g_valid_till',
  'csr_registration',
  'trade_union_registration',
  'cooperative_registration',
  'society_registration',
  'trust_registration',
  'epfo_code',
  'esic_code',
  'udyam_registration',
] as const

// ─── Get Statutory Registration ──────────────────────────────────────────────

export async function getStatutoryRegistration(orgId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('organisations')
    .select(LEGAL_COLUMNS.join(', '))
    .eq('id', orgId)
    .maybeSingle()

  if (error) {
    console.error('getStatutoryRegistration Error:', error)
    return { success: false as const, error: 'Failed to fetch statutory registration' }
  }

  return { success: true as const, data }
}

// ─── Update Statutory Registration ───────────────────────────────────────────

export async function updateStatutoryRegistration(
  orgId: string,
  data: {
    legal_entity_type?: string
    registration_state?: string
    [key: string]: string | undefined
  }
) {
  const supabase = await createClient()

  // Get org_type to validate legal_entity_type
  const { data: orgData, error: orgError } = await supabase
    .from('organisations')
    .select('org_type')
    .eq('id', orgId)
    .maybeSingle()

  if (orgError || !orgData) {
    return { success: false as const, error: 'Organisation not found' }
  }

  const orgType = orgData.org_type as OrgType

  // Validate legal_entity_type against org_type
  if (data.legal_entity_type) {
    const validTypes = VALID_LEGAL_TYPES[orgType] || []
    if (!validTypes.includes(data.legal_entity_type as LegalEntityType)) {
      return { success: false as const, error: `Invalid legal entity type '${data.legal_entity_type}' for organisation type '${orgType}'` }
    }
  }

  // Validate statutory IDs using regex patterns
  const validationErrors: string[] = []
  const updatePayload: Record<string, string | undefined> = {}

  for (const [key, value] of Object.entries(data)) {
    if (!value) continue

    // Check if this key is a statutory ID type
    if (key in STATUTORY_ID_CONFIG) {
      const isValid = validateStatutoryId(key as StatutoryIdType, value)
      if (!isValid) {
        const config = STATUTORY_ID_CONFIG[key as StatutoryIdType]
        validationErrors.push(`Invalid ${config.en} format. Expected: ${config.example}`)
      } else {
        // Map to correct DB column
        updatePayload[STATUTORY_COLUMNS[key as StatutoryIdType]] = value.trim().toUpperCase()
      }
    } else {
      // Pass through non-statutory fields (legal_entity_type, registration_state, etc.)
      updatePayload[key] = value
    }
  }

  if (validationErrors.length > 0) {
    return { success: false as const, error: validationErrors.join('; ') }
  }

  const { error } = await supabase
    .from('organisations')
    .update(updatePayload)
    .eq('id', orgId)

  if (error) {
    console.error('updateStatutoryRegistration Error:', error)
    return { success: false as const, error: 'Failed to update statutory registration' }
  }

  revalidatePath('/[lang]/dashboard', 'layout')
  return { success: true as const }
}

// ─── Compliance Filings ──────────────────────────────────────────────────────

export async function getComplianceFilings(orgId: string, status?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('compliance_filings')
    .select('*')
    .eq('organisation_id', orgId)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query.order('due_date', { ascending: true })

  if (error) {
    console.error('getComplianceFilings Error:', error)
    return { success: false as const, error: 'Failed to fetch compliance filings' }
  }

  return { success: true as const, data: data || [] }
}

const CreateFilingSchema = z.object({
  filing_type: z.string().min(1, 'Filing type is required'),
  filing_name: z.string().min(1, 'Filing name is required'),
  authority: z.string().min(1, 'Authority is required'),
  financial_year: z.string().optional(),
  due_date: z.string().min(1, 'Due date is required'),
  status: z.enum(['pending', 'filed', 'overdue', 'exempt', 'not_applicable']).default('pending'),
  notes: z.string().optional(),
})

export async function createComplianceFiling(orgId: string, data: z.infer<typeof CreateFilingSchema>) {
  const result = CreateFilingSchema.safeParse(data)
  if (!result.success) {
    return { success: false as const, error: result.error.issues[0]?.message || 'Invalid filing data' }
  }

  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  const { error } = await supabase.from('compliance_filings').insert({
    organisation_id: orgId,
    filing_type: result.data.filing_type,
    filing_name: result.data.filing_name,
    authority: result.data.authority,
    financial_year: result.data.financial_year || null,
    due_date: result.data.due_date,
    status: result.data.status,
    notes: result.data.notes || null,
    created_by: user?.user?.id || null,
  })

  if (error) {
    console.error('createComplianceFiling Error:', error)
    return { success: false as const, error: 'Failed to create compliance filing' }
  }

  revalidatePath('/[lang]/dashboard', 'layout')
  return { success: true as const }
}

const UpdateFilingSchema = z.object({
  filing_name: z.string().optional(),
  due_date: z.string().optional(),
  filed_date: z.string().nullable().optional(),
  status: z.enum(['pending', 'filed', 'overdue', 'exempt', 'not_applicable']).optional(),
  filing_reference: z.string().nullable().optional(),
  document_url: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export async function updateComplianceFiling(filingId: string, data: z.infer<typeof UpdateFilingSchema>) {
  const result = UpdateFilingSchema.safeParse(data)
  if (!result.success) {
    return { success: false as const, error: result.error.issues[0]?.message || 'Invalid filing data' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('compliance_filings')
    .update(result.data)
    .eq('id', filingId)

  if (error) {
    console.error('updateComplianceFiling Error:', error)
    return { success: false as const, error: 'Failed to update compliance filing' }
  }

  revalidatePath('/[lang]/dashboard', 'layout')
  return { success: true as const }
}
