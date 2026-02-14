import { createClient } from '@/lib/supabase/server'
import { Users } from 'lucide-react'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/dashboard/admin-view'
import { MemberDashboard } from '@/components/dashboard/member-view'
import { unlockCapabilities } from '@/lib/capabilities'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  // Check Membership Status
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('status, role, organization_id')
    .eq('id', user.id)
    .single()

  // Handle case where profile record doesn't exist yet
  if (profileError || !profileData) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 md:p-12">
          <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We couldn't find your organisation profile. This usually happens if your account setup wasn't completed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="px-8">
              <Link href={`/${lang}/signup`}>Set Up Organisation</Link>
            </Button>
            <Button asChild variant="outline" className="px-8">
              <Link href={`/${lang}/docs`}>Read Guide</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const profile = profileData as any

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

  if (!profile.organization_id) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">No Organisation Found</h1>
        <p className="text-gray-600 mb-8">You are not currently a member of any organisation.</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href={`/${lang}/signup`}>Create New Organisation</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${lang}/docs`}>View Documentation</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Check Org Suspension
  const { data: orgData } = await supabase
    .from('organisations')
    .select('status')
    .eq('id', profile.organization_id)
    .single()

  const org = orgData as any

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
     await unlockCapabilities(profile.organization_id)
  }

  if (isAdmin) {
    // Admin Data Fetching
    const [members, events, tasks, donations, activity] = await Promise.all([
      (supabase.from('members') as any).select('*', { count: 'exact', head: true }).eq('organisation_id', profile.organization_id),
      (supabase.from('events') as any).select('*', { count: 'exact', head: true }).eq('organisation_id', profile.organization_id),
      (supabase.from('tasks') as any).select('*', { count: 'exact', head: true }).eq('organisation_id', profile.organization_id).eq('status', 'open'),
      (supabase.from('donations') as any).select('amount').eq('organisation_id', profile.organization_id),
      (supabase.from('audit_logs') as any).select('action, created_at, details').eq('organisation_id', profile.organization_id).order('created_at', { ascending: false }).limit(5)
    ])

    const totalDonations = ((donations as any).data || []).reduce((sum: number, d: any) => sum + (Number(d.amount) || 0), 0)
    
    // Transform audit logs to recent activity format
    const recentActivity = ((activity as any).data || []).map((log: any) => ({
      title: log.action.replace(/_/g, ' '),
      type: 'audit',
      time: new Date(log.created_at).toLocaleDateString()
    }))

    return (
      <AdminDashboard 
        stats={{
          members: members.count || 0,
          events: events.count || 0,
          tasks: tasks.count || 0,
          donations: totalDonations
        }}
        recentActivity={recentActivity}
        lang={lang}
      />
    )
  }

  // Member Data Fetching
  const [events, tasks, announcements] = await Promise.all([
    (supabase.from('events') as any).select('*').eq('organisation_id', profile.organization_id).gte('start_time', new Date().toISOString()).order('start_time', { ascending: true }).limit(3),
    (supabase.from('task_assignments') as any).select('task:tasks(*)').eq('member_id', user.id).limit(3),
    (supabase.from('announcements') as any).select('*').eq('organisation_id', profile.organization_id).order('created_at', { ascending: false }).limit(3)
  ])

  // Filter tasks correctly
  const myTasks = ((tasks as any).data || []).map((t: any) => t.task).filter(Boolean)

  return (
    <MemberDashboard 
      events={(events as any).data || []}
      tasks={myTasks}
      announcements={(announcements as any).data || []}
      lang={lang}
    />
  )
}
