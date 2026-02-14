import { createClient } from '@/lib/supabase/server'
import { EventForm } from '@/components/events/event-form'
import { getCollaboratingOrgs } from '@/actions/collaboration'
import { redirect } from 'next/navigation'
import { AccessDenied } from '@/components/dashboard/access-denied'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewEventPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profileData } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single()

  const profile = profileData as { organization_id: string; role: string } | null

  if (!profile || !profile.organization_id || !['admin', 'editor', 'executive'].includes(profile.role)) {
    return <AccessDenied lang={lang} />
  }

  const partners = await getCollaboratingOrgs(profile.organization_id)

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/${lang}/dashboard/events`} className="flex items-center text-sm text-gray-500 hover:text-black mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Events
        </Link>
        <h1 className="text-2xl font-bold">Create New Event</h1>
      </div>
      <EventForm orgId={profile.organization_id} partners={partners} />
    </div>
  )
}
