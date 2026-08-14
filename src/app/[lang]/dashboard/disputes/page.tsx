import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { getTradeDisputes } from '@/lib/../actions/trade-disputes'
import { Scale, Plus, Building2, Calendar, ShieldCheck, AlertCircle, Clock, CheckCircle2 } from 'lucide-react'
import { DisputesManager } from '@/components/disputes/disputes-manager'

export const metadata: Metadata = {
  title: 'Trade Disputes & ALC Conciliation | Sangathan',
  description: 'Track workplace disputes, collective grievances, and statutory labour court conciliation stages.',
}

export default async function TradeDisputesPage(props: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const isHindi = lang === 'hi'
  const orgId = await getSelectedOrganisationId()

  let disputes: any[] = []
  if (orgId) {
    const res = await getTradeDisputes(orgId)
    if (res.success) disputes = res.disputes
  }

  const activeCount = disputes.filter(d => d.status === 'active' || d.status === 'pending_hearing').length
  const settledCount = disputes.filter(d => d.status === 'settled').length
  const totalWorkers = disputes.reduce((sum, d) => sum + (d.worker_count || 1), 0)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shadow-2xs">
                <Scale className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {isHindi ? 'श्रमिक विवाद एवं सुलह मंच (Trade Disputes)' : 'Trade Disputes & ALC Conciliation'}
              </h1>
            </div>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
              {isHindi
                ? 'कारखाना स्तर के विवादों, गैर-कानूनी बर्खास्तगी और वेतन कटौती के मामलों को सुलह अधिकारी (ALC) व श्रम न्यायालय में ट्रैक करें।'
                : 'Manage workplace disputes, wage theft cases, and statutory conciliation stages under the Industrial Disputes Act.'}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'सक्रिय विवाद (Active)' : 'Active Cases'}
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{activeCount}</p>
          <p className="mt-1 text-xs text-slate-500">{isHindi ? 'सुलह प्रक्रिया में' : 'In active conciliation'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'निपटाए गए मामले (Settled)' : 'Settled Disputes'}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{settledCount}</p>
          <p className="mt-1 text-xs text-slate-500">{isHindi ? 'द्विपक्षीय समझौते द्वारा' : 'Via bipartite accord'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'प्रभावित श्रमिक' : 'Impacted Workers'}
            </span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{totalWorkers}</p>
          <p className="mt-1 text-xs text-slate-500">{isHindi ? 'यूनियन सुरक्षा में' : 'Covered under collective action'}</p>
        </div>
      </div>

      {/* Main Interactive Manager */}
      <DisputesManager initialDisputes={disputes} isHindi={isHindi} orgId={orgId || ''} />
    </div>
  )
}
