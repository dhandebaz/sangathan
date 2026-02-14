'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { approveMember, rejectMember } from '@/actions/membership'
import { useRouter } from 'next/navigation'

export function RequestList({ requests }: { requests: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    setLoading(id)
    await approveMember({ memberId: id })
    setLoading(null)
    router.refresh()
  }

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this request?')) return
    setLoading(id)
    await rejectMember({ memberId: id })
    setLoading(null)
    router.refresh()
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">No pending membership requests.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border rounded-lg shadow-sm gap-4">
          <div>
            <h4 className="font-semibold text-gray-900">{req.full_name || 'Unknown User'}</h4>
            <p className="text-sm text-gray-500">{req.email}</p>
            <p className="text-xs text-gray-400 mt-1">Requested: {new Date(req.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={() => handleReject(req.id)}
              disabled={loading === req.id}
            >
              {loading === req.id ? '...' : 'Reject'}
            </Button>
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleApprove(req.id)}
              disabled={loading === req.id}
            >
              {loading === req.id ? 'Processing...' : 'Approve'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
