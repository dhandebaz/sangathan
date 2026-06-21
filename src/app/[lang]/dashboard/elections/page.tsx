import { getTranslations } from 'next-intl/server'
import { PageHeader } from '@/components/public/page-header'
import { getSelectedOrganisationId } from '@/lib/cookies'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ElectionsClient from '@/components/dashboard/elections/elections-client'

export default async function ElectionsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations('dashboard')
  const organisationId = await getSelectedOrganisationId()
  
  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const supabase = await createClient()

  // Get current user profile ID
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user?.id || '')
    .eq('organisation_id', organisationId)
    .single()

  // Fetch elections
  const { data: elections } = await supabase
    .from('elections')
    .select(`
      *,
      election_positions (
        *,
        candidates (
          *,
          profiles:profile_id (
            full_name,
            email
          )
        )
      )
    `)
    .eq('organisation_id', organisationId)
    .order('start_time', { ascending: false })

  // Fetch if current user has voted in any of these elections
  const { data: myVotes } = await supabase
    .from('election_voters')
    .select('election_id')
    .eq('profile_id', profile?.id)

  const votedElectionIds = myVotes?.map(v => v.election_id) || []

  // Fetch all active members for nomination dropdown
  const { data: members } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('organisation_id', organisationId)
    .eq('status', 'active')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Union Elections
        </h1>
      </div>

      <ElectionsClient 
        elections={elections || []} 
        votedElectionIds={votedElectionIds}
        members={members || []}
        isAdmin={profile?.role === 'admin' || profile?.role === 'editor'}
      />
    </div>
  )
}
