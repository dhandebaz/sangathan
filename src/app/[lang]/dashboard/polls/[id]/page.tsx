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

  const { data: poll } = await supabaseAdmin
    .from('polls')
    .select('*')
    .eq('id', id)
    .single() as { data: Poll | null }

  if (!poll) notFound()

  const { data: options } = await supabaseAdmin
    .from('poll_options')
    .select('*')
    .eq('poll_id', id)
    .order('display_order', { ascending: true }) as { data: PollOption[] | null }

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
     const secret = process.env.POLL_HMAC_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
     if (!secret) {
       throw new Error('Missing POLL_HMAC_SECRET or SUPABASE_SERVICE_ROLE_KEY')
     }
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

  const { data: profileData } = await supabase
    .from('profiles')
    .select('role, organisation_id, status')
    .eq('id', user.id)
    .single()

  const profile = profileData as { role: string; organisation_id: string | null; status: string } | null

  const isEligible = profile?.organisation_id === poll.organisation_id && profile?.status === 'active'

  let results: PollResults = poll.final_results || { counts: {}, total: 0 }
  
  if (poll.status === 'active' && poll.type === 'informal') {
     const { data: options } = await supabaseAdmin
       .from('poll_options')
       .select('id')
       .eq('poll_id', id)

     const counts: Record<string, number> = {}
     let total = 0

     for (const option of options || []) {
       const { count } = await supabaseAdmin
         .from('poll_votes')
         .select('id', { count: 'exact', head: true })
         .eq('poll_id', id)
         .eq('option_id', option.id)

       const optionCount = typeof count === 'number' ? count : 0
       counts[option.id] = optionCount
       total += optionCount
     }

     results = { counts, total }
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
