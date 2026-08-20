'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { z } from 'zod'

const RtiSchema = z.object({
  subject: z.string().min(3, "Subject is required"),
  department: z.string().min(2, "Department is required"),
  questions: z.string().min(10, "RTI Questions are required"),
})

const AtrSchema = z.object({
  officialName: z.string().min(2, "Official name/designation required"),
  commitment: z.string().min(5, "Commitment details required"),
  promisedDate: z.string(),
})

export async function generateRtiAction(input: z.infer<typeof RtiSchema>) {
  try {
    const result = RtiSchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const { data, error } = await supabase
      .from('proposals')
      .insert({
        organisation_id: orgId,
        created_by: user.id,
        title: `[RTI APPLICATION] ${result.data.subject}`,
        content: `Public Information Officer (PIO): ${result.data.department}\n\nInformation Requested under RTI Act 2005:\n${result.data.questions}`,
        status: 'discussion'
      })
      .select()
      .maybeSingle()

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('proposals')
        .insert({
          organisation_id: orgId,
          created_by: user.id,
          title: `[RTI APPLICATION] ${result.data.subject}`,
          content: `Public Information Officer (PIO): ${result.data.department}\n\nInformation Requested under RTI Act 2005:\n${result.data.questions}`,
          status: 'discussion'
        })
        .select()
        .maybeSingle()

      if (fallback.error) throw fallback.error
    }

    revalidatePath('/', 'layout')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate RTI'
    return { success: false, error: message }
  }
}

export async function logAtrAction(input: z.infer<typeof AtrSchema>) {
  try {
    const result = AtrSchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const { data, error } = await supabase
      .from('proposals')
      .insert({
        organisation_id: orgId,
        created_by: user.id,
        title: `[ATR COMMITMENT] ${result.data.officialName}`,
        content: `Official: ${result.data.officialName}\nPromised Deadline: ${result.data.promisedDate}\n\nCommitment Details:\n${result.data.commitment}`,
        status: 'discussion'
      })
      .select()
      .maybeSingle()

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('proposals')
        .insert({
          organisation_id: orgId,
          created_by: user.id,
          title: `[ATR COMMITMENT] ${result.data.officialName}`,
          content: `Official: ${result.data.officialName}\nPromised Deadline: ${result.data.promisedDate}\n\nCommitment Details:\n${result.data.commitment}`,
          status: 'discussion'
        })
        .select()
        .maybeSingle()

      if (fallback.error) throw fallback.error
    }

    revalidatePath('/', 'layout')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to log ATR commitment'
    return { success: false, error: message }
  }
}

export async function getRtiAtrLogs(organisationId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('organisation_id', organisationId)
      .or('title.ilike.[RTI APPLICATION]%,title.ilike.[ATR COMMITMENT]%')
      .order('created_at', { ascending: false })

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('proposals')
        .select('*')
        .eq('organisation_id', organisationId)
        .or('title.ilike.[RTI APPLICATION]%,title.ilike.[ATR COMMITMENT]%')
        .order('created_at', { ascending: false })

      if (!fallback.error) return { success: true, logs: fallback.data || [] }
      return { success: false, logs: [] }
    }

    return { success: true, logs: data || [] }
  } catch {
    return { success: false, logs: [] }
  }
}
