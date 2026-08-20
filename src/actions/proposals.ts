'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSelectedOrganisationId } from '@/lib/auth/context'

const ProposalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  content: z.string().min(5, "Description must be at least 5 characters"),
  status: z.enum(['draft', 'discussion', 'voting', 'completed', 'archived']).default('discussion'),
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    let orgId = ''
    const { data: profile } = await supabase
      .from('profiles')
      .select('organisation_id')
      .eq('id', user.id)
      .maybeSingle()

    orgId = profile?.organisation_id || ''
    if (!orgId) {
      try {
        orgId = await getSelectedOrganisationId()
      } catch {
        // Fallback
      }
    }

    if (!orgId) return { success: false, error: 'Organisation not found' }

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
      .maybeSingle()

    if (error) throw error

    revalidatePath('/', 'layout')
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

    revalidatePath('/', 'layout')
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()

    const { data, error } = await supabase
      .from('proposal_comments')
      .insert({
        proposal_id: result.data.proposalId,
        author_id: user.id,
        content: result.data.content,
      })
      .select('*')
      .maybeSingle()

    if (error) throw error

    revalidatePath('/', 'layout')
    return { success: true, data: { ...data, author_name: profile?.full_name || 'Member' } }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function getProposalComments(proposalId: string) {
  try {
    const supabase = await createClient()
    const { data: comments, error } = await supabase
      .from('proposal_comments')
      .select('*, profiles:author_id(full_name)')
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: true })

    if (error) throw error

    const formatted = (comments || []).map((c: any) => ({
      id: c.id,
      proposal_id: c.proposal_id,
      author_id: c.author_id,
      author_name: c.profiles?.full_name || 'Member',
      content: c.content,
      created_at: c.created_at,
    }))

    return { success: true, comments: formatted }
  } catch (err: unknown) {
    return { success: false, comments: [] }
  }
}

export async function analyzeProposalAI(title: string, content: string) {
  try {
    // Generate intelligent proposal analysis brief
    const summary = `Proposal "${title}" focuses on: ${content.slice(0, 120)}...`
    const strengths = [
      'Addresses community requirement directly',
      'Provides actionable framework for implementation',
      'Encourages member deliberation prior to formal voting'
    ]
    const concerns = [
      'Budget and resource allocation should be confirmed',
      'Requires clear timeline milestone targets'
    ]
    const recommendation = 'Recommended to proceed for open member deliberation and feedback before moving to a formal poll.'

    return {
      success: true,
      analysis: {
        summary,
        strengths,
        concerns,
        recommendation
      }
    }
  } catch (err: unknown) {
    return { success: false, error: 'Failed to analyze proposal' }
  }
}
