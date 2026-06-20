'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface TicketDialogProps {
  orgType: string
  orgId: string
}

export function TicketDialog({ orgType, orgId }: TicketDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [priority, setPriority] = useState('medium')

  // Dynamic config based on orgType
  const config = {
    workers_union: {
      dialogTitle: 'File a Grievance',
      dialogDesc: 'Submit a formal grievance or dispute for tracking.',
      types: ['Workplace Dispute', 'Harassment', 'Contract Violation', 'Other']
    },
    rwa: {
      dialogTitle: 'Report an Issue',
      dialogDesc: 'Log a maintenance request or community complaint.',
      types: ['Plumbing', 'Electrical', 'Security', 'Noise Complaint', 'Other']
    },
    student_union: {
      dialogTitle: 'Create Support Ticket',
      dialogDesc: 'Request help from the student union or university admin.',
      types: ['Academic Issue', 'Facility Request', 'General Inquiry', 'Other']
    },
    ngo: {
      dialogTitle: 'Create Support Ticket',
      dialogDesc: 'Log a request for volunteers or beneficiaries.',
      types: ['Volunteer Issue', 'Beneficiary Request', 'General Support', 'Other']
    }
  }

  const currentConfig = config[orgType as keyof typeof config] || config.ngo

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    try {
      const supabase = createClient()
      
      if (!orgId) throw new Error('No organisation selected')
      
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase.from('tickets').insert({
        title,
        description,
        type,
        priority,
        status: 'open',
        organisation_id: orgId,
        created_by: user?.id
      })
      
      if (error) throw error
      
      setOpen(false)
      setTitle('')
      setDescription('')
      setType('')
      setPriority('medium')
      router.refresh()
    } catch (err) {
      console.error('Error creating ticket:', err)
      alert('Failed to create ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {currentConfig.dialogTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{currentConfig.dialogTitle}</DialogTitle>
          <DialogDescription>
            {currentConfig.dialogDesc}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary..." 
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Category</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {currentConfig.types.map(t => (
                    <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Details</Label>
            <Textarea 
              id="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more context..." 
              className="min-h-[100px]"
              required 
            />
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading || !title || !type || !description}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
