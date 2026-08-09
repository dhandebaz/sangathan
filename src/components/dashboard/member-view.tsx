'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Calendar, CheckSquare, Megaphone, ArrowRight, AlertCircle,
  Clock, MapPin, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { DashboardEvent, DashboardTask, DashboardAnnouncement } from '@/types/dashboard'


function welcomeMessage(type: string): string {
  switch (type) {
    case 'student_union': return 'कैम्पस events और union activities देखें'
    case 'workers_union': return 'Union meetings और collective actions देखें'
    case 'rwa': return 'Community events और maintenance देखें'
    case 'ngo': return 'Projects और volunteer opportunities देखें'
    default: return 'यहाँ देखें क्या नया है'
  }
}

function getTimeGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'सुप्रभात'
  if (hour < 17) return 'नमस्कार'
  if (hour < 21) return 'शुभ संध्या'
  return 'शुभ रात्रि'
}

export function MemberDashboard({
  lang,
  events,
  tasks,
  announcements,
  orgType,
  userName
}: {
  lang: string
  events: DashboardEvent[]
  tasks: DashboardTask[]
  announcements: DashboardAnnouncement[]
  orgType?: string
  userName?: string
}) {
  const type = orgType || 'ngo'
  const nextEvent = events[0]
  const taskCount = tasks.length
  const greetingEmoji = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return '☀️'
    if (hour < 17) return '🌤️'
    if (hour < 21) return '🌅'
    return '🌙'
  })()

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 md:p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              {getTimeGreeting()}{userName ? `, ${userName}` : ''}! {greetingEmoji}
            </h1>
            <p className="text-slate-300 text-sm mt-1">{welcomeMessage(type)}</p>
            {taskCount > 0 && (
              <div className="mt-3 inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs font-medium">
                <CheckSquare className="h-3.5 w-3.5" />
                {taskCount} tasks बाकी हैं
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-l-4 border-l-brand-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckSquare className="h-4 w-4 text-brand-600" />
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">My Tasks</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{taskCount}</div>
            {taskCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">काम बाकी है</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Next Event</span>
            </div>
            {nextEvent ? (
              <>
                <div className="text-sm font-semibold text-foreground truncate">{nextEvent.title}</div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(nextEvent.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </>
            ) : (
              <>
                <div className="text-sm font-medium text-muted-foreground">कोई event नहीं</div>
                <p className="text-xs text-muted-foreground mt-0.5">शांति है! 🎉</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Tasks */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <CheckSquare className="h-4 w-4 text-success" />
            मेरे Tasks
          </h2>
          {tasks.length > 0 && (
            <Link href={`/${lang}/dashboard/tasks`} className="text-xs text-brand-600 font-medium hover:underline">सभी देखें</Link>
          )}
        </div>
        {tasks.length === 0 ? (
          <EmptyState
            emoji="✅"
            title="सब काम हो गया! 🎉"
            description="कोई task नहीं बचा"
          />
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 3).map((task) => (
              <Card key={task.id} className="transition-all hover:shadow-md active:scale-[0.99]">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border-2 border-muted-foreground/30 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded ${
                          task.priority === 'high'
                            ? 'bg-rose-100 text-rose-700'
                            : task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {task.priority === 'high' && <AlertCircle className="h-3 w-3" />}
                          {task.priority === 'high' ? 'जल्दी' : task.priority === 'medium' ? 'मध्यम' : 'सामान्य'}
                        </span>
                        {task.due_date && (
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <Calendar className="h-4 w-4 text-brand-600" />
            आने वाले Events
          </h2>
          {events.length > 0 && (
            <Link href={`/${lang}/dashboard/events`} className="text-xs text-brand-600 font-medium hover:underline">सभी देखें</Link>
          )}
        </div>
        {events.length === 0 ? (
          <EmptyState
            emoji="📅"
            title="कोई event नहीं है"
            description="जल्द आएगा!"
          />
        ) : (
          <div className="space-y-2">
            {events.slice(0, 2).map((event) => (
              <Link href={`/${lang}/dashboard/events/${event.id}`} key={event.id} className="block">
                <Card className="transition-all hover:shadow-md active:scale-[0.99] border-l-4 border-l-brand-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{event.title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(event.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          {event.location && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Latest Updates */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <Megaphone className="h-4 w-4 text-brand-500" />
            नई बातें
          </h2>
        </div>
        {announcements.length === 0 ? (
          <EmptyState
            emoji="📢"
            title="कोई update नहीं है"
            description="जल्द आएगा!"
          />
        ) : (
          <div className="space-y-2">
            {announcements.slice(0, 2).map((a) => (
              <Card key={a.id} className="transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {a.is_pinned && (
                      <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-1.5 py-0.5 rounded">📌 Pinned</span>
                    )}
                    <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-medium text-sm text-foreground mb-1">{a.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Need Help */}
      <Card className="bg-brand-50/50 border-brand-200">
        <CardContent className="p-4 text-center">
          <p className="text-sm font-medium text-foreground mb-2">कुछ पूछना है? 🤔</p>
          <p className="text-xs text-muted-foreground mb-3">Help लें — हम यहाँ हैं!</p>
          <Button asChild variant="outline" className="h-10 text-xs">
            <Link href={`/${lang}/dashboard/helpdesk`}>
              <ExternalLink className="h-3 w-3 mr-1" />
              Help लें
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
