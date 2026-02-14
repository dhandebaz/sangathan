import { MetricCard } from '@/components/analytics/metric-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, CheckSquare, Megaphone, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { AdminStats, RecentActivityItem } from '@/types/dashboard'

export function AdminDashboard({ 
  lang, 
  stats, 
  recentActivity 
}: { 
  lang: string, 
  stats: AdminStats, 
  recentActivity: RecentActivityItem[] 
}) {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Members" value={stats.members} icon={Users} />
        <MetricCard title="Events" value={stats.events} icon={Calendar} />
        <MetricCard title="Open Tasks" value={stats.tasks} icon={CheckSquare} />
        <MetricCard title="Donations" value={stats.donations} />
      </div>

      {/* Quick Actions (Mobile Optimized) */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        <Button asChild variant="outline" className="h-24 flex flex-col gap-2 bg-white shadow-sm hover:shadow-md border-primary/10">
          <Link href={`/${lang}/announcements`}>
            <Megaphone className="w-6 h-6 text-primary" />
            <span className="font-medium">Post Update</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 flex flex-col gap-2 bg-white shadow-sm hover:shadow-md border-primary/10">
          <Link href={`/${lang}/events/new`}>
            <Calendar className="w-6 h-6 text-primary" />
            <span className="font-medium">New Event</span>
          </Link>
        </Button>
      </div>

      {/* Recent Activity / Pending */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {recentActivity.length === 0 ? (
               <div className="p-8 text-center text-gray-500 text-sm">No recent activity found.</div>
            ) : (
               recentActivity.map((item, i) => (
                 <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{item.title || 'Untitled Activity'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{item.type}</span>
                        <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                 </div>
               ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
