import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId, getUserContext } from '@/lib/auth/context'
import { TicketManager } from '@/components/dashboard/ticket-manager'

export const dynamic = 'force-dynamic'

export default async function MaintenancePage() {
  const supabase = await createClient()
  const orgId = await getSelectedOrganisationId()
  const ctx = await getUserContext(orgId)

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*')
    .eq('organisation_id', ctx.organizationId)
    .eq('type', 'maintenance')
    .order('created_at', { ascending: false })

  return (
    <TicketManager 
      type="maintenance"
      title="Maintenance Requests"
      description="Track infrastructure, facility, and property maintenance requests."
      tickets={tickets || []}
      role={ctx.role}
      isAdminOrEditor={['admin', 'editor'].includes(ctx.role)}
    />
  )
}
