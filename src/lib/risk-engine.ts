'use server'

import { createServiceClient } from '@/lib/supabase/service'

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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

interface RiskEvent {
  entity_type: 'org' | 'user' | 'member' | 'event'
  entity_id: string
  risk_type: string
  severity: 'low' | 'medium' | 'high'
  metadata?: Json
}

export async function logRiskEvent(event: RiskEvent) {
  const supabase = createServiceClient()
  const payload = {
    entity_type: event.entity_type,
    entity_id: event.entity_id,
    risk_type: event.risk_type,
    severity: event.severity,
    metadata: event.metadata ?? {},
  }

  await supabase.from('system_logs').insert({
    level: 'security',
    source: 'risk_engine',
    message: `Risk event: ${event.risk_type}`,
    metadata: payload as Json,
  } as never)

  // Take action based on severity
  if (event.severity === 'high' && event.entity_type === 'org') {
     // Auto-suspend or flag for review
     await supabase.from('organisations').update({ status: 'warning' }).eq('id', event.entity_id)
  }
}

export async function restrictOrg(event: { entity_id: string }) {
    const supabase = createServiceClient()
    const restricted = {
        transparency_mode: false,
        federation_mode: false,
        broadcast_restricted: true
    }
    await supabase.from('organisations').update({ capabilities: restricted }).eq('id', event.entity_id)
    
    // Log the platform action
    await supabase.from('platform_actions').insert({
        action_type: 'restriction',
        target_org_id: event.entity_id,
        severity: 'medium',
        reason: 'Automated broadcast limit enforcement',
        created_by: 'system'
    })
}
