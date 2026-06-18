import { createClient } from '@/lib/supabase/server'
import { EventForm } from '@/components/events/event-form'
import { getCollaboratingOrgs } from '@/actions/collaboration'
import { redirect, notFound } from 'next/navigation'
import { AccessDenied } from '@/components/dashboard/access-denied'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DashboardEvent } from '@/types/dashboard'

export default async function EditEventPage(props: { params: Promise<{ lang: string, id: string }> }) {
  const { lang, id } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profileData } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  const profile = profileData as { organisation_id: string | null; role: string } | null

  if (!profile || !profile.organisation_id || !['admin', 'editor', 'executive'].includes(profile.role)) {
    return <AccessDenied lang={lang} />
  }

  // Fetch Event
  const { data: eventData } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('organisation_id', profile.organisation_id)
    .single()

  const event = eventData as DashboardEvent | null

  if (!event) notFound()

  // Fetch partners
  const partners = await getCollaboratingOrgs(profile.organisation_id)

  // Fetch existing collaborations for this event
  const { data: jointEvents } = await supabase
    .from('joint_events')
    .select('organisation_id')
    .eq('event_id', id)

  // Attach collaborating_org_ids to initialData
  const eventWithCollabs = {
    ...event,
    collaborating_org_ids: jointEvents?.map(j => j.organisation_id) || []
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/${lang}/dashboard/events/${id}`} className="flex items-center text-sm text-gray-500 hover:text-black mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Event
        </Link>
        <h1 className="text-2xl font-bold">Edit Event</h1>
      </div>
      <EventForm orgId={profile.organisation_id} partners={partners} initialData={eventWithCollabs as unknown as DashboardEvent} />
    </div>
  )
}
