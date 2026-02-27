import { createClient } from '@/lib/supabase/server'
import { getUserContext } from '@/lib/auth/context'
import { notFound } from 'next/navigation'
import { Meeting, MeetingAttendance, Organisation } from '@/types/dashboard'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PrintMeetingPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const ctx = await getUserContext()
  
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', id)
    .single()
  
  const meeting = data as Meeting | null
    
  if (error || !meeting) notFound()

  const { data: attData } = await supabase
    .from('meeting_attendance')
    .select('status, members(full_name)')
    .eq('meeting_id', id)
    .order('status', { ascending: false })
  
  const attendance = attData as unknown as MeetingAttendance[] | null

  const { data: orgData } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', ctx.organizationId)
    .single()
  
  const org = orgData as Organisation | null

  // Generate Verification Hash
  // We include meeting ID, date, title, and attendance count to ensure content integrity
  const dataToHash = JSON.stringify({
      id: meeting.id,
      date: meeting.date,
      title: meeting.title,
      attendance: attendance?.map(a => `${a.members.full_name}:${a.status}`).sort().join('|')
  })
  
  const verificationHash = crypto.createHash('sha256').update(dataToHash).digest('hex').substring(0, 16).toUpperCase()

  return (
    <div className="p-8 bg-white min-h-screen text-black print-container">
      {/* Header */}
      <div className="mb-8 border-b-2 border-black pb-4 flex justify-between items-end">
        <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-1">{org?.name}</h2>
            <h1 className="text-3xl font-bold">{meeting.title}</h1>
        </div>
        <div className="text-right text-sm">
           <p><strong>Date:</strong> {new Date(meeting.date).toLocaleDateString()}</p>
           {meeting.location && <p><strong>Location:</strong> {meeting.location}</p>}
        </div>
      </div>

      {/* Agenda */}
      <div className="mb-8">
         <h3 className="font-bold uppercase text-xs mb-2 border-b border-gray-300 pb-1 w-full">Agenda / Notes</h3>
         <div className="text-sm whitespace-pre-wrap leading-relaxed">
            {meeting.description || 'No notes recorded.'}
         </div>
      </div>

      {/* Attendance Table */}
      <div>
         <h3 className="font-bold uppercase text-xs mb-4 border-b border-gray-300 pb-1 w-full">Attendance Record</h3>
         <table className="w-full text-left text-sm border-collapse">
            <thead>
               <tr className="border-b-2 border-black">
                  <th className="py-2 px-2 font-bold">Member Name</th>
                  <th className="py-2 px-2 w-32 font-bold text-right">Status</th>
                  <th className="py-2 px-2 w-32 font-bold text-right">Signature</th>
               </tr>
            </thead>
            <tbody>
               {attendance?.map((row, i) => (
                  <tr key={i} className="border-b border-gray-200">
                     <td className="py-3 px-2">{row.members.full_name}</td>
                     <td className="py-3 px-2 capitalize text-right">{row.status}</td>
                     <td className="py-3 px-2 border-l border-dashed border-gray-300"></td>
                  </tr>
               ))}
               {(!attendance || attendance.length === 0) && (
                   <tr>
                       <td colSpan={3} className="py-4 text-center text-gray-500 italic">No attendance records found.</td>
                   </tr>
               )}
            </tbody>
         </table>
      </div>

      {/* Footer with Verification Hash */}
      <div className="fixed bottom-0 left-0 w-full p-8 print:p-0 print:relative print:mt-12">
          <div className="border-t-2 border-black pt-2 flex justify-between items-end text-[10px] font-mono text-gray-600">
            <div>
                <p>Generated via Sangathan Platform</p>
                <p>Date: {new Date().toLocaleString()}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-black">SYSTEM VERIFICATION HASH</p>
                <p className="tracking-widest bg-gray-100 px-2 py-1 mt-1 inline-block border border-gray-300">
                    {verificationHash}
                </p>
            </div>
          </div>
      </div>

      <style>{`
        @media print {
          @page { margin: 1.5cm; size: A4; }
          body { 
            -webkit-print-color-adjust: exact; 
            font-family: 'Times New Roman', serif;
          }
          .print-container { padding: 0 !important; }
          .no-print { display: none; }
        }
      `}</style>
      
      <div className="fixed top-4 right-4 no-print flex gap-2">
         <button 
            onClick={() => window.print()} 
            className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 font-bold"
         >
            Print Record
         </button>
      </div>
    </div>
  )
}
