'use client'

import { useState } from 'react'
import { submitAppeal } from '@/actions/appeals'
import { AlertCircle, Send } from 'lucide-react'

export function AppealForm({ organisationId }: { organisationId: string }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    const result = await submitAppeal({
      organisationId,
      type: formData.get('type') as 'suspension' | 'restriction' | 'other',
      reason: formData.get('reason') as string,
      contactEmail: formData.get('contactEmail') as string,
      evidenceLink: (formData.get('evidenceLink') as string) || undefined,
    })

    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error || 'Failed to submit appeal')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-700 font-bold mb-2">Appeal Submitted</div>
        <p className="text-sm text-green-600">
          Your appeal has been securely transmitted to the Governance Board. 
          You will receive an update at your contact email within 48 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Appeal Type</label>
        <select name="type" required className="w-full p-2 border rounded-md bg-white">
          <option value="suspension">Suspension Appeal</option>
          <option value="restriction">Feature Restriction</option>
          <option value="other">Other Governance Issue</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Appeal</label>
        <textarea 
          name="reason" 
          required 
          rows={4}
          minLength={20}
          className="w-full p-2 border rounded-md"
          placeholder="Please explain why the suspension was in error or how the issue has been resolved..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Evidence URL (Optional)</label>
        <input 
          type="url" 
          name="evidenceLink" 
          className="w-full p-2 border rounded-md"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
        <input 
          type="email" 
          name="contactEmail" 
          required 
          className="w-full p-2 border rounded-md"
          placeholder="admin@example.com"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded-md font-medium hover:opacity-90 flex items-center justify-center gap-2"
      >
        {loading ? 'Submitting...' : <><Send size={16} /> Submit to Governance Board</>}
      </button>
    </form>
  )
}
