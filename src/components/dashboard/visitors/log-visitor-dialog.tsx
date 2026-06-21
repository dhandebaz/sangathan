'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from 'lucide-react'
import { preApproveVisitor } from '@/actions/visitors'
import { useRouter } from 'next/navigation'

export function LogVisitorDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    // Convert to ISO string
    const dateInput = formData.get('expected_arrival') as string
    let expected_arrival = new Date().toISOString()
    if (dateInput) {
      expected_arrival = new Date(dateInput).toISOString()
    }

    const res = await preApproveVisitor({
      visitor_name: formData.get('visitor_name') as string,
      purpose: formData.get('purpose') as string,
      expected_arrival: expected_arrival,
      unit_number: formData.get('unit_number') as string,
    })

    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else if (res?.success) {
      setOpen(false)
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus size={16} />
          Pre-Approve Visitor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pre-Approve Visitor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
          
          <div className="space-y-2">
            <Label htmlFor="visitor_name">Visitor Name</Label>
            <Input id="visitor_name" name="visitor_name" required minLength={2} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Visit</Label>
            <Input id="purpose" name="purpose" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expected_arrival">Expected Arrival Time</Label>
            <Input id="expected_arrival" name="expected_arrival" type="datetime-local" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit_number">Target Unit (Optional)</Label>
            <Input id="unit_number" name="unit_number" placeholder="e.g. A-101" />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Approve Visitor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
