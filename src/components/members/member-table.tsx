'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Printer } from 'lucide-react'
import { updateMember, changeMemberStatus } from '@/actions/members/actions'

interface Member {
  id: string
  full_name: string
  phone: string | null
  email: string | null
  designation: string | null
  area: string | null
  status: 'active' | 'inactive' | null
  joining_date: string | null
  role: string | null
}

export function MemberTable({ members }: { members: Member[] }) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusToggle = async (member: Member) => {
    // Only toggle, optimistic UI would be better but simple is fine for now
    if (confirm(`Are you sure you want to ${member.status === 'active' ? 'deactivate' : 'activate'} this member?`)) {
        setIsUpdating(true)
        const newStatus = member.status === 'active' ? 'inactive' : 'active'
        await changeMemberStatus({ memberId: member.id, status: newStatus })
        router.refresh()
        setIsUpdating(false)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-gray-50">
            <th className="py-3 px-4 font-semibold">Name</th>
            <th className="py-3 px-4 font-semibold">Phone</th>
            <th className="py-3 px-4 font-semibold hidden md:table-cell">Designation</th>
            <th className="py-3 px-4 font-semibold hidden md:table-cell">Area</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {members.length === 0 ? (
             <tr>
               <td colSpan={6} className="py-8 text-center text-gray-500">
                 No members found.
               </td>
             </tr>
          ) : (
            members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium">{member.full_name}</td>
                <td className="py-3 px-4 text-gray-600">{member.phone || '-'}</td>
                <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{member.designation || '-'}</td>
                <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{member.area || '-'}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {member.status || 'active'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusToggle(member)}
                    className="text-sm text-gray-500 hover:text-black underline disabled:opacity-50"
                  >
                    {member.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
