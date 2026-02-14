import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CheckSquare, Megaphone, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function MemberDashboard({ lang, events, tasks, announcements }: { lang: string, events: any[], tasks: any[], announcements: any[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Welcome Back!</h1>
      
      {/* Upcoming Events */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Upcoming Events
          </h2>
          <Link href={`/${lang}/dashboard/events`} className="text-sm text-blue-600 font-medium">View All</Link>
        </div>
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="bg-gray-50 border border-dashed rounded-lg p-6 text-center text-gray-500 text-sm">
              No upcoming events.
            </div>
          ) : (
            events.map((event) => (
              <Link href={`/${lang}/dashboard/events/${event.id}`} key={event.id} className="block">
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(event.start_time).toLocaleDateString()} • {event.location || 'Online'}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Assigned Tasks */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-green-500" />
            My Tasks
          </h2>
          <Link href={`/${lang}/dashboard/tasks`} className="text-sm text-blue-600 font-medium">View All</Link>
        </div>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="bg-gray-50 border border-dashed rounded-lg p-6 text-center text-gray-500 text-sm">
              No tasks assigned.
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-white border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {task.priority} priority
                  </span>
                </div>
                <Button size="sm" variant="outline" asChild>
                   <Link href={`/${lang}/dashboard/tasks`}>View</Link>
                </Button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Latest Announcements */}
      <section>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <Megaphone className="w-5 h-5 text-orange-500" />
          Latest Updates
        </h2>
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white border rounded-lg p-4 shadow-sm">
               <div className="flex items-center gap-2 mb-1">
                 {a.is_pinned && <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Pinned</span>}
                 <span className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString()}</span>
               </div>
               <h3 className="font-medium mb-1">{a.title}</h3>
               <p className="text-sm text-gray-600 line-clamp-2">{a.content}</p>
            </div>
          ))}
          {announcements.length === 0 && (
            <p className="text-gray-500 text-sm italic">No recent announcements.</p>
          )}
        </div>
      </section>
    </div>
  )
}
