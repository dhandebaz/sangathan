import { createClient } from '@/lib/supabase/server'
import { getUserContext } from '@/lib/auth/context'
import { notFound } from 'next/navigation'
import { Meeting, MeetingAttendance, Organisation } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PrintMeetingPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const ctx = await getUserContext()
  
  // Fetch Meeting
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', id)
    .single()
  
  const meeting = data as Meeting | null
    
  if (error || !meeting) notFound()

  // Fetch Attendance
  const { data: attData } = await supabase
    .from('meeting_attendance')
    .select('status, members(full_name)')
    .eq('meeting_id', id)
    .order('status', { ascending: false })
  
  const attendance = attData as unknown as MeetingAttendance[] | null

  // Fetch Organisation Name
  const { data: orgData } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', ctx.organizationId)
    .single()
  
  const org = orgData as Organisation | null

  return (
    <div className="p-8 bg-white min-h-screen text-black">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-1">{org?.name}</h2>
        <h1 className="text-3xl font-bold">{meeting.title}</h1>
        <div className="flex gap-4 mt-2 text-sm">
           <p><strong>Date:</strong> {new Date(meeting.date).toLocaleString()}</p>
           {meeting.location && <p><strong>Location:</strong> {meeting.location}</p>}
        </div>
      </div>

      <div className="mb-8">
         <h3 className="font-bold uppercase text-xs mb-2 border-b border-gray-200 pb-1">Agenda / Notes</h3>
         <div className="text-sm whitespace-pre-wrap">
            {meeting.description || 'No notes recorded.'}
         </div>
      </div>

      <div>
         <h3 className="font-bold uppercase text-xs mb-4 border-b border-gray-200 pb-1">Attendance Record</h3>
         <table className="w-full text-left text-sm border-collapse">
            <thead>
               <tr className="border-b border-black">
                  <th className="py-2 px-2">Member</th>
                  <th className="py-2 px-2 w-32">Status</th>
               </tr>
            </thead>
            <tbody>
               {attendance?.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                     <td className="py-2 px-2">{row.members.full_name}</td>
                     <td className="py-2 px-2 capitalize">{row.status}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      <div className="mt-12 pt-4 border-t text-xs text-center text-gray-400">
        Generated on {new Date().toLocaleDateString()} via Sangathan Platform
      </div>

      <style>{`
        @media print {
          @page { margin: 1.5cm; }
          body { -webkit-print-color-adjust: exact; }
        }
      `}</style>
      
      <script dangerouslySetInnerHTML={{__html: `window.print();`}} />
    </div>
  )
}
