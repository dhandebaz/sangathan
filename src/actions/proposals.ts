'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSelectedOrganisationId } from '@/lib/auth/context'

const ProposalSchema = z.object({
  title: z.string().min(5, "Title is too short").max(200),
  content: z.string().min(20, "Content must be more detailed"),
  status: z.enum(['draft', 'discussion', 'voting', 'completed', 'archived']).default('draft'),
})

const CommentSchema = z.object({
  proposalId: z.string().uuid(),
  content: z.string().min(1, "Comment cannot be empty").max(1000),
})

export async function createProposal(input: z.infer<typeof ProposalSchema>) {
  try {
    const result = ProposalSchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const orgId = await getSelectedOrganisationId()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { data, error } = await supabase
      .from('proposals')
      .insert({
        organisation_id: orgId,
        created_by: user.id,
        title: result.data.title,
        content: result.data.content,
        status: result.data.status,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard/governance/proposals')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function updateProposalStatus(proposalId: string, status: 'draft' | 'discussion' | 'voting' | 'completed' | 'archived') {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
      .from('proposals')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', proposalId)

    if (error) throw error

    revalidatePath('/dashboard/governance/proposals')
    revalidatePath(`/dashboard/governance/proposals/${proposalId}`)
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function addProposalComment(input: z.infer<typeof CommentSchema>) {
  try {
    const result = CommentSchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
      .from('proposal_comments')
      .insert({
        proposal_id: result.data.proposalId,
        author_id: user.id,
        content: result.data.content,
      })

    if (error) throw error

    revalidatePath(`/dashboard/governance/proposals/${result.data.proposalId}`)
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}
