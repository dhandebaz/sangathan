import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { LogDonationDialog } from '@/components/donations/log-donation-dialog'
import { DonationList } from '@/components/donations/donation-list'
import { SubscriptionList } from '@/components/donations/subscription-list'
import { Printer } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Donation, DonationSubscription } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

async function getOrgType(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string> {
  const orgId = await getSelectedOrganisationId()
  const { data } = await supabase.from('organisations').select('org_type').eq('id', orgId).single()
  return data?.org_type || 'default'
}

function getOrgLabels(orgType: string) {
  const labels: Record<string, { title: string; description: string }> = {
    ngo: { title: 'Donations & Fundraising', description: 'Track donor contributions, issue tax receipts, and manage fundraising campaigns.' },
    rwa: { title: 'Maintenance Collections', description: 'Track maintenance fee collections and society funds.' },
    student_union: { title: 'Contributions', description: 'Track financial contributions and member subscriptions.' },
    workers_union: { title: 'Contributions', description: 'Track financial contributions and member subscriptions.' },
  }
  return labels[orgType] || { title: 'Donations', description: 'Track contributions and manage financial support.' }
}

interface PageProps {
  params: Promise<{ lang: string }>
  searchParams: Promise<{
    q?: string
    status?: string
    page?: string
  }>
}

export default async function DonationsPage(props: PageProps) {
  const { lang } = await props.params
  const params = await props.searchParams
  const query = params.q || ''
  const status = params.status || 'all'
  
  const supabase = await createClient()
  const selectedOrgId = await getSelectedOrganisationId()
  const orgType = await getOrgType(supabase)
  const { title, description } = getOrgLabels(orgType)

  let dbQuery = supabase
    .from('donations')
    .select('*')
    .eq('organisation_id', selectedOrgId)
    .order('date', { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`donor_name.ilike.%${query}%,upi_reference.ilike.%${query}%`)
  }

  if (status === 'verified') {
    dbQuery = dbQuery.not('verified_by', 'is', null)
  } else if (status === 'pending') {
    dbQuery = dbQuery.is('verified_by', null)
  }

  const { data, error } = await dbQuery
  
  const donations = data as unknown as Donation[] | null

  const { data: subData, error: subError } = await supabase
    .from('donation_subscriptions')
    .select('*')
    .eq('organisation_id', selectedOrgId)
    .order('created_at', { ascending: false })

  const subscriptions = subData as unknown as DonationSubscription[] | null

  if (error || subError) {
    return <div className="p-4 text-red-500">Error loading data</div>
  }

  const totalAmount = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
    <div className="space-y-6">
           <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
             <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex gap-2">
            <a 
               href={`/${lang}/dashboard/donations/print`} 
               target="_blank"
               className="bg-card border border-border text-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-accent"
            >
               <Printer size={16} />
               Export Ledger
            </a>
            <LogDonationDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         <Card className="bg-primary/5 border-primary/10">
           <CardContent className="p-5">
             <div className="text-sm text-primary font-medium uppercase tracking-wide">Total Collected</div>
             <div className="text-3xl font-bold text-primary mt-1">₹{totalAmount.toLocaleString()}</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-5">
             <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total Transactions</div>
             <div className="text-3xl font-bold text-foreground mt-1">{donations?.length || 0}</div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-5">
             <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Pending Verification</div>
             <div className="text-3xl font-bold text-foreground mt-1">
               {donations?.filter(d => !d.verified_by).length || 0}
             </div>
           </CardContent>
         </Card>
      </div>

      <Tabs defaultValue="one-time" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="one-time">One-Time Donations</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Subscriptions</TabsTrigger>
        </TabsList>
        <TabsContent value="one-time">
          <div className="content-card rounded-lg p-0 overflow-hidden border">
             <DonationList donations={donations || []} />
          </div>
        </TabsContent>
        <TabsContent value="recurring">
          <div className="content-card rounded-lg p-0 overflow-hidden border">
             <SubscriptionList subscriptions={subscriptions || []} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
