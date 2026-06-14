'use client'

import { useState } from 'react'
import { HeartHandshake, Search, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { AddMemberDialog } from '@/components/members/add-member-dialog'

interface Volunteer {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  created_at: string
}

interface VolunteersClientProps {
  initialVolunteers: Volunteer[]
}

export function VolunteersClient({ initialVolunteers }: VolunteersClientProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredVolunteers = initialVolunteers.filter((vol) => {
    const term = searchTerm.toLowerCase()
    const nameMatch = vol.full_name?.toLowerCase().includes(term)
    const emailMatch = vol.email?.toLowerCase().includes(term)
    const phoneMatch = vol.phone?.toLowerCase().includes(term)
    return nameMatch || emailMatch || phoneMatch
  })

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Volunteer Network</h1>
          <p className="text-gray-500 mt-1">Manage, assign, and coordinate your on-ground volunteers.</p>
        </div>
        <div className="flex gap-2">
          <AddMemberDialog 
            triggerLabel="Invite Volunteers" 
            triggerIcon={<Users size={16} />} 
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search volunteers..." 
              className="pl-9 bg-white" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Volunteer Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVolunteers.map((vol) => (
                <tr key={vol.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                        <HeartHandshake size={18} />
                      </div>
                      <div className="font-medium text-gray-900">{vol.full_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{vol.email || 'No email provided'}</div>
                    <div className="text-gray-500 text-xs mt-1">{vol.phone || ''}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(vol.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filteredVolunteers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No volunteers found. Invite your team to get started.
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
