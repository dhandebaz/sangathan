import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert, AlertTriangle } from 'lucide-react'
import { suspendOrganisation, reactivateOrganisation } from '@/actions/system/actions'
import { SystemAdminOrganisation } from '@/types/dashboard'
import { requirePlatformAdmin } from '@/lib/auth/context'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrganisationDetailsPage({ params }: PageProps) {
  const { id } = await params
  await requirePlatformAdmin()

  const supabase = createServiceClient()

  const { data: org, error } = await supabase
    .from('organisations')
    .select('id, name, slug, is_suspended, status, membership_policy, created_at')
    .eq('id', id)
    .single() as { data: SystemAdminOrganisation | null, error: { message: string } | null }

  if (error || !org) return <div className="p-8">Organisation not found</div>

  const { data: members } = await supabase
    .from('members')
    .select('id, full_name, email, phone, status, created_at')
    .eq('organisation_id', id)
    .order('created_at', { ascending: false })
    .limit(25)

  const { data: logs } = await supabase
    .from('system_logs')
    .select('id, level, source, message, created_at')
    .eq('organisation_id', id)
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: actions } = await supabase
    .from('platform_actions')
    .select('id, action_type, severity, reason, created_at, created_by')
    .eq('target_org_id', id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-gray-50 text-black">
       <header className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
           <Link href="/admin/organisations" className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
           </Link>
           <h1 className="text-xl font-bold flex items-center gap-2">
             <ShieldAlert size={20} className="text-red-500" />
             {org.name}
           </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold mb-4">Status & Actions</h2>
            <div className="flex items-center justify-between">
               <div>
                  <div className="text-sm text-gray-500 uppercase font-bold">Current Status</div>
                  <div className={`text-xl font-bold ${org.is_suspended ? 'text-red-600' : 'text-green-600'}`}>
                     {org.is_suspended ? 'SUSPENDED' : 'ACTIVE'}
                  </div>
               </div>
               
               <div>
                  {org.is_suspended ? (
                     <form action={async () => {
                        'use server'
                        await reactivateOrganisation({ organisationId: org.id })
                     }}>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700">
                           Reactivate Organisation
                        </button>
                     </form>
                  ) : (
                     <form action={async () => {
                        'use server'
                        await suspendOrganisation({ organisationId: org.id })
                     }}>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 flex items-center gap-2">
                           <AlertTriangle size={18} />
                           Suspend Organisation
                        </button>
                     </form>
                  )}
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
               <h3 className="font-bold mb-4">Details</h3>
               <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">ID:</span> {org.id}</p>
                  <p><span className="text-gray-500">Slug:</span> {org.slug}</p>
                  <p><span className="text-gray-500">Created:</span> {new Date(org.created_at).toLocaleString()}</p>
                  <p><span className="text-gray-500">Status:</span> {org.status}</p>
                  <p><span className="text-gray-500">Membership policy:</span> {org.membership_policy}</p>
               </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
               <h3 className="font-bold mb-4">Recent Members</h3>
               <ul className="space-y-2">
                  {members?.map((member) => (
                     <li key={member.id} className="text-sm border-b pb-2 last:border-0">
                        <div className="font-medium">{member.full_name}</div>
                        <div className="text-gray-500 text-xs">
                          {member.email || member.phone || 'No contact'}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {member.status} · {new Date(member.created_at).toLocaleDateString()}
                        </div>
                     </li>
                  ))}
               </ul>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
             <h3 className="font-bold mb-4">Recent Logs</h3>
             <div className="space-y-2 text-sm">
               {logs?.map((log) => (
                 <div key={log.id} className="border-b pb-2 last:border-0">
                   <div className="flex items-center justify-between">
                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                       {log.level.toUpperCase()}
                     </span>
                     <span className="text-xs text-gray-500">
                       {new Date(log.created_at).toLocaleString()}
                     </span>
                   </div>
                   <div className="mt-1 text-xs text-gray-500 font-mono">{log.source}</div>
                   <div className="mt-1 text-sm text-gray-800">{log.message}</div>
                 </div>
               ))}
               {(!logs || logs.length === 0) && (
                 <p className="text-sm text-gray-500 italic">No logs for this organisation.</p>
               )}
             </div>
           </div>

           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
             <h3 className="font-bold mb-4">Actions History</h3>
             <div className="space-y-2 text-sm">
               {actions?.map((action) => (
                 <div key={action.id} className="border-b pb-2 last:border-0">
                   <div className="flex items-center justify-between">
                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                       {action.action_type}
                     </span>
                     <span className="text-xs text-gray-500">
                       {new Date(action.created_at).toLocaleString()}
                     </span>
                   </div>
                   {action.severity && (
                     <div className="mt-1 text-xs text-gray-500">
                       Severity: {action.severity}
                     </div>
                   )}
                   <div className="mt-1 text-sm text-gray-800">{action.reason}</div>
                 </div>
               ))}
               {(!actions || actions.length === 0) && (
                 <p className="text-sm text-gray-500 italic">No actions recorded.</p>
               )}
             </div>
           </div>
         </div>
      </main>
    </div>
  )
}
