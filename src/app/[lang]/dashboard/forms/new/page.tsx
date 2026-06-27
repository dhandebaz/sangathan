import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { NewFormClient } from '@/components/forms/new-form-client'

export const dynamic = 'force-dynamic'

export default async function NewFormPage(props: { params: Promise<{ lang: string }> }) {
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
    <div className="space-y-6">
      <NewFormClient lang={lang} />
    </div>
  )
}
