import { createClient } from '@/lib/supabase/server'
import { getUserContext } from '@/lib/auth/context'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AuditLogPage() {
  const supabase = await createClient()
  const ctx = await getUserContext()
  
  // Role Check: Only Admin/Editor can view logs (Prompt says Admin: Full, Editor: Read-only, Viewer: No access)
  // getUserContext returns role.
  if (ctx.role === 'viewer') {
    return <div className="p-8 text-center text-gray-500">You do not have permission to view audit logs.</div>
  }

  // Fetch Logs
  const { data: logs, error } = await supabase
    .from('audit_logs')
    .select('*, profiles(full_name)')
    .eq('organisation_id', ctx.organizationId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return <div className="p-4 text-red-500">Error loading audit logs.</div>
  }

  return (
    <div>
       <div className="mb-6">
         <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
         <p className="text-gray-500 mt-1">Track actions and changes within your organisation.</p>
       </div>

       <div className="content-card rounded-lg p-0 overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                   <tr>
                      <th className="py-3 px-4 font-medium text-gray-500">Timestamp</th>
                      <th className="py-3 px-4 font-medium text-gray-500">User</th>
                      <th className="py-3 px-4 font-medium text-gray-500">Action</th>
                      <th className="py-3 px-4 font-medium text-gray-500">Resource</th>
                      <th className="py-3 px-4 font-medium text-gray-500">Details</th>
                   </tr>
                </thead>
                <tbody className="divide-y">
                   {logs?.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                         <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString()}
                         </td>
                         <td className="py-3 px-4 font-medium">
                            {log.profiles?.full_name || 'System / Unknown'}
                         </td>
                         <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                               {log.action}
                            </span>
                         </td>
                         <td className="py-3 px-4 text-xs text-gray-500">
                            {log.resource_table} / {log.resource_id.slice(0, 8)}...
                         </td>
                         <td className="py-3 px-4 text-xs text-gray-500 max-w-xs truncate font-mono">
                            {JSON.stringify(log.details)}
                         </td>
                      </tr>
                   ))}
                   {logs?.length === 0 && (
                      <tr>
                         <td colSpan={5} className="py-8 text-center text-gray-500">No activity recorded.</td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  )
}
