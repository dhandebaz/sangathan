import { createClient } from '@/lib/supabase/server'
import { Plus, Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function EventsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user?.id)
    .single()

  const orgId = profile?.organisation_id

  const [ownedEventsRes, jointEventsRes] = await Promise.all([
    supabase.from('events').select('*, event_rsvps(count)').eq('organisation_id', orgId).order('start_time', { ascending: true }),
    supabase.from('joint_events').select('event:events(*, event_rsvps(count))').eq('organisation_id', orgId)
  ])

  const allEvents = [
    ...(ownedEventsRes.data || []),
    ...(jointEventsRes.data?.map((j: any) => j.event) || [])
  ].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">Manage your organisation's events and participation.</p>
        </div>
        <Button asChild>
          <Link href={`/${lang}/dashboard/events/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEvents?.map((event: any) => (
          <Link href={`/${lang}/dashboard/events/${event.id}`} key={event.id} className="group block">
            <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  event.organisation_id === orgId ? 'bg-orange-50 text-orange-700' : 'bg-purple-50 text-purple-700'
                }`}>
                  {event.organisation_id === orgId ? event.event_type : 'Co-Hosted'}
                </div>
                {new Date(event.start_time) < new Date() && (
                  <span className="text-gray-400 text-xs font-medium">Past</span>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors">{event.title}</h3>
              
              <div className="space-y-2 text-sm text-gray-500 flex-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.start_time).toLocaleDateString()}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{event.event_rsvps?.[0]?.count || 0} / {event.capacity || '∞'}</span>
                </div>
                <span className="text-blue-600 font-medium group-hover:underline">Manage</span>
              </div>
            </div>
          </Link>
        ))}
        
        {(!allEvents || allEvents.length === 0) && (
          <div className="col-span-full text-center py-12 bg-gray-50 border border-dashed rounded-xl">
            <p className="text-gray-500">No events found. Create your first event to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
