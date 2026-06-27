import { createServiceClient } from '@/lib/supabase/service'
import { Shield, Gavel, Ban, Activity } from 'lucide-react'
import { requirePlatformAdmin } from '@/lib/auth/context'

export const dynamic = 'force-dynamic'

export default async function SecurityPage() {
  await requirePlatformAdmin()

  const supabase = createServiceClient()

  const [{ data: actions }, { count: legalHoldCount }, { data: restrictedOrgs }, { data: rateLimits }] =
    await Promise.all([
      supabase
        .from('platform_actions')
        .select('*, organisations(name, slug)')
        .order('created_at', { ascending: false })
        .limit(50) as unknown as Promise<{ data: PlatformActionRow[] | null }>,
      supabase
        .from('organisations')
        .select('*', { count: 'exact', head: true })
        .eq('legal_hold', true),
      supabase
        .from('organisations')
        .select('id, name, slug')
        .eq('status', 'suspended')
        .limit(50),
      supabase
        .from('rate_limits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50) as unknown as Promise<{ data: RateLimitRow[] | null }>,
    ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-3">
          <Shield className="text-red-600" />
          Security overview
        </h1>
        <p className="mt-2 text-sm text-slate-600">Platform security status, legal holds, restricted orgs, and rate limits.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-bold uppercase">
            <Gavel size={16} /> Legal holds
          </div>
          <div className="text-3xl font-bold text-red-600">{legalHoldCount || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-bold uppercase">
            <Ban size={16} /> Suspended orgs
          </div>
          <div className="text-3xl font-bold text-orange-600">{restrictedOrgs?.length || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-bold uppercase">
            <Activity size={16} /> Rate limit entries
          </div>
          <div className="text-3xl font-bold text-gray-900">{rateLimits?.length || 0}</div>
        </div>
      </div>

      {legalHoldCount && legalHoldCount > 0 ? (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-sm uppercase text-gray-700 flex items-center gap-2">
              <Gavel size={14} /> Legal holds
            </h2>
          </div>
          <div className="p-4 text-sm text-gray-600">{legalHoldCount} organisation(s) under legal hold.</div>
        </section>
      ) : null}

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-sm uppercase text-gray-700">Suspended organisations</h2>
          <span className="text-xs text-gray-500">{restrictedOrgs?.length || 0} orgs</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Name</th>
                <th className="py-3 px-6 font-medium text-gray-500">Slug</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(restrictedOrgs || []).map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 font-medium">{org.name}</td>
                  <td className="py-3 px-6 font-mono text-xs">{org.slug}</td>
                </tr>
              ))}
              {(!restrictedOrgs || restrictedOrgs.length === 0) && (
                <tr>
                  <td colSpan={2} className="py-6 px-4 text-center text-sm text-gray-500">No suspended organisations.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-bold text-sm uppercase text-gray-700">Recent platform actions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Time</th>
                <th className="py-3 px-6 font-medium text-gray-500">Organisation</th>
                <th className="py-3 px-6 font-medium text-gray-500">Action</th>
                <th className="py-3 px-6 font-medium text-gray-500">Severity</th>
                <th className="py-3 px-6 font-medium text-gray-500">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(actions || []).map((action) => (
                <tr key={action.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(action.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-6">
                    {action.organisations?.name ? (
                      <span className="font-medium">{action.organisations.name}</span>
                    ) : (
                      <span className="text-xs text-gray-400">System</span>
                    )}
                  </td>
                  <td className="py-3 px-6 font-mono text-xs uppercase">{action.action_type}</td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      action.severity === 'level_5' || action.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : action.severity === 'level_4' || action.severity === 'medium'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {action.severity || 'normal'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-700 max-w-md truncate">{action.reason}</td>
                </tr>
              ))}
              {(!actions || actions.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-6 px-4 text-center text-sm text-gray-500">No platform actions recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-bold text-sm uppercase text-gray-700">Rate limits</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Key</th>
                <th className="py-3 px-6 font-medium text-gray-500">Count</th>
                <th className="py-3 px-6 font-medium text-gray-500">Window</th>
                <th className="py-3 px-6 font-medium text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(rateLimits || []).map((rl, idx) => (
                <tr key={rl.key || idx} className="hover:bg-gray-50">
                  <td className="py-3 px-6 font-mono text-xs">{rl.key}</td>
                  <td className="py-3 px-6">{rl.points}</td>
                  <td className="py-3 px-6 text-xs">{new Date(rl.window_start).toLocaleString()}</td>
                  <td className="py-3 px-6 text-xs text-gray-500 whitespace-nowrap">
                    {rl.created_at ? new Date(rl.created_at).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
              {(!rateLimits || rateLimits.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center text-sm text-gray-500">No rate limit entries.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

interface PlatformActionRow {
  id: string
  action_type: string
  severity: string | null
  reason: string
  created_at: string
  organisations?: { name: string; slug: string } | null
}

interface RateLimitRow {
  key: string
  points: number
  window_start: string
  created_at: string
}
