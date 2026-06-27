'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react'
import { TicketDialog } from './ticket-dialog'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface Ticket {
  id: string
  title: string
  description: string
  type: string
  priority: string
  status: string
  created_at: string | null
}

interface HelpdeskClientProps {
  orgType: string
  orgId: string
}

export function HelpdeskClient({ orgType, orgId }: HelpdeskClientProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  const config = {
    workers_union: {
      pageTitle: 'Grievance Tracker',
      pageDesc: 'Manage and track workplace disputes and contract violations.'
    },
    rwa: {
      pageTitle: 'Maintenance & Complaints',
      pageDesc: 'Manage community maintenance requests and resident complaints.'
    },
    student_union: {
      pageTitle: 'Student Support Desk',
      pageDesc: 'Track and resolve student inquiries and facility requests.'
    },
    ngo: {
      pageTitle: 'Operations Helpdesk',
      pageDesc: 'Track support requests and operational issues.'
    }
  }

  const currentConfig = config[orgType as keyof typeof config] || config.ngo

  useEffect(() => {
    async function fetchTickets() {
      const supabase = createClient()
      
      if (orgId) {
        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('organisation_id', orgId)
          .order('created_at', { ascending: false })
          
        if (!error && data) {
          setTickets(data as Ticket[])
        }
      }
      setLoading(false)
    }
    
    fetchTickets()
  }, [])

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4 text-orange-500" />
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />
      case 'resolved': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'closed': return <CheckCircle2 className="w-4 h-4 text-gray-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{currentConfig.pageTitle}</h1>
          <p className="text-muted-foreground mt-2">
            {currentConfig.pageDesc}
          </p>
        </div>
        <TicketDialog orgType={orgType} orgId={orgId} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>All tracked cases for your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No records found. Click the button above to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map(ticket => (
                <div key={ticket.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3 mb-3 sm:mb-0">
                    <div className="mt-1">
                      {getStatusIcon(ticket.status)}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-slate-900">{ticket.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="text-xs uppercase font-medium bg-slate-50">
                          {ticket.type}
                        </Badge>
                        <Badge variant="outline" className={`text-xs uppercase font-medium border-0 ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </Badge>
                        {ticket.created_at && (
                          <span className="text-xs text-muted-foreground ml-1">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <Badge variant="secondary" className="capitalize">
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                    
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      View <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
