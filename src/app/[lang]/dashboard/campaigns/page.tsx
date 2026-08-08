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
    return <CampaignManager campaigns={[]} role={role} isAdminOrEditor={false} />
  }

  let campaigns: any[] = []

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false })

  if (error) {
    try {
      const adminClient = createServiceClient()
      const fallbackRes = await adminClient
        .from('campaigns')
        .select('*')
        .eq('organisation_id', orgId)
        .order('created_at', { ascending: false })

      if (!fallbackRes.error) {
        campaigns = fallbackRes.data || []
      }
    } catch {
      campaigns = []
    }
  } else {
    campaigns = data || []
  }

  return (
    <CampaignManager
      campaigns={campaigns}
      role={role}
      isAdminOrEditor={['admin', 'editor', 'executive'].includes(role)}
    />
  )
}
