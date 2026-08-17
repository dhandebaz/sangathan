import { PressReleasesClient } from '@/components/dashboard/civic/press-releases-client'
import { getPressReleasesAction } from '@/actions/press-releases'
import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Press Release & Media Dispatch Studio | Sangathan',
    description: 'Bilingual press release builder and media communications studio for civic collectives and grassroots campaigns.',
  }
}

export default async function PressReleasesPage(props: { params: Promise<{ lang: string }> }) {
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

  const releasesRes = await getPressReleasesAction(orgId)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <PressReleasesClient
        orgId={orgId}
        orgName={org?.name || 'Civic Collective'}
        initialReleases={releasesRes.data || []}
      />
    </div>
  )
}
