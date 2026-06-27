import { createServiceClient } from '@/lib/supabase/service'
import { Webhook } from 'lucide-react'
import { requirePlatformAdmin } from '@/lib/auth/context'

export const dynamic = 'force-dynamic'

interface WebhookEvent {
  id: string
  provider: string
  event_type: string
  status: 'received' | 'processed' | 'failed' | 'ignored'
  payload: Record<string, unknown> | null
  error: string | null
  created_at: string
}

const statusBadge: Record<string, string> = {
  received: 'bg-gray-100 text-gray-800',
  processed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  ignored: 'bg-yellow-100 text-yellow-800',
}

export default async function WebhooksPage() {
  await requirePlatformAdmin()

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('webhook_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const events = (data || []) as WebhookEvent[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-3">
          <Webhook className="text-red-600" />
          Webhook monitoring
        </h1>
        <p className="mt-2 text-sm text-slate-600">Track incoming webhook events from external providers.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Provider</th>
                <th className="py-3 px-6 font-medium text-gray-500">Event type</th>
                <th className="py-3 px-6 font-medium text-gray-500">Status</th>
                <th className="py-3 px-6 font-medium text-gray-500">Payload</th>
                <th className="py-3 px-6 font-medium text-gray-500">Error</th>
                <th className="py-3 px-6 font-medium text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 font-mono text-xs font-medium">{event.provider}</td>
                  <td className="py-3 px-6 font-mono text-xs">{event.event_type}</td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${statusBadge[event.status] || 'bg-gray-100 text-gray-800'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <details className="group">
                      <summary className="cursor-pointer text-xs text-blue-600 hover:underline">View payload</summary>
                      <pre className="mt-2 text-xs bg-gray-50 p-2 rounded border overflow-x-auto max-w-xs max-h-32 overflow-y-auto">
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </details>
                  </td>
                  <td className="py-3 px-6 text-xs text-red-600 max-w-xs truncate" title={event.error || ''}>
                    {event.error || '-'}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(event.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-sm text-gray-500">No webhook events received.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
