import { getSelectedOrganisationId } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ChandaClient from '@/components/dashboard/chanda/chanda-client'

export default async function ChandaPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  const organisationId = await getSelectedOrganisationId()
  
  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const supabase = await createClient()

  // Fetch billing plans (chanda rounds - we can filter by name having 'Chanda' or just show all one_time ones)
  // Let's assume all one_time plans with name containing 'Chanda' are chanda rounds
  const { data: plans } = await supabase
    .from('billing_plans')
    .select('*')
    .eq('organisation_id', organisationId)
    .ilike('name', '%Chanda%')
    .order('created_at', { ascending: false })

  // Fetch dues with member details for all these plans
  let dues: any[] = []
  if (plans && plans.length > 0) {
    const planIds = plans.map(p => p.id)
    const { data: fetchedDues } = await supabase
      .from('membership_dues')
      .select(`
        id,
        amount,
        status,
        due_date,
        notes,
        plan_id,
        profiles:member_profile_id (
          full_name,
          area
        )
      `)
      .eq('organisation_id', organisationId)
      .in('plan_id', planIds)
      
    dues = fetchedDues || []
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Colony Chanda Ledger
          </h1>
          <p className="text-muted-foreground mt-1">Track monthly micro-collections door-to-door.</p>
        </div>
      </div>

      <ChandaClient plans={plans || []} dues={dues} lang={lang} />
    </div>
  )
}
