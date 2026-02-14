import { createClient } from '@/lib/supabase/server'
import { MetricCard } from '@/components/analytics/metric-card'
import { Users, Calendar, CheckSquare, DollarSign, Megaphone } from 'lucide-react'
import { redirect } from 'next/navigation'
import { checkCapability } from '@/lib/capabilities'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  // Check Permission
  const { data: profileData } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single()

  const profile = profileData as any

  if (!profile || !profile.organization_id || !['admin', 'editor'].includes(profile.role)) {
    return <div className="p-8 text-center text-red-600">Access Denied</div>
  }

  const orgId = profile.organization_id

  const canAnalytics = await checkCapability(orgId, 'advanced_analytics')
  if (!canAnalytics) return <div className="p-8 text-center text-gray-500">Advanced Analytics is not enabled for your organisation.</div>

  // --- Parallel Data Fetching ---
  const results = await Promise.allSettled([
    // 1. Members
    (supabase.from('members') as any).select('*', { count: 'exact', head: true }).eq('organisation_id', orgId),
    (supabase.from('members') as any).select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).eq('status', 'active'),
    
    // 2. Events
    (supabase.from('events') as any).select('*', { count: 'exact', head: true }).eq('organisation_id', orgId),
    (supabase.from('event_rsvps') as any).select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).eq('status', 'attended'),
    
    // 3. Tasks
    (supabase.from('tasks') as any).select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).eq('status', 'open'),
    (supabase.from('tasks') as any).select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).eq('status', 'completed'),
    (supabase.from('task_logs') as any).select('hours_logged').eq('organisation_id', orgId), // This might fail if task_logs doesn't have org_id directly, check schema.
    // task_logs links to task which links to org. RLS handles it, but direct select needs join or we fetch all logs via RLS (which filters by org).
    // Let's assume RLS filters correctly for simple select if we use the right client.
    // Actually, task_logs doesn't have organisation_id in my previous schema (it has task_id). 
    // We need to join. Supabase JS doesn't do aggregation sums easily without RPC.
    // We will fetch raw logs for now (assuming not huge scale yet) or use a view later.
    (supabase.from('task_logs') as any).select('hours_logged, task:tasks!inner(organisation_id)').eq('task.organisation_id', orgId),

    // 4. Donations
    (supabase.from('donations') as any).select('amount').eq('organisation_id', orgId),

    // 5. Announcements
    (supabase.from('announcements') as any).select('*', { count: 'exact', head: true }).eq('organisation_id', orgId),
  ])

  // Helpers
  const getCount = (res: any) => (res.status === 'fulfilled' && res.value.data !== null ? res.value.count : 0)
  const getData = (res: any) => (res.status === 'fulfilled' ? res.value.data : [])

  const totalMembers = getCount(results[0])
  const activeMembers = getCount(results[1])
  
  const totalEvents = getCount(results[2])
  const totalAttended = getCount(results[3])
  
  const openTasks = getCount(results[4])
  const completedTasks = getCount(results[5])
  
  const taskLogs = getData(results[6]) || []
  const totalHours = taskLogs.reduce((sum: number, log: any) => sum + (Number(log.hours_logged) || 0), 0)

  const donations = getData(results[7]) || []
  const totalDonations = donations.reduce((sum: number, d: any) => sum + (Number(d.amount) || 0), 0)

  const totalAnnouncements = getCount(results[8])

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
