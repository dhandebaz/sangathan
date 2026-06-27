import { createServiceClient } from '@/lib/supabase/service'
import { AlertTriangle } from 'lucide-react'
import { requirePlatformAdmin } from '@/lib/auth/context'
import { getAllRiskEvents, updateRiskEvent } from '@/actions/system/risk-events'

export const dynamic = 'force-dynamic'

interface RiskEventRow {
  id: string
  risk_type: string
  severity: 'low' | 'medium' | 'high'
  entity_id: string
  entity_type: string
  detected_at: string
  metadata: Record<string, unknown> | null
  resolved: boolean
}

const severityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-800 border-red-300',
  medium: 'bg-orange-100 text-orange-800 border-orange-300',
  low: 'bg-yellow-100 text-yellow-800 border-yellow-300',
}

export default async function RiskEventsPage() {
  await requirePlatformAdmin()

  const events = await getAllRiskEvents() as RiskEventRow[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-3">
          <AlertTriangle className="text-red-600" />
          Risk event investigation
        </h1>
        <p className="mt-2 text-sm text-slate-600">Monitor and respond to platform risk events.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-4">
        {['high', 'medium', 'low'].map((sev) => {
          const count = events.filter((e) => e.severity === sev).length
          return (
            <div key={sev} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-1 text-xs font-bold uppercase">
                <span className={`inline-block w-2 h-2 rounded-full ${sev === 'high' ? 'bg-red-500' : sev === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                {sev} severity
              </div>
              <div className="text-2xl font-bold">{count}</div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Risk type</th>
                <th className="py-3 px-6 font-medium text-gray-500">Severity</th>
                <th className="py-3 px-6 font-medium text-gray-500">Entity</th>
                <th className="py-3 px-6 font-medium text-gray-500">Detected</th>
                <th className="py-3 px-6 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 font-mono text-xs font-medium uppercase">{event.risk_type}</td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${severityColors[event.severity] || 'bg-gray-100 text-gray-800'}`}>
                      {event.severity}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <span className="font-mono text-xs">{event.entity_type}/{event.entity_id}</span>
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(event.detected_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {!event.resolved ? (
                      <div className="flex items-center justify-end gap-2">
                        <form action={async () => {
                          'use server'
                          await updateRiskEvent({ eventId: event.id, status: 'investigated' })
                        }}>
                          <button type="submit" className="min-h-9 rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
                            Investigate
                          </button>
                        </form>
                        <form action={async () => {
                          'use server'
                          await updateRiskEvent({ eventId: event.id, status: 'resolved' })
                        }}>
                          <button type="submit" className="min-h-9 rounded-lg bg-green-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-800">
                            Resolve
                          </button>
                        </form>
                        <form action={async () => {
                          'use server'
                          await updateRiskEvent({ eventId: event.id, status: 'dismissed' })
                        }}>
                          <button type="submit" className="min-h-9 rounded-lg bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-300">
                            Dismiss
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 px-4 text-center text-sm text-gray-500">No risk events detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
