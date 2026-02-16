import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { VotingInterface } from '@/components/polls/voting-interface'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createHmac } from 'crypto'
import { Poll, PollOption, PollResults } from '@/types/dashboard'

export default async function PollPage(props: { params: Promise<{ lang: string, id: string }> }) {
  const { lang, id } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const supabaseAdmin = createServiceClient()

  // 1. Fetch Poll
  const { data: poll } = await supabaseAdmin
    .from('polls')
    .select('*')
    .eq('id', id)
    .single() as { data: Poll | null }

  if (!poll) notFound()

  // 2. Fetch Options
  const { data: options } = await supabaseAdmin
    .from('poll_options')
    .select('*')
    .eq('poll_id', id)
    .order('display_order', { ascending: true }) as { data: PollOption[] | null }

  // 3. Check if user voted
  // We need to check both identifiable and anonymous
  let hasVoted = false
  
  if (poll.voting_method === 'identifiable') {
     const { data: vote } = await supabaseAdmin
       .from('poll_votes')
       .select('id')
       .eq('poll_id', id)
       .eq('member_id', user.id)
       .single()
     if (vote) hasVoted = true
  } else {
     const secret = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallback'
     const raw = `${id}:${user.id}:${secret}`
     const hash = createHmac('sha256', secret).update(raw).digest('hex')
     
     const { data: vote } = await supabaseAdmin
       .from('poll_votes')
       .select('id')
       .eq('poll_id', id)
       .eq('hashed_identifier', hash)
       .single()
     if (vote) hasVoted = true
  }

  // 4. Check Eligibility
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role, organisation_id, status')
    .eq('id', user.id)
    .single()

  const profile = profileData as { role: string; organisation_id: string | null; status: string } | null

  const isEligible = profile?.organisation_id === poll.organisation_id && profile?.status === 'active' 
    // Add role check if needed, simplified here (VotingInterface handles it via Action check too)

  // 5. Get Live Results (if allowed)
  let results: PollResults = poll.final_results || { counts: {}, total: 0 }
  
  if (poll.status === 'active' && poll.type === 'informal') {
     // Aggregate live
     const { data: votes } = await supabaseAdmin.from('poll_votes').select('option_id').eq('poll_id', id)
     const counts: Record<string, number> = {}
     votes?.forEach((v: { option_id: string }) => {
       counts[v.option_id] = (counts[v.option_id] || 0) + 1
     })
     results = { counts, total: votes?.length || 0 }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/${lang}/dashboard/polls`} className="flex items-center text-sm text-gray-500 hover:text-black mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Polls
        </Link>
      </div>
      
      <VotingInterface 
        poll={poll} 
        options={options || []} 
        hasVoted={hasVoted} 
        isEligible={isEligible}
        totalVotes={results.total}
        results={results}
      />
    </div>
  )
}
