import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function checkSuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return false
  const superAdmins = process.env.SUPER_ADMIN_EMAILS?.split(',') || []
  return superAdmins.includes(user.email)
}

export default async function OrganisationsPage() {
  const isSuperAdmin = await checkSuperAdmin()
  if (!isSuperAdmin) redirect('/')

  const supabase = createServiceClient()

  // Fetch Organisations
  const { data, error } = await supabase
    .from('organisations')
    .select('*, profiles(count), supporter_subscriptions(status)')
    .order('created_at', { ascending: false })
  
  const orgs = data as any[]

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
                     <th className="py-3 px-6 font-medium text-gray-500">Users</th>
                     <th className="py-3 px-6 font-medium text-gray-500">Plan</th>
                     <th className="py-3 px-6 font-medium text-gray-500">Status</th>
                     <th className="py-3 px-6 font-medium text-gray-500 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {orgs?.map((org: any) => {
                     const isActiveSupporter = org.supporter_subscriptions?.some((s: any) => s.status === 'active')
                     return (
                        <tr key={org.id} className="hover:bg-gray-50">
                           <td className="py-3 px-6 font-medium">{org.name}</td>
                           <td className="py-3 px-6 font-mono text-xs">{org.slug}</td>
                           <td className="py-3 px-6">{org.profiles?.[0]?.count || 0}</td>
                           <td className="py-3 px-6">
                              {isActiveSupporter 
                                ? <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">SUPPORTER</span> 
                                : <span className="text-gray-500 text-xs">Free</span>
                              }
                           </td>
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
               </tbody>
            </table>
         </div>
      </main>
    </div>
  )
}
