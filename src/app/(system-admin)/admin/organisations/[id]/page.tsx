import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert, AlertTriangle } from 'lucide-react'
import { suspendOrganisation, reactivateOrganisation } from '@/actions/system/actions'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

async function checkSuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return false
  const superAdmins = process.env.SUPER_ADMIN_EMAILS?.split(',') || []
  return superAdmins.includes(user.email)
}

export default async function OrganisationDetailsPage({ params }: PageProps) {
  const { id } = await params
  const isSuperAdmin = await checkSuperAdmin()
  if (!isSuperAdmin) redirect('/')

  const supabase = createServiceClient()

  // Fetch Organisation
  const { data: org, error } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !org) return <div className="p-8">Organisation not found</div>

  // Fetch Admins
  const { data: admins } = await supabase
    .from('profiles')
    .select('*')
    .eq('organisation_id', id)
    .eq('role', 'admin')

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
         {/* Status Card */}
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

         {/* Details */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
               <h3 className="font-bold mb-4">Details</h3>
               <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">ID:</span> {org.id}</p>
                  <p><span className="text-gray-500">Slug:</span> {org.slug}</p>
                  <p><span className="text-gray-500">Created:</span> {new Date(org.created_at).toLocaleString()}</p>
               </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
               <h3 className="font-bold mb-4">Administrators</h3>
               <ul className="space-y-2">
                  {admins?.map((admin: any) => (
                     <li key={admin.id} className="text-sm border-b pb-2 last:border-0">
                        <div className="font-medium">{admin.full_name}</div>
                        <div className="text-gray-500">{admin.email}</div>
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </main>
    </div>
  )
}
