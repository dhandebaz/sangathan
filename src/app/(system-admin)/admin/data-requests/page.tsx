import { createServiceClient } from '@/lib/supabase/service'
import { ShieldAlert } from 'lucide-react'
import { requirePlatformAdmin } from '@/lib/auth/context'
import { processDataRequest } from '@/actions/system/data-requests'

export const dynamic = 'force-dynamic'

interface DataRequestRow {
  id: string
  request_type: string
  user_id: string
  organisation_id: string
  status: string
  created_at: string
  organisations?: { name: string } | null
  profiles?: { email: string } | null
}

const statusBadge: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default async function DataRequestsPage() {
  await requirePlatformAdmin()

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('data_requests')
    .select('*, organisations(name), profiles:user_id(email)')
    .order('created_at', { ascending: false })
    .limit(100)

  const requests = (data || []) as DataRequestRow[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-3">
          <ShieldAlert className="text-red-600" />
          Data requests
        </h1>
        <p className="mt-2 text-sm text-slate-600">Process data deletion, export, and other privacy requests.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Type</th>
                <th className="py-3 px-6 font-medium text-gray-500">User</th>
                <th className="py-3 px-6 font-medium text-gray-500">Organisation</th>
                <th className="py-3 px-6 font-medium text-gray-500">Status</th>
                <th className="py-3 px-6 font-medium text-gray-500">Created</th>
                <th className="py-3 px-6 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 capitalize font-medium">{req.request_type}</td>
                  <td className="py-3 px-6 font-mono text-xs">{req.profiles?.email || 'Unknown'}</td>
                  <td className="py-3 px-6 text-xs">{req.organisations?.name || 'N/A'}</td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${statusBadge[req.status] || 'bg-gray-100 text-gray-800'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(req.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {req.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <form action={async () => {
                          'use server'
                          await processDataRequest({ requestId: req.id, status: 'completed' })
                        }}>
                          <button type="submit" className="min-h-9 rounded-lg bg-green-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-800">
                            Complete
                          </button>
                        </form>
                        <form action={async () => {
                          'use server'
                          await processDataRequest({ requestId: req.id, status: 'rejected' })
                        }}>
                          <button type="submit" className="min-h-9 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-800">
                            Reject
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-sm text-gray-500">No data requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
