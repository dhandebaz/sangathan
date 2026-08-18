import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { UnifiedGovernanceHub } from '@/components/dashboard/governance/unified-governance-hub'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'शासन प्रणाली एवं वित्तीय कोष | संगठन' : 'Governance & Treasury Hub | Sangathan',
    description: isHindi
      ? 'लोकतांत्रिक प्रस्ताव, मतदान, आय-व्यय बहीखाता, चंदा रसीदें और अनुदान प्रबंधन।'
      : 'Democratic resolutions, voting ballots, financial ledger, chanda & donations, and grants.',
  }
}

interface PageProps {
  params: Promise<{ lang: string }>
  searchParams: Promise<{
    tab?: string
    status?: string
    q?: string
  }>
}

export default async function GovernancePage({ params, searchParams }: PageProps) {
  const { lang } = await params
  const sp = await searchParams
  const initialTab = sp.tab || 'proposals'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${lang}/login`)
  }

  const selectedOrgId = await getSelectedOrganisationId()
  if (!selectedOrgId) {
    redirect(`/${lang}/select-organisation`)
  }

  // Get user profile & org details
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .eq('organisation_id', selectedOrgId)
    .maybeSingle()

  const { data: org } = await supabase
    .from('organisations')
    .select('name, organisation_type')
    .eq('id', selectedOrgId)
    .single()

  const isAdmin = profile?.role === 'admin' || profile?.role === 'owner'
  const orgName = org?.name || 'Organisation'
  const orgType = org?.organisation_type || 'civic_collective'

  // Fetch Proposals
  const { data: proposals } = await supabase
    .from('proposals')
    .select('*')
    .eq('organisation_id', selectedOrgId)
    .order('created_at', { ascending: false })

  // Fetch Polls
  const { data: polls } = await supabase
    .from('polls')
    .select('*')
    .eq('organisation_id', selectedOrgId)
    .order('created_at', { ascending: false })

  // Fetch Financial Transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('organisation_id', selectedOrgId)
    .order('created_at', { ascending: false })

  // Fetch Campaigns
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('organisation_id', selectedOrgId)
    .order('created_at', { ascending: false })

  // Fetch Tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('organisation_id', selectedOrgId)
    .order('created_at', { ascending: false })

  // Aggregated stats
  const totalIncome = transactions?.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount || 0), 0) || 0
  const totalExpenses = transactions?.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount || 0), 0) || 0

  const stats = {
    totalProposals: proposals?.length || 0,
    activePolls: polls?.filter(p => p.status === 'active').length || polls?.length || 0,
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    totalChanda: totalIncome,
    activeCampaigns: campaigns?.filter(c => c.status === 'active').length || campaigns?.length || 0,
    pendingTasks: tasks?.filter(t => t.status !== 'completed').length || tasks?.length || 0,
  }

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 space-y-6">
      <UnifiedGovernanceHub
        lang={lang}
        orgId={selectedOrgId}
        orgName={orgName}
        orgType={orgType}
        isAdmin={isAdmin}
        initialTab={initialTab}
        proposals={proposals || []}
        polls={polls || []}
        transactions={transactions || []}
        campaigns={campaigns || []}
        tasks={tasks || []}
        stats={stats}
      />
    </div>
  )
}
