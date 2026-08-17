'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { appendImmutableAuditLog } from '@/lib/audit/immutable-log'
import { z } from 'zod'

const RequestDualApprovalSchema = z.object({
  action_type: z.enum([
    'broadcast_mass_announcement',
    'financial_ledger_adjustment',
    'admin_role_elevation',
    'bulk_member_purge',
  ]),
  action_payload: z.record(z.string(), z.any()),
})

export async function requestDualApprovalAction(input: z.infer<typeof RequestDualApprovalSchema>) {
  try {
    const validated = RequestDualApprovalSchema.parse(input)
    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not selected' }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('pending_dual_approvals')
      .insert({
        organisation_id: orgId,
        action_type: validated.action_type,
        action_payload: validated.action_payload,
        requested_by: user.id,
        status: 'pending',
      })
      .select()
      .maybeSingle()

    if (error) throw error

    // Log to immutable chain
    await appendImmutableAuditLog({
      organisationId: orgId,
      eventType: `DUAL_APPROVAL_REQUESTED_${validated.action_type}`,
      actorId: user.id,
      actorEmail: user.email || 'user',
      actorRole: 'admin',
      targetResource: `pending_dual_approvals/${data.id}`,
      payloadSnapshot: validated.action_payload,
    })

    revalidatePath('/[lang]/dashboard/audit', 'page')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to request dual approval'
    return { success: false, error: message }
  }
}

export async function approveDualApprovalAction(approvalId: string) {
  try {
    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const adminClient = createServiceClient()

    // 1. Fetch approval
    const { data: approval, error: appErr } = await adminClient
      .from('pending_dual_approvals')
      .select('*')
      .eq('id', approvalId)
      .maybeSingle()

    if (appErr || !approval) return { success: false, error: 'Approval request not found' }

    if (approval.requested_by === user.id) {
      return { success: false, error: 'Dual-approval guardrail: A different authorized administrator must approve this action.' }
    }

    // 2. Mark approved
    await adminClient
      .from('pending_dual_approvals')
      .update({
        status: 'approved',
        approved_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', approvalId)

    // 3. Log to immutable chain
    await appendImmutableAuditLog({
      organisationId: orgId,
      eventType: `DUAL_APPROVAL_GRANTED_${approval.action_type}`,
      actorId: user.id,
      actorEmail: user.email || 'co_signer',
      actorRole: 'co_signer_admin',
      targetResource: `pending_dual_approvals/${approvalId}`,
      payloadSnapshot: { originalRequest: approval.action_payload },
    })

    revalidatePath('/[lang]/dashboard/audit', 'page')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to approve action'
    return { success: false, error: message }
  }
}

export async function rejectDualApprovalAction(approvalId: string, reason?: string) {
  try {
    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const adminClient = createServiceClient()
    await adminClient
      .from('pending_dual_approvals')
      .update({
        status: 'rejected',
        approved_by: user.id,
        rejection_reason: reason || 'Declined by co-signing administrator',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', approvalId)

    revalidatePath('/[lang]/dashboard/audit', 'page')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reject action'
    return { success: false, error: message }
  }
}

export async function getPendingDualApprovalsAction(orgId: string) {
  try {
    const adminClient = createServiceClient()
    const { data } = await adminClient
      .from('pending_dual_approvals')
      .select('*, requester:profiles!requested_by(full_name, email)')
      .eq('organisation_id', orgId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    return { success: true, data: data || [] }
  } catch {
    return { success: true, data: [] }
  }
}
