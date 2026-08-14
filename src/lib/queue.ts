import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { sendAgentMail } from '@/lib/agentmail'
import { captureException } from '@/lib/sentry'
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
    }, err)
    return false
  }
}

export async function processNextJob() {
  const supabase = createServiceClient()
  
  // 1. Lock next job
  // We check for pending jobs with optimistic locking
  const { data: jobs, error: selectError } = await supabase
    .from('system_jobs')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(1)
  
  if (selectError || !jobs || jobs.length === 0) return null
  const job = jobs[0]

  // Optimistic lock
  const { error: lockError } = await supabase
    .from('system_jobs')
    .update({ status: 'running', updated_at: new Date().toISOString() })
    .eq('id', job.id)
    .eq('status', 'pending')

  if (lockError) return null

  try {
    logger.info('queue', `Processing job ${job.id} (${job.type})`)
    
    // --- JOB HANDLERS ---
    switch (job.type) {
      case 'send_email': {
        const payload = (job.payload as Record<string, unknown>) || {}
        const to = (payload.to as string | string[]) || ''
        const subject = (payload.subject as string) || 'Sangathan Notification'
        const html = payload.html as string | undefined
        const text = payload.text as string | undefined
        const tags = (payload.tags as string[]) || ['queue_dispatch']

        if (to) {
          const res = await sendAgentMail({
            to,
            subject,
            html,
            text,
            tags,
            metadata: { jobId: job.id },
          })

          if (!res.success) {
            throw new Error(res.error || 'AgentMail delivery failed')
          }
        }
        break
      }

      case 'process_webhook':
      case 'audit_log_batch':
      case 'export_data':
      default:
        logger.warn('queue', `Processed or acknowledged job type: ${job.type}`)
    }
    
    // Mark as completed
    await supabase.from('system_jobs').update({
      status: 'completed',
      updated_at: new Date().toISOString()
    }).eq('id', job.id)

    return { id: job.id, type: job.type, status: 'completed' }
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    logger.error('queue', `Job ${job.id} failed: ${errorMessage}`, { error: err as Record<string, unknown> }, err)
    captureException(err, { source: 'queue', extra: { jobId: job.id, jobType: job.type } })
    
    const attempts = (job.attempts || 0) + 1
    const nextStatus = attempts >= (job.max_attempts || 3) ? 'failed' : 'pending'
    
    await supabase.from('system_jobs').update({
      status: nextStatus,
      attempts,
      last_error: errorMessage,
      updated_at: new Date().toISOString()
    }).eq('id', job.id)

    return { id: job.id, type: job.type, status: nextStatus, error: errorMessage }
  }
}
