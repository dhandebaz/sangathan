import { createServiceClient } from '@/lib/supabase/service'

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type OrgCapability = 
  | 'basic_governance' 
  | 'advanced_analytics' 
  | 'federation_mode' 
  | 'voting_engine' 
  | 'volunteer_engine' 
  | 'transparency_mode' 
  | 'coalition_tools'

export const DEFAULT_CAPABILITIES: Record<OrgCapability, boolean> = {
  basic_governance: true,
  advanced_analytics: false,
  federation_mode: true,
  voting_engine: true,
  volunteer_engine: true,
  transparency_mode: false,
  coalition_tools: false
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
  const { data: org } = await supabase.from('organisations').select('capabilities').eq('id', orgId).single()
  const current = (org?.capabilities as Record<string, boolean> || DEFAULT_CAPABILITIES)
  
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


export async function checkCapability(orgId: string, capability: OrgCapability): Promise<boolean> {
  let supabase
  try {
    supabase = createServiceClient()
  } catch (error) {
    console.error('Capability check fallback: service client not configured', error)
    return DEFAULT_CAPABILITIES[capability] || false
  }
  
  const { data } = await supabase
    .from('organisations')
    .select('capabilities')
    .eq('id', orgId)
    .single()
    
  if (!data || !data.capabilities) return DEFAULT_CAPABILITIES[capability] || false
  
  const capabilities = data.capabilities as Record<string, boolean>
  return !!capabilities[capability]
}

export async function getOrgCapabilities(orgId: string): Promise<Record<string, boolean>> {
  let supabase
  try {
    supabase = createServiceClient()
  } catch (error) {
    console.error('Org capabilities fallback: service client not configured', error)
    return DEFAULT_CAPABILITIES
  }
  
  const { data } = await supabase
    .from('organisations')
    .select('capabilities')
    .eq('id', orgId)
    .single()
    
  if (!data || !data.capabilities) return DEFAULT_CAPABILITIES
  
  const capabilities = data.capabilities as Record<string, boolean>
  return { ...DEFAULT_CAPABILITIES, ...capabilities }
}
