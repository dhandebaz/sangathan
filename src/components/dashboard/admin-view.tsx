'use client'

import { MetricCard } from '@/components/analytics/metric-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, CheckSquare, ArrowRight, UsersRound, Ticket, HandCoins, Building, Wrench, Scale, ScrollText } from 'lucide-react'
import Link from 'next/link'
import { AdminStats, RecentActivityItem, DashboardEvent } from '@/types/dashboard'

function orgLabel(type: string): string {
  switch (type) {
    case 'student_union': return 'Student Union'
    case 'workers_union': return 'Workers Union'
    case 'rwa': return 'Residents Welfare'
    case 'ngo': return 'NGO'
    default: return 'Organisation'
  }
}

function orgFeatures(type: string, lang: string) {
  const base = { dashboards: [] as { label: string; href: string; icon: React.ElementType; desc: string }[] }

  if (type === 'ngo') {
    return {
      dashboards: [
        { label: 'Donations', href: `/${lang}/dashboard/donations`, icon: HandCoins, desc: 'Track contributions' },
        { label: 'Volunteers', href: `/${lang}/dashboard/volunteers`, icon: UsersRound, desc: 'Manage teams' },
        { label: 'Compliance', href: `/${lang}/dashboard/settings`, icon: ScrollText, desc: 'Regulatory filings' },
      ]
    }
  }
  if (type === 'student_union') {
    return {
      dashboards: [
        { label: 'Elections', href: `/${lang}/dashboard/polls`, icon: Ticket, desc: 'Manage polls' },
        { label: 'Members', href: `/${lang}/dashboard/members`, icon: UsersRound, desc: 'Student body' },
        { label: 'Events', href: `/${lang}/dashboard/events`, icon: Calendar, desc: 'Campus events' },
      ]
    }
  }
  if (type === 'workers_union') {
    return {
      dashboards: [
        { label: 'Grievances', href: `/${lang}/dashboard/grievances`, icon: Scale, desc: 'File complaints' },
        { label: 'Members', href: `/${lang}/dashboard/members`, icon: UsersRound, desc: 'Worker registry' },
        { label: 'Meetings', href: `/${lang}/dashboard/meetings`, icon: Calendar, desc: 'Union meetings' },
      ]
    }
  }
  if (type === 'rwa') {
    return {
      dashboards: [
        { label: 'Maintenance', href: `/${lang}/dashboard/maintenance`, icon: Wrench, desc: 'Track requests' },
        { label: 'Complaints', href: `/${lang}/dashboard/complaints`, icon: Scale, desc: 'Resolve issues' },
        { label: 'Events', href: `/${lang}/dashboard/events`, icon: Calendar, desc: 'Community events' },
      ]
    }
  }
  return base
}

export function AdminDashboard({
  lang,
  stats,
  recentActivity,
  upcomingEvents,
  membershipRequests,
  openAppeals,
  orgType
}: {
  lang: string
  stats: AdminStats
  recentActivity: RecentActivityItem[]
  upcomingEvents: DashboardEvent[]
  membershipRequests: number
  openAppeals: number
  orgType?: string
}) {
  const type = orgType || 'ngo'
  const features = orgFeatures(type, lang)
  const label = orgLabel(type)

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{label} Overview</h1>
        <p className="text-sm text-muted-foreground">Welcome back. Here is what needs your attention.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Members" value={stats.members} icon={Users} />
        <MetricCard title="Events" value={stats.events} icon={Calendar} />
        <MetricCard title="Open Tasks" value={stats.tasks} icon={CheckSquare} />
        <MetricCard title={type === 'ngo' ? 'Donations' : 'Activity'} value={stats.donations} icon={type === 'ngo' ? HandCoins : Building} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {features.dashboards.map((f) => (
          <Button key={f.href} asChild variant="outline" className="h-auto flex-col items-start gap-1 p-4 shadow-sm hover:shadow-md">
            <Link href={f.href}>
              <div className="flex items-center gap-2">
                <f.icon className="h-5 w-5 text-brand-600" />
                <span className="font-semibold text-sm">{f.label}</span>
              </div>
              <span className="text-xs text-muted-foreground font-normal">{f.desc}</span>
            </Link>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Membership Requests</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between px-6 pb-4">
            <div className="text-3xl font-bold text-foreground">{membershipRequests}</div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/${lang}/dashboard/membership-requests`}>Review</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Appeals</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between px-6 pb-4">
            <div className="text-3xl font-bold text-foreground">{openAppeals}</div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/${lang}/dashboard/settings`}>Manage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Upcoming Events</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link href={`/${lang}/dashboard/events`}>View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {upcomingEvents.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">No upcoming events scheduled.</div>
              ) : (
                upcomingEvents.map((event) => (
                  <Link key={event.id} href={`/${lang}/dashboard/events/${event.id}`} className="group flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-brand-600 transition-colors">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(event.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {event.location || 'Online'}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-brand-600 transition-colors" />
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {recentActivity.length === 0 ? (
                 <div className="p-6 text-center text-sm text-muted-foreground">No recent activity found.</div>
              ) : (
                 recentActivity.map((item, i) => (
                   <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
                     <div className="min-w-0">
                       <p className="text-sm font-medium text-foreground truncate">{item.title || 'Untitled'}</p>
                       <div className="flex items-center gap-2 mt-0.5">
                         <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{item.type}</span>
                         <span className="text-xs text-muted-foreground">{item.created_at}</span>
                       </div>
                     </div>
                   </div>
                 ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
