import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { createServiceClient } from '@/lib/supabase/service'
import { requirePlatformAdmin } from '@/lib/auth/context'

export const dynamic = 'force-dynamic'

interface AdminUser {
  id: string
  email: string
  full_name: string | null
  is_platform_admin: boolean | null
  status: 'active' | 'pending' | 'rejected' | 'removed'
  organisation_count: number
}

export default async function AdminUsersPage() {
  await requirePlatformAdmin()

  const supabase = createServiceClient()

  const { data, error } = await supabase.rpc('admin_list_users')

  if (error) {
    return <div className="p-8">Error loading users</div>
  }

  const users = data as AdminUser[] | null

  if (!users) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert size={20} className="text-red-500" />
            Users
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Email</th>
                <th className="py-3 px-6 font-medium text-gray-500">Name</th>
                <th className="py-3 px-6 font-medium text-gray-500">Platform admin</th>
                <th className="py-3 px-6 font-medium text-gray-500">Global status</th>
                <th className="py-3 px-6 font-medium text-gray-500">Total organisations</th>
                <th className="py-3 px-6 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 font-mono text-xs">{user.email}</td>
                  <td className="py-3 px-6">{user.full_name || '—'}</td>
                  <td className="py-3 px-6">
                    {user.is_platform_admin ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">
                        YES
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                        NO
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-700">{user.status}</td>
                  <td className="py-3 px-6">{user.organisation_count}</td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <form
                        action={async () => {
                          'use server'
                          const client = createServiceClient()
                          await client
                            .from('profiles')
                            .update({ is_platform_admin: true } as never)
                            .eq('id', user.id)
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-green-700 hover:underline"
                        >
                          Promote
                        </button>
                      </form>
                      <form
                        action={async () => {
                          'use server'
                          const client = createServiceClient()
                          await client
                            .from('profiles')
                            .update({ is_platform_admin: false } as never)
                            .eq('id', user.id)
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-red-700 hover:underline"
                        >
                          Demote
                        </button>
                      </form>
                    </div>
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

