import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import type { Json } from '@/types/database'

export type JobType = 'send_email' | 'process_webhook' | 'audit_log_batch' | 'export_data'

export type JobPayload = Json

export interface JobDefinition {
  type: JobType
  payload: JobPayload
}

export async function enqueueJob(type: JobType, payload: JobPayload) {
  return enqueueJobs([{ type, payload }])
}

export async function enqueueJobs(jobs: JobDefinition[]) {
  if (jobs.length === 0) return true

  const supabase = createServiceClient()
  
  try {
    const { error } = await supabase.from('system_jobs').insert(
      jobs.map(job => ({
        type: job.type,
        payload: job.payload,
        status: 'pending',
        attempts: 0
      }))
    )

    if (error) throw error
    
    return true
  } catch (err) {
    logger.error('queue', `Failed to enqueue ${jobs.length} jobs`, {
      error: err as Record<string, unknown>,
      jobTypes: Array.from(new Set(jobs.map(j => j.type)))
    })
    return false
  }
}

export async function processNextJob() {
  const supabase = createServiceClient()
  
  // 1. Lock next job
  // We need a custom RPC for 'SELECT FOR UPDATE SKIP LOCKED' because Supabase JS doesn't support it directly
  // Fallback: Optimistic locking
  
  const { data: job, error } = await supabase.rpc('lock_next_job')
  
  if (error || !job) return null

  try {
    logger.info('queue', `Processing job ${job.id} (${job.type})`)
    
    // --- JOB HANDLERS ---
    switch (job.type) {
      case 'send_email':
        // Emails are now fully handled by Supabase Auth / Triggers directly
        break
      case 'process_webhook':
        // await processWebhook(job.payload)
        break
      default:
        // Allow other job types to pass if handled elsewhere, or throw
        // For now we just log warning for unimplemented types
        logger.warn('queue', `Unimplemented job type: ${job.type}`)
    }
    
    // Success
    await supabase.from('system_jobs').update({
      status: 'completed',
      updated_at: new Date().toISOString()
    }).eq('id', job.id)
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    logger.error('queue', `Job ${job.id} failed`, { error: err as Record<string, unknown> })
    
    const nextStatus = job.attempts >= (job.max_attempts || 3) ? 'failed' : 'pending'
    // Exponential backoff could be calculated here for next 'locked_until'
    
    await supabase.from('system_jobs').update({
      status: nextStatus,
      attempts: job.attempts + 1,
      last_error: errorMessage,
      updated_at: new Date().toISOString()
    }).eq('id', job.id)
  }
}
