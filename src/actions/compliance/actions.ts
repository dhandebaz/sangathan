'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { enqueueJob } from '@/lib/queue'
import { softDelete } from '@/lib/db-utils'

// 1. Request Data Export (Async)
export async function requestDataExport() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  const adminClient = createServiceClient()
  
  // Get User Org
  const { data: profile } = await adminClient
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()
    
  if (!profile || (profile as any).role !== 'admin') {
    return { error: 'Only admins can export organisation data' }
  }
  
  // Log Request
  const { data: request, error } = await adminClient
    .from('data_requests')
    .insert({
      organisation_id: (profile as any).organisation_id,
      user_id: user.id,
      request_type: 'export',
      status: 'pending'
    } as any)
    .select()
    .single()
    
  if (error) return { error: 'Failed to create request' }
  
  // Queue Job
  await enqueueJob('export_data', { 
    requestId: (request as any).id, 
    organisationId: (profile as any).organisation_id,
    userId: user.id 
  })
  
  await logger.security('compliance', `Data export requested by ${user.email}`, { orgId: (profile as any).organisation_id })
  
  return { success: true, message: 'Export started. You will receive an email when ready.' }
}

// 2. Request Account Deletion
export async function requestAccountDeletion() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  const adminClient = createServiceClient()
  
  // Log Request
  const { error } = await adminClient
    .from('data_requests')
    .insert({
      user_id: user.id,
      request_type: 'deletion',
      status: 'pending',
      details: { reason: 'User requested via dashboard' }
    } as any)
    
  if (error) return { error: 'Failed to submit deletion request' }
  
  await logger.security('compliance', `Account deletion requested by ${user.email}`)
  
  return { success: true, message: 'Deletion request received. Processing within 7 days.' }
}

// 3. Delete Organisation (Soft Delete)
export async function deleteOrganisation(orgId: string, confirmation: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Unauthorized' }
  if (confirmation !== 'DELETE') return { error: 'Invalid confirmation' }
  
  const adminClient = createServiceClient()
  
  // Verify Admin
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role, organisation_id')
    .eq('id', user.id)
    .single()
    
  if (!profile || (profile as any).role !== 'admin' || (profile as any).organisation_id !== orgId) {
    return { error: 'Unauthorized' }
  }
  
  // Check Legal Hold
  const { data: org } = await adminClient
    .from('organisations')
    .select('legal_hold')
    .eq('id', orgId)
    .single()
    
  if (org && (org as any).legal_hold) {
    await logger.security('compliance', `Blocked deletion attempt on Legal Hold org ${orgId}`)
    return { error: 'Organisation is under Legal Hold and cannot be deleted.' }
  }
  
  // Soft Delete Org
  await softDelete('organisations', orgId, user.id)
  
  // Soft Delete Members (Cascade logic usually handles this in hard delete, but for soft delete we might need a job)
  // For now, simple org-level flag is enough to hide data in UI
  
  await logger.critical('compliance', `Organisation ${orgId} soft-deleted by ${user.email}`)
  
  return { success: true }
}
