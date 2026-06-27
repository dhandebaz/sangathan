import { HelpdeskClient } from '@/components/dashboard/helpdesk/helpdesk-client'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { createServiceClient } from '@/lib/supabase/service'

export default async function HelpdeskPage() {
  const supabase = createServiceClient()
  const orgId = await getSelectedOrganisationId()
  
  let orgType = 'ngo' // Default
  if (orgId) {
    const { data } = await supabase.from('organisations').select('org_type').eq('id', orgId).single()
    if (data?.org_type) {
      orgType = data.org_type
    }
  }

  return (
    <div className="space-y-6">
      <HelpdeskClient orgType={orgType} orgId={orgId} />
    </div>
  )
}
