'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { z } from 'zod'

const InductMemberSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(8, "Phone number is required"),
  course: z.string().optional(),
  year: z.string().optional(),
  hostel: z.string().optional(),
  inductedBy: z.string().optional()
})

export async function inductMemberAction(input: z.infer<typeof InductMemberSchema>) {
  try {
    const result = InductMemberSchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    // Insert new member profile & record in Supabase
    const adminClient = createServiceClient()
    const { data: newProfile, error } = await adminClient
      .from('profiles')
      .insert({
        full_name: result.data.fullName,
        phone: result.data.phone,
        area: result.data.course || 'General Student',
        designation: 'Union Inductee',
        organisation_id: orgId,
        role: 'general',
        status: 'active',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/[lang]/dashboard/induction', 'page')
    revalidatePath('/[lang]/dashboard/members', 'page')

    return { success: true, member: newProfile }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to induct member'
    return { success: false, error: message }
  }
}

export async function batchInductMembersAction(membersList: { fullName: string; phone: string; course?: string }[]) {
  try {
    if (!membersList || membersList.length === 0) {
      return { success: false, error: 'No members provided' }
    }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const adminClient = createServiceClient()
    const rows = membersList.map(m => ({
      full_name: m.fullName,
      phone: m.phone,
      area: m.course || 'Batch Drive Inductee',
      designation: 'Union Inductee',
      organisation_id: orgId,
      role: 'general',
      status: 'active',
      created_at: new Date().toISOString()
    }))

    const { error } = await adminClient
      .from('profiles')
      .insert(rows)

    if (error) throw error

    revalidatePath('/[lang]/dashboard/induction', 'page')
    revalidatePath('/[lang]/dashboard/members', 'page')

    return { success: true, count: rows.length }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to batch induct members'
    return { success: false, error: message }
  }
}
