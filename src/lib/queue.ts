import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'

export type JobType = 'send_email' | 'process_webhook' | 'audit_log_batch' | 'export_data'

export interface JobPayload {
  [key: string]: any
}

export async function enqueueJob(type: JobType, payload: JobPayload) {
  const supabase = createServiceClient()
  
  try {
    const { error } = await supabase.from('system_jobs').insert({
      type,
      payload,
      status: 'pending',
      attempts: 0
    } as any)

    if (error) throw error
    
    // If we want immediate processing in serverless, we could fire an async fetch here
    // to a processing endpoint, but purely queuing is safer.
    return true
  } catch (err) {
    logger.error('queue', `Failed to enqueue job ${type}`, { error: err })
    return false
  }
}

export async function processNextJob() {
  const supabase = createServiceClient()
  
  // 1. Lock next job
  // We need a custom RPC for "SELECT FOR UPDATE SKIP LOCKED" because Supabase JS doesn't support it directly
  // Fallback: Optimistic locking
  
  const { data: jobData, error } = await supabase.rpc('lock_next_job')
  
  if (error || !jobData) return null
  const job = jobData as any

  try {
    logger.info('queue', `Processing job ${job.id} (${job.type})`)
    
    // --- JOB HANDLERS ---
    switch (job.type) {
      case 'send_email':
        // await sendEmail(job.payload)
        break
      case 'process_webhook':
        // await processWebhook(job.payload)
        break
      default:
        throw new Error(`Unknown job type: ${job.type}`)
    }
    
    // Success
    await (supabase.from('system_jobs') as any).update({
      status: 'completed',
      updated_at: new Date().toISOString()
    }).eq('id', job.id)
    
  } catch (err: any) {
    logger.error('queue', `Job ${job.id} failed`, { error: err })
    
    const nextStatus = job.attempts >= (job.max_attempts || 3) ? 'failed' : 'pending'
    // Exponential backoff could be calculated here for next 'locked_until'
    
    await (supabase.from('system_jobs') as any).update({
      status: nextStatus,
      attempts: job.attempts + 1,
      last_error: err.message,
      updated_at: new Date().toISOString()
    }).eq('id', job.id)
  }
}
