import { createServiceClient } from '@/lib/supabase/service'
import { BarChart3 } from 'lucide-react'
import { requirePlatformAdmin } from '@/lib/auth/context'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  await requirePlatformAdmin()

  const supabase = createServiceClient()

  const [
    { data: orgs },
    { data: orgTypes },
    { data: membersByOrg },
    { data: recentLogs },
    { data: orgsByMonth },
  ] = await Promise.all([
    supabase.from('organisations').select('id, name, org_type, created_at').order('created_at', { ascending: false }).limit(500),
    supabase.from('organisations').select('org_type'),
    supabase.from('members').select('organisation_id, organisations(name)'),
    supabase.from('audit_logs').select('*, organisations(name), profiles(full_name)').order('created_at', { ascending: false }).limit(20),
    supabase.from('organisations').select('created_at'),
  ])

  const orgTypeBreakdown: Record<string, number> = {}
  ;(orgTypes || []).forEach((o) => {
    const t = o.org_type || 'unspecified'
    orgTypeBreakdown[t] = (orgTypeBreakdown[t] || 0) + 1
  })

  const totalMembers = membersByOrg?.length || 0
  const orgCount = orgs?.length || 0
  const avgMembersPerOrg = orgCount > 0 ? (totalMembers / orgCount).toFixed(1) : '0'

  const monthCounts: Record<string, number> = {}
  ;(orgsByMonth || []).forEach((o) => {
    const m = new Date(o.created_at).toISOString().slice(0, 7)
    monthCounts[m] = (monthCounts[m] || 0) + 1
  })
  const months = Object.entries(monthCounts).sort(([a], [b]) => a.localeCompare(b))
  const maxMonthCount = Math.max(...months.map(([, c]) => c), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-3">
          <BarChart3 className="text-red-600" />
          Platform analytics
        </h1>
        <p className="mt-2 text-sm text-slate-600">Organisation breakdown, member stats, and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-bold uppercase text-gray-500 mb-1">Total organisations</div>
          <div className="text-3xl font-bold">{orgCount}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-bold uppercase text-gray-500 mb-1">Total members</div>
          <div className="text-3xl font-bold">{totalMembers}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-bold uppercase text-gray-500 mb-1">Avg members/org</div>
          <div className="text-3xl font-bold">{avgMembersPerOrg}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-sm uppercase text-gray-700">Organisations by type</h2>
          </div>
          <div className="p-4">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="py-2 font-medium text-gray-500">Type</th>
                  <th className="py-2 font-medium text-gray-500 text-right">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {Object.entries(orgTypeBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => (
                    <tr key={type} className="hover:bg-gray-50">
                      <td className="py-2 capitalize">{type}</td>
                      <td className="py-2 text-right font-bold">{count}</td>
                    </tr>
                  ))}
                {Object.keys(orgTypeBreakdown).length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-4 text-center text-sm text-gray-500">No data.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-sm uppercase text-gray-700">Growth (orgs by month)</h2>
          </div>
          <div className="p-4">
            {months.length > 0 ? (
              <div className="space-y-2">
                {months.map(([month, count]) => (
                  <div key={month} className="flex items-center gap-3">
                    <span className="text-xs font-mono w-16 shrink-0 text-gray-500">{month}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded transition-all"
                        style={{ width: `${(count / maxMonthCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No growth data available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-bold text-sm uppercase text-gray-700">Recent activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Time</th>
                <th className="py-3 px-6 font-medium text-gray-500">Organisation</th>
                <th className="py-3 px-6 font-medium text-gray-500">User</th>
                <th className="py-3 px-6 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(recentLogs || []).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 font-medium">{log.organisations?.name || 'Unknown'}</td>
                  <td className="py-3 px-6 text-xs">{log.profiles?.full_name || 'System'}</td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                      {log.action}
                    </span>
                  </td>
                </tr>
              ))}
              {(!recentLogs || recentLogs.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center text-sm text-gray-500">No recent activity.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
