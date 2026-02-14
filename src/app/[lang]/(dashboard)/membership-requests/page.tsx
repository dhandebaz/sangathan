import { createClient } from '@/lib/supabase/server'
import { RequestList } from '@/components/members/request-list'
import { redirect } from 'next/navigation'

export default async function RequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single()

  const profile = profileData as any

  if (!profile || profile.role !== 'admin') {
      return (
        <div className="p-8 text-center">
          <h1 className="text-xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-500">Only administrators can manage membership requests.</p>
        </div>
      )
  }

  const { data: requests } = await (supabase
    .from('profiles') as any)
    .select('*')
    .eq('organization_id', profile.organization_id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Membership Requests</h1>
          <p className="text-gray-500 text-sm mt-1">Review and approve new members.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {requests?.length || 0} Pending
        </div>
      </div>
      
      <RequestList requests={requests || []} />
    </div>
  )
}
