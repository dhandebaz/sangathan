'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { addMember } from '@/actions/members/actions'

export function AddMemberDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError('')

    const data = {
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string,
      email: (formData.get('email') as string) || undefined,
      designation: (formData.get('designation') as string) || undefined,
      area: (formData.get('area') as string) || undefined,
      joining_date: (formData.get('joining_date') ? new Date(formData.get('joining_date') as string).toISOString() : new Date().toISOString()),
      status: 'active' as const,
      role: 'member' as const,
    }

    const result = await addMember(data)

    if (result.success) {
      setIsOpen(false)
      router.refresh()
    } else {
      setError(result.error || 'Failed to add member')
    }
    setIsLoading(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
      >
        <Plus size={16} />
        Add Member
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Add New Member</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              name="full_name"
              required
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone *</label>
            <input
              name="phone"
              required
              type="tel"
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Designation</label>
              <input
                name="designation"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Area</label>
              <input
                name="area"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email (Optional)</label>
            <input
              name="email"
              type="email"
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          
           <div>
            <label className="block text-sm font-medium mb-1">Joining Date</label>
            <input
              name="joining_date"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Adding...' : 'Add Member'}
          </button>
        </form>
      </div>
    </div>
  )
}
