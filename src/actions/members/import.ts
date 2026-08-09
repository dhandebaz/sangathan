'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { checkMemberLimit } from '@/lib/plans/limits'

const ImportRowSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  phone: z.string().min(5, 'Phone is required'),
  email: z.string().email().optional().or(z.literal('')),
  designation: z.string().optional(),
  area: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  role: z.enum(['admin', 'editor', 'viewer', 'member']).default('member'),
  notes: z.string().optional(),
})

const BulkImportSchema = z.object({
  members: z.array(ImportRowSchema).min(1, 'At least one member row is required'),
})

function cleanPhoneNumber(raw: string): string {
  let cleaned = raw.replace(/[^\d+]/g, '').trim()
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '+91' + cleaned.substring(1)
  } else if (!cleaned.startsWith('+') && cleaned.length === 10) {
    cleaned = '+91' + cleaned
  }
  return cleaned
}

export const bulkImportMembers = createSafeAction(
  BulkImportSchema,
  async (input, context) => {
    const rawMembers = input.members
    const orgId = context.organizationId

    // 1. Capacity limit check
    const limitCheck = await checkMemberLimit(orgId, rawMembers.length)
    if (!limitCheck.allowed) {
      return {
        error: limitCheck.error || `Plan member capacity exceeded. Cannot import ${rawMembers.length} members.`,
      }
    }

    const adminClient = createServiceClient()

    // 2. Fetch existing phones and emails in this organisation to prevent duplicates
    const { data: existingMembers } = await adminClient
      .from('members')
      .select('phone, email')
      .eq('organisation_id', orgId)

    const existingPhones = new Set<string>()
    const existingEmails = new Set<string>()

    for (const m of existingMembers || []) {
      if (m.phone) existingPhones.add(cleanPhoneNumber(m.phone))
      if (m.email) existingEmails.add(m.email.toLowerCase())
    }

    const toInsert: Array<{
      organisation_id: string
      full_name: string
      phone: string
      email: string | null
      designation: string | null
      area: string | null
      status: 'active' | 'inactive'
      role: 'admin' | 'editor' | 'viewer' | 'member'
      notes: string | null
      joining_date: string
    }> = []

    const skippedDuplicates: string[] = []
    const seenInBatch = new Set<string>()

    for (const row of rawMembers) {
      const normalizedPhone = cleanPhoneNumber(row.phone)
      const normalizedEmail = row.email ? row.email.toLowerCase() : null

      if (seenInBatch.has(normalizedPhone) || existingPhones.has(normalizedPhone)) {
        skippedDuplicates.push(`${row.full_name} (${row.phone}) - Duplicate phone`)
        continue
      }

      if (normalizedEmail && (seenInBatch.has(normalizedEmail) || existingEmails.has(normalizedEmail))) {
        skippedDuplicates.push(`${row.full_name} (${row.email}) - Duplicate email`)
        continue
      }

      seenInBatch.add(normalizedPhone)
      if (normalizedEmail) seenInBatch.add(normalizedEmail)

      toInsert.push({
        organisation_id: orgId,
        full_name: row.full_name.trim(),
        phone: normalizedPhone,
        email: normalizedEmail,
        designation: row.designation?.trim() || null,
        area: row.area?.trim() || null,
        status: row.status,
        role: row.role,
        notes: row.notes?.trim() || null,
        joining_date: new Date().toISOString(),
      })
    }

    if (toInsert.length === 0) {
      return {
        success: false,
        error: 'No new unique members to import. All rows were either duplicates or invalid.',
        skipped: skippedDuplicates,
      }
    }

    // 3. Batch insert in chunks of 100
    const chunkSize = 100
    let insertedCount = 0

    for (let i = 0; i < toInsert.length; i += chunkSize) {
      const chunk = toInsert.slice(i, i + chunkSize)
      const { error: insertError } = await adminClient.from('members').insert(chunk)

      if (insertError) {
        return {
          error: `Failed during bulk insertion: ${insertError.message}`,
          insertedSoFar: insertedCount,
        }
      }
      insertedCount += chunk.length
    }

    await logAction({
      organisation_id: orgId,
      user_id: context.user.id,
      action: 'MEMBERS_BULK_IMPORTED',
      resource_table: 'members',
      resource_id: orgId,
      details: {
        totalSubmitted: rawMembers.length,
        insertedCount,
        skippedDuplicatesCount: skippedDuplicates.length,
      },
    })

    revalidatePath('/', 'layout')

    return {
      success: true,
      insertedCount,
      skippedCount: skippedDuplicates.length,
      skippedDetails: skippedDuplicates.slice(0, 10),
    }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'bulk_import_members' },
)
