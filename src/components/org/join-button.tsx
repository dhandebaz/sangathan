'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { requestJoinOrganisation } from '@/actions/membership'
import { useRouter } from 'next/navigation'

export function JoinButton({ orgId, policy, isAuthenticated }: { orgId: string, policy: string, isAuthenticated: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleJoin = async () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${window.location.pathname}`)
      return
    }

    setLoading(true)
    const res = await requestJoinOrganisation({ orgId })
    setLoading(false)

    if (res.success) {
      router.refresh()
    } else {
      alert(res.error)
    }
  }

  if (policy === 'invite_only') return null

  return (
    <Button onClick={handleJoin} disabled={loading} className="w-full sm:w-auto bg-black text-white hover:bg-gray-800">
      {loading ? 'Processing...' : policy === 'admin_approval' ? 'Request to Join' : 'Join Organisation'}
    </Button>
  )
}
