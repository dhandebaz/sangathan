import { createServiceClient } from '@/lib/supabase/service'
import type { Json } from '@/types/database'

export type OrgCapability =
  | 'basic_governance'
  | 'advanced_analytics'
  | 'federation_mode'
  | 'voting_engine'
  | 'volunteer_engine'
  | 'transparency_mode'
  | 'coalition_tools'
  | 'campaigns'
  | 'grievances'
  | 'complaints'
  | 'maintenance'
  | 'donations'
  | 'volunteers'
  | 'student_ids'
  | 'events'
  | 'memberships'
  | 'ai_features'
  | 'compliance'
  | 'grants'
  | 'cba_documents'
  | 'visitors'
  | 'jobs'
  | 'dues'
  | 'elections'
  | 'meetings'
  | 'subgroups'
  | 'tasks'
  | 'disputes'
  | 'domestic_staff'
  | 'assets_amc'
  | 'volunteer_certificates'
  | 'hostel_mess'
  | 'election_counting'
  | 'field_audits'
  | 'press_releases'
  | 'receiving_tracker'
  | 'parcha_generator'

// System role permissions matrix
export const SYSTEM_ROLE_PERMISSIONS: Record<string, Record<string, boolean>> = {
  can_edit: {
    create_complaint: true,
    edit_own_complaint: true,
    edit_any_complaint: false,
    delete_complaint: false,
    comment_on_complaint: true,
    vote_on_complaint: true,
    assign_complaint: false,
    manage_members: false,
    manage_roles: false,
    manage_org_settings: false,
    change_plan: false,
    delete_org: false,
    remove_primary_admin: false,
    view_analytics: true,
    export_data: false,
    print_complaints: true,
    create_task: true,
    edit_own_task: true,
    edit_any_task: false,
    delete_task: false,
    create_meeting: true,
    manage_subgroups: false,
    manage_campaigns: false,
    manage_financials: false,
  },
  can_comment: {
    create_complaint: false,
    edit_own_complaint: false,
    edit_any_complaint: false,
    delete_complaint: false,
    comment_on_complaint: true,
    vote_on_complaint: true,
    assign_complaint: false,
    manage_members: false,
    manage_roles: false,
    manage_org_settings: false,
    change_plan: false,
    delete_org: false,
    remove_primary_admin: false,
    view_analytics: true,
    export_data: false,
    print_complaints: true,
    create_task: false,
    edit_own_task: false,
    edit_any_task: false,
    delete_task: false,
    create_meeting: false,
    manage_subgroups: false,
    manage_campaigns: false,
    manage_financials: false,
  },
  can_manage: {
    create_complaint: true,
    edit_own_complaint: true,
    edit_any_complaint: true,
    delete_complaint: false,
    comment_on_complaint: true,
    vote_on_complaint: true,
    assign_complaint: true,
    manage_members: true,
    manage_roles: false,
    manage_org_settings: true,
    change_plan: false,
    delete_org: false,
    remove_primary_admin: false,
    view_analytics: true,
    export_data: true,
    print_complaints: true,
    create_task: true,
    edit_own_task: true,
    edit_any_task: true,
    delete_task: true,
    create_meeting: true,
    manage_subgroups: true,
    manage_campaigns: true,
    manage_financials: true,
  },
  second_admin: {
    create_complaint: true,
    edit_own_complaint: true,
    edit_any_complaint: true,
    delete_complaint: true,
    comment_on_complaint: true,
    vote_on_complaint: true,
    assign_complaint: true,
    manage_members: true,
    manage_roles: true,
    manage_org_settings: true,
    change_plan: false,
    delete_org: false,
    remove_primary_admin: false,
    view_analytics: true,
    export_data: true,
    print_complaints: true,
    create_task: true,
    edit_own_task: true,
    edit_any_task: true,
    delete_task: true,
    create_meeting: true,
    manage_subgroups: true,
    manage_campaigns: true,
    manage_financials: true,
  },
}

export function getSystemRolePermissions(role: string): Record<string, boolean> {
  return SYSTEM_ROLE_PERMISSIONS[role] || {}
}

export function hasPermission(role: string, permission: string): boolean {
  const perms = getSystemRolePermissions(role)
  return perms[permission] === true
}

// Check if a role can manage another role (hierarchy)
export const ROLE_HIERARCHY: Record<string, number> = {
  can_comment: 10,
  can_edit: 20,
  can_manage: 30,
  second_admin: 40,
  admin: 50,
  executive: 60,
}

export function canAssignRole(actorRole: string, targetRole: string): boolean {
  const actorLevel = ROLE_HIERARCHY[actorRole] || 0
  const targetLevel = ROLE_HIERARCHY[targetRole] || 0
  // Can assign roles at or below your level, except primary admin actions
  return actorLevel >= targetLevel
}

// Check if role is a system role
export function isSystemRole(role: string): boolean {
  return role in SYSTEM_ROLE_PERMISSIONS
}

// Get available roles for assignment based on actor's role and plan
export function getAssignableRoles(actorRole: string, planName: string): string[] {
  const allRoles = ['can_comment', 'can_edit', 'can_manage', 'second_admin']
  
  // Community plan: only can_edit and can_comment
  if (planName === 'Community') {
    return ['can_comment', 'can_edit']
  }
  
  // Filter by hierarchy
  return allRoles.filter(r => canAssignRole(actorRole, r))
}

export const BASE_CAPABILITIES: Record<OrgCapability, boolean> = {
  basic_governance: true,
  advanced_analytics: false,
  federation_mode: false,
  voting_engine: false,
  volunteer_engine: false,
  transparency_mode: false,
  coalition_tools: false,
  campaigns: false,
  grievances: false,
  complaints: false,
  maintenance: false,
  donations: false,
  volunteers: false,
  student_ids: false,
  events: false,
  memberships: false,
  ai_features: false,
  compliance: true,
  grants: false,
  cba_documents: false,
  visitors: false,
  jobs: false,
  dues: false,
  elections: false,
  meetings: true,
  subgroups: true,
  tasks: true,
  disputes: false,
  domestic_staff: false,
  assets_amc: false,
  volunteer_certificates: false,
  hostel_mess: false,
  election_counting: false,
  field_audits: false,
  press_releases: false,
  receiving_tracker: false,
  parcha_generator: false,
}

export function getOrgTypeDefaults(orgType?: string | null): Record<OrgCapability, boolean> {
  if (orgType === 'civic_collective') {
    return { ...BASE_CAPABILITIES, volunteers: true, volunteer_certificates: true, donations: true, campaigns: true, coalition_tools: true, transparency_mode: true, memberships: true, volunteer_engine: true, federation_mode: true, voting_engine: true, events: true, elections: true, dues: true, compliance: false, meetings: true, subgroups: true, tasks: true, field_audits: true, press_releases: true, receiving_tracker: true, parcha_generator: true }
  }
  if (orgType === 'ngo') {
    return { ...BASE_CAPABILITIES, volunteers: true, volunteer_certificates: true, donations: true, campaigns: true, coalition_tools: true, transparency_mode: true, memberships: true, volunteer_engine: true, federation_mode: true, grants: true, events: true, elections: true, dues: true, compliance: true, meetings: true, subgroups: true, press_releases: true, field_audits: true, receiving_tracker: true, parcha_generator: true }
  }
  if (orgType === 'student_union') {
    return { ...BASE_CAPABILITIES, student_ids: true, events: true, voting_engine: true, grievances: true, federation_mode: true, campaigns: true, memberships: true, elections: true, election_counting: true, hostel_mess: true, subgroups: true, compliance: true, meetings: true, dues: true }
  }
  if (orgType === 'workers_union') {
    return { ...BASE_CAPABILITIES, grievances: true, disputes: true, voting_engine: true, federation_mode: true, campaigns: true, memberships: true, cba_documents: true, jobs: true, dues: true, elections: true, events: true, compliance: true, meetings: true, subgroups: true }
  }
  if (orgType === 'rwa') {
    return { ...BASE_CAPABILITIES, maintenance: true, domestic_staff: true, assets_amc: true, complaints: true, donations: true, voting_engine: true, events: true, memberships: true, visitors: true, elections: true, grievances: true, compliance: true, meetings: true, subgroups: true }
  }

  return { ...BASE_CAPABILITIES, voting_engine: true, federation_mode: true, volunteer_engine: true }
}

// Logic to unlock capabilities based on org maturity
export async function unlockCapabilities(orgId: string) {
  let supabase
  try {
    supabase = createServiceClient()
  } catch (error) {
    console.error('Capabilities unlock skipped: service client not configured', error)
    return
  }
  
  // 1. Fetch Stats
  const [members, events] = await Promise.all([
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).eq('status', 'active'),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).lt('end_time', new Date().toISOString())
  ])
  
  const memberCount = members.count || 0
  const completedEvents = events.count || 0
  
  // 2. Fetch Current Capabilities
  const { data: org } = await supabase.from('organisations').select('capabilities, org_type').eq('id', orgId).single()
  const defaults = getOrgTypeDefaults(org?.org_type)
  const current = (org?.capabilities as Record<string, boolean> || defaults)
  
  const updates: Record<string, boolean> = {}
  let hasUpdates = false
  
  // 3. Apply Rules
  // Rule: 10+ members -> Unlock Voting & Tasks
  if (memberCount >= 10) {
    if (!current.voting_engine) { updates.voting_engine = true; hasUpdates = true; }
    if (!current.volunteer_engine) { updates.volunteer_engine = true; hasUpdates = true; }
  }
  
  // Rule: 1 Event Completed -> Unlock Analytics
  if (completedEvents >= 1) {
    if (!current.advanced_analytics) { updates.advanced_analytics = true; hasUpdates = true; }
  }
  
  // 4. Update if needed
  if (hasUpdates) {
    const newCapabilities = { ...current, ...updates }
    await supabase.from('organisations').update({ capabilities: newCapabilities }).eq('id', orgId)
    
    // Log Unlock
    await supabase.from('audit_logs').insert({
      organisation_id: orgId,
      action: 'capabilities_unlocked',
      resource_table: 'organisations',
      resource_id: orgId,
      details: updates as Json,
    })
  }
}

/**
 * Checks if an organisation has a specific capability.
 * 
 * @param orgId The Organisation ID
 * @param capability The capability key to check
 * @param shouldThrow If true, throws an error on failure (Server Action mode) or redirects (Page mode)
 */
export async function checkCapability(orgId: string, capability: OrgCapability, shouldThrow: boolean = false): Promise<boolean> {
  let supabase
  try {
    supabase = createServiceClient()
  } catch (error) {
    console.error('Capability check fallback: service client not configured', error)
    if (shouldThrow) throw new Error('System Configuration Error')
    return getOrgTypeDefaults()[capability] || false
  }
  
  const { data } = await supabase
    .from('organisations')
    .select('capabilities, org_type')
    .eq('id', orgId)
    .single()
    
  const defaults = getOrgTypeDefaults(data?.org_type)
  
  if (!data || !data.capabilities) {
      if (shouldThrow && !defaults[capability]) {
          throw new Error(`Access Denied: Capability '${capability}' is not enabled for this organisation.`)
      }
      return defaults[capability] || false
  }
  
  const stored = data.capabilities as Record<string, boolean>
  const hasCap = !!stored[capability] || !!defaults[capability]
  
  if (!hasCap && shouldThrow) {
      throw new Error(`Access Denied: Capability '${capability}' is locked.`)
  }
  
  return hasCap
}

export async function requireCapability(orgId: string, capability: OrgCapability) {
    return checkCapability(orgId, capability, true)
}

export async function getOrgCapabilities(orgId: string): Promise<Record<string, boolean>> {
  let supabase
  try {
    supabase = createServiceClient()
  } catch (error) {
    console.error('Org capabilities fallback: service client not configured', error)
    return getOrgTypeDefaults()
  }
  
  const { data } = await supabase
    .from('organisations')
    .select('capabilities, org_type')
    .eq('id', orgId)
    .single()
    
  const defaults = getOrgTypeDefaults(data?.org_type)
  if (!data || !data.capabilities) return defaults
  
  const capabilities = data.capabilities as Record<string, boolean>
  return { ...defaults, ...capabilities }
}
