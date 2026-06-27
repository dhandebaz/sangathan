import { createServiceClient } from '@/lib/supabase/service'
import { CreditCard } from 'lucide-react'
import { requirePlatformAdmin } from '@/lib/auth/context'
import { getAllBillingPlans, setOrganisationPlan } from '@/actions/system/billing'

export const dynamic = 'force-dynamic'

interface BillingPlanRow {
  id: string
  organisation_id: string
  name: string
  amount: number
  currency: string
  frequency: string
  is_active: boolean
  created_at: string
  organisations?: { name: string; slug: string } | null
}

export default async function BillingPage() {
  await requirePlatformAdmin()

  const plans = await getAllBillingPlans() as BillingPlanRow[]

  const supabase = createServiceClient()
  const { data: orgs } = await supabase
    .from('organisations')
    .select('id, name, plan_name')
    .order('name', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-3">
          <CreditCard className="text-red-600" />
          Billing overview
        </h1>
        <p className="mt-2 text-sm text-slate-600">View billing plans across organisations and manage plan assignments.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-sm uppercase text-gray-700 mb-4">Change organisation plan</h2>
        <form action={async (formData: FormData) => {
          'use server'
          const organisationId = formData.get('organisation_id') as string
          const planName = formData.get('plan_name') as string
          await setOrganisationPlan({ organisationId, planName })
        }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Organisation UUID *</label>
            <input name="organisation_id" required placeholder="org-uuid" className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Plan name *</label>
            <input name="plan_name" required placeholder="e.g. premium" className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="min-h-11 w-full rounded-lg bg-green-700 px-4 py-2 font-bold text-white hover:bg-green-800">
              Update plan
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-bold text-sm uppercase text-gray-700">Billing plans</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Organisation</th>
                <th className="py-3 px-6 font-medium text-gray-500">Plan name</th>
                <th className="py-3 px-6 font-medium text-gray-500">Amount</th>
                <th className="py-3 px-6 font-medium text-gray-500">Currency</th>
                <th className="py-3 px-6 font-medium text-gray-500">Frequency</th>
                <th className="py-3 px-6 font-medium text-gray-500">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 font-medium">
                    {plan.organisations?.name || 'Unknown'}
                    {plan.organisations?.slug && (
                      <span className="ml-2 text-xs text-gray-500 font-mono">{plan.organisations.slug}</span>
                    )}
                  </td>
                  <td className="py-3 px-6 font-mono text-xs">{plan.name}</td>
                  <td className="py-3 px-6">{plan.amount}</td>
                  <td className="py-3 px-6 text-xs">{plan.currency}</td>
                  <td className="py-3 px-6 text-xs capitalize">{plan.frequency}</td>
                  <td className="py-3 px-6">
                    {plan.is_active ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">Yes</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800">No</span>
                    )}
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-sm text-gray-500">No billing plans found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-bold text-sm uppercase text-gray-700">Organisation plans</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Organisation</th>
                <th className="py-3 px-6 font-medium text-gray-500">Plan name</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(orgs || []).map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 font-medium">{org.name}</td>
                  <td className="py-3 px-6 font-mono text-xs">{org.plan_name || '-'}</td>
                </tr>
              ))}
              {(!orgs || orgs.length === 0) && (
                <tr>
                  <td colSpan={2} className="py-6 px-4 text-center text-sm text-gray-500">No organisations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
