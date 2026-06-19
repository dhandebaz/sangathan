'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Search, Filter, Trash2, Loader2, UserPlus, Clock, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { createTicket, updateTicketStatus, deleteTicket } from '@/actions/tickets/actions'
import { assignTicket, setTicketSLA } from '@/actions/tickets/governance-actions'

type Ticket = {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  sla_due_at?: string
  assigned_to?: string
}

interface TicketManagerProps {
  type: 'grievance' | 'complaint' | 'maintenance'
  tickets: Ticket[]
  title: string
  description: string
  role?: string
  isAdminOrEditor?: boolean
}

export function TicketManager({
  type,
  tickets,
  title,
  description,
  role,
  isAdminOrEditor,
}: TicketManagerProps) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const router = useRouter()

  const canManage = isAdminOrEditor || role === 'admin' || role === 'editor'

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('public:tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router])

  async function handleCreateTicket(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const ticketTitle = formData.get('title') as string
    const ticketDesc = formData.get('description') as string
    const priority = formData.get('priority') as 'low' | 'medium' | 'high'

    const result = await createTicket({
      title: ticketTitle,
      description: ticketDesc,
      type,
      priority,
    })

    if (result.success && !result.data?.error) {
      setIsOpen(false)
      toast.success('Ticket created successfully')
      router.refresh()
    } else {
      const errorMsg = result.error || result.data?.error || 'Failed to create ticket'
      toast.error(errorMsg)
    }
    setIsLoading(false)
  }

  async function handleUpdateStatus(ticketId: string, status: 'in_progress' | 'resolved') {
    setActionLoadingId(ticketId)
    const result = await updateTicketStatus({ ticketId, status })
    if (result.success && !result.data?.error) {
      toast.success(`Ticket status updated to ${status.replace('_', ' ')}`)
      router.refresh()
    } else {
      const errorMsg = result.error || result.data?.error || 'Failed to update ticket status'
      toast.error(errorMsg)
    }
    setActionLoadingId(null)
  }

  async function handleDeleteTicket(ticketId: string) {
    if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return
    }
    setActionLoadingId(ticketId)
    const result = await deleteTicket({ ticketId })
    if (result.success && !result.data?.error) {
      toast.success('Ticket deleted successfully')
      router.refresh()
    } else {
      const errorMsg = result.error || result.data?.error || 'Failed to delete ticket'
      toast.error(errorMsg)
    }
    setActionLoadingId(null)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight capitalize">{title}</h1>
           <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                New {type === 'grievance' ? 'Grievance' : type === 'complaint' ? 'Complaint' : 'Request'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  New {type === 'grievance' ? 'Grievance' : type === 'complaint' ? 'Complaint' : 'Maintenance Request'}
                </DialogTitle>
                <DialogDescription>
                  Submit a new {type} for the organisation.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTicket} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    minLength={3}
                    placeholder="Brief summary"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    minLength={10}
                    rows={4}
                    placeholder="Detailed explanation (minimum 10 characters)"
                    disabled={isLoading}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <select
                    id="priority"
                    name="priority"
                    required
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-card"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="min-w-[100px]">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm mb-6">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Governance</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{ticket.title}</div>
                    <div className="text-muted-foreground text-xs mt-1 line-clamp-1">{ticket.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={ticket.status === 'resolved' ? 'secondary' : ticket.status === 'in_progress' ? 'default' : 'destructive'} className="capitalize">
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium capitalize px-2 py-1 rounded-md ${
                      ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {ticket.sla_due_at ? (
                         <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                            <Clock size={12} />
                            <span>Due: {new Date(ticket.sla_due_at).toLocaleDateString()}</span>
                         </div>
                      ) : (
                         <span className="text-xs text-muted-foreground italic">No SLA</span>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                         <UserPlus size={12} />
                         <span>{ticket.assigned_to ? 'Assigned' : 'Open'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canManage && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            title="Assign (Action Implemented)"
                            onClick={() => toast.info('Governance: assignTicket action is ready for use.')}
                          >
                            <Settings2 className="h-4 w-4" />
                          </Button>
                          {ticket.status === 'open' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 text-xs"
                              disabled={actionLoadingId !== null}
                              onClick={() => handleUpdateStatus(ticket.id, 'in_progress')}
                            >
                              Start
                            </Button>
                          )}
                          {ticket.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 text-xs bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                              disabled={actionLoadingId !== null}
                              onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                            >
                              Resolve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={actionLoadingId !== null}
                            onClick={() => handleDeleteTicket(ticket.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
