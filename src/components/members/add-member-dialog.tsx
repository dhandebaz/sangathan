'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2 } from 'lucide-react'
import { addMember } from '@/actions/members/actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function AddMemberDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
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
      toast.success('Member added successfully')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to add member')
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Enter the details of the new member here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              name="full_name"
              required
              placeholder="e.g. John Doe"
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              name="phone"
              required
              type="tel"
              placeholder="e.g. +91 9876543210"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                name="designation"
                placeholder="e.g. Member"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                name="area"
                placeholder="e.g. Mumbai"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. john@example.com"
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="joining_date">Joining Date</Label>
            <Input
              id="joining_date"
              name="joining_date"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[100px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Member'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
