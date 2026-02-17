'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Users, Globe2, Lock } from 'lucide-react'
import { createMeeting } from '@/actions/meetings'
import Link from 'next/link'

interface Member {
  id: string
  full_name: string
}

export function CreateMeetingForm({ members }: { members: Member[] }) {
  const router = useRouter()
  const params = useParams() as { lang?: string }
  const lang = params.lang || 'en'
  const [loading, setLoading] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  const [visibility, setVisibility] = useState<'public' | 'members' | 'private'>('members')
  
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
      end_time: formData.get('end_time')
        ? new Date(formData.get('end_time') as string).toISOString()
        : undefined,
      location: formData.get('location') as string,
      visibility,
      meeting_link: (formData.get('meeting_link') as string) || undefined,
      attendee_ids: Array.from(selectedMembers)
    })

    if (result.success) {
       router.push(`/${lang}/dashboard/meetings/${result.data?.meetingId}`)
    } else {
       alert(result.error)
       setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
         <Link href={`/${lang}/dashboard/meetings`} className="text-gray-500 hover:text-black">
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
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                     <label className="block text-sm font-medium mb-1">End Time</label>
                     <input 
                        name="end_time"
                        type="datetime-local"
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium mb-1">Location</label>
                     <input 
                        name="location"
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder="e.g., Main Hall or Online"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium mb-1">Meeting Link</label>
                     <input 
                        name="meeting_link"
                        type="url"
                        className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder="https://meet.google.com/..."
                     />
                     <p className="mt-1 text-xs text-gray-500">
                        Leave blank to auto-generate a secure Jitsi link.
                     </p>
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
                     <Globe2 size={18} />
                     Visibility
                  </h3>
                  <div className="space-y-2 text-sm">
                     <label className="flex items-start gap-2 cursor-pointer">
                        <input 
                          type="radio"
                          name="visibility"
                          value="public"
                          checked={visibility === 'public'}
                          onChange={() => setVisibility('public')}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium">Public</div>
                          <p className="text-xs text-gray-500">Visible on public organisation page. Anyone with the link can join.</p>
                        </div>
                     </label>
                     <label className="flex items-start gap-2 cursor-pointer">
                        <input 
                          type="radio"
                          name="visibility"
                          value="members"
                          checked={visibility === 'members'}
                          onChange={() => setVisibility('members')}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium">Members only</div>
                          <p className="text-xs text-gray-500">Visible inside dashboard for organisation members.</p>
                        </div>
                     </label>
                     <label className="flex items-start gap-2 cursor-pointer">
                        <input 
                          type="radio"
                          name="visibility"
                          value="private"
                          checked={visibility === 'private'}
                          onChange={() => setVisibility('private')}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Private
                          </div>
                          <p className="text-xs text-gray-500">For sensitive meetings. Not shown on public pages.</p>
                        </div>
                     </label>
                  </div>
               </div>

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
