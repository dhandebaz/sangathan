'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { rsvpToEvent } from '@/actions/events'
import { useRouter } from 'next/navigation'

export function RSVPButton({ event, isAuthenticated }: { event: any, isAuthenticated: boolean }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const router = useRouter()

  const handleRSVP = async () => {
    setLoading(true)
    const res = await rsvpToEvent({
      event_id: event.id,
      guest_name: !isAuthenticated ? guestName : undefined,
      guest_email: !isAuthenticated ? guestEmail : undefined
    })
    setLoading(false)

    if (res.success) {
      setOpen(false)
      router.refresh()
    } else {
      alert(res.error)
    }
  }

  if (!isAuthenticated && event.event_type !== 'public') {
    return (
      <Button onClick={() => router.push(`/login?next=${window.location.pathname}`)}>
        Login to RSVP
      </Button>
    )
  }

  if (isAuthenticated) {
    return (
      <Button onClick={handleRSVP} disabled={loading} size="lg" className="w-full sm:w-auto">
        {loading ? 'Registering...' : 'RSVP Now'}
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">RSVP Now</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Event Registration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="john@example.com" type="email" />
          </div>
          <Button onClick={handleRSVP} disabled={loading || !guestName || !guestEmail} className="w-full">
            {loading ? 'Registering...' : 'Confirm Registration'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
