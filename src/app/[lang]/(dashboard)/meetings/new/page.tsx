import { createClient } from '@/lib/supabase/server'
import { CreateMeetingForm } from '@/components/meetings/create-meeting-form'
import { redirect } from 'next/navigation'
import { AccessDenied } from '@/components/dashboard/access-denied'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function NewMeetingPage(props: { params: Promise<{ lang: string }> }) {
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

  // Fetch active members to populate the invite list
  const { data: members } = await supabase
    .from('members')
    .select('id, full_name')
    .eq('status', 'active')
    .order('full_name')

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/${lang}/dashboard/meetings`} className="flex items-center text-sm text-gray-500 hover:text-black mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Meetings
        </Link>
        <h1 className="text-2xl font-bold">Schedule New Meeting</h1>
      </div>
      <CreateMeetingForm members={members || []} />
    </div>
  )
}
