// Immutable Tamper-Evident Audit Chain with Cryptographic SHA-256 Chaining

import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/service'

export interface ImmutableAuditRecord {
  organisationId: string
  eventType: string
  actorId?: string | null
  actorEmail: string
  actorRole: string
  targetResource: string
  payloadSnapshot: Record<string, any>
}

export async function appendImmutableAuditLog(record: ImmutableAuditRecord) {
  const adminClient = createServiceClient()

  try {
    // 1. Fetch latest block hash
    const { data: latest } = await adminClient
      .from('immutable_audit_chain')
      .select('current_block_hash, sequence_number')
      .eq('organisation_id', record.organisationId)
      .order('sequence_number', { ascending: false })
      .limit(1)
      .maybeSingle()

    const prevBlockHash = latest?.current_block_hash || '0000000000000000000000000000000000000000000000000000000000000000'
    const timestamp = new Date().toISOString()

    // 2. Compute current block hash
    const dataToHash = `${prevBlockHash}|${record.eventType}|${record.actorEmail}|${record.targetResource}|${JSON.stringify(record.payloadSnapshot)}|${timestamp}`
    const currentBlockHash = crypto.createHash('sha256').update(dataToHash).digest('hex')

    // 3. Insert new block
    await adminClient.from('immutable_audit_chain').insert({
      organisation_id: record.organisationId,
      event_type: record.eventType,
      actor_id: record.actorId || null,
      actor_email: record.actorEmail,
      actor_role: record.actorRole,
      target_resource: record.targetResource,
      payload_snapshot: record.payloadSnapshot,
      prev_block_hash: prevBlockHash,
      current_block_hash: currentBlockHash,
      tamper_verified: true,
      timestamp,
    })

    return { success: true, blockHash: currentBlockHash }
  } catch (err) {
    console.error('Failed to append immutable audit log', err)
    return { success: false }
  }
}
