'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { z } from 'zod'

const TallySchema = z.object({
  boothName: z.string().min(2, "Booth name required"),
  roundNumber: z.number().min(1),
  candidateName: z.string().min(2, "Candidate name required"),
  postTitle: z.string().min(2, "Post title required"),
  votesCount: z.number().min(0),
})

export async function logBoothVoteTallyAction(input: z.infer<typeof TallySchema>) {
  try {
    const result = TallySchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('tasks')
      .insert({
        organisation_id: orgId,
        created_by: user.id,
        title: `[ELECTION TALLY] ${result.data.postTitle}: ${result.data.candidateName} (+${result.data.votesCount} votes)`,
        description: `Post: ${result.data.postTitle}\nCandidate: ${result.data.candidateName}\nBooth: ${result.data.boothName}\nRound: ${result.data.roundNumber}\nVotes: ${result.data.votesCount}`,
        status: 'completed',
        priority: 'high'
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/[lang]/dashboard/election-counting', 'page')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to log vote tally'
    return { success: false, error: message }
  }
}

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
