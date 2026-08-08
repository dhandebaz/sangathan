import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { AuditLog } from '@/types/dashboard'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AuditLogPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  let selectedOrgId = profile?.organisation_id
  if (!selectedOrgId) {
    try {
      selectedOrgId = await getSelectedOrganisationId()
    } catch {
      // Fallback
    }
  }

  if (!selectedOrgId) {
    return (
      <div className="p-8 text-center border border-border bg-card rounded-xl">
        <h2 className="text-xl font-bold">No Organisation Selected</h2>
        <p className="text-muted-foreground mt-2">Please select an organisation to view audit logs.</p>
      </div>
    )
  }

  let logs: AuditLog[] = []

  const { data, error } = await supabase
    .from('audit_logs')
    .select('*, profiles(full_name)')
    .eq('organisation_id', selectedOrgId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    try {
      const adminClient = createServiceClient()
      const fallbackRes = await adminClient
        .from('audit_logs')
        .select('*, profiles(full_name)')
        .eq('organisation_id', selectedOrgId)
        .order('created_at', { ascending: false })
        .limit(100)

      if (!fallbackRes.error) {
        logs = (fallbackRes.data || []) as unknown as AuditLog[]
      }
    } catch {
      logs = []
    }
  } else {
    logs = (data || []) as unknown as AuditLog[]
  }

  return (
    <div className="space-y-6">
       <div className="mb-6">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">Audit Logs</h1>
         <p className="text-muted-foreground mt-1">Track actions and changes within your organisation.</p>
       </div>

       <div className="content-card rounded-lg p-0 overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-muted border-b">
                   <tr>
                      <th className="py-3 px-4 font-medium text-muted-foreground">Timestamp</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground">User</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground">Action</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground">Resource</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground">Details</th>
                   </tr>
                </thead>
                <tbody className="divide-y">
                   {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-accent">
                         <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString()}
                         </td>
                         <td className="py-3 px-4 font-medium">
                            {log.profiles?.full_name || 'System / Unknown'}
                         </td>
                         <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-foreground font-mono">
                               {log.action}
                            </span>
                         </td>
                         <td className="py-3 px-4 text-xs text-muted-foreground">
                            {log.resource_table} / {log.resource_id ? log.resource_id.slice(0, 8) + '...' : '-'}
                         </td>
                         <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs truncate font-mono">
                            {JSON.stringify(log.details)}
                         </td>
                      </tr>
                   ))}
                   {logs.length === 0 && (
                      <tr>
                         <td colSpan={5} className="py-8 text-center text-muted-foreground">No activity recorded.</td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  )
}
