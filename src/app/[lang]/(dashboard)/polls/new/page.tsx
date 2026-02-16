import { createClient } from '@/lib/supabase/server'
import { PollForm } from '@/components/polls/poll-form'
import { redirect } from 'next/navigation'
import { AccessDenied } from '@/components/dashboard/access-denied'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewPollPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
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

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/${lang}/dashboard/polls`} className="flex items-center text-sm text-gray-500 hover:text-black mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Polls
        </Link>
        <h1 className="text-2xl font-bold">Create New Poll</h1>
      </div>
      <PollForm orgId={profile.organisation_id} />
    </div>
  )
}
