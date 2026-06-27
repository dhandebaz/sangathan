import { createServiceClient } from '@/lib/supabase/service'
import { Briefcase, RefreshCw, XCircle } from 'lucide-react'
import { requirePlatformAdmin } from '@/lib/auth/context'

export const dynamic = 'force-dynamic'

interface SystemJob {
  id: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  attempts: number
  max_attempts: number
  last_error: string | null
  created_at: string
}

const statusBadge: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  running: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
}

export default async function JobsPage() {
  await requirePlatformAdmin()

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('system_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const jobs = (data || []) as SystemJob[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-3">
          <Briefcase className="text-red-600" />
          System jobs
        </h1>
        <p className="mt-2 text-sm text-slate-600">Monitor and manage background system jobs.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Type</th>
                <th className="py-3 px-6 font-medium text-gray-500">Status</th>
                <th className="py-3 px-6 font-medium text-gray-500">Attempts</th>
                <th className="py-3 px-6 font-medium text-gray-500">Max attempts</th>
                <th className="py-3 px-6 font-medium text-gray-500">Last error</th>
                <th className="py-3 px-6 font-medium text-gray-500">Created</th>
                <th className="py-3 px-6 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 font-mono text-xs font-medium">{job.type}</td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${statusBadge[job.status] || 'bg-gray-100 text-gray-800'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-xs">{job.attempts}</td>
                  <td className="py-3 px-6 text-xs">{job.max_attempts}</td>
                  <td className="py-3 px-6 text-xs text-red-600 max-w-xs truncate" title={job.last_error || ''}>
                    {job.last_error || '-'}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(job.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {job.status === 'failed' && (
                        <form action={async () => {
                          'use server'
                          const client = createServiceClient()
                          await client.from('system_jobs').update({ status: 'pending', attempts: 0, last_error: null }).eq('id', job.id)
                        }}>
                          <button type="submit" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                            <RefreshCw size={12} /> Retry
                          </button>
                        </form>
                      )}
                      {job.status === 'pending' && (
                        <form action={async () => {
                          'use server'
                          const client = createServiceClient()
                          await client.from('system_jobs').update({ status: 'cancelled' }).eq('id', job.id)
                        }}>
                          <button type="submit" className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline">
                            <XCircle size={12} /> Cancel
                          </button>
                        </form>
                      )}
                      {(job.status !== 'failed' && job.status !== 'pending') && (
                        <span className="text-xs text-gray-400 italic">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 px-4 text-center text-sm text-gray-500">No system jobs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
