import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId, getUserContext } from '@/lib/auth/context'
import { CampaignManager } from '@/components/dashboard/campaign-manager'

export const dynamic = 'force-dynamic'

export default async function CampaignsPage() {
  const supabase = await createClient()
  const orgId = await getSelectedOrganisationId()
  const ctx = await getUserContext(orgId)

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('organisation_id', ctx.organizationId)
    .order('created_at', { ascending: false })

  return (
    <CampaignManager
      campaigns={campaigns || []}
      role={ctx.role}
      isAdminOrEditor={['admin', 'editor'].includes(ctx.role)}
    />
  )
}

