'use server'

import { createServiceClient } from '@/lib/supabase/service'

// --- Risk Scoring Logic ---

// Rate Limit Thresholds (Configurable)
const MAX_OTP_PER_PHONE_HOUR = 5
const MAX_OTP_PER_IP_HOUR = 20
const MAX_BROADCASTS_PER_ORG_DAY = 3
const FORM_SPAM_THRESHOLD_PER_IP_HOUR = 10

export async function detectOTPRisk(phone: string, ip: string) {
  const supabase = createServiceClient()
  
  // Clean up old attempts (Naive approach, better to use cron or expiration)
  await supabase.from('otp_attempts').delete().lt('attempted_at', new Date(Date.now() - 3600000).toISOString())
  
  // Log attempt
  await supabase.from('otp_attempts').insert({ phone, ip_address: ip })
  
  // Check counts
  const { count: phoneCount } = await supabase.from('otp_attempts').select('*', { count: 'exact', head: true }).eq('phone', phone)
  const { count: ipCount } = await supabase.from('otp_attempts').select('*', { count: 'exact', head: true }).eq('ip_address', ip)
  
  if ((phoneCount || 0) > MAX_OTP_PER_PHONE_HOUR || (ipCount || 0) > MAX_OTP_PER_IP_HOUR) {
     await logRiskEvent({
       entity_type: 'user',
       entity_id: '00000000-0000-0000-0000-000000000000', // Placeholder or actual user if known
       risk_type: 'otp_abuse',
       severity: 'high',
       metadata: { phone, ip, phoneCount, ipCount }
     })
     return { blocked: true }
  }
  
  return { blocked: false }
}

export async function checkBroadcastLimit(orgId: string) {
  const supabase = createServiceClient()
  
  // Check daily broadcasts
  const { count: dailyCount } = await supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true })
    .eq('organisation_id', orgId)
    .eq('send_email', true)
    .gte('created_at', new Date(Date.now() - 86400000).toISOString())
    
  if ((dailyCount || 0) >= MAX_BROADCASTS_PER_ORG_DAY) {
     await logRiskEvent({
       entity_type: 'org',
       entity_id: orgId,
       risk_type: 'broadcast_spam',
       severity: 'medium',
       metadata: { dailyCount }
     })
     return { allowed: false, reason: 'Daily broadcast limit reached.' }
  }
  
  // Check recipient volume (if we track it per hour)
  // For now, simple daily count check is good start.
  
  return { allowed: true }
}

export async function checkFormSpam(orgId: string, ip: string) {
  const supabase = createServiceClient()
  
  const { count } = await supabase
    .from('form_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip) // Assuming we log IP on submission
    .gte('created_at', new Date(Date.now() - 3600000).toISOString())
    
  if ((count || 0) > FORM_SPAM_THRESHOLD_PER_IP_HOUR) {
     await logRiskEvent({
       entity_type: 'org',
       entity_id: orgId,
       risk_type: 'bot_forms',
       severity: 'high',
       metadata: { ip, count }
     })
     return { blocked: true }
  }
  
  return { blocked: false }
}

export async function logRiskEvent(event: {
  entity_type: 'org' | 'user' | 'member' | 'event',
  entity_id: string,
  risk_type: 'spam_signup' | 'otp_abuse' | 'broadcast_spam' | 'bot_forms' | 'donation_spike' | 'unusual_growth' | 'suspicious_collaboration',
  severity: 'low' | 'medium' | 'high',
  metadata?: Record<string, unknown>
}) {
  const supabase = createServiceClient()
  
  await supabase.from('risk_events').insert({
    ...event,
    detected_at: new Date().toISOString()
  })
  
  // Auto-escalate if high severity
  if (event.severity === 'high' && event.entity_type === 'org') {
     // 1. Set Warning Status
     await supabase.from('organisations').update({ status: 'warning' }).eq('id', event.entity_id)
     
     // 2. Restrict Capabilities (Auto-Response)
     const { data: orgData } = await supabase.from('organisations').select('capabilities').eq('id', event.entity_id).single()
     const org = orgData as { capabilities: Record<string, unknown> } | null
     if (org?.capabilities) {
        const restricted = { 
           ...org.capabilities, 
           transparency_mode: false, // Hide badge
           federation_mode: false, // Stop networking
           broadcast_restricted: true // Custom flag or just capability removal
        }
        await supabase.from('organisations').update({ capabilities: restricted }).eq('id', event.entity_id)
        
        // Log Action
        await supabase.from('platform_actions').insert({
           action_type: 'restriction',
           target_org_id: event.entity_id,
           severity: 'level_2',
           reason: `Auto-restriction due to High Severity Risk: ${event.risk_type}`,
           created_by: '00000000-0000-0000-0000-000000000000'
        })
     }
  }
}
