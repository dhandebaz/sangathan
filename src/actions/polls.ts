'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createHmac } from 'crypto'

// --- Schemas ---

export const PollSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.enum(['informal', 'formal']),
  visibility_level: z.enum(['members', 'volunteer', 'core', 'executive']),
  voting_method: z.enum(['anonymous', 'identifiable']),
  quorum_percentage: z.number().optional(),
  end_time: z.string().datetime().optional(),
  options: z.array(z.string().min(1)).min(2),
  is_public: z.boolean().default(false)
})

export const CreatePollSchema = PollSchema.extend({
  organisation_id: z.string().uuid(),
})

export const VoteSchema = z.object({
  poll_id: z.string().uuid(),
  option_id: z.string().uuid(),
})

// --- Actions ---

export async function createPoll(input: z.infer<typeof CreatePollSchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    // Check permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, organization_id')
      .eq('id', user.id)
      .single() as { data: { role: string; organization_id: string } | null, error: { message: string } | null }

    if (!profile || profile.organization_id !== input.organisation_id || !['admin', 'editor'].includes(profile.role)) {
      return { success: false, error: 'Permission denied' }
    }

    // Create Poll
    const { data: poll, error } = await supabase
      .from('polls')
      .insert({
        organisation_id: input.organisation_id,
        title: input.title,
        description: input.description,
        type: input.type,
        visibility_level: input.visibility_level,
        voting_method: input.voting_method,
        quorum_percentage: input.quorum_percentage,
        end_time: input.end_time,
        status: 'active', // Direct to active for now
        created_by: user.id,
        is_public: input.is_public
      })
      .select()
      .single() as { data: { id: string } | null, error: { message: string } | null }

    if (error || !poll) throw new Error(error?.message || 'Failed to create poll')

    // Create Options
    const options = input.options.map((label, idx) => ({
      poll_id: poll.id,
      label,
      display_order: idx
    }))

    const { error: optError } = await supabase.from('poll_options').insert(options)
    if (optError) throw optError

    revalidatePath('/dashboard/polls')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function castVote(input: z.infer<typeof VoteSchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    const supabaseAdmin = createServiceClient()

    // 1. Get Poll Details
    const { data: poll } = await supabaseAdmin
      .from('polls')
      .select('*')
      .eq('id', input.poll_id)
      .single() as { data: { organisation_id: string; status: string; end_time: string | null; voting_method: string; visibility_level: string } | null, error: { message: string } | null }

    if (!poll || poll.status !== 'active') return { success: false, error: 'Poll is not active' }
    if (poll.end_time && new Date(poll.end_time) < new Date()) return { success: false, error: 'Poll has ended' }

    // 2. Check Eligibility (Role)
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, organization_id, status')
      .eq('id', user.id)
      .single() as { data: { role: string; organization_id: string; status: string } | null, error: { message: string } | null }

    if (!profile || profile.organization_id !== poll.organisation_id || profile.status !== 'active') {
       return { success: false, error: 'Not eligible to vote' }
    }
    
    const roleHierarchy = { 'viewer': 0, 'member': 1, 'general': 1, 'volunteer': 2, 'core': 3, 'executive': 4, 'editor': 5, 'admin': 6 }
    const requiredLevel = roleHierarchy[poll.visibility_level as keyof typeof roleHierarchy] || 1
    const userLevel = roleHierarchy[profile.role as keyof typeof roleHierarchy] || 0
    
    if (userLevel < requiredLevel) return { success: false, error: 'Role not eligible' }

    // 3. Prepare Vote Record
    const voteRecord: { poll_id: string; option_id: string; hashed_identifier?: string; member_id?: string } = {
      poll_id: input.poll_id,
      option_id: input.option_id,
    }

    if (poll.voting_method === 'anonymous') {
       // Generate Hash
       const secret = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallback'
       const raw = `${input.poll_id}:${user.id}:${secret}`
       const hash = createHmac('sha256', secret).update(raw).digest('hex')
       voteRecord.hashed_identifier = hash
       
       // Check duplicate via hash
       const { data: existing } = await supabaseAdmin
         .from('poll_votes')
         .select('id')
         .eq('poll_id', input.poll_id)
         .eq('hashed_identifier', hash)
         .single()
       
       if (existing) return { success: false, error: 'Already voted' }
       
    } else {
       voteRecord.member_id = user.id
       
       // Check duplicate via ID
       const { data: existing } = await supabaseAdmin
         .from('poll_votes')
         .select('id')
         .eq('poll_id', input.poll_id)
         .eq('member_id', user.id)
         .single()
         
       if (existing) return { success: false, error: 'Already voted' }
    }

    const { error } = await supabaseAdmin.from('poll_votes').insert(voteRecord)
    if (error) throw error

    revalidatePath(`/dashboard/polls/${input.poll_id}`)
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function closePoll(pollId: string) {
  try {
    // Permission check...
    
    // Calculate Results
    const supabaseAdmin = createServiceClient()
    
    // Get Votes
    const { data: votes } = await supabaseAdmin
      .from('poll_votes')
      .select('option_id')
      .eq('poll_id', pollId) as { data: { option_id: string }[] | null, error: { message: string } | null }
      
    // Aggregate
    const results: Record<string, number> = {}
    votes?.forEach((v) => {
      results[v.option_id] = (results[v.option_id] || 0) + 1
    })
    
    const totalVotes = votes?.length || 0
    
    // Check Quorum if formal
    const { data: poll } = await supabaseAdmin.from('polls').select('*').eq('id', pollId).single() as { data: { type: string; quorum_percentage: number | null; organisation_id: string } | null, error: { message: string } | null }
    let passed = true
    
    if (poll && poll.type === 'formal' && poll.quorum_percentage) {
       // Get total eligible members count (Approximation)
       // This is expensive for large orgs, better to cache "eligible_count" at poll creation or fetch now
       const { count: totalMembers } = await supabaseAdmin
         .from('profiles')
         .select('*', { count: 'exact', head: true })
         .eq('organization_id', poll.organisation_id)
         .eq('status', 'active')
         // Filter by role if needed... let's assume total active members for simplicity or apply role filter
       
       const participation = (totalVotes / (totalMembers || 1)) * 100
       if (participation < poll.quorum_percentage) passed = false
    }

    // Save Final Results
    const finalData = {
      counts: results,
      total: totalVotes,
      passed
    }

    await supabaseAdmin
      .from('polls')
      .update({ status: 'closed', final_results: finalData })
      .eq('id', pollId)

    revalidatePath('/dashboard/polls')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}
