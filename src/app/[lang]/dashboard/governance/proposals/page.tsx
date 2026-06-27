import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { ProposalManager } from '@/components/dashboard/proposal-manager'

export const dynamic = 'force-dynamic'

export default async function ProposalsPage() {
  const supabase = await createClient()
  const orgId = await getSelectedOrganisationId()

  const { data: proposals } = await supabase
    .from('proposals')
    .select('*')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <ProposalManager proposals={proposals || []} />
    </div>
  )
}
