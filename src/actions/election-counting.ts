'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { z } from 'zod'

const TallySchema = z.object({
  electionId: z.string().uuid().optional(),
  positionId: z.string().uuid().optional(),
  candidateId: z.string().uuid().optional(),
  boothName: z.string().min(2, "Booth name required"),
  roundNumber: z.number().min(1),
  candidateName: z.string().min(2, "Candidate name required"),
  postTitle: z.string().min(2, "Post title required"),
  votesCount: z.number().min(0),
})

export const logBoothVoteTallyAction = createSafeAction(
  TallySchema,
  async (input, context) => {
    const supabase = await createClient()
    const orgId = context.organizationId
    const userId = context.user.id

    // 1. If explicit relational IDs exist, insert into election_booth_tallies
    if (input.electionId && input.positionId && input.candidateId) {
      const { data, error } = await supabase
        .from('election_booth_tallies')
        .upsert({
          election_id: input.electionId,
          position_id: input.positionId,
          candidate_id: input.candidateId,
          booth_name: input.boothName,
          round_number: input.roundNumber,
          votes_count: input.votesCount,
          recorded_by: userId,
        }, { onConflict: 'election_id, position_id, candidate_id, booth_name, round_number' })
        .select()
        .maybeSingle()

      if (!error && data) {
        revalidatePath('/', 'layout')
        return { success: true, data }
      }
    }

    // 2. Backward compatible logging to tasks for fast multi-booth tally
    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('tasks')
      .insert({
        organisation_id: orgId,
        created_by: userId,
        title: `[ELECTION TALLY] ${input.postTitle}: ${input.candidateName} (+${input.votesCount} votes)`,
        description: `Post: ${input.postTitle}\nCandidate: ${input.candidateName}\nBooth: ${input.boothName}\nRound: ${input.roundNumber}\nVotes: ${input.votesCount}`,
        status: 'completed',
        priority: 'high'
      })
      .select()
      .maybeSingle()

    if (error) throw new Error(error.message)

    revalidatePath('/', 'layout')
    return { success: true, data }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin', 'editor'] }
)

export async function getElectionTallyLogs(organisationId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('organisation_id', organisationId)
      .ilike('title', '[ELECTION TALLY]%')
      .order('created_at', { ascending: false })

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('tasks')
        .select('*')
        .eq('organisation_id', organisationId)
        .ilike('title', '[ELECTION TALLY]%')
        .order('created_at', { ascending: false })

      if (!fallback.error) return { success: true, logs: fallback.data || [] }
      return { success: false, logs: [] }
    }

    return { success: true, logs: data || [] }
  } catch {
    return { success: false, logs: [] }
  }
}
