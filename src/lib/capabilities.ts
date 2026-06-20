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
  ai_features: false
}

export function getOrgTypeDefaults(orgType?: string | null): Record<OrgCapability, boolean> {
  if (orgType === 'ngo') {
    return { ...BASE_CAPABILITIES, volunteers: true, donations: true, campaigns: true, coalition_tools: true, transparency_mode: true, memberships: true, volunteer_engine: true }
  }
  if (orgType === 'student_union') {
    return { ...BASE_CAPABILITIES, student_ids: true, events: true, voting_engine: true, grievances: true, federation_mode: true, campaigns: true, memberships: true }
  }
  if (orgType === 'workers_union') {
    return { ...BASE_CAPABILITIES, grievances: true, voting_engine: true, federation_mode: true, campaigns: true, memberships: true }
  }
  if (orgType === 'rwa') {
    return { ...BASE_CAPABILITIES, maintenance: true, complaints: true, donations: true, voting_engine: true, events: true, memberships: true }
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
      actor_id: '00000000-0000-0000-0000-000000000000' // System
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
