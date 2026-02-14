import { createClient } from '@/lib/supabase/server'
import { Plus, Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function MeetingsPage() {
  const supabase = await createClient()

  // Fetch meetings with attendance count
  const { data, error } = await supabase
    .from('meetings')
    .select('id, title, date, location, meeting_attendance(count)')
    .order('date', { ascending: false })
  
  const meetings = data as any[]

  if (error) {
    return <div className="p-4 text-red-500">Error loading meetings</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
           <p className="text-gray-500 mt-1">Schedule and track organisational gatherings.</p>
        </div>
        <Link 
            href="/dashboard/meetings/new" 
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
            <Plus size={16} />
            Schedule Meeting
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {meetings?.map((meeting) => (
          <div key={meeting.id} className="content-card rounded-lg p-6 hover:shadow-md transition-shadow">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                   <h3 className="text-xl font-bold mb-1">{meeting.title}</h3>
                   <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                         <Calendar size={14} />
                         <span>{new Date(meeting.date).toLocaleString()}</span>
                      </div>
                      {meeting.location && (
                        <div className="flex items-center gap-1">
                           <MapPin size={14} />
                           <span>{meeting.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                         <Users size={14} />
                         <span>{meeting.meeting_attendance?.[0]?.count || 0} Attendees</span>
                      </div>
                   </div>
                </div>
                
                <Link 
                   href={`/dashboard/meetings/${meeting.id}`} 
                   className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2"
                >
                   View Details
                   <ArrowRight size={16} />
                </Link>
             </div>
          </div>
        ))}

        {meetings?.length === 0 && (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                <p>No meetings scheduled yet.</p>
            </div>
        )}
      </div>
    </div>
  )
}
