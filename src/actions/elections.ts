'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createElectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  start_time: z.string(),
  end_time: z.string(),
})

export const createElection = createSafeAction(
  createElectionSchema,
  async (data, context) => {
    const supabase = await createClient();
    const organisationId = context.organizationId;
    const profileId = context.user.id;
    const { data: election, error } = await supabase
      .from('elections')
      .insert({
        organisation_id: organisationId,
        ...data,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    
    revalidatePath('/[lang]/dashboard/elections', 'page')
    return { success: true, election }
  }
)

const createPositionSchema = z.object({
  election_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  max_votes_per_voter: z.number().min(1).default(1),
})

export const createElectionPosition = createSafeAction(
  createPositionSchema,
  async (data, context) => {
    const supabase = await createClient();
    const organisationId = context.organizationId;
    const profileId = context.user.id;
    const { error } = await supabase
      .from('election_positions')
      .insert(data)

    if (error) throw new Error(error.message)
    revalidatePath('/[lang]/dashboard/elections', 'page')
    return { success: true }
  }
)

const nominateCandidateSchema = z.object({
  position_id: z.string().uuid(),
  profile_id: z.string().uuid(),
  manifesto_text: z.string().optional(),
})

export const nominateCandidate = createSafeAction(
  nominateCandidateSchema,
  async (data, context) => {
    const supabase = await createClient();
    const organisationId = context.organizationId;
    const profileId = context.user.id;
    const { error } = await supabase
      .from('candidates')
      .insert({
        position_id: data.position_id,
        profile_id: data.profile_id,
        manifesto_text: data.manifesto_text,
        votes_count: 0
      })

    if (error) throw new Error(error.message)
    revalidatePath('/[lang]/dashboard/elections', 'page')
    return { success: true }
  }
)

const voteSchema = z.object({
  election_id: z.string().uuid(),
  votes: z.array(z.object({
    position_id: z.string().uuid(),
    candidate_id: z.string().uuid()
  }))
})

export const submitVote = createSafeAction(
  voteSchema,
  async (data, context) => {
    const supabase = await createClient();
    const organisationId = context.organizationId;
    const profileId = context.user.id;
    // Check if election is active
    const { data: election } = await supabase
      .from('elections')
      .select('status, end_time')
      .eq('id', data.election_id)
      .single()

    if (!election || election.status !== 'active') {
      throw new Error('Voting is not currently active for this election.')
    }

    // Check if already voted
    const { data: existingVote } = await supabase
      .from('election_voters')
      .select('id')
      .eq('election_id', data.election_id)
      .eq('profile_id', profileId)
      .single()

    if (existingVote) {
      throw new Error('You have already voted in this election.')
    }

    // Record the vote (increment candidates)
    // NOTE: In a real production system with high concurrency, you'd want an RPC call here to increment securely
    // For this demonstration, we'll increment in a loop
    for (const vote of data.votes) {
      // Fetch current count to increment
      const { data: candidate } = await supabase
        .from('candidates')
        .select('votes_count')
        .eq('id', vote.candidate_id)
        .single()
        
      if (candidate) {
        await supabase
          .from('candidates')
          .update({ votes_count: candidate.votes_count + 1 })
          .eq('id', vote.candidate_id)
      }
    }

    // Mark user as voted
    const { error: voteRecordError } = await supabase
      .from('election_voters')
      .insert({
        election_id: data.election_id,
        profile_id: profileId
      })

    if (voteRecordError) throw new Error('Failed to record voter receipt')

    revalidatePath('/[lang]/dashboard/elections', 'page')
    return { success: true }
  }
)
