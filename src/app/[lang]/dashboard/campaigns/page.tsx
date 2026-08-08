import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { CampaignManager } from '@/components/dashboard/campaign-manager'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CampaignsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  let orgId = profile?.organisation_id
  let role = profile?.role || 'member'

  if (!orgId) {
    try {
      orgId = await getSelectedOrganisationId()
    } catch {
      // fallback
    }
  }

  if (!orgId) {
    return <CampaignManager lang={lang} campaigns={[]} petitions={[]} role={role} isAdminOrEditor={false} />
  }

  let campaigns: any[] = []
  let petitions: any[] = []
  let orgSlug = 'org'

  const adminClient = createServiceClient()

  try {
    const [orgRes, campRes, petRes] = await Promise.all([
      adminClient.from('organisations').select('slug').eq('id', orgId).single(),
      adminClient.from('campaigns').select('*').eq('organisation_id', orgId).order('created_at', { ascending: false }),
      adminClient.from('petitions').select('*').eq('organisation_id', orgId).order('created_at', { ascending: false }),
    ])

    if (orgRes.data?.slug) orgSlug = orgRes.data.slug
    if (campRes.data) campaigns = campRes.data
    if (petRes.data) petitions = petRes.data
  } catch {
    campaigns = []
    petitions = []
  }

  return (
    <CampaignManager
      lang={lang}
      orgSlug={orgSlug}
      campaigns={campaigns}
      petitions={petitions}
      role={role}
      isAdminOrEditor={['admin', 'editor', 'executive'].includes(role)}
    />
  )
}
