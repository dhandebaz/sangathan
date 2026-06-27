'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { FileText, Calendar, DollarSign, Clock, CheckCircle2, AlertCircle, Plus, MoreVertical } from 'lucide-react'
import { createGrant, updateGrantStatus } from '@/actions/grants'
import { toast } from 'sonner'

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
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [form, setForm] = useState({ title: '', amount: '', status: 'draft', deadline: '' })
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
      case 'submitted': return <Clock className="w-4 h-4 text-blue-500" />
      case 'awarded': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const handleCreate = async () => {
    try {
      await createGrant({
        title: form.title,
        amount: Number(form.amount),
        status: form.status as any,
        deadline: form.deadline || undefined
      })
      toast.success('Success')
      setIsUploadOpen(false)
      window.location.reload()
    } catch (e: any) {
      toast.error('Error')
    }
  }

  const handleStatusChange = async (grantId: string, status: any) => {
    try {
      await updateGrantStatus({ grant_id: grantId, status })
      toast.success('Status Updated', { description: 'Grant status updated successfully.'  })
      setGrants(gs => gs.map(g => g.id === grantId ? { ...g, status } : g))
    } catch (e: any) {
      toast.error('Error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Grants Management</h1>
          <p className="text-muted-foreground mt-2">
            Track grant applications, compliance deadlines, and funds received.
          </p>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Track New Grant</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Track Grant Application</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Grant Title</Label>
                <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Clean Water Initiative 2026" />
              </div>
              <div className="space-y-2">
                <Label>Expected Amount (₹)</Label>
                <Input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="50000" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm({...form, status: v})}>
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Drafting</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="awarded">Awarded</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Deadline / Decision Date</Label>
                  <Input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
                </div>
              </div>
              <Button className="w-full" onClick={handleCreate}>Save Grant</Button>
            </div>
          </DialogContent>
        </Dialog>
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
                    <Badge variant={grant.status === 'awarded' ? 'default' : 'secondary'} className="capitalize">
                      {grant.status}
                    </Badge>
                    <Select value={grant.status} onValueChange={(val) => handleStatusChange(grant.id, val)}>
                      <SelectTrigger className="w-[110px] h-8 bg-transparent border-0 shadow-none hover:bg-accent hover:text-accent-foreground focus:ring-0">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="awarded">Awarded</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
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
