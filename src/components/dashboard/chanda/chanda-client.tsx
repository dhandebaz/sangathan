'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createChandaRound, markChandaCashPaid } from '@/actions/chanda'
import { toast } from 'sonner'
import { Plus, CheckCircle2, Clock, IndianRupee, Users, Percent } from 'lucide-react'
import { BillingPlan, MembershipDue } from '@/types/dashboard'

type ChandaDue = MembershipDue & {
  profiles?: { full_name?: string | null; email?: string | null } | null
  billing_plans?: { name?: string | null } | null
  members?: { full_name?: string | null; area?: string | null; phone?: string | null } | null
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const PURPOSES = [
  { value: 'chowkidari', label: 'Chowkidari (चौकीदारी)' },
  { value: 'safai', label: 'Safai (सफाई)' },
  { value: 'repair_fund', label: 'Repair Fund (मरम्मत)' },
  { value: 'festival', label: 'Festival Fund (त्योहार)' },
  { value: 'other', label: 'Other' },
]

export default function ChandaClient({
  plans,
  dues,
}: {
  plans: BillingPlan[]
  dues: ChandaDue[]
  lang: string
}) {
  const [openNewRound, setOpenNewRound] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  // Form state
  const [purpose, setPurpose] = useState('chowkidari')
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()])
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [amount, setAmount] = useState('100')

  // Filter to only chanda rounds (plans with [CHANDA] or specific purpose names)
  const chandaPlans = plans.filter(p =>
    p.name.includes('[CHANDA]') || p.name.includes('Chanda')
  )

  const latestPlan = chandaPlans[0]

  // Filter dues for current round
  const currentDues = latestPlan
    ? dues.filter(d => d.plan_id === latestPlan.id)
    : []

  const pastDues = latestPlan
    ? dues.filter(d => d.plan_id !== latestPlan.id)
    : dues

  // Stats
  const totalHouses = currentDues.length
  const paidCount = currentDues.filter(d => d.status === 'paid').length
  const pendingCount = totalHouses - paidCount
  const collectedAmount = currentDues
    .filter(d => d.status === 'paid')
    .reduce((sum, d) => sum + d.amount, 0)
  const pendingAmount = currentDues
    .filter(d => d.status !== 'paid')
    .reduce((sum, d) => sum + d.amount, 0)
  const collectionRate = totalHouses > 0 ? Math.round((paidCount / totalHouses) * 100) : 0

  const handleCreateRound = async () => {
    setCreating(true)
    try {
      const res = await createChandaRound({
        month,
        year: month,
        amount_per_house: Number(amount),
        purpose,
      })
      if (res?.success) {
        toast.success('Collection Round Created', {
          description: `${purpose} chanda for ${month} ${year} — ₹${amount}/house × ${res.count || 0} houses`,
        })
        setOpenNewRound(false)
      } else {
        toast.error('Failed', { description: res?.error || 'Could not create round' })
      }
    } catch {
      toast.error('Error creating collection round')
    }
    setCreating(false)
  }

  const handleMarkPaid = async (dueId: string) => {
    setLoadingId(dueId)
    try {
      const res = await markChandaCashPaid({ due_id: dueId })
      if (res?.success) {
        toast.success('Marked as Paid (Cash)')
      } else {
        toast.error('Failed', { description: res?.error || 'Could not mark paid' })
      }
    } catch {
      toast.error('Error marking payment')
    }
    setLoadingId(null)
  }

  // Group dues by area/gali
  const groupedDues = currentDues.reduce<Record<string, ChandaDue[]>>((acc, due) => {
    const area = due.members?.area || due.profiles?.full_name?.charAt(0)?.toUpperCase() || 'Other'
    if (!acc[area]) acc[area] = []
    acc[area].push(due)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-5 h-5 mx-auto text-slate-400 mb-1" />
            <p className="text-2xl font-bold text-foreground">{totalHouses}</p>
            <p className="text-xs text-muted-foreground">Total Houses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <IndianRupee className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
            <p className="text-2xl font-bold text-emerald-600">₹{collectedAmount.toLocaleString('en-IN')}</p>
            <p className="text-xs text-muted-foreground">Collected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-5 h-5 mx-auto text-amber-500 mb-1" />
            <p className="text-2xl font-bold text-amber-600">₹{pendingAmount.toLocaleString('en-IN')}</p>
            <p className="text-xs text-muted-foreground">Pending ({pendingCount})</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Percent className="w-5 h-5 mx-auto text-sky-500 mb-1" />
            <p className="text-2xl font-bold text-sky-600">{collectionRate}%</p>
            <p className="text-xs text-muted-foreground">Collection Rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="current">
              Current Round {latestPlan ? `(${latestPlan.name.replace('[CHANDA] ', '')})` : ''}
            </TabsTrigger>
            <TabsTrigger value="past">Past Rounds ({chandaPlans.length > 1 ? chandaPlans.length - 1 : 0})</TabsTrigger>
          </TabsList>

          <Dialog open={openNewRound} onOpenChange={setOpenNewRound}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" /> New Collection Round
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start New Chanda Collection Round</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Purpose</Label>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PURPOSES.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select value={month} onValueChange={setMonth}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {MONTHS.map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input type="number" value={year} onChange={e => setYear(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Amount per House (₹)</Label>
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100" />
                </div>
                <Button className="w-full" onClick={handleCreateRound} disabled={creating}>
                  {creating ? 'Creating...' : 'Generate Collection for All Members'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="current" className="space-y-6">
          {totalHouses === 0 ? (
            <Card className="p-8 text-center text-slate-500 border-dashed border-2">
              <p className="text-lg font-medium mb-2">No active collection round</p>
              <p className="text-sm">Start a new chanda collection round to generate entries for all members.</p>
            </Card>
          ) : (
            Object.entries(groupedDues).map(([area, areaDues]) => (
              <div key={area}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {area} ({areaDues.length} houses)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {areaDues.map(due => {
                    const isPaid = due.status === 'paid'
                    const name = due.members?.full_name || due.profiles?.full_name || 'Unknown'
                    return (
                      <Card
                        key={due.id}
                        className={`transition-all ${isPaid ? 'bg-emerald-50/50 border-emerald-200' : 'hover:border-sky-300'}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground truncate">{name}</p>
                              {due.members?.area && (
                                <p className="text-xs text-muted-foreground mt-0.5">{due.members.area}</p>
                              )}
                              <p className="text-sm font-bold mt-1">₹{due.amount}</p>
                            </div>
                            <div>
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-sm">
                                  <CheckCircle2 className="w-3 h-3" /> Paid
                                </span>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-7"
                                  onClick={() => handleMarkPaid(due.id)}
                                  disabled={loadingId === due.id}
                                >
                                  {loadingId === due.id ? '...' : '✓ Cash Paid'}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {chandaPlans.length <= 1 ? (
            <Card className="p-8 text-center text-slate-500">
              No past collection rounds yet.
            </Card>
          ) : (
            <div className="bg-white rounded-sm border overflow-hidden">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-900 border-b">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Round</th>
                    <th className="px-6 py-3 font-semibold">Amount</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {chandaPlans.slice(1).map(plan => {
                    const roundDues = dues.filter(d => d.plan_id === plan.id)
                    const paid = roundDues.filter(d => d.status === 'paid').length
                    const total = roundDues.length
                    return (
                      <tr key={plan.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 font-medium text-slate-900">{plan.name.replace('[CHANDA] ', '')}</td>
                        <td className="px-6 py-3">₹{plan.amount}/house</td>
                        <td className="px-6 py-3">{paid}/{total} collected</td>
                        <td className="px-6 py-3 text-slate-500">{new Date(plan.created_at).toLocaleDateString()}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
