import { createClient } from '@/lib/supabase/server'
import { RequestList } from '@/components/members/request-list'
import { redirect } from 'next/navigation'
import { AccessDenied } from '@/components/dashboard/access-denied'

export default async function RequestsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profileData } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single()

  const profile = profileData as { organization_id: string; role: string } | null

  if (!profile || !profile.organization_id || profile.role !== 'admin') {
      return <AccessDenied lang={lang} />
  }

  const { data: requests } = await supabase
    .from('profiles')
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
      
      <RequestList requests={(requests || []) as unknown as { id: string; full_name?: string | null; email?: string | null; created_at: string }[]} />
    </div>
  )
}
