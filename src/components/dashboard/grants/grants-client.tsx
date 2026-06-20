'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { FileText, Calendar, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

interface Grant {
  id: string
  title: string
  amount: number
  status: string
  deadline: string | null
  created_at: string | null
}

interface GrantsClientProps {
  orgId: string
}

export function GrantsClient({ orgId }: GrantsClientProps) {
  const [grants, setGrants] = useState<Grant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGrants() {
      const supabase = createClient()
      
      if (orgId) {
        const { data, error } = await supabase
          .from('grants')
          .select('*')
          .eq('organisation_id', orgId)
          .order('created_at', { ascending: false })
          
        if (!error && data) {
          setGrants(data as Grant[])
        }
      }
      setLoading(false)
    }
    
    fetchGrants()
  }, [])

  function getStatusIcon(status: string) {
    switch (status) {
      case 'draft': return <FileText className="w-4 h-4 text-gray-500" />
      case 'applied': return <Clock className="w-4 h-4 text-blue-500" />
      case 'approved': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-purple-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grants Management</h1>
          <p className="text-muted-foreground mt-2">
            Track grant applications, compliance deadlines, and funds received.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grant Pipeline</CardTitle>
          <CardDescription>Your current funding applications and active grants.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : grants.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No grants found. Start a new application to track it here.
            </div>
          ) : (
            <div className="space-y-4">
              {grants.map(grant => (
                <div key={grant.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3 mb-3 sm:mb-0">
                    <div className="mt-1">
                      {getStatusIcon(grant.status)}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-slate-900">{grant.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1.5">
                        <div className="flex items-center text-xs font-medium text-slate-700 gap-1">
                          <DollarSign className="w-3 h-3" />
                          {grant.amount.toLocaleString()}
                        </div>
                        {grant.deadline && (
                          <div className="flex items-center text-xs text-muted-foreground gap-1">
                            Deadline: {new Date(grant.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <Badge variant="secondary" className="capitalize">
                      {grant.status}
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
