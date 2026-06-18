'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createHmac } from 'crypto'
import { createSafeAction } from '@/lib/auth/actions'

// --- Schemas ---

const PollSchema = z.object({
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

const CreatePollSchema = PollSchema.extend({
  organisation_id: z.string().uuid().optional(), // Allowed for backward compatibility in schema, but ignored in handler
})

const VoteSchema = z.object({
  poll_id: z.string().uuid(),
  option_id: z.string().uuid(),
})

const ClosePollSchema = z.object({
  poll_id: z.string().uuid(),
})

// --- Types ---

interface VoteRecord {
  poll_id: string
  option_id: string
  hashed_identifier?: string
  member_id?: string
}

// --- Actions ---

export const createPoll = createSafeAction(
  CreatePollSchema,
  async (data, context) => {
    const supabase = await createClient()
    
    // Create Poll
    const { data: poll, error } = await supabase
      .from('polls')
      .insert({
        organisation_id: context.organizationId,
        title: data.title,
        description: data.description,
        type: data.type,
        visibility_level: data.visibility_level,
        voting_method: data.voting_method,
        quorum_percentage: data.quorum_percentage,
        end_time: data.end_time,
        status: 'active',
        created_by: context.user.id,
        is_public: data.is_public,
      } as never)
      .select()
      .single()

    if (error || !poll) throw new Error(error?.message || 'Failed to create poll')

    // Create Options
    const options = data.options.map((label, idx) => ({
      poll_id: (poll as { id: string }).id,
      label,
      display_order: idx,
    }))

    const { error: optError } = await supabase
      .from('poll_options')
      .insert(options as never)
    if (optError) throw optError

    revalidatePath('/', 'layout')
    return { id: (poll as { id: string }).id }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'createPoll' }
)

export const castVote = createSafeAction(
  VoteSchema,
  async (data, context) => {
    const supabaseAdmin = createServiceClient()

    // 1. Get Poll Details
    const { data: poll, error: pollError } = await supabaseAdmin
      .from('polls')
      .select('*')
      .eq('id', data.poll_id)
      .single()

    if (pollError || !poll) throw new Error('Poll not found')

    const p = poll as { organisation_id: string; status: string; end_time: string | null; visibility_level: string; voting_method: string }

    if (p.status !== 'active') throw new Error('Poll is not active')
    if (p.end_time && new Date(p.end_time) < new Date()) throw new Error('Poll has ended')

    // 2. Check Permissions (Cross-org check is handled by createSafeAction's context,
    // but we need to ensure the poll belongs to the user's org)
    if (p.organisation_id !== context.organizationId) {
      throw new Error('You are not authorized to vote in this poll')
    }
    
    const roleHierarchy = { 'viewer': 0, 'member': 1, 'general': 1, 'volunteer': 2, 'core': 3, 'executive': 4, 'editor': 5, 'admin': 6 }
    const requiredLevel = roleHierarchy[p.visibility_level as keyof typeof roleHierarchy] || 1
    const userLevel = roleHierarchy[context.role as keyof typeof roleHierarchy] || 0
    
    if (userLevel < requiredLevel) throw new Error('Role not eligible')

    // 3. Prepare Vote Record
    const secret = process.env.POLL_HMAC_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!secret) {
      throw new Error('Missing POLL_HMAC_SECRET or SUPABASE_SERVICE_ROLE_KEY')
    }
    const raw = `${data.poll_id}:${context.user.id}:${secret}`
    const ip_hash = createHmac('sha256', secret).update(raw).digest('hex')

    const voteRecord: VoteRecord = {
      poll_id: data.poll_id,
      option_id: data.option_id,
    }

    if (p.voting_method === 'anonymous') {
       voteRecord.hashed_identifier = ip_hash

       // Check duplicate via hash
       const { data: existing } = await supabaseAdmin
         .from('poll_votes')
         .select('id')
         .eq('poll_id', data.poll_id)
         .eq('hashed_identifier', ip_hash)
         .single()
       
       if (existing) throw new Error('Already voted')
       
    } else {
       voteRecord.member_id = context.user.id
       
       // Check duplicate via ID
       const { data: existing } = await supabaseAdmin
         .from('poll_votes')
         .select('id')
         .eq('poll_id', data.poll_id)
         .eq('member_id', context.user.id)
         .single()
         
       if (existing) throw new Error('Already voted')
    }

    const { error } = await supabaseAdmin.from('poll_votes').insert(voteRecord as never)
    if (error) throw error

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { actionName: 'castVote' }
)

export const closePoll = createSafeAction(
  ClosePollSchema,
  async (data, context) => {
    const supabaseAdmin = createServiceClient()

    // 1. Get Poll & Permission Check
    const { data: poll, error: pollError } = await supabaseAdmin
      .from('polls')
      .select('*')
      .eq('id', data.poll_id)
      .single()

    if (pollError || !poll) throw new Error('Poll not found')

    const p = poll as { organisation_id: string; status: string; type: string; quorum_percentage: number | null }

    if (p.organisation_id !== context.organizationId) {
      throw new Error('Permission denied')
    }

    if (p.status !== 'active') throw new Error('Poll is already closed')

    // 2. Calculate Results
    const { data: options, error: optionsError } = await supabaseAdmin
      .from('poll_options')
      .select('id')
      .eq('poll_id', data.poll_id)

    if (optionsError || !options) throw new Error('Failed to load poll options')

    const results: Record<string, number> = {}
    let totalVotes = 0

    for (const option of options) {
      const { count } = await supabaseAdmin
        .from('poll_votes')
        .select('id', { count: 'exact', head: true })
        .eq('poll_id', data.poll_id)
        .eq('option_id', option.id)

      const optionCount = typeof count === 'number' ? count : 0
      results[option.id] = optionCount
      totalVotes += optionCount
    }
    
    // Check Quorum if formal
    let passed = true
    
    if (p.type === 'formal' && p.quorum_percentage) {
       const { count: totalMembers } = await supabaseAdmin
         .from('profiles')
         .select('*', { count: 'exact', head: true })
         .eq('organisation_id', p.organisation_id)
         .eq('status', 'active')
       
       const participation = (totalVotes / (totalMembers || 1)) * 100
       if (participation < p.quorum_percentage) passed = false
    }

    // Save Final Results
    const finalData = {
      counts: results,
      total: totalVotes,
      passed
    }

    const { error: updateError } = await supabaseAdmin
      .from('polls')
      .update({ status: 'closed', final_results: finalData } as never)
      .eq('id', data.poll_id)

    if (updateError) throw updateError

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'closePoll' }
)
