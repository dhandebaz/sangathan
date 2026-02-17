import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, MapPin, Printer, Trash2, Video, Globe2, Lock } from 'lucide-react'
import Link from 'next/link'
import { AttendanceList } from '@/components/meetings/attendance-list'
import { deleteMeeting } from '@/actions/meetings'
import { Meeting, MeetingAttendance } from '@/types/dashboard'

interface PageProps {
  params: Promise<{ lang: string; id: string }>
}

export const dynamic = 'force-dynamic'

export default async function MeetingDetailsPage({ params }: PageProps) {
  const { lang, id } = await params
  const supabase = await createClient()

  const { data: meeting, error } = await supabase
    .from('meetings')
    .select('*, organisation_id')
    .eq('id', id)
    .single() as { data: Meeting | null, error: { message: string } | null }

  if (error || !meeting) notFound()

  const { data: attendance } = await supabase
    .from('meeting_attendance')
    .select('member_id, status, members(full_name)')
    .eq('meeting_id', id)
    .order('status', { ascending: false }) as { data: MeetingAttendance[] | null }

  const jitsiLink = `https://meet.jit.si/sangathan-${meeting.organisation_id}-${meeting.id}`
  const meetingLink = (meeting as Meeting & { meeting_link?: string | null }).meeting_link || jitsiLink
  const visibility = (meeting as Meeting & { visibility?: 'public' | 'members' | 'private' }).visibility || 'members'

  const start = new Date(meeting.date)
  const end = (meeting as Meeting & { end_time?: string | null }).end_time ? new Date((meeting as Meeting & { end_time?: string | null }).end_time as string) : null

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
            <Link href={`/${lang}/dashboard/meetings`} className="text-gray-500 hover:text-black">
               <ArrowLeft size={20} />
            </Link>
            <div>
               <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{meeting.title}</h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border bg-gray-50 text-gray-700">
                    {visibility === 'public' && <Globe2 className="w-3 h-3" />}
                    {visibility === 'private' && <Lock className="w-3 h-3" />}
                    {visibility.charAt(0).toUpperCase() + visibility.slice(1)} meeting
                  </span>
               </div>
               <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                     <Calendar size={14} />
                     <span>
                       {start.toLocaleString()}
                       {end && (
                         <>
                           {' – '}
                           {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </>
                       )}
                     </span>
                  </div>
                  {meeting.location && (
                     <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{meeting.location}</span>
                     </div>
                  )}
               </div>
            </div>
         </div>

         <div className="flex gap-2">
            <a 
               href={`/${lang}/dashboard/meetings/${id}/print`} 
               target="_blank"
               className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-gray-50"
            >
               <Printer size={16} />
               Export Summary
            </a>
            
            <a 
               href={meetingLink} 
               target="_blank" 
               rel="noopener noreferrer"
               className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-blue-700"
            >
               <Video size={16} />
               Join Meeting
            </a>

            <form action={async () => {
               'use server'
               await deleteMeeting({ meetingId: id })
            }}>
                <button type="submit" className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="Delete Meeting">
                   <Trash2 size={18} />
                </button>
            </form>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            <div className="content-card rounded-lg">
               <h3 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-wide">Agenda & Notes</h3>
               <div className="prose text-sm text-gray-600">
                  {meeting.description ? (
                     <p className="whitespace-pre-wrap">{meeting.description}</p>
                  ) : (
                     <p className="italic text-gray-400">No agenda or notes added.</p>
                  )}
               </div>
            </div>
         </div>

         <div className="content-card rounded-lg p-0 overflow-hidden h-fit">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
               <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wide">Attendance</h3>
               <span className="text-xs bg-white border px-2 py-1 rounded text-gray-600">
                  {attendance?.filter(a => a.status === 'present').length || 0} / {attendance?.length || 0} Present
               </span>
            </div>
            <AttendanceList meetingId={id} attendees={attendance || []} />
         </div>
      </div>
    </div>
  )
}
