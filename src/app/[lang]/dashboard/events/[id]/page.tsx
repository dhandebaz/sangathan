import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QrCode, ArrowLeft } from 'lucide-react'
import { DashboardEvent, EventRSVP } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export default async function EventDetailsPage(props: { params: Promise<{ lang: string, id: string }> }) {
  const { lang, id } = await props.params
  const supabase = await createClient()
  
  const { data: eventData } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  const event = eventData as DashboardEvent | null

  if (!event) notFound()

  const { data: rsvpsData } = await supabase
    .from('event_rsvps')
    .select('*, user:user_id(full_name, email)')
    .eq('event_id', id)
    .order('created_at', { ascending: false })

  const rsvps = rsvpsData as (EventRSVP & { user: { full_name: string; email: string } | null })[] | null

  const attendedCount = rsvps?.filter((r) => r.status === 'attended').length || 0
  const registeredCount = rsvps?.length || 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/${lang}/dashboard/events`} className="flex items-center text-sm text-gray-500 hover:text-black mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Events
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
          <div className="flex gap-2 mt-2">
             <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium uppercase">{event.event_type}</span>
             <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
               {new Date(event.start_time).toLocaleString()}
             </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
             <Link href={`/${lang}/dashboard/events/${id}/check-in`}>
               <QrCode className="mr-2 h-4 w-4" />
               Launch Check-in
             </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
          <p className="text-sm font-medium text-gray-500 uppercase">Registered</p>
          <h3 className="text-3xl font-bold">{registeredCount}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
          <p className="text-sm font-medium text-gray-500 uppercase">Attended</p>
          <h3 className="text-3xl font-bold text-green-600">{attendedCount}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
          <p className="text-sm font-medium text-gray-500 uppercase">Turnout Rate</p>
          <h3 className="text-3xl font-bold text-blue-600">
            {registeredCount > 0 ? Math.round((attendedCount / registeredCount) * 100) : 0}%
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-bold text-lg">Attendee List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Checked In</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rsvps?.map((rsvp) => (
                <tr key={rsvp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {rsvp.guest_name || rsvp.user?.full_name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {rsvp.guest_email || rsvp.user?.email || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rsvp.status === 'attended' ? 'bg-green-100 text-green-800' :
                      rsvp.status === 'registered' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {rsvp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {rsvp.status === 'attended' ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
              {(!rsvps || rsvps.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No registrations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
