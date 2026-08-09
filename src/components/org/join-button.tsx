'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { requestJoinOrganisation } from '@/actions/membership'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function JoinButton({
  orgId,
  policy,
  isAuthenticated,
  lang,
}: {
  orgId: string
  policy: string
  isAuthenticated: boolean
  lang: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const isHindi = lang === 'hi'

  const handleJoin = async () => {
    if (!isAuthenticated) {
      const nextUrl = typeof window !== 'undefined' ? window.location.pathname : `/${lang}`
      router.push(`/${lang}/login?next=${encodeURIComponent(nextUrl)}`)
      return
    }

    setLoading(true)
    const res = await requestJoinOrganisation({ orgId })
    setLoading(false)

    if (res.success) {
      toast.success(
        policy === 'admin_approval'
          ? (isHindi ? 'सदस्यता अनुरोध सफलतापूर्वक भेजा गया' : 'Join request submitted')
          : (isHindi ? 'आप संगठन में शामिल हो गए हैं' : 'You joined the organisation')
      )
      router.refresh()
    } else {
      toast.error(res.error || (isHindi ? 'संगठन में शामिल होने में विफल' : 'Failed to join organisation'))
    }
  }

  if (policy === 'invite_only') return null

  return (
    <Button onClick={handleJoin} disabled={loading} className="w-full sm:w-auto">
      {loading
        ? (isHindi ? 'प्रक्रिया जारी...' : 'Processing...')
        : policy === 'admin_approval'
        ? (isHindi ? 'सदस्यता अनुरोध भेजें' : 'Request to Join')
        : (isHindi ? 'संगठन से जुड़ें' : 'Join Organisation')}
    </Button>
  )
}
