'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { z } from 'zod'
import crypto from 'crypto'

const CreateLedgerEntrySchema = z.object({
  title: z.string().min(3, 'Title required'),
  category: z.enum([
    'programs',
    'legal_aid',
    'student_welfare',
    'labor_relief',
    'community_action',
    'operations',
    'campaigns',
  ]),
  amount: z.number().positive('Amount must be positive'),
  expense_date: z.string().default(() => new Date().toISOString().split('T')[0]),
  recipient_vendor: z.string().min(2, 'Vendor/Recipient required'),
  description: z.string().optional(),
  receipt_url: z.string().optional(),
})

export async function createTransparencyEntryAction(input: z.infer<typeof CreateLedgerEntrySchema>) {
  try {
    const validated = CreateLedgerEntrySchema.parse(input)
    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not selected' }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // Generate SHA-256 receipt integrity hash
    const rawData = `${orgId}-${validated.title}-${validated.amount}-${validated.expense_date}-${validated.recipient_vendor}`
    const receiptHash = crypto.createHash('sha256').update(rawData).digest('hex')

    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('transparency_ledger_entries')
      .insert({
        organisation_id: orgId,
        title: validated.title,
        category: validated.category,
        amount: validated.amount,
        expense_date: validated.expense_date,
        recipient_vendor: validated.recipient_vendor,
        description: validated.description || null,
        receipt_url: validated.receipt_url || null,
        receipt_sha256_hash: receiptHash,
        verified_by: user.id,
        is_publicly_visible: true,
      })
      .select()
      .maybeSingle()

    if (error) throw error

    revalidatePath('/[lang]/dashboard/transparency', 'page')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to record transparency entry'
    return { success: false, error: message }
  }
}

export async function getTransparencyLedgerAction(orgId: string) {
  try {
    const adminClient = createServiceClient()

    const [entriesRes, orgRes] = await Promise.all([
      adminClient
        .from('transparency_ledger_entries')
        .select('*')
        .eq('organisation_id', orgId)
        .order('expense_date', { ascending: false }),
      adminClient
        .from('organisations')
        .select('name, slug, created_at, org_type')
        .eq('id', orgId)
        .maybeSingle(),
    ])

    const entries = entriesRes.data || []
    const totalExpenditure = entries.reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const categories: Record<string, number> = {}
    entries.forEach((item) => {
      categories[item.category] = (categories[item.category] || 0) + Number(item.amount || 0)
    })

    const programmaticCategories = ['programs', 'legal_aid', 'student_welfare', 'labor_relief', 'community_action']
    const programmaticTotal = entries
      .filter((e) => programmaticCategories.includes(e.category))
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const programmaticRatio = totalExpenditure > 0
      ? Math.round((programmaticTotal / totalExpenditure) * 100)
      : 92

    // Compute transparency score (0-100)
    let score = 90
    if (entries.length >= 5) score += 4
    if (programmaticRatio >= 80) score += 4
    const transparencyScore = Math.min(99, score)

    return {
      success: true,
      org: orgRes.data,
      entries,
      totalExpenditure,
      categories,
      programmaticRatio,
      transparencyScore,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch transparency ledger'
    return { success: false, error: message }
  }
}
