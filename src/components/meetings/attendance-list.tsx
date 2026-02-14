'use client'

import { useState } from 'react'
import { Check, X, Minus } from 'lucide-react'
import { markAttendance } from '@/actions/meetings'

interface Attendee {
  member_id: string
  status: 'present' | 'absent' | 'excused'
  members: { full_name: string }
}

export function AttendanceList({ meetingId, attendees }: { meetingId: string, attendees: Attendee[] }) {
  // We use local state to update UI optimistically, though server action revalidates
  const [list, setList] = useState(attendees)

  const handleMark = async (memberId: string, status: 'present' | 'absent' | 'excused') => {
    // Optimistic update
    setList(prev => prev.map(a => a.member_id === memberId ? { ...a, status } : a))
    
    await markAttendance({ meetingId, memberId, status })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b">
           <tr>
              <th className="py-3 px-4 font-medium text-gray-500">Member</th>
              <th className="py-3 px-4 font-medium text-gray-500 text-center">Present</th>
              <th className="py-3 px-4 font-medium text-gray-500 text-center">Absent</th>
              <th className="py-3 px-4 font-medium text-gray-500 text-center">Excused</th>
           </tr>
        </thead>
        <tbody className="divide-y">
           {list.map((attendee) => (
              <tr key={attendee.member_id} className="hover:bg-gray-50">
                 <td className="py-3 px-4 font-medium">{attendee.members.full_name}</td>
                 <td className="py-3 px-4 text-center">
                    <button 
                       onClick={() => handleMark(attendee.member_id, 'present')}
                       className={`p-1.5 rounded-full ${attendee.status === 'present' ? 'bg-green-100 text-green-700' : 'text-gray-300 hover:bg-gray-100'}`}
                    >
                       <Check size={18} />
                    </button>
                 </td>
                 <td className="py-3 px-4 text-center">
                    <button 
                       onClick={() => handleMark(attendee.member_id, 'absent')}
                       className={`p-1.5 rounded-full ${attendee.status === 'absent' ? 'bg-red-100 text-red-700' : 'text-gray-300 hover:bg-gray-100'}`}
                    >
                       <X size={18} />
                    </button>
                 </td>
                 <td className="py-3 px-4 text-center">
                    <button 
                       onClick={() => handleMark(attendee.member_id, 'excused')}
                       className={`p-1.5 rounded-full ${attendee.status === 'excused' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-300 hover:bg-gray-100'}`}
                    >
                       <Minus size={18} />
                    </button>
                 </td>
              </tr>
           ))}
           {list.length === 0 && (
              <tr>
                 <td colSpan={4} className="py-8 text-center text-gray-500">No attendees invited.</td>
              </tr>
           )}
        </tbody>
      </table>
    </div>
  )
}
