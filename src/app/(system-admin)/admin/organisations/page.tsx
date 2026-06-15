import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { requirePlatformAdmin } from '@/lib/auth/context'

export const dynamic = 'force-dynamic'

type OrganisationRow = {
  id: string
  name: string
  slug: string
  membership_policy: string | null
  public_transparency_enabled: boolean | null
  status: string | null
  created_at: string
  members?: { count: number }[]
}

export default async function OrganisationsPage() {
  await requirePlatformAdmin()

  let orgs: OrganisationRow[] = []
  let errorMessage: string | null = null

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('organisations')
      .select(
        'id, name, slug, membership_policy, public_transparency_enabled, status, created_at, members(count)',
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      errorMessage = error.message
    } else {
      orgs = (data || []) as OrganisationRow[]
    }
  } catch (err) {
    console.error(err)
    errorMessage = String(err)
  }

  if (errorMessage) {
    return <div>Error loading organisations: {errorMessage}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-3">
          <ShieldAlert className="text-red-600" />
          Organisations
        </h1>
        <p className="mt-2 text-sm text-slate-600">Manage organisation status, membership policy, and operational access.</p>
      </div>
         <div className="data-table-wrap">
            <div className="min-w-[1100px]">
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
                  {orgs.map((org) => {
                    const memberCount = org.members?.[0]?.count || 0
                     return (
                        <tr key={org.id} className="hover:bg-gray-50">
                           <td className="py-3 px-6 font-medium">{org.name}</td>
                           <td className="py-3 px-6 font-mono text-xs">{org.slug}</td>
                           <td className="py-3 px-6">
                             <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                               {(org.status || 'active').toUpperCase()}
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
         </div>
    </div>
  )
}
