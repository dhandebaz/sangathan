import { createServiceClient } from '@/lib/supabase/service'
import { CreditCard, CheckCircle2, Building2, Sparkles, Receipt, Shield } from 'lucide-react'
import { requirePlatformAdmin } from '@/lib/auth/context'
import {
  getAllBillingTransactions,
  getAllOrganisationsPlanOverview,
  setOrganisationPlan,
} from '@/actions/system/billing'

export const dynamic = 'force-dynamic'

export default async function AdminBillingPage() {
  await requirePlatformAdmin()

  const [transactions, orgs] = await Promise.all([
    getAllBillingTransactions(),
    getAllOrganisationsPlanOverview(),
  ])

  const totalRevenue = transactions.reduce((acc, t) => acc + (t.amount || 0), 0)
  const institutionCount = orgs.filter((o) => o.plan_name === 'Institution').length
  const communityCount = orgs.filter((o) => !o.plan_name || o.plan_name === 'Community').length

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <CreditCard className="text-indigo-600 w-7 h-7" />
            Platform Subscriptions & Solidarity Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor organisation patronage, Razorpay transaction ledger, and plan capabilities.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Community Orgs</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{communityCount}</div>
          <p className="text-xs text-slate-500 mt-1">Cross-subsidized civic collectives</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Institution Patronage</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{institutionCount}</div>
          <p className="text-xs text-slate-500 mt-1">Funded NGOs & Unions covering compute</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Contribution</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <p className="text-xs text-slate-500 mt-1">Directly funds sovereign infrastructure</p>
        </div>
      </div>

      {/* Manual Plan Adjustment Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="font-bold text-sm uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600" />
          Assign / Adjust Organisation Plan
        </h2>
        <form
          action={async (formData: FormData) => {
            'use server'
            const organisationId = formData.get('organisation_id') as string
            const planName = formData.get('plan_name') as 'Community' | 'Institution'
            const planPeriod = formData.get('plan_period') as 'monthly' | 'yearly' | 'lifetime'
            if (organisationId && planName) {
              await setOrganisationPlan({ organisationId, planName, planPeriod })
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4"
        >
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 mb-1">Organisation *</label>
            <select
              name="organisation_id"
              required
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800"
            >
              <option value="">Select Organisation</option>
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.plan_name || 'Community'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 mb-1">Target Plan *</label>
            <select
              name="plan_name"
              required
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800"
            >
              <option value="Community">Community (₹0 - Max 20 members)</option>
              <option value="Institution">Institution (Solidarity - Unlimited + AI)</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 mb-1">Period</label>
            <select
              name="plan_period"
              defaultValue="monthly"
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly (Annual)</option>
              <option value="lifetime">Lifetime / Perpetual Grant</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="min-h-11 w-full rounded-xl bg-slate-900 px-4 py-2 font-bold text-xs text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
              Update Plan & Capabilities
            </button>
          </div>
        </form>
      </div>

      {/* Razorpay Transaction Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-600" />
            Razorpay Payment Transactions ({transactions.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-3.5 px-5 font-bold">Date</th>
                <th className="py-3.5 px-5 font-bold">Organisation</th>
                <th className="py-3.5 px-5 font-bold">Plan / Item</th>
                <th className="py-3.5 px-5 font-bold">Billing Cycle</th>
                <th className="py-3.5 px-5 font-bold">Amount</th>
                <th className="py-3.5 px-5 font-bold">Razorpay Payment ID</th>
                <th className="py-3.5 px-5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                    {new Date(tx.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-900">
                    {tx.organisations?.name || 'Unknown'}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-indigo-950">{tx.plan_name}</td>
                  <td className="py-3.5 px-5 text-slate-600 capitalize">{tx.plan_period}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-900">
                    ₹{Number(tx.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500">
                    {tx.razorpay_payment_id || '-'}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organisations Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-600" />
            Organisation Plan Directory ({orgs.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-3.5 px-5 font-bold">Organisation</th>
                <th className="py-3.5 px-5 font-bold">Type</th>
                <th className="py-3.5 px-5 font-bold">Plan</th>
                <th className="py-3.5 px-5 font-bold">Billing Cycle</th>
                <th className="py-3.5 px-5 font-bold">Plan Status</th>
                <th className="py-3.5 px-5 font-bold">White-Label</th>
                <th className="py-3.5 px-5 font-bold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orgs.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-slate-900">
                    <div>{org.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">/{org.slug}</div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 capitalize">{org.org_type || 'General'}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                        org.plan_name === 'Institution'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {org.plan_name || 'Community'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 capitalize">{org.plan_period || 'monthly'}</td>
                  <td className="py-3.5 px-5 text-slate-600 capitalize">{org.plan_status || 'active'}</td>
                  <td className="py-3.5 px-5">
                    {org.whitelabel_enabled ? (
                      <span className="text-emerald-700 font-bold">Yes</span>
                    ) : (
                      <span className="text-slate-400">No</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                    {new Date(org.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
