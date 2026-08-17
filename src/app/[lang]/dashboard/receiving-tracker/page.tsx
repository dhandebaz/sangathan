import { ReceivingTrackerClient } from '@/components/dashboard/civic/receiving-tracker-client'
import { getReceivingTrackersAction } from '@/actions/receiving-tracker'
import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Stamped Physical Receiving & RTI Tracker | Sangathan',
    description: 'Track physical stamped receiving copies from municipal ward offices and auto-generate Section 6(1) RTI applications.',
  }
}

export default async function ReceivingTrackerPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .maybeSingle()

  let orgId = profile?.organisation_id
  if (!orgId) {
    try {
      orgId = await getSelectedOrganisationId()
    } catch {
      // fallback
    }
  }

  if (!orgId) {
    redirect(`/${lang}/onboarding`)
  }

  const { data: org } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', orgId)
    .maybeSingle()

  const trackersRes = await getReceivingTrackersAction(orgId)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <ReceivingTrackerClient
        orgId={orgId}
        orgName={org?.name || 'Civic Collective'}
        initialTrackers={trackersRes.data || []}
      />
    </div>
  )
}
