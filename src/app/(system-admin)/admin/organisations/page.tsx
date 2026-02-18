import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { SystemAdminOrganisation } from '@/types/dashboard'
import { requirePlatformAdmin } from '@/lib/auth/context'

export const dynamic = 'force-dynamic'

export default async function OrganisationsPage() {
  await requirePlatformAdmin()

  const supabase = createServiceClient()

  const { data: orgs, error } = await supabase
    .from('organisations')
    .select('id, name, slug, is_suspended, status, membership_policy, created_at, members(count)')
    .order('created_at', { ascending: false }) as {
      data: (SystemAdminOrganisation & { members?: { count: number }[] })[] | null
      error: { message: string } | null
    }

  if (error) return <div className="p-8">Error loading organisations</div>

  return (
    <div className="min-h-screen bg-gray-50 text-black">
       <header className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
           <Link href="/admin" className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
           </Link>
           <h1 className="text-xl font-bold flex items-center gap-2">
             <ShieldAlert size={20} className="text-red-500" />
             Organisations
           </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 border-b">
                  <tr>
                     <th className="py-3 px-6 font-medium text-gray-500">Name</th>
                     <th className="py-3 px-6 font-medium text-gray-500">Slug</th>
                     <th className="py-3 px-6 font-medium text-gray-500">Status</th>
                     <th className="py-3 px-6 font-medium text-gray-500">Membership policy</th>
                     <th className="py-3 px-6 font-medium text-gray-500">Created</th>
                     <th className="py-3 px-6 font-medium text-gray-500">Total members</th>
                     <th className="py-3 px-6 font-medium text-gray-500">Status</th>
                     <th className="py-3 px-6 font-medium text-gray-500 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {orgs?.map((org) => {
                    const memberCount = org.members?.[0]?.count || 0
                     return (
                        <tr key={org.id} className="hover:bg-gray-50">
                           <td className="py-3 px-6 font-medium">{org.name}</td>
                           <td className="py-3 px-6 font-mono text-xs">{org.slug}</td>
                           <td className="py-3 px-6">
                             <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                               {org.status.toUpperCase()}
                             </span>
                           </td>
                           <td className="py-3 px-6">
                             <span className="text-xs text-gray-700 font-mono">
                               {org.membership_policy}
                             </span>
                           </td>
                           <td className="py-3 px-6 text-xs text-gray-600 whitespace-nowrap">
                             {new Date(org.created_at).toLocaleString()}
                           </td>
                           <td className="py-3 px-6">
                             {memberCount}
                           </td>
                           <td className="py-3 px-6 text-right">
                             <div className="flex items-center justify-end gap-3">
                               <Link
                                 href={`/admin/organisations/${org.id}`}
                                 className="text-blue-600 hover:underline text-xs font-medium"
                               >
                                 Manage
                               </Link>
                               <Link
                                 href={`/admin/organisations/${org.id}?view=members`}
                                 className="text-gray-700 hover:underline text-xs"
                               >
                                 View members
                               </Link>
                               <Link
                                 href={`/admin/logs?organisation_id=${org.id}`}
                                 className="text-gray-700 hover:underline text-xs"
                               >
                                 View logs
                               </Link>
                             </div>
                           </td>
                        </tr>
                     )
                  })}
               </tbody>
            </table>
         </div>
      </main>
    </div>
  )
}
