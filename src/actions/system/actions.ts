'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { requirePlatformAdmin } from '@/lib/auth/context'

const OrgActionSchema = z.object({
  organisationId: z.string().uuid(),
})

export const suspendOrganisation = async (input: z.infer<typeof OrgActionSchema>) => {
  const result = OrgActionSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid organisation payload' }
  }

  await requirePlatformAdmin()

  const authClient = await createClient()
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const supabase = createServiceClient()

  // STRICT WHERE CLAUSE: Ensure ID is provided via .eq()
  const { error } = await supabase
    .from('organisations')
    .update({ is_suspended: true } as never)
    .eq('id', result.data.organisationId)

  if (error) throw new Error(error.message)

  // Secondary Platform Action Log (High Severity Mutation)
  await supabase.from('platform_actions').insert({
    action_type: 'suspension',
    target_org_id: result.data.organisationId,
    severity: 'level_5',
    reason: 'Manual suspension via Admin Console',
    created_by: user.id
  })

  await logAction({
    organisation_id: result.data.organisationId,
    user_id: user.id,
    action: 'ORG_SUSPENDED',
    resource_table: 'organisations',
    resource_id: result.data.organisationId,
  })

  revalidatePath('/', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}

export const reactivateOrganisation = async (input: z.infer<typeof OrgActionSchema>) => {
  const result = OrgActionSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid organisation payload' }
  }

  await requirePlatformAdmin()

  const authClient = await createClient()
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const supabase = createServiceClient()

  // STRICT WHERE CLAUSE: Ensure ID is provided via .eq()
  const { error } = await supabase
    .from('organisations')
    .update({ is_suspended: false } as never)
    .eq('id', result.data.organisationId)

  if (error) throw new Error(error.message)

  // Secondary Platform Action Log (Resolution)
  await supabase.from('platform_actions').insert({
    action_type: 'resolve_appeal',
    target_org_id: result.data.organisationId,
    reason: 'Manual reactivation via Admin Console',
    created_by: user.id
  })

  await logAction({
    organisation_id: result.data.organisationId,
    user_id: user.id,
    action: 'ORG_REACTIVATED',
    resource_table: 'organisations',
    resource_id: result.data.organisationId,
  })

  revalidatePath('/', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function getSystemJobs() {
  await requirePlatformAdmin()
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('system_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  return data || []
}

export async function retryFailedJob(jobId: string) {
  await requirePlatformAdmin()

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('system_jobs')
    .update({ status: 'pending', attempts: 0, last_error: null, locked_until: null })
    .eq('id', jobId)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/jobs', 'page')
  return { success: true }
}

export async function cancelPendingJob(jobId: string) {
  await requirePlatformAdmin()

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('system_jobs')
    .update({ status: 'failed', last_error: 'Cancelled by admin' })
    .eq('id', jobId)

  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/jobs', 'page')
  return { success: true }
}

export async function getWebhookEvents() {
  await requirePlatformAdmin()
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('webhook_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  return data || []
}

export async function getPlatformStats() {
  await requirePlatformAdmin()
  const supabase = createServiceClient()

  const [orgRes, userRes, appealRes, jobRes, logRes] = await Promise.all([
    supabase.from('organisations').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('appeals').select('*', { count: 'exact', head: true }).in('status', ['pending', 'under_review']),
    supabase.from('system_jobs').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
    supabase.from('system_logs').select('*', { count: 'exact', head: true }).eq('level', 'critical'),
  ])

  return {
    totalOrganisations: orgRes.count || 0,
    totalUsers: userRes.count || 0,
    openAppeals: appealRes.count || 0,
    failedJobs: jobRes.count || 0,
    criticalLogs24h: logRes.count || 0,
  }
}

export async function addSystemLog(input: { level: string; source: string; message: string; metadata?: Record<string, unknown>; user_id?: string; organisation_id?: string }) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('system_logs').insert(input)
  if (error) throw new Error(error.message)
  return { success: true }
}
