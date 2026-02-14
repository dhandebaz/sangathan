import { createServiceClient } from '@/lib/supabase/service'

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
  federation_mode: false,
  voting_engine: false,
  volunteer_engine: false,
  transparency_mode: false, // Default false for new orgs until criteria met
  coalition_tools: false
}

// Logic to unlock capabilities based on org maturity
export async function unlockCapabilities(orgId: string) {
  const supabase = createServiceClient()
  
  // 1. Fetch Stats
  const [members, events] = await Promise.all([
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).eq('status', 'active'),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).lt('end_time', new Date().toISOString())
  ])
  
  const memberCount = members.count || 0
  const completedEvents = events.count || 0
  
  // 2. Fetch Current Capabilities
  const { data: org } = await supabase.from('organisations').select('capabilities').eq('id', orgId).single()
  const current = (org?.capabilities || DEFAULT_CAPABILITIES) as Record<string, boolean>
  
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
      details: updates,
      actor_id: '00000000-0000-0000-0000-000000000000' // System
    })
  }
}


export async function checkCapability(orgId: string, capability: OrgCapability): Promise<boolean> {
  const supabase = createServiceClient()
  
  const { data } = await supabase
    .from('organisations')
    .select('capabilities')
    .eq('id', orgId)
    .single()
    
  if (!data || !data.capabilities) return DEFAULT_CAPABILITIES[capability] || false
  
  // JSONB comes back as object
  return !!data.capabilities[capability]
}

export async function getOrgCapabilities(orgId: string): Promise<Record<string, boolean>> {
  const supabase = createServiceClient()
  
  const { data } = await supabase
    .from('organisations')
    .select('capabilities')
    .eq('id', orgId)
    .single()
    
  if (!data || !data.capabilities) return { basic_governance: true }
  
  return data.capabilities
}
