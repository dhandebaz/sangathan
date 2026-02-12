import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ShieldAlert, Users, Building, Activity } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function checkSuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !user.email) return false
  
  // Whitelist check via Env Var
  const superAdmins = process.env.SUPER_ADMIN_EMAILS?.split(',') || []
  return superAdmins.includes(user.email)
}

export default async function SystemAdminDashboard() {
  const isSuperAdmin = await checkSuperAdmin()
  if (!isSuperAdmin) redirect('/')

  const supabase = createServiceClient()

  // Fetch Stats
  const { count: orgCount } = await supabase.from('organisations').select('*', { count: 'exact', head: true })
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: subCount } = await supabase.from('supporter_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')

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
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-bold uppercase">
                  <Building size={16} /> Organisations
               </div>
               <div className="text-4xl font-bold">{orgCount}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-bold uppercase">
                  <Users size={16} /> Users
               </div>
               <div className="text-4xl font-bold">{userCount}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm font-bold uppercase">
                  <Activity size={16} /> Active Supporters
               </div>
               <div className="text-4xl font-bold text-orange-600">{subCount}</div>
            </div>
         </div>

         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
               <h2 className="font-bold">Recent Organisations</h2>
               <Link href="/admin/organisations" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="p-8 text-center text-gray-500 italic">
               (List would go here - implemented in /admin/organisations)
            </div>
         </div>
      </main>
    </div>
  )
}
