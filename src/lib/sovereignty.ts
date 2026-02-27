import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { logger } from '@/lib/logger'

export type OrganisationData = {
  organisation: any
  members: any[]
  forms: any[]
  form_submissions: any[]
  meetings: any[]
  donations: any[]
  audit_logs: any[]
  exported_at: string
}

export async function exportOrganisationData(): Promise<OrganisationData | null> {
  const supabase = await createClient()
  
  // Enforce auth context
  let orgId: string
  try {
    orgId = await getSelectedOrganisationId()
  } catch (error) {
    logger.error('sovereignty', 'Export failed: No organisation context', { error })
    return null
  }

  // Fetch all related data in parallel (RLS ensures data isolation)
  const [
    orgRes,
    membersRes,
    formsRes,
    submissionsRes,
    meetingsRes,
    donationsRes,
    auditRes
  ] = await Promise.all([
    supabase.from('organisations').select('*').eq('id', orgId).single(),
    supabase.from('members').select('*').eq('organisation_id', orgId),
    supabase.from('forms').select('*').eq('organisation_id', orgId),
    supabase.from('form_submissions').select('*').eq('organisation_id', orgId),
    supabase.from('meetings').select('*').eq('organisation_id', orgId),
    supabase.from('donations').select('*').eq('organisation_id', orgId),
    supabase.from('audit_logs').select('*').eq('organisation_id', orgId)
  ])

  if (orgRes.error) {
    logger.error('sovereignty', 'Export failed: Could not fetch organisation', { error: orgRes.error })
    throw new Error('Export failed')
  }

  // Construct the sovereignty package
  const packageData: OrganisationData = {
    organisation: orgRes.data,
    members: membersRes.data || [],
    forms: formsRes.data || [],
    form_submissions: submissionsRes.data || [],
    meetings: meetingsRes.data || [],
    donations: donationsRes.data || [],
    audit_logs: auditRes.data || [],
    exported_at: new Date().toISOString()
  }

  // Log the sovereignty event
  await logger.info('sovereignty', `Data export generated for org ${orgId}`, {
    member_count: packageData.members.length,
    form_count: packageData.forms.length
  })

  return packageData
}
