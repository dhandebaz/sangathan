import { createClient } from '@/lib/supabase/server'
import { Users } from 'lucide-react'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/dashboard/admin-view'
import { MemberDashboard } from '@/components/dashboard/member-view'
import { unlockCapabilities } from '@/lib/capabilities'

export const dynamic = 'force-dynamic'

export default async function DashboardPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  // Check Membership Status
  const { data: profile } = await supabase
    .from('profiles')
    .select('status, role, organisation_id')
    .eq('id', user.id)
    .single()

  // ... (existing status checks) ...

  if (profile?.status === 'pending') {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
          <div className="flex justify-center mb-4">
             <div className="bg-yellow-100 p-3 rounded-full">
               <Users className="w-8 h-8 text-yellow-600" />
             </div>
          </div>
          <h1 className="text-2xl font-bold text-yellow-800 mb-2">Membership Pending</h1>
          <p className="text-yellow-700 max-w-lg mx-auto">
            Your request to join this organisation is currently pending approval by an administrator.
            You will be notified via email once your request is processed.
          </p>
        </div>
      </div>
    )
  }

  if (profile?.status === 'rejected') {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-red-800 mb-2">Membership Rejected</h1>
          <p className="text-red-700">
            Your request to join this organisation was not approved.
          </p>
        </div>
      </div>
    )
  }

  // Check Org Suspension
  const { data: org } = await supabase
    .from('organisations')
    .select('status')
    .eq('id', profile.organisation_id)
    .single()

  if (org?.status === 'suspended') {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-red-800 mb-2">Organisation Suspended</h1>
          <p className="text-red-700">
            This organisation has been suspended due to policy violations. Please contact platform support.
          </p>
        </div>
      </div>
    )
  }

  const isAdmin = ['admin', 'editor', 'executive'].includes(profile.role)

  // Try to unlock capabilities if admin visits dashboard
  if (isAdmin) {
     await unlockCapabilities(profile.organisation_id)
  }

  if (isAdmin) {
    // Admin Data Fetching
    const [members, events, tasks, donations, activity] = await Promise.all([
      supabase.from('members').select('*', { count: 'exact', head: true }).eq('organisation_id', profile.organisation_id),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('organisation_id', profile.organisation_id),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('organisation_id', profile.organisation_id).eq('status', 'open'),
      supabase.from('donations').select('amount').eq('organisation_id', profile.organisation_id),
      supabase.from('audit_logs').select('action, created_at, details').eq('organisation_id', profile.organisation_id).order('created_at', { ascending: false }).limit(5)
    ])

    const totalDonations = (donations.data || []).reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
    
    // Transform audit logs to recent activity format
    const recentActivity = (activity.data || []).map((log: any) => ({
      title: log.action.replace(/_/g, ' '),
      type: 'audit',
      created_at: log.created_at
    }))

    return <AdminDashboard lang={lang} stats={{
      members: members.count || 0,
      events: events.count || 0,
      tasks: tasks.count || 0,
      donations: `₹${totalDonations.toLocaleString()}`
    }} recentActivity={recentActivity} />
  } else {
    // Member Data Fetching
    const [events, tasks, announcements] = await Promise.all([
      supabase.from('events').select('*').eq('organisation_id', profile.organisation_id).gte('start_time', new Date().toISOString()).order('start_time', { ascending: true }).limit(3),
      supabase.from('task_assignments').select('task:tasks(*)').eq('member_id', user.id).eq('accepted', true).limit(3),
      supabase.from('announcements').select('*').eq('organisation_id', profile.organisation_id).order('created_at', { ascending: false }).limit(3)
    ])

    // Filter tasks correctly
    const myTasks = (tasks.data || []).map((t: any) => t.task).filter(Boolean)

    return <MemberDashboard lang={lang} events={events.data || []} tasks={myTasks} announcements={announcements.data || []} />
  }
}
