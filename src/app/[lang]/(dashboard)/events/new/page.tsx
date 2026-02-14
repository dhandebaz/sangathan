import { createClient } from '@/lib/supabase/server'
import { EventForm } from '@/components/events/event-form'
import { getCollaboratingOrgs } from '@/actions/collaboration'
import { redirect } from 'next/navigation'

export default async function NewEventPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    return <div>Access Denied</div>
  }

  const partners = await getCollaboratingOrgs(profile.organisation_id)

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <EventForm orgId={profile.organisation_id} partners={partners} />
    </div>
  )
}
