import { createServiceClient } from '@/lib/supabase/service'
import { Scale } from 'lucide-react'
import { requirePlatformAdmin } from '@/lib/auth/context'
import { resolveAppeal } from '@/actions/system/appeals'

export const dynamic = 'force-dynamic'

interface AppealRow {
  id: string
  organisation_id: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  reason: string
  created_at: string
  organisations?: { name: string; slug: string } | null
}

const statusBadge: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-gray-100 text-gray-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default async function AppealsPage() {
  await requirePlatformAdmin()

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('appeals')
    .select('*, organisations(name, slug)')
    .order('created_at', { ascending: false })
    .limit(100)

  const appeals = (data || []) as AppealRow[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-3">
          <Scale className="text-red-600" />
          Appeals management
        </h1>
        <p className="mt-2 text-sm text-slate-600">Review and resolve organisation suspension appeals.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Created</th>
                <th className="py-3 px-6 font-medium text-gray-500">Organisation</th>
                <th className="py-3 px-6 font-medium text-gray-500">Type</th>
                <th className="py-3 px-6 font-medium text-gray-500">Status</th>
                <th className="py-3 px-6 font-medium text-gray-500">Reason</th>
                <th className="py-3 px-6 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appeals.map((appeal) => (
                <tr key={appeal.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(appeal.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 font-medium">
                    {appeal.organisations?.name || 'Unknown'}
                    {appeal.organisations?.slug && (
                      <span className="ml-2 text-xs text-gray-500 font-mono">{appeal.organisations.slug}</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-xs">Suspension</td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${statusBadge[appeal.status] || 'bg-gray-100 text-gray-800'}`}>
                      {appeal.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-700 max-w-xs truncate" title={appeal.reason}>
                    {appeal.reason}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {appeal.status === 'pending' || appeal.status === 'under_review' ? (
                      <div className="flex items-center justify-end gap-2">
                        <form action={async () => {
                          'use server'
                          await resolveAppeal({ appealId: appeal.id, resolution: 'approved' })
                        }}>
                          <button type="submit" className="min-h-9 rounded-lg bg-green-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-800">
                            Approve
                          </button>
                        </form>
                        <form action={async () => {
                          'use server'
                          await resolveAppeal({ appealId: appeal.id, resolution: 'rejected' })
                        }}>
                          <button type="submit" className="min-h-9 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-800">
                            Reject
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
              {appeals.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-sm text-gray-500">No appeals found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
