import { createClient } from '@/lib/supabase/server'
import { MetricCard } from '@/components/analytics/metric-card'
import { Users, Calendar, CheckSquare, DollarSign, Megaphone } from 'lucide-react'
import { redirect } from 'next/navigation'
import { checkCapability } from '@/lib/capabilities'
import { AccessDenied } from '@/components/dashboard/access-denied'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  // Check Permission
  const { data: profileData } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  const profile = profileData as { organisation_id: string | null; role: string } | null

  if (!profile || !profile.organisation_id || !['admin', 'executive'].includes(profile.role)) {
    return <AccessDenied lang={lang} />
  }

  const orgId = profile.organisation_id

  const canAnalytics = await checkCapability(orgId, 'advanced_analytics')
  if (!canAnalytics) return <div className="p-8 text-center text-gray-500">Advanced Analytics is not enabled for your organisation.</div>

  // --- Parallel Data Fetching ---
  const results = await Promise.allSettled([
    // 1. Members
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId),
    supabase.from('members').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).eq('status', 'active'),
    
    // 2. Events
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId),
    supabase.from('event_rsvps').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).eq('status', 'attended'),
    
    // 3. Tasks
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).eq('status', 'open'),
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).eq('status', 'completed'),
    
    // 4. Task Logs (Inner join tasks to verify org)
    supabase.from('task_logs').select('hours_logged, task:tasks!inner(organisation_id)').eq('task.organisation_id', orgId),

    // 5. Donations
    supabase.from('donations').select('amount').eq('organisation_id', orgId),

    // 6. Announcements
    supabase.from('announcements').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId),
  ])

  // Helpers
  const getCount = (res: PromiseSettledResult<{ count: number | null }>) => 
    (res.status === 'fulfilled' && res.value && 'count' in res.value ? res.value.count || 0 : 0)
  
  const getData = <T,>(res: PromiseSettledResult<{ data: T[] | null }>) => 
    (res.status === 'fulfilled' && res.value ? res.value.data : [])

  const totalMembers = getCount(results[0] as PromiseSettledResult<{ count: number | null }>)
  const activeMembers = getCount(results[1] as PromiseSettledResult<{ count: number | null }>)
  
  const totalEvents = getCount(results[2] as PromiseSettledResult<{ count: number | null }>)
  const totalAttended = getCount(results[3] as PromiseSettledResult<{ count: number | null }>)
  
  const openTasks = getCount(results[4] as PromiseSettledResult<{ count: number | null }>)
  const completedTasks = getCount(results[5] as PromiseSettledResult<{ count: number | null }>)
  
  const taskLogs = (getData<{ hours_logged: number }>(results[6] as PromiseSettledResult<{ data: { hours_logged: number }[] | null }>) || [])
  const totalHours = taskLogs.reduce((sum: number, log) => sum + (Number(log.hours_logged) || 0), 0)

  const donations = (getData<{ amount: number }>(results[7] as PromiseSettledResult<{ data: { amount: number }[] | null }>) || [])
  const totalDonations = donations.reduce((sum: number, d) => sum + (Number(d.amount) || 0), 0)

  const totalAnnouncements = getCount(results[8] as PromiseSettledResult<{ count: number | null }>)

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Insights and performance metrics.</p>
        </div>
        {/* <DateRangePicker /> */}
      </div>

      {/* Membership Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Users className="w-5 h-5" /> Membership</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title="Total Members" value={totalMembers} subtext="Registered profiles" />
          <MetricCard title="Active Members" value={activeMembers} subtext="Approved & active" />
          <MetricCard title="Activity Rate" value={`${totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0}%`} subtext="Engagement" />
        </div>
      </section>

      {/* Operations Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><CheckSquare className="w-5 h-5" /> Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard title="Open Tasks" value={openTasks} icon={CheckSquare} />
          <MetricCard title="Tasks Completed" value={completedTasks} />
          <MetricCard title="Volunteer Hours" value={totalHours.toFixed(1)} subtext="Total time logged" />
          <MetricCard title="Events Held" value={totalEvents} icon={Calendar} />
        </div>
      </section>

      {/* Impact Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><DollarSign className="w-5 h-5" /> Impact & Reach</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title="Total Donations" value={`₹${totalDonations.toLocaleString()}`} />
          <MetricCard title="Event Attendance" value={totalAttended} subtext="Total check-ins" />
          <MetricCard title="Announcements" value={totalAnnouncements} icon={Megaphone} />
        </div>
      </section>
    </div>
  )
}
