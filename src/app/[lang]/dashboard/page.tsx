import { createClient } from '@/lib/supabase/server'
import { Users } from 'lucide-react'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/dashboard/admin-view'
import { MemberDashboard } from '@/components/dashboard/member-view'
import { unlockCapabilities } from '@/lib/capabilities'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DashboardEvent, DashboardTask, DashboardAnnouncement } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('status, role, organisation_id, phone_verified')
    .eq('id', user.id)
    .single()

  if (profileError || !profileData) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 md:p-12">
          <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We couldn&apos;t find your organisation profile. This usually happens if your account setup wasn&apos;t completed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="px-8">
              <Link href={`/${lang}/onboarding`}>Set Up Organisation</Link>
            </Button>
            <Button asChild variant="outline" className="px-8">
              <Link href={`/${lang}/docs`}>Read Guide</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const profile = profileData as { status: 'active' | 'pending' | 'rejected' | 'removed'; role: string; organisation_id: string | null; phone_verified: boolean }

  const onboardingIncomplete = !profile.organisation_id || !profile.phone_verified

  if (onboardingIncomplete) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 md:p-12">
          <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Finish setting up your organisation</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Complete onboarding to unlock your dashboard and start using Sangathan.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="px-8">
              <Link href={`/${lang}/onboarding`}>Continue Onboarding</Link>
            </Button>
            <Button asChild variant="outline" className="px-8">
              <Link href={`/${lang}/docs`}>View Guide</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (profile.status === 'pending') {
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

  if (profile.status === 'rejected') {
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

  if (!profile.organisation_id) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">No Organisation Found</h1>
        <p className="text-gray-600 mb-8">You are not currently a member of any organisation.</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href={`/${lang}/onboarding`}>Create New Organisation</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${lang}/docs`}>View Documentation</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { data: orgData } = await supabase
    .from('organisations')
    .select('status')
    .eq('id', profile.organisation_id)
    .single()

  const org = orgData as { status: string } | null

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

  if (isAdmin) {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      membersRes,
      activeMembersRes,
      upcomingEventsRes,
      openTasksRes,
      donationsRes,
      activityRes,
      membershipRequestsRes,
      appealsRes
    ] = await Promise.all([
      supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('organisation_id', profile.organisation_id),
      supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('organisation_id', profile.organisation_id)
        .eq('status', 'active'),
      supabase
        .from('events')
        .select('*')
        .eq('organisation_id', profile.organisation_id)
        .gte('start_time', now.toISOString())
        .order('start_time', { ascending: true })
        .limit(5),
      supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('organisation_id', profile.organisation_id)
        .eq('status', 'open'),
      supabase
        .from('donations')
        .select('amount, created_at')
        .eq('organisation_id', profile.organisation_id)
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabase
        .from('audit_logs')
        .select('action, created_at, details')
        .eq('organisation_id', profile.organisation_id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('organisation_id', profile.organisation_id)
        .eq('status', 'pending'),
      supabase
        .from('appeals')
        .select('*', { count: 'exact', head: true })
        .eq('organisation_id', profile.organisation_id)
    ])

    const totalMembers = membersRes.count || 0
    const activeMembers = activeMembersRes.count || 0
    const openTasks = openTasksRes.count || 0
    const upcomingEvents = (upcomingEventsRes.data || []) as unknown as DashboardEvent[]
    const membershipRequests = membershipRequestsRes.count || 0
    const openAppeals = appealsRes.count || 0

    const totalDonations = (donationsRes.data || []).reduce((sum: number, d) => sum + (Number(d.amount) || 0), 0)

    const recentActivity = (activityRes.data || []).map((log) => ({
      title: log.action.replace(/_/g, ' '),
      type: 'audit',
      created_at: new Date(log.created_at).toLocaleDateString()
    }))

    return (
      <AdminDashboard
        stats={{
          members: activeMembers || totalMembers,
          events: upcomingEvents.length,
          tasks: openTasks || 0,
          donations: totalDonations
        }}
        recentActivity={recentActivity}
        upcomingEvents={upcomingEvents}
        membershipRequests={membershipRequests || 0}
        openAppeals={openAppeals || 0}
        lang={lang}
      />
    )
  }

  const [eventsRes, tasksRes, announcementsRes] = await Promise.all([
    supabase.from('events').select('*').eq('organisation_id', profile.organisation_id).gte('start_time', new Date().toISOString()).order('start_time', { ascending: true }).limit(3),
    supabase.from('task_assignments').select('task:tasks(*)').eq('member_id', user.id).limit(3),
    supabase.from('announcements').select('*').eq('organisation_id', profile.organisation_id).order('created_at', { ascending: false }).limit(3)
  ])

  const myTasks = (tasksRes.data || [])
    .map((t) => t.task as unknown as DashboardTask)
    .filter(Boolean)

  return (
    <MemberDashboard
      upcomingEvents={(eventsRes.data || []) as unknown as DashboardEvent[]}
      tasks={myTasks}
      announcements={(announcementsRes.data || []) as unknown as DashboardAnnouncement[]}
      lang={lang}
    />
  )
}
