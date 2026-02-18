import { createServiceClient } from '@/lib/supabase/service'
import { ShieldAlert, Users, Building, Activity, Scale, Gavel } from 'lucide-react'
import Link from 'next/link'
import { SystemAdminOrganisation } from '@/types/dashboard'
import { requirePlatformAdmin } from '@/lib/auth/context'

export const dynamic = 'force-dynamic'

export default async function SystemAdminDashboard() {
   await requirePlatformAdmin()

   const supabase = createServiceClient()

   try {
      const [orgRes, suspendedOrgRes, userRes, memberRes, appealsRes, recentOrgsRes] = await Promise.all([
         supabase.from('organisations').select('*', { count: 'exact', head: true }),
         supabase.from('organisations').select('*', { count: 'exact', head: true }).eq('status', 'suspended'),
         supabase.from('profiles').select('*', { count: 'exact', head: true }),
         supabase.from('members').select('*', { count: 'exact', head: true }),
         supabase.from('appeals').select('*', { count: 'exact', head: true }).in('status', ['pending', 'under_review']),
         supabase.from('organisations')
            .select('id, name, slug, is_suspended, status, membership_policy, created_at, members(count)')
            .order('created_at', { ascending: false })
            .limit(5) as unknown as Promise<{ data: (SystemAdminOrganisation & { members?: { count: number }[] })[] | null }>
      ])

      const orgCount = orgRes.count || 0
      const suspendedOrgs = suspendedOrgRes.count || 0
      const userCount = userRes.count || 0
      const memberCount = memberRes.count || 0
      const openAppeals = appealsRes.count || 0
      const recentOrgs = recentOrgsRes.data || []

      return (
         <div className="min-h-screen bg-gray-50 text-black">
            <header className="bg-black text-white p-4">
               <div className="max-w-7xl mx-auto flex justify-between items-center">
                  <h1 className="text-xl font-bold flex items-center gap-2">
                     <ShieldAlert size={20} className="text-red-500" />
                     Sangathan System Admin
                  </h1>
                  <div className="text-sm text-gray-400">Restricted Access</div>
               </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Link href="/admin/organisations" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-orange-500 transition-colors block">
                     <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-bold uppercase">
                        <Building size={16} /> Organisations
                     </div>
                     <div className="text-4xl font-bold">{orgCount}</div>
                  </Link>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                     <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-bold uppercase">
                        <Users size={16} /> Users
                     </div>
                     <div className="text-4xl font-bold">{userCount}</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                     <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-bold uppercase">
                        <Users size={16} /> Members
                     </div>
                     <div className="text-4xl font-bold">{memberCount}</div>
                  </div>
                  <Link href="/admin/logs" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-orange-500 transition-colors block">
                     <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-bold uppercase">
                        <Activity size={16} /> System Logs
                     </div>
                     <div className="text-4xl font-bold text-orange-600">View</div>
                  </Link>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                     <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-bold uppercase">
                        <ShieldAlert size={16} /> Suspended Organisations
                     </div>
                     <div className="text-3xl font-bold text-red-600">{suspendedOrgs}</div>
                  </div>
                  <Link href="/admin/moderation" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-orange-500 transition-colors block">
                     <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-bold uppercase">
                        <Gavel size={16} /> Moderation Dashboard
                     </div>
                     <div className="text-3xl font-bold text-gray-900">Open</div>
                  </Link>
                  <Link href="/admin/audit" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-orange-500 transition-colors block">
                     <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-bold uppercase">
                        <Scale size={16} /> Appeals Open
                     </div>
                     <div className="text-3xl font-bold text-gray-900">{openAppeals}</div>
                  </Link>
               </div>

               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                     <h2 className="font-bold">Recent Organisations</h2>
                     <Link href="/admin/organisations" className="text-sm text-blue-600 hover:underline">View All</Link>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm">
                        <thead className="border-b">
                           <tr>
                              <th className="py-3 px-6 font-medium text-gray-500">Name</th>
                              <th className="py-3 px-6 font-medium text-gray-500">Slug</th>
                              <th className="py-3 px-6 font-medium text-gray-500">Users</th>
                              <th className="py-3 px-6 font-medium text-gray-500">Status</th>
                              <th className="py-3 px-6 font-medium text-gray-500 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y">
                           {recentOrgs?.map((org) => {
                              const memberTotal = org.members?.[0]?.count || 0
                              return (
                                 <tr key={org.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-6 font-medium">
                                       {org.name}
                                    </td>
                                    <td className="py-3 px-6 font-mono text-xs text-gray-500">{org.slug}</td>
                                    <td className="py-3 px-6">{memberTotal}</td>
                                    <td className="py-3 px-6">
                                       {org.is_suspended
                                          ? <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded">SUSPENDED</span>
                                          : <span className="text-green-600 text-xs">Active</span>
                                       }
                                    </td>
                                    <td className="py-3 px-6 text-right">
                                       <Link href={`/admin/organisations/${org.id}`} className="text-blue-600 hover:underline">
                                          Manage
                                       </Link>
                                    </td>
                                 </tr>
                              )
                           })}
                           {(!recentOrgs || recentOrgs.length === 0) && (
                              <tr>
                                 <td colSpan={5} className="p-8 text-center text-gray-400 italic">No organisations found</td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </main>
         </div>
      )
   } catch (error: unknown) {
      console.error('Admin Dashboard Error:', error)
      return (
         <div className="p-8 text-center text-red-600">
            <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
            <p className="text-sm">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
            <p className="text-xs mt-4 text-gray-500">Check logs for details. Ensure SUPABASE_SERVICE_ROLE_KEY is set.</p>
         </div>
      )
   }
}
