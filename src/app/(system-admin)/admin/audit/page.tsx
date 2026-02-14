import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { AuditLog } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

async function checkSuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return false
  const superAdmins = process.env.SUPER_ADMIN_EMAILS?.split(',') || []
  return superAdmins.includes(user.email)
}

export default async function GlobalAuditPage() {
  const isSuperAdmin = await checkSuperAdmin()
  if (!isSuperAdmin) redirect('/')

  const supabase = createServiceClient()

  // Fetch Global Logs
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*, organisations(name), profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(100)
  
  const logs = data as AuditLog[]

  if (error) return <div className="p-8">Error loading logs</div>

  return (
    <div className="min-h-screen bg-gray-50 text-black">
       <header className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
           <Link href="/admin" className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
           </Link>
           <h1 className="text-xl font-bold flex items-center gap-2">
             <ShieldAlert size={20} className="text-red-500" />
             Global Audit Logs
           </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 border-b">
                  <tr>
                     <th className="py-3 px-4 font-medium text-gray-500">Timestamp</th>
                     <th className="py-3 px-4 font-medium text-gray-500">Organisation</th>
                     <th className="py-3 px-4 font-medium text-gray-500">User</th>
                     <th className="py-3 px-4 font-medium text-gray-500">Action</th>
                     <th className="py-3 px-4 font-medium text-gray-500">Resource</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {logs?.map((log: AuditLog) => (
                     <tr key={log.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                           {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-bold">
                           {log.organisations?.name || 'Unknown'}
                        </td>
                        <td className="py-3 px-4">
                           {log.profiles?.full_name || 'System'}
                        </td>
                        <td className="py-3 px-4">
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                              {log.action}
                           </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                           {log.resource_table} / {log.resource_id}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </main>
    </div>
  )
}
