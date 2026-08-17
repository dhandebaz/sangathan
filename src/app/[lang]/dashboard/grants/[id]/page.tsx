import { Metadata } from 'next'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { getGrantAccountingSummary } from '@/actions/grant-accounting'
import { createClient } from '@/lib/supabase/server'
import { DollarSign, Landmark, ArrowLeft, Plus, CheckCircle2, Clock } from 'lucide-react'
import Link from 'next/link'
import { GrantAccountingStudio } from '@/components/grants/grant-accounting-studio'

export const metadata: Metadata = {
  title: 'Grant Tranches & Line-Item Budget Spend | Sangathan',
  description: 'Track milestone tranche disbursements, line-item expenditures, and balance utilization for institutional grants.',
}

export default async function GrantDetailPage(props: {
  params: Promise<{ lang: string; id: string }>
}) {
  const { lang, id: grantId } = await props.params
  const isHindi = lang === 'hi'
  const orgId = await getSelectedOrganisationId()

  const supabase = await createClient()
  const { data: grant } = await supabase
    .from('grants')
    .select('*')
    .eq('id', grantId)
    .eq('organisation_id', orgId || '')
    .maybeSingle()

  let accountingData: any = {
    milestones: [],
    expenses: [],
    totalTranches: 0,
    totalExpenses: 0,
    remainingBalance: 0,
  }

  if (orgId) {
    const res = await getGrantAccountingSummary(grantId, orgId)
    if (res.success) accountingData = res
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Back Navigation */}
      <div className="border-b border-slate-200/80 pb-6">
        <Link
          href={`/${lang}/dashboard/grants`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {isHindi ? 'सभी ग्रांट्स पर वापस जाएं' : 'Back to Grants'}
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-2xs">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {grant?.title || (isHindi ? 'संस्थागत ग्रांट विवरण' : 'Grant Accounting Studio')}
                </h1>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  {isHindi ? 'फंडर / दाता: ' : 'Funding Agency: '}
                  <span className="font-bold text-slate-800">{grant?.funder || 'Govt / CSR Entity'}</span>
                  {grant?.amount && ` • Total Sanctioned: ₹${Number(grant.amount).toLocaleString('en-IN')}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'प्राप्त किश्तें (Tranches Disbursed)' : 'Total Tranches Received'}
            </span>
            <Landmark className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            ₹{Number(accountingData.totalTranches).toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-slate-500">{accountingData.milestones.length} {isHindi ? 'माइलस्टोन्स' : 'milestones'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'वास्तविक व्यय (Expenses Spent)' : 'Actual Line-Item Spend'}
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            ₹{Number(accountingData.totalExpenses).toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-slate-500">{accountingData.expenses.length} {isHindi ? 'व्यय प्रविष्टियां' : 'logged line items'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'शेष अप्रयुक्त राशि (Remaining)' : 'Unspent Grant Balance'}
            </span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-indigo-700">
            ₹{Number(accountingData.remainingBalance).toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-slate-500">{isHindi ? 'ऑडिट हेतु उपलब्ध' : 'Available for programmatic spend'}</p>
        </div>
      </div>

      {/* Main Studio */}
      <GrantAccountingStudio
        grantId={grantId}
        initialMilestones={accountingData.milestones}
        initialExpenses={accountingData.expenses}
        isHindi={isHindi}
      />
    </div>
  )
}
