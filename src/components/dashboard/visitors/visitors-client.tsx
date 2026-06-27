'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { UserCheck, Clock, CheckCircle2, LogOut, Ban, Check, LogOut as LogOutIcon } from 'lucide-react'
import { LogVisitorDialog } from './log-visitor-dialog'
import { checkInVisitor, checkOutVisitor } from '@/actions/visitors'
import { useRouter } from 'next/navigation'

interface Visitor {
  id: string
  name: string
  phone: string | null
  purpose: string
  expected_time: string | null
  status: string
  created_at: string | null
}

interface VisitorsClientProps {
  orgId: string
}

export function VisitorsClient({ orgId }: VisitorsClientProps) {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchVisitors() {
      const supabase = createClient()
      
      if (orgId) {
        const { data, error } = await supabase
          .from('visitors')
          .select('*')
          .eq('organisation_id', orgId)
          .order('created_at', { ascending: false })
          
        if (!error && data) {
          setVisitors(data as Visitor[])
        }
      }
      setLoading(false)
    }
    
    fetchVisitors()
  }, [])

  function getStatusIcon(status: string) {
    switch (status) {
      case 'expected': return <Clock className="w-4 h-4 text-blue-500" />
      case 'checked_in': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'checked_out': return <LogOut className="w-4 h-4 text-gray-500" />
      case 'denied': return <Ban className="w-4 h-4 text-red-500" />
      default: return <UserCheck className="w-4 h-4 text-gray-500" />
    }
  }

  const handleCheckIn = async (id: string) => {
    setActionLoading(`in-${id}`)
    await checkInVisitor({ visitor_id: id })
    
    // Optimistic UI update
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'checked_in' } : v))
    setActionLoading(null)
    router.refresh()
  }

  const handleCheckOut = async (id: string) => {
    setActionLoading(`out-${id}`)
    await checkOutVisitor({ visitor_id: id })
    
    // Optimistic UI update
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'checked_out' } : v))
    setActionLoading(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Visitor Management</h1>
          <p className="text-muted-foreground mt-2">
            Track expected guests, gate passes, and current visitors on premises.
          </p>
        </div>
        <LogVisitorDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gate Logs</CardTitle>
          <CardDescription>Recent visitor logs and expected arrivals.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : visitors.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No visitors logged for today.
            </div>
          ) : (
            <div className="space-y-4">
              {visitors.map(visitor => (
                <div key={visitor.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3 mb-3 sm:mb-0">
                    <div className="mt-1">
                      {getStatusIcon(visitor.status)}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-slate-900">{visitor.name}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1.5">
                        <div className="flex items-center text-xs font-medium text-slate-700 gap-1">
                          Purpose: {visitor.purpose}
                        </div>
                        {visitor.expected_time && (
                          <div className="flex items-center text-xs text-muted-foreground gap-1">
                            Expected: {new Date(visitor.expected_time).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    {visitor.status === 'expected' && (
                       <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleCheckIn(visitor.id)}
                          disabled={actionLoading === `in-${visitor.id}`}
                       >
                          <Check className="w-3.5 h-3.5" />
                          Check In
                       </Button>
                    )}
                    {visitor.status === 'checked_in' && (
                       <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 gap-1 text-gray-600 hover:bg-gray-50"
                          onClick={() => handleCheckOut(visitor.id)}
                          disabled={actionLoading === `out-${visitor.id}`}
                       >
                          <LogOutIcon className="w-3.5 h-3.5" />
                          Check Out
                       </Button>
                    )}
                    <Badge variant="secondary" className="capitalize">
                      {visitor.status.replace('_', ' ')}
                    </Badge>
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
