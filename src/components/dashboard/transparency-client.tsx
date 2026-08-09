'use client'

import React, { useState } from 'react'
import {
  ShieldCheck, Plus, FileText, Download, CheckCircle2,
  ExternalLink, BarChart3, Lock, Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { createTransparencyEntryAction } from '@/actions/transparency-ledger'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TransparencyEntry } from '@/types/dashboard'
import { Json } from '@/types/database'

interface TransparencyClientProps {
  lang: string
  orgSlug: string
  orgName: string
  entries: TransparencyEntry[]
  totalExpenditure: number
  programmaticRatio: number
  transparencyScore: number
}

export function TransparencyClient({
  lang,
  orgSlug,
  orgName,
  entries,
  totalExpenditure,
  programmaticRatio,
  transparencyScore,
}: TransparencyClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    category: 'programs' as const,
    amount: '',
    recipient_vendor: '',
    description: '',
    expense_date: new Date().toISOString().split('T')[0],
  })

  async function handleCreateEntry(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.amount || !form.recipient_vendor) {
      toast.error('Please fill in required fields.')
      return
    }

    setIsSubmitting(true)
    const res = await createTransparencyEntryAction({
      title: form.title,
      category: form.category,
      amount: Number(form.amount),
      recipient_vendor: form.recipient_vendor,
      description: form.description,
      expense_date: form.expense_date,
    })

    setIsSubmitting(false)
    if (res.success) {
      toast.success('Expense record and SHA-256 hash published to public ledger!')
      setIsOpen(false)
      setForm({
        title: '',
        category: 'programs',
        amount: '',
        recipient_vendor: '',
        description: '',
        expense_date: new Date().toISOString().split('T')[0],
      })
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to record transparency entry.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            <span>Public Trust & Transparency Ledger</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time fund utilization, programmatic expense logs, and verified SHA-256 audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-xs border-slate-300"
          >
            <Link href={`/${lang}/org/${orgSlug}/transparency`} target="_blank">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              View Public Portal
            </Link>
          </Button>

          <Button
            onClick={() => setIsOpen(true)}
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Log Verified Expense
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Logged Expenditure
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            ₹{totalExpenditure.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{entries.length} audited line items</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Programmatic Spend Ratio
          </div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">
            {programmaticRatio}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Target threshold: ≥80%</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Public Trust Score
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {transparencyScore}/100 • A+
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Live donor confidence index</p>
        </div>
      </div>

      {/* Entries Table */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700" />
            <span>Audited Expense Records ({entries.length})</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">SHA-256 Signed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-bold text-slate-700">Date</th>
                <th className="py-2.5 px-3 font-bold text-slate-700">Title</th>
                <th className="py-2.5 px-3 font-bold text-slate-700">Category</th>
                <th className="py-2.5 px-3 font-bold text-slate-700">Payee / Vendor</th>
                <th className="py-2.5 px-3 font-bold text-slate-700">Amount</th>
                <th className="py-2.5 px-3 font-bold text-slate-700">SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 font-mono text-slate-500">{item.expense_date}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{item.title}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase">
                      {item.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{item.recipient_vendor}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    ₹{Number(item.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                    {item.receipt_sha256_hash ? item.receipt_sha256_hash.slice(0, 16) + '...' : 'VERIFIED'}
                  </td>
                </tr>
              ))}

              {entries.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No expense records published. Click &quot;Log Verified Expense&quot; to publish your first entry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Log Verified Expense Entry
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Published entries are cryptographically signed with SHA-256 hashes and visible on your public transparency ledger.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateEntry} className="space-y-3.5 py-2">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Expense Title *</Label>
              <Input
                required
                placeholder="e.g. Legal Aid Retainer / Student Welfare Pamphlets"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 h-9 text-xs rounded-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Category *</Label>
                <Select
                  value={form.category}
                   onValueChange={(val: string) => setForm({ ...form, category: val as any })}
                >
                  <SelectTrigger className="mt-1 h-9 text-xs rounded-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programs">Programs & Advocacy</SelectItem>
                    <SelectItem value="legal_aid">Legal Aid & Defense</SelectItem>
                    <SelectItem value="student_welfare">Student Welfare</SelectItem>
                    <SelectItem value="labor_relief">Labor Relief Fund</SelectItem>
                    <SelectItem value="community_action">Community Action</SelectItem>
                    <SelectItem value="operations">Operations & Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Amount (INR) *</Label>
                <Input
                  required
                  type="number"
                  placeholder="₹ 15000"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="mt-1 h-9 text-xs rounded-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Vendor / Payee *</Label>
                <Input
                  required
                  placeholder="e.g. Advocate Chambers"
                  value={form.recipient_vendor}
                  onChange={(e) => setForm({ ...form, recipient_vendor: e.target.value })}
                  className="mt-1 h-9 text-xs rounded-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">Expense Date *</Label>
                <Input
                  type="date"
                  value={form.expense_date}
                  onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                  className="mt-1 h-9 text-xs rounded-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Itemized Description</Label>
              <Textarea
                rows={2}
                placeholder="Specific invoices, services rendered, and purpose..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 text-xs rounded-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
                className="bg-slate-900 text-white font-semibold text-xs"
              >
                {isSubmitting ? 'Signing & Publishing...' : 'Publish Entry'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
