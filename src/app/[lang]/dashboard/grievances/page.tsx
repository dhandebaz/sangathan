import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId, getUserContext } from '@/lib/auth/context'
import { TicketManager } from '@/components/dashboard/ticket-manager'

export const dynamic = 'force-dynamic'

export default async function GrievancesPage() {
  const supabase = await createClient()
  const orgId = await getSelectedOrganisationId()
  const ctx = await getUserContext(orgId)

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*')
    .eq('organisation_id', ctx.organizationId)
    .eq('type', 'grievance')
    .order('created_at', { ascending: false })

  return (
    <TicketManager 
      type="grievance"
      title="Grievance Redressal"
      description="Track and resolve labor disputes, workplace issues, and union member grievances."
      tickets={tickets || []}
      role={ctx.role}
      isAdminOrEditor={['admin', 'editor'].includes(ctx.role)}
    />
  )
}
