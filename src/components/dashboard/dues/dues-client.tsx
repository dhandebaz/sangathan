'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, CheckCircle, Receipt, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createBillingPlan, generateDuesForMembers, markDueAsPaid } from '@/actions/dues'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BillingPlan, MembershipDue } from '@/types/dashboard'

export default function DuesClient({ 
  plans, 
  dues, 
  lang 
}: { 
  plans: BillingPlan[], 
  dues: any[], 
  lang: string 
}) {
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false)
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  
  const [planForm, setPlanForm] = useState({ name: '', amount: '', frequency: 'monthly' })
  const [generateForm, setGenerateForm] = useState({ plan_id: '', due_date: '', notes: '' })

  const handleCreatePlan = async () => {
    try {
      await createBillingPlan({
        name: planForm.name,
        amount: Number(planForm.amount),
        frequency: planForm.frequency as any
      })
      toast({ title: 'Plan Created', description: 'Billing plan created successfully.' })
      setIsPlanDialogOpen(false)
      setPlanForm({ name: '', amount: '', frequency: 'monthly' })
    } catch (e: any) {
      toast.error()
    }
  }

  const handleGenerateDues = async () => {
    try {
      const res = await generateDuesForMembers({
        plan_id: generateForm.plan_id,
        due_date: generateForm.due_date,
        notes: generateForm.notes
      })
      toast({ title: 'Dues Generated', description: `Generated dues for ${res.count} members.` })
      setIsGenerateDialogOpen(false)
      setGenerateForm({ plan_id: '', due_date: '', notes: '' })
    } catch (e: any) {
      toast.error()
    }
  }

  const handleMarkPaid = async (dueId: string) => {
    try {
      await markDueAsPaid({ due_id: dueId })
      toast({ title: 'Payment Recorded', description: 'Due marked as paid.' })
    } catch (e: any) {
      toast.error()
    }
  }

  return (
    <Tabs defaultValue="dues" className="w-full">
      <div className="flex justify-between items-center mb-6">
        <TabsList>
          <TabsTrigger value="dues">Dues Collection</TabsTrigger>
          <TabsTrigger value="plans">Billing Plans</TabsTrigger>
        </TabsList>

        <div className="flex gap-2">
          <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> New Plan</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Billing Plan</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Plan Name</Label>
                  <Input value={planForm.name} onChange={e => setPlanForm({...planForm, name: e.target.value})} placeholder="e.g. Standard Monthly Dues" />
                </div>
                <div className="space-y-2">
                  <Label>Amount (INR)</Label>
                  <Input type="number" value={planForm.amount} onChange={e => setPlanForm({...planForm, amount: e.target.value})} placeholder="500" />
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={planForm.frequency} onValueChange={v => setPlanForm({...planForm, frequency: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="one_time">One Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleCreatePlan}>Create Plan</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button><Receipt className="w-4 h-4 mr-2" /> Generate Dues</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Generate Dues for Active Members</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Billing Plan</Label>
                  <Select value={generateForm.plan_id} onValueChange={v => setGenerateForm({...generateForm, plan_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Select a plan" /></SelectTrigger>
                    <SelectContent>
                      {plans.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name} - ₹{p.amount}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" value={generateForm.due_date} onChange={e => setGenerateForm({...generateForm, due_date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Input value={generateForm.notes} onChange={e => setGenerateForm({...generateForm, notes: e.target.value})} placeholder="e.g. May 2026 Dues" />
                </div>
                <Button className="w-full" onClick={handleGenerateDues}>Generate Invoices</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TabsContent value="dues" className="space-y-4">
        {dues.length === 0 ? (
          <Card className="p-8 text-center text-slate-500">
            No dues found. Generate dues to start collecting.
          </Card>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-900 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Member</th>
                  <th className="px-6 py-4 font-semibold">Plan / Notes</th>
                  <th className="px-6 py-4 font-semibold">Due Date</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dues.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{d.profiles?.full_name}</div>
                      <div className="text-xs text-slate-500">{d.profiles?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{d.billing_plans?.name || 'Manual'}</div>
                      {d.notes && <div className="text-xs text-slate-500">{d.notes}</div>}
                    </td>
                    <td className="px-6 py-4">{new Date(d.due_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium">₹{d.amount}</td>
                    <td className="px-6 py-4">
                      {d.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <CheckCircle className="w-3.5 h-3.5" /> Paid
                        </span>
                      ) : d.status === 'overdue' ? (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                          <AlertCircle className="w-3.5 h-3.5" /> Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {d.status !== 'paid' && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkPaid(d.id)}>
                          Mark Paid
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TabsContent>

      <TabsContent value="plans" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <Card key={p.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{p.name}</h3>
                  <p className="text-sm text-slate-500 capitalize">{p.frequency}</p>
                </div>
                <div className="text-lg font-bold text-slate-900">₹{p.amount}</div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm">
                <span className={`w-2 h-2 rounded-full ${p.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                {p.is_active ? 'Active' : 'Inactive'}
              </div>
            </Card>
          ))}
          {plans.length === 0 && (
            <div className="col-span-3 text-center py-8 text-slate-500 border-2 border-dashed rounded-xl">
              No billing plans configured.
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
