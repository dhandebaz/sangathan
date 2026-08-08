'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { submitSupportTicket } from '@/actions/helpdesk/submit'
import { toast } from 'sonner'

interface TicketDialogProps {
  orgType: string
  orgId: string
}

export function TicketDialog({ orgType, orgId }: TicketDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    try {
      const supabase = createClient()
      if (!orgId) throw new Error('No organisation selected')
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      const res = await submitSupportTicket(message, orgId, user.id)
      
      if (!res.success) {
        throw new Error(res.error || 'Failed to submit')
      }
      
      toast.success('Your ticket has been sent to our platform support team.')

      setOpen(false)
      setMessage('')
      router.refresh()
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create ticket'
      console.error('Error creating ticket:', err)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4" />
          Contact Support
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Platform Support
          </DialogTitle>
          <DialogDescription>
            Report a bug, request a feature, or ask for help. We will route your request to the right team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="message">How can we help you?</Label>
            <Textarea 
              id="message" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. The login button isn't working... or I would love a dark mode..." 
              className="min-h-[120px]"
              required 
            />
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading || !message.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
