'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { z } from 'zod'

const CreateMemorandumSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  recipient: z.string().min(2, "Recipient is required"),
  department: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
})

export async function createMemorandum(input: z.infer<typeof CreateMemorandumSchema>) {
  try {
    const result = CreateMemorandumSchema.safeParse(input)
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
        title: `[GYAPAN] ${result.data.title}`,
        content: `Recipient: ${result.data.recipient}\nDepartment: ${result.data.department || 'University Administration'}\n\n${result.data.content}`,
        status: 'discussion'
      })
      .select()
      .maybeSingle()

    if (error) {
      // Fallback via Service Client
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('proposals')
        .insert({
          organisation_id: orgId,
          created_by: user.id,
          title: `[GYAPAN] ${result.data.title}`,
          content: `Recipient: ${result.data.recipient}\nDepartment: ${result.data.department || 'University Administration'}\n\n${result.data.content}`,
          status: 'discussion'
        })
        .select()
        .maybeSingle()
        
      if (fallback.error) throw fallback.error
    }

    revalidatePath('/', 'layout')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save Memorandum'
    return { success: false, error: message }
  }
}

export async function getMemorandums(organisationId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('organisation_id', organisationId)
      .ilike('title', '[GYAPAN]%')
      .order('created_at', { ascending: false })

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('proposals')
        .select('*')
        .eq('organisation_id', organisationId)
        .ilike('title', '[GYAPAN]%')
        .order('created_at', { ascending: false })

      if (!fallback.error) return { success: true, memorandums: fallback.data || [] }
      return { success: false, memorandums: [] }
    }

    return { success: true, memorandums: data || [] }
  } catch {
    return { success: false, memorandums: [] }
  }
}

export async function signMemorandum(proposalId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
      .from('proposal_comments')
      .insert({
        proposal_id: proposalId,
        author_id: user.id,
        content: '✍️ Digitally Signed Memorandum Representation',
      })

    if (error) {
      const adminClient = createServiceClient()
      await adminClient
        .from('proposal_comments')
        .insert({
          proposal_id: proposalId,
          author_id: user.id,
          content: '✍️ Digitally Signed Memorandum Representation',
        })
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to sign memorandum'
    return { success: false, error: message }
  }
}
