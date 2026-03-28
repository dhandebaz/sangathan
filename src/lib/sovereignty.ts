import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { logger } from '@/lib/logger'

export type OrganisationData = {
  organisation: Record<string, unknown> | null
  members: Record<string, unknown>[]
  forms: Record<string, unknown>[]
  form_submissions: Record<string, unknown>[]
  meetings: Record<string, unknown>[]
  donations: Record<string, unknown>[]
  audit_logs: Record<string, unknown>[]
  exported_at: string
}

export async function exportOrganisationData(): Promise<OrganisationData | null> {
  const supabase = await createClient()

  let orgId: string
  try {
    orgId = await getSelectedOrganisationId()
  } catch (error) {
    logger.error('sovereignty', 'Export failed: No organisation context', { error })
    return null
  }

  const [
    orgRes,
    membersRes,
    formsRes,
    submissionsRes,
    meetingsRes,
    donationsRes,
    auditRes,
  ] = await Promise.all([
    supabase.from('organisations').select('*').eq('id', orgId).single(),
    supabase.from('members').select('*').eq('organisation_id', orgId),
    supabase.from('forms').select('*').eq('organisation_id', orgId),
    supabase.from('form_submissions').select('*').eq('organisation_id', orgId),
    supabase.from('meetings').select('*').eq('organisation_id', orgId),
    supabase.from('donations').select('*').eq('organisation_id', orgId),
    supabase.from('audit_logs').select('*').eq('organisation_id', orgId),
  ])

  if (orgRes.error) {
    logger.error('sovereignty', 'Export failed: Could not fetch organisation', { error: orgRes.error })
    throw new Error('Export failed')
  }

  const packageData: OrganisationData = {
    organisation: (orgRes.data as Record<string, unknown> | null) || null,
    members: (membersRes.data as Record<string, unknown>[] | null) || [],
    forms: (formsRes.data as Record<string, unknown>[] | null) || [],
    form_submissions: (submissionsRes.data as Record<string, unknown>[] | null) || [],
    meetings: (meetingsRes.data as Record<string, unknown>[] | null) || [],
    donations: (donationsRes.data as Record<string, unknown>[] | null) || [],
    audit_logs: (auditRes.data as Record<string, unknown>[] | null) || [],
    exported_at: new Date().toISOString(),
  }

  await logger.info('sovereignty', `Data export generated for org ${orgId}`, {
    member_count: packageData.members.length,
    form_count: packageData.forms.length,
  })

  return packageData
}
