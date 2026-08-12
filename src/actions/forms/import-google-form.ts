'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { bulkImportMembers } from '@/actions/members/import'
import type { FormField } from '@/types/forms'

const ImportGoogleFormSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  visibility: z.enum(['public', 'members', 'private']).default('public'),
  rawData: z.string().min(10, 'Spreadsheet or form response data is required'),
  importAsMembers: z.boolean().default(false),
  defaultMemberRole: z.enum(['admin', 'editor', 'viewer', 'member']).default('member'),
})

function parseSpreadsheet(text: string): { headers: string[]; rows: string[][] } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length === 0) return { headers: [], rows: [] }

  const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ','

  const parsed = lines.map((line) => {
    // Regex to handle quoted CSV cells containing commas
    const row: string[] = []
    let inQuotes = false
    let currentCell = ''

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes
      } else if (char === delimiter && !inQuotes) {
        row.push(currentCell.trim())
        currentCell = ''
      } else {
        currentCell += char
      }
    }
    row.push(currentCell.trim())
    return row.map((cell) => cell.replace(/^["']|["']$/g, '').trim())
  })

  const headers = parsed[0]
  const rows = parsed.slice(1).filter((r) => r.some((c) => c.length > 0))
  return { headers, rows }
}

function detectFieldType(header: string, sampleValues: string[]): 'text' | 'number' | 'phone' | 'textarea' | 'dropdown' {
  const norm = header.toLowerCase()
  if (norm.includes('phone') || norm.includes('mobile') || norm.includes('whatsapp') || norm.includes('contact')) {
    return 'phone'
  }
  if (norm.includes('number') || norm.includes('age') || norm.includes('amount') || norm.includes('dues') || norm.includes('count')) {
    return 'number'
  }
  if (norm.includes('feedback') || norm.includes('comment') || norm.includes('reason') || norm.includes('address') || norm.includes('description') || norm.includes('suggestion')) {
    return 'textarea'
  }

  // Check sample values
  const nonEmpty = sampleValues.filter((v) => v && v.length > 0)
  if (nonEmpty.length > 0) {
    const isAllNumbers = nonEmpty.every((v) => !isNaN(Number(v)))
    if (isAllNumbers) return 'number'

    const avgLength = nonEmpty.reduce((acc, v) => acc + v.length, 0) / nonEmpty.length
    if (avgLength > 80) return 'textarea'

    // Check for distinct dropdown options
    const uniqueValues = Array.from(new Set(nonEmpty))
    if (uniqueValues.length <= 6 && nonEmpty.length >= 8) {
      return 'dropdown'
    }
  }

  return 'text'
}

export const importGoogleFormWithSubmissions = createSafeAction(
  ImportGoogleFormSchema,
  async (input, context) => {
    const { headers, rows } = parseSpreadsheet(input.rawData)

    if (headers.length === 0) {
      return { success: false, error: 'No valid columns found in the provided data.' }
    }

    // 1. Identify Timestamp column if Google Forms included one (e.g., "Timestamp", "Submission Date")
    let timestampColIndex = -1
    const formFields: FormField[] = []
    const headerToFieldId: Record<number, string> = {}

    headers.forEach((h, idx) => {
      const lower = h.toLowerCase()
      if (idx === 0 && (lower.includes('timestamp') || lower.includes('time') || lower.includes('date'))) {
        timestampColIndex = idx
        return
      }

      const sampleColValues = rows.slice(0, 20).map((r) => r[idx] || '')
      const fieldType = detectFieldType(h, sampleColValues)
      const fieldId = `field_${idx}_${Math.random().toString(36).substring(2, 7)}`

      const fieldObj: FormField = {
        id: fieldId,
        label: h,
        type: fieldType,
        required: false,
      }

      if (fieldType === 'dropdown') {
        const uniqueOptions = Array.from(new Set(sampleColValues.filter((v) => v.length > 0))).slice(0, 10)
        if (uniqueOptions.length > 0) {
          fieldObj.options = uniqueOptions
        }
      }

      formFields.push(fieldObj)
      headerToFieldId[idx] = fieldId
    })

    if (formFields.length === 0) {
      return { success: false, error: 'Could not construct any form fields from headers.' }
    }

    const adminClient = createServiceClient()

    // 2. Create the Form in Sangathan
    const { data: createdForm, error: formError } = await adminClient
      .from('forms')
      .insert({
        organisation_id: context.organizationId,
        title: input.title,
        description: input.description || `Imported from Google Forms / Sheets (${rows.length} past responses)`,
        visibility: input.visibility,
        fields: formFields,
        is_active: true,
        created_by: context.user.id,
      })
      .select('id')
      .single()

    if (formError || !createdForm) {
      return { success: false, error: `Failed to create form: ${formError?.message || 'Unknown error'}` }
    }

    const formId = createdForm.id

    // 3. Ingest Historical Submissions into `form_submissions`
    let importedSubmissionsCount = 0

    if (rows.length > 0) {
      const submissionsToInsert = rows.map((row) => {
        const submissionData: Record<string, unknown> = {}

        headers.forEach((_, idx) => {
          const fieldId = headerToFieldId[idx]
          if (fieldId) {
            submissionData[fieldId] = row[idx] || ''
          }
        })

        let createdAt = new Date().toISOString()
        if (timestampColIndex !== -1 && row[timestampColIndex]) {
          const parsedDate = new Date(row[timestampColIndex])
          if (!isNaN(parsedDate.getTime())) {
            createdAt = parsedDate.toISOString()
          }
        }

        return {
          form_id: formId,
          organisation_id: context.organizationId,
          user_id: null,
          data: submissionData,
          created_at: createdAt,
        }
      })

      // Batch insert submissions in chunks of 100
      const chunkSize = 100
      for (let i = 0; i < submissionsToInsert.length; i += chunkSize) {
        const chunk = submissionsToInsert.slice(i, i + chunkSize)
        const { error: subInsertError } = await adminClient.from('form_submissions').insert(chunk)
        if (!subInsertError) {
          importedSubmissionsCount += chunk.length
        }
      }
    }

    // 4. Convert Respondents to Members if requested
    let membersImportResult: { insertedCount?: number; skippedCount?: number } | undefined

    if (input.importAsMembers && rows.length > 0) {
      // Find Name, Phone, Email columns
      let nameIdx = -1
      let phoneIdx = -1
      let emailIdx = -1
      let areaIdx = -1
      let desigIdx = -1

      headers.forEach((h, idx) => {
        const norm = h.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (nameIdx === -1 && (norm.includes('name') || norm.includes('naam') || norm.includes('member'))) {
          nameIdx = idx
        } else if (phoneIdx === -1 && (norm.includes('phone') || norm.includes('mobile') || norm.includes('contact') || norm.includes('whatsapp') || norm.includes('tel'))) {
          phoneIdx = idx
        } else if (emailIdx === -1 && (norm.includes('email') || norm.includes('mail'))) {
          emailIdx = idx
        } else if (areaIdx === -1 && (norm.includes('area') || norm.includes('flat') || norm.includes('wing') || norm.includes('unit') || norm.includes('hostel') || norm.includes('dept'))) {
          areaIdx = idx
        } else if (desigIdx === -1 && (norm.includes('designation') || norm.includes('post') || norm.includes('role') || norm.includes('title'))) {
          desigIdx = idx
        }
      })

      if (nameIdx !== -1 && phoneIdx !== -1) {
        const memberPayload = rows
          .map((r) => ({
            full_name: r[nameIdx]?.trim() || 'Unnamed Respondent',
            phone: r[phoneIdx]?.trim() || '',
            email: emailIdx !== -1 ? r[emailIdx]?.trim() || undefined : undefined,
            area: areaIdx !== -1 ? r[areaIdx]?.trim() || undefined : undefined,
            designation: desigIdx !== -1 ? r[desigIdx]?.trim() || undefined : undefined,
            role: input.defaultMemberRole,
            status: 'active' as const,
            notes: `Imported from Google Form: ${input.title}`,
          }))
          .filter((m) => m.phone.length >= 5)

        if (memberPayload.length > 0) {
          const mRes = await bulkImportMembers({ members: memberPayload })
          if (mRes.success && mRes.data) {
            membersImportResult = {
              insertedCount: mRes.data.insertedCount,
              skippedCount: mRes.data.skippedCount,
            }
          }
        }
      }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'GOOGLE_FORM_IMPORTED',
      resource_table: 'forms',
      resource_id: formId,
      details: {
        title: input.title,
        fieldsCount: formFields.length,
        submissionsCount: importedSubmissionsCount,
        membersImported: membersImportResult?.insertedCount || 0,
      },
    })

    revalidatePath('/', 'layout')

    return {
      success: true,
      formId,
      fieldsCount: formFields.length,
      submissionsCount: importedSubmissionsCount,
      membersImportResult,
    }
  },
  { allowedRoles: ['admin', 'editor', 'executive'], actionName: 'import_google_form' }
)
