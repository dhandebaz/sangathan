'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, CheckSquare, Megaphone, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { DashboardEvent, DashboardTask, DashboardAnnouncement } from '@/types/dashboard'

function welcomeMessage(type: string): string {
  switch (type) {
    case 'student_union': return 'Stay tuned for campus events and union activities.'
    case 'workers_union': return 'Stay informed about union meetings and collective actions.'
    case 'rwa': return 'Stay updated on community events and maintenance requests.'
    case 'ngo': return 'Stay connected with ongoing projects and volunteer opportunities.'
    default: return 'Here is what needs your attention.'
  }
}

export function MemberDashboard({
  lang,
  events,
  tasks,
  announcements,
  orgType
}: {
  lang: string
  events: DashboardEvent[]
  tasks: DashboardTask[]
  announcements: DashboardAnnouncement[]
  orgType?: string
}) {
  const type = orgType || 'ngo'
  const nextEvent = events[0]
  const taskCount = tasks.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">{welcomeMessage(type)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="py-3 px-4">
            <div className="text-[11px] text-muted-foreground mb-1 font-medium uppercase tracking-wide">My Tasks</div>
            <div className="text-xl font-bold text-foreground">{taskCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <div className="text-[11px] text-muted-foreground mb-1 font-medium uppercase tracking-wide">Next Event</div>
            <div className="text-xs text-foreground">
              {nextEvent
                ? `${new Date(nextEvent.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • ${nextEvent.title}`
                : 'No upcoming events'}
            </div>
          </CardContent>
        </Card>
      </div>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2 text-foreground">
            <Calendar className="w-4 h-4 text-brand-600" />
            Upcoming Events
          </h2>
          <Link href={`/${lang}/dashboard/events`} className="text-sm text-brand-600 font-medium hover:underline">View All</Link>
        </div>
        <div className="space-y-2">
          {events.length === 0 ? (
            <div className="bg-muted border border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground">
              No upcoming events.
            </div>
          ) : (
            events.map((event) => (
              <Link href={`/${lang}/dashboard/events/${event.id}`} key={event.id} className="block group">
                <Card className="transition-all duration-200 hover:shadow-md border-l-[3px] border-l-brand-500">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-brand-600 transition-colors">{event.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(event.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {event.location || 'Online'}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0 group-hover:text-brand-600 transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2 text-foreground">
            <CheckSquare className="w-4 h-4 text-success" />
            My Tasks
          </h2>
          <Link href={`/${lang}/dashboard/tasks`} className="text-sm text-brand-600 font-medium hover:underline">View All</Link>
        </div>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="bg-muted border border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground">
              No tasks assigned.
            </div>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4 flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate">{task.title}</h3>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded font-medium ${
                      task.priority === 'high'
                        ? 'bg-danger-bg text-danger-text'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {task.priority} priority
                    </span>
                  </div>
                  <Button size="sm" variant="outline" asChild className="shrink-0">
                    <Link href={`/${lang}/dashboard/tasks`}>View</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold flex items-center gap-2 mb-3 text-foreground">
          <Megaphone className="w-4 h-4 text-brand-500" />
          Latest Updates
        </h2>
        <div className="space-y-3">
          {announcements.map((a) => (
            <Card key={a.id} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  {a.is_pinned && (
                    <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Pinned</span>
                  )}
                  <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="font-medium text-sm text-foreground mb-1">{a.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
              </CardContent>
            </Card>
          ))}
          {announcements.length === 0 && (
            <div className="bg-muted border border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground">
              No recent announcements.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
