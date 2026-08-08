'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createSafeAction } from '@/lib/auth/actions'
import { checkAiAccess } from '@/lib/ai/nvidia'
import { generateStructuredCompletion } from '@/lib/ai/resilient-router'

const ProposalAnalysisSchema = z.object({
  proposalId: z.string().uuid(),
})

export const analyzeProposal = createSafeAction(
  ProposalAnalysisSchema,
  async (input, context) => {
    if (!(await checkAiAccess(context.organizationId))) return { error: 'AI features not available' }

    const supabase = await createClient()
    const { data: proposal } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', input.proposalId)
      .eq('organisation_id', context.organizationId)
      .single()

    if (!proposal) return { error: 'Proposal not found' }

    const { data: comments } = await supabase
      .from('proposal_comments')
      .select('content, created_at')
      .eq('proposal_id', input.proposalId)
      .order('created_at', { ascending: false })

    const { data: activePolls } = await supabase
      .from('polls')
      .select('question, status')
      .eq('organisation_id', context.organizationId)
      .in('status', ['active', 'pending'])

    const analysisSchema = z.object({
        readability_score: z.enum(['easy', 'moderate', 'complex']),
        summary: z.string().describe('One-paragraph plain-language summary of the proposal'),
        strengths: z.array(z.string()),
        concerns: z.array(z.string()),
        potential_conflicts: z.array(z.object({
          with: z.string(),
          description: z.string(),
        })),
        suggested_amendments: z.array(z.object({
          section: z.string(),
          suggestion: z.string(),
          reason: z.string(),
        })),
        community_sentiment: z.object({
          overall: z.enum(['positive', 'mixed', 'negative', 'insufficient_data']),
          supporting_points: z.array(z.string()),
          opposing_points: z.array(z.string()),
        }),
        recommendation: z.string(),
      })
    const result = await generateStructuredCompletion({
      prompt: `Analyze this organization proposal for civic impact, clarity, and potential issues.

Title: ${proposal.title}
Content: ${proposal.content}
Current Status: ${proposal.status}

Community Comments: ${comments?.map(c => c.content).join('\n') || 'No comments yet'}
Active Org Polls: ${activePolls?.map(p => p.question).join('\n') || 'None'}

Provide a comprehensive analysis including readability, strengths, concerns, potential conflicts with existing polls/activities, suggested amendments, community sentiment from comments, and an overall recommendation.`,
      maxTokens: 3_000,
    }, analysisSchema)

    return { success: true, analysis: result.object, providerUsed: result.providerUsed, latencyMs: result.latencyMs }
  },
  { allowedRoles: ['admin', 'editor', 'executive'], actionName: 'ai_analyze_proposal' },
)

export const generateProposalBrief = createSafeAction(
  ProposalAnalysisSchema,
  async (input, context) => {
    if (!(await checkAiAccess(context.organizationId))) return { error: 'AI features not available' }

    const supabase = await createClient()
    const { data: proposal } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', input.proposalId)
      .eq('organisation_id', context.organizationId)
      .single()

    if (!proposal) return { error: 'Proposal not found' }

    const briefSchema = z.object({
        plain_language_summary: z.string(),
        what_it_means: z.string(),
        key_changes_if_passed: z.array(z.string()),
        who_it_affects: z.string(),
      })
    const result = await generateStructuredCompletion({
      prompt: `Write a citizen-friendly brief for this proposal so all members can understand it before voting.

Title: ${proposal.title}
Content: ${proposal.content}

Use plain, jargon-free language. Explain what it means, what changes if it passes, and who it affects.`,
      maxTokens: 1_500,
    }, briefSchema)

    return { success: true, brief: result.object, providerUsed: result.providerUsed, latencyMs: result.latencyMs }
  },
  { allowedRoles: ['admin', 'editor', 'executive'], actionName: 'ai_proposal_brief' },
)
