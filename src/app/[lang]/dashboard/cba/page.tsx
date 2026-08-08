import { CBAClient } from '@/components/dashboard/cba/cba-client'
import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CBAPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

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

  return (
    <div className="space-y-6">
      <CBAClient orgId={orgId} />
    </div>
  )
}
