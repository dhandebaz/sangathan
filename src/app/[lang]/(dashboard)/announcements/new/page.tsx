import { createClient } from '@/lib/supabase/server'
import { AnnouncementForm } from '@/components/announcements/announcement-form'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AccessDenied } from '@/components/dashboard/access-denied'

export default async function NewAnnouncementPage(props: { params: Promise<{ lang: string }> }) {
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

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/${lang}/dashboard/announcements`} className="flex items-center text-sm text-gray-500 hover:text-black mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Announcements
        </Link>
        <h1 className="text-2xl font-bold">New Announcement</h1>
        <p className="text-gray-500 text-sm">Broadcast updates to your organisation members.</p>
      </div>
      
      <AnnouncementForm orgId={profile.organization_id} />
    </div>
  )
}
