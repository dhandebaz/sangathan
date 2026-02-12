'use client'

import { useState } from 'react'
import { toggleFormStatus } from '@/actions/forms/actions'

export function FormStatusToggle({ formId, isActive }: { formId: string, isActive: boolean }) {
  const [active, setActive] = useState(isActive)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    const newState = !active
    const result = await toggleFormStatus({ formId, isActive: newState })
    if (result.success) {
      setActive(newState)
    }
    setLoading(false)
  }

  return (
    <button 
        onClick={handleToggle} 
        disabled={loading}
        className={`text-xs font-medium px-2 py-1 rounded-full ${
            active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}
    >
        {loading ? '...' : (active ? 'Active' : 'Closed')}
    </button>
  )
}
