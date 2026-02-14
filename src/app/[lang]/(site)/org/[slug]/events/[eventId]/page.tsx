import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { RSVPButton } from '@/components/events/rsvp-button'
import { TicketView } from '@/components/events/ticket-view'
import { generateQRData } from '@/actions/events'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'

export default async function EventPage(props: { params: Promise<{ slug: string, eventId: string }> }) {
  const { slug, eventId } = await props.params
  const supabaseAdmin = createServiceClient()
  
  // 1. Fetch Event
  const { data: eventData } = await (supabaseAdmin
    .from('events') as any)
    .select('*, organisation_id')
    .eq('id', eventId)
    .single()

  const event = eventData as any

  if (!event) notFound()

  // 2. Fetch Org (for branding/verification)
  const { data: orgData } = await (supabaseAdmin
    .from('organisations') as any)
    .select('id, name, slug')
    .eq('id', event.organisation_id)
    .single()
  
  const org = orgData as any
  if (org?.slug !== slug) notFound()

  // 3. Check User Status
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let rsvp = null
  if (user) {
    const { data } = await (supabaseAdmin
      .from('event_rsvps') as any)
      .select('*, user:user_id(full_name)')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single()
    rsvp = data as any
  }

  // 4. Generate QR if RSVPed
  let qrToken = ''
  if (rsvp) {
    qrToken = await generateQRData(event.id, user?.id, (rsvp as any).id)
  }

  // 5. Check Capacity
  let remainingSpots = null
  if (event.capacity) {
    const { count } = await (supabaseAdmin
      .from('event_rsvps') as any)
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('status', 'registered')
    
    remainingSpots = Math.max(0, event.capacity - (count || 0))
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 min-h-screen">
      <div className="mb-8">
        <span className="text-sm font-medium text-orange-600 uppercase tracking-wide">{org.name} Presents</span>
        <h1 className="text-4xl font-extrabold mt-2 tracking-tight">{event.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Details */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <Calendar className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="font-semibold">Date & Time</p>
                <p className="text-gray-600">
                  {new Date(event.start_time).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  <br />
                  {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {event.end_time && ` - ${new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-gray-600">{event.location}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <Users className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="font-semibold">Access</p>
                <p className="text-gray-600 capitalize">{event.event_type} Event</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none text-gray-600">
            <p>{event.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {rsvp ? (
              <TicketView event={event} rsvp={rsvp} qrToken={qrToken} />
            ) : (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center space-y-4">
                <h3 className="font-bold text-lg">Join this Event</h3>
                {remainingSpots !== null && (
                  <div className="text-sm text-gray-500 mb-2">
                    <span className="font-semibold text-black">{remainingSpots}</span> spots remaining
                  </div>
                )}
                
                {event.rsvp_enabled ? (
                   remainingSpots === 0 ? (
                     <div className="bg-gray-100 p-3 rounded text-gray-500 font-medium">Event Full</div>
                   ) : (
                     <RSVPButton event={event} isAuthenticated={!!user} />
                   )
                ) : (
                   <div className="bg-gray-100 p-3 rounded text-gray-500 font-medium">RSVP Closed</div>
                )}
                
                <p className="text-xs text-gray-400 mt-4">
                  By registering, you agree to share your name and email with {org.name}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
