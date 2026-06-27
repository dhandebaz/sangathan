import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId, getUserContext } from '@/lib/auth/context'
import { TicketManager } from '@/components/dashboard/ticket-manager'
import { BillingManager } from '@/components/dashboard/billing-manager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Invoice, Unit } from '@/types/dashboard'

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

  // Fetch Billing Data
  const { data: invoicesData } = await supabase
    .from('invoices')
    .select('*')
    .eq('organisation_id', ctx.organizationId)
    .order('due_date', { ascending: false })

  const { data: unitsData } = await supabase
    .from('units')
    .select('*')
    .eq('organisation_id', ctx.organizationId)

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Facility & Maintenance</h1>
        <p className="text-muted-foreground mt-1">Manage infrastructure requests and maintenance billing.</p>
      </div>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tickets">Service Requests</TabsTrigger>
          <TabsTrigger value="billing">Maintenance Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tickets">
          <TicketManager 
            type="maintenance"
            title=""
            description=""
            tickets={tickets || []}
            role={ctx.role}
            isAdminOrEditor={['admin', 'editor'].includes(ctx.role)}
          />
        </TabsContent>

        <TabsContent value="billing">
          <BillingManager 
            invoices={(invoicesData as unknown as Invoice[]) || []}
            units={(unitsData as unknown as Unit[]) || []}
            isAdminOrEditor={['admin', 'editor', 'executive'].includes(ctx.role)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
