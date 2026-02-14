'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react'
import { createMeeting } from '@/actions/meetings'
import Link from 'next/link'

interface Member {
  id: string
  full_name: string
}

export function CreateMeetingForm({ members }: { members: Member[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  
  const toggleMember = (id: string) => {
    const newSet = new Set(selectedMembers)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedMembers(newSet)
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    
    const result = await createMeeting({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: new Date(formData.get('date') as string).toISOString(),
      location: formData.get('location') as string,
      attendee_ids: Array.from(selectedMembers)
    })

    if (result.success) {
       router.push(`/dashboard/meetings/${result.data?.meetingId}`)
    } else {
       alert(result.error)
       setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
         <Link href="/dashboard/meetings" className="text-gray-500 hover:text-black">
            <ArrowLeft size={20} />
         </Link>
         <h1 className="text-2xl font-bold">Schedule New Meeting</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 space-y-6">
            <div className="content-card rounded-lg space-y-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input 
                    name="title"
                    required
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none text-lg font-medium"
                    placeholder="e.g., Monthly Executive Meeting"
                  />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium mb-1">Date & Time</label>
                     <input 
                        name="date"
                        type="datetime-local"
                        required
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium mb-1">Location</label>
                     <input 
                        name="location"
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder="e.g., Main Hall or Online"
                     />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium mb-1">Agenda / Notes</label>
                  <textarea 
                    name="description"
                    rows={4}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Meeting agenda items..."
                  />
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="content-card rounded-lg">
               <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Users size={18} />
                  Invite Members
               </h3>
               <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-2">
                  {members.map(member => (
                     <label key={member.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                           type="checkbox"
                           checked={selectedMembers.has(member.id)}
                           onChange={() => toggleMember(member.id)}
                           className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm">{member.full_name}</span>
                     </label>
                  ))}
                  {members.length === 0 && <p className="text-sm text-gray-500 text-center">No active members found.</p>}
               </div>
               <div className="mt-2 text-xs text-gray-500 text-right">
                  {selectedMembers.size} selected
               </div>
            </div>

            <button 
               type="submit"
               disabled={loading}
               className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            >
               {loading ? 'Scheduling...' : 'Schedule Meeting'}
            </button>
         </div>
      </div>
    </form>
  )
}
