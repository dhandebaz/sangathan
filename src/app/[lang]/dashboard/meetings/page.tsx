import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { MeetingsClient, MeetingItem } from '@/components/meetings/meetings-client'

export const dynamic = 'force-dynamic'

async function getOrgType(supabase: Awaited<ReturnType<typeof createClient>>, orgId: string): Promise<string> {
  if (!orgId) return 'default'
  const { data } = await supabase.from('organisations').select('org_type').eq('id', orgId).single()
  return data?.org_type || 'default'
}

function getOrgLabels(orgType: string) {
  const labels: Record<string, { title: string; description: string }> = {
    ngo: { title: 'Meetings & Syncs', description: 'Track board meetings, team syncs, and stakeholder gatherings.' },
    student_union: { title: 'Union Assemblies', description: 'Schedule council meetings, club assemblies, and student forums.' },
    workers_union: { title: 'Union Meetings', description: 'Organize collective bargaining sessions, shop floor meetings, and member assemblies.' },
    rwa: { title: 'Society Meetings', description: 'Manage AGMs, committee meetings, and resident gatherings.' },
  }
  return labels[orgType] || { title: 'Meetings', description: 'Schedule and track organisational gatherings.' }
}

export default async function MeetingsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${lang}/login`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  let selectedOrgId = profile?.organisation_id
  if (!selectedOrgId) {
    try {
      selectedOrgId = await getSelectedOrganisationId()
    } catch {
      // Ignore
    }
  }

  if (!selectedOrgId) {
    return (
      <div className="p-8 text-center border border-border bg-card rounded-xl">
        <h2 className="text-xl font-bold">No Organisation Selected</h2>
        <p className="text-muted-foreground mt-2">Please join or set up an organisation to manage meetings.</p>
      </div>
    )
  }

  const orgType = await getOrgType(supabase, selectedOrgId)
  const { title, description } = getOrgLabels(orgType)

  let meetings: MeetingItem[] = []

  const { data, error } = await supabase
    .from('meetings')
    .select('id, title, date, location, description, meeting_link, organisation_id')
    .eq('organisation_id', selectedOrgId)
    .order('date', { ascending: false })

  if (error) {
    try {
      const adminClient = createServiceClient()
      const fallbackRes = await adminClient
        .from('meetings')
        .select('id, title, date, location, description, meeting_link, organisation_id')
        .eq('organisation_id', selectedOrgId)
        .order('date', { ascending: false })

      if (!fallbackRes.error) {
        meetings = (fallbackRes.data || []) as MeetingItem[]
      }
    } catch {
      meetings = []
    }
  } else {
    meetings = (data || []) as MeetingItem[]
  }

  return (
    <MeetingsClient
      initialMeetings={meetings}
      lang={lang}
      title={title}
      description={description}
    />
  )
}
