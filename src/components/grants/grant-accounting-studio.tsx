'use client'

import { useState } from 'react'
import { GrantMilestone, GrantExpense } from '@/types/dashboard'
import { createGrantMilestone, logGrantExpense, updateGrantMilestoneStatus } from '@/actions/grant-accounting'
import { Landmark, Plus, CheckCircle2, Calendar, FileText, ArrowRight, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

interface GrantAccountingStudioProps {
  grantId: string
  initialMilestones: GrantMilestone[]
  initialExpenses: GrantExpense[]
  isHindi: boolean
}

export function GrantAccountingStudio({
  grantId,
  initialMilestones,
  initialExpenses,
  isHindi,
}: GrantAccountingStudioProps) {
  const [milestones, setMilestones] = useState<GrantMilestone[]>(initialMilestones)
  const [expenses, setExpenses] = useState<GrantExpense[]>(initialExpenses)

  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Milestone Form
  const [milestoneTitle, setMilestoneTitle] = useState('')
  const [trancheAmount, setTrancheAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [deliverables, setDeliverables] = useState('')

  // Expense Form
  const [budgetLineItem, setBudgetLineItem] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0])
  const [vendorName, setVendorName] = useState('')
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('')
  const [notes, setNotes] = useState('')

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await createGrantMilestone({
        grant_id: grantId,
        title: milestoneTitle,
        tranche_amount: Number(trancheAmount),
        target_date: targetDate || undefined,
        deliverables: deliverables || undefined,
      })

      if (!res.error && res.data?.milestone) {
        setMilestones([...milestones, res.data.milestone])
        setIsMilestoneModalOpen(false)
        setMilestoneTitle('')
        setTrancheAmount('')
        setTargetDate('')
        setDeliverables('')
        toast.success(isHindi ? 'माइलस्टोन किश्त सफलतापूर्वक जोड़ी गई।' : 'Milestone tranche added successfully.')
      } else {
        toast.error(res.error || 'Failed to add milestone')
      }
    } catch {
      toast.error('An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await logGrantExpense({
        grant_id: grantId,
        milestone_id: selectedMilestoneId || undefined,
        budget_line_item: budgetLineItem,
        amount: Number(expenseAmount),
        expense_date: expenseDate,
        vendor_name: vendorName || undefined,
        notes: notes || undefined,
      })

      if (!res.error && res.data?.expense) {
        setExpenses([res.data.expense, ...expenses])
        setIsExpenseModalOpen(false)
        setBudgetLineItem('')
        setExpenseAmount('')
        setVendorName('')
        setNotes('')
        toast.success(isHindi ? 'व्यय प्रविष्टि दर्ज की गई।' : 'Expense line-item logged successfully.')
      } else {
        toast.error(res.error || 'Failed to log expense')
      }
    } catch {
      toast.error('An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (milestoneId: string, status: GrantMilestone['status']) => {
    try {
      const res = await updateGrantMilestoneStatus({
        milestone_id: milestoneId,
        status,
        disbursed_at: status === 'completed' || status === 'verified' ? new Date().toISOString().split('T')[0] : undefined,
      })

      if (!res.error && res.data?.success) {
        setMilestones(
          milestones.map((m) => (m.id === milestoneId ? { ...m, status } : m))
        )
        toast.success(isHindi ? 'माइलस्टोन स्थिति अपडेट हुई।' : 'Milestone status updated.')
      }
    } catch {
      toast.error('Failed to update status.')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Column 1: Milestones & Tranches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {isHindi ? '1. ग्रांट किश्तें एवं माइलस्टोन्स' : '1. Tranches & Milestones'}
          </h3>
          <button
            onClick={() => setIsMilestoneModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            {isHindi ? 'किश्त जोड़ें' : 'Add Tranche'}
          </button>
        </div>

        {milestones.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center text-xs text-slate-500">
            {isHindi ? 'कोई किश्त/माइलस्टोन नहीं है। फंडर किश्तों का विवरण यहाँ जोड़ें।' : 'No tranches defined yet. Add grant disbursement milestones.'}
          </div>
        ) : (
          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {m.target_date ? `${isHindi ? 'लक्ष्य तारीख: ' : 'Target: '} ${m.target_date}` : ''}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    ₹{Number(m.tranche_amount).toLocaleString('en-IN')}
                  </span>
                </div>

                {m.deliverables && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {m.deliverables}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border ${
                      m.status === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : m.status === 'completed'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {m.status}
                  </span>

                  <select
                    value={m.status}
                    onChange={(e) => handleStatusChange(m.id, e.target.value as any)}
                    className="text-xs rounded-lg border border-slate-300 px-2 py-1 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="verified">Verified by Funder</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Column 2: Line-Item Expenses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {isHindi ? '2. ग्रांट बजट व्यय प्रविष्टियां' : '2. Line-Item Spend Ledger'}
          </h3>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            {isHindi ? 'व्यय दर्ज करें' : 'Log Expense'}
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center text-xs text-slate-500">
            {isHindi ? 'कोई व्यय प्रविष्टि दर्ज नहीं है।' : 'No expenses logged against this grant yet.'}
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((e) => (
              <div
                key={e.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{e.budget_line_item}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>{e.expense_date}</span>
                    {e.vendor_name && <span>• {e.vendor_name}</span>}
                  </div>
                  {e.notes && <p className="text-[11px] text-slate-600 mt-1 italic">{e.notes}</p>}
                </div>
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                  ₹{Number(e.amount).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Tranche Modal */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {isHindi ? 'नई किश्त / माइलस्टोन जोड़ें' : 'Add Grant Tranche'}
            </h3>
            <form onSubmit={handleAddMilestone} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'किश्त का शीर्षक' : 'Tranche Title'}
                </label>
                <input
                  type="text"
                  required
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  placeholder="e.g. Tranche 1: Baseline Survey"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'किश्त राशि (₹)' : 'Tranche Amount (₹)'}
                </label>
                <input
                  type="number"
                  required
                  value={trancheAmount}
                  onChange={(e) => setTrancheAmount(e.target.value)}
                  placeholder="250000"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'लक्ष्य तारीख' : 'Target Date'}
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'अपेक्षित परिणाम (Deliverables)' : 'Deliverables'}
                </label>
                <textarea
                  rows={2}
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  placeholder="e.g. Survey report of 500 households submitted."
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700"
                >
                  {isHindi ? 'सहेजें' : 'Save Tranche'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {isHindi ? 'ग्रांट बजट व्यय प्रविष्टि' : 'Log Grant Line-Item Expense'}
            </h3>
            <form onSubmit={handleLogExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'बजट मद (Line Item Name)' : 'Budget Line Item'}
                </label>
                <input
                  type="text"
                  required
                  value={budgetLineItem}
                  onChange={(e) => setBudgetLineItem(e.target.value)}
                  placeholder="e.g. Field Survey Enumerators Stipend"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'राशि (₹)' : 'Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="15000"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'तारीख' : 'Expense Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'वेंडर / प्राप्तकर्ता' : 'Vendor / Recipient'}
                </label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. Regional Field Agency"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'संबद्ध किश्त / माइलस्टोन (वैकल्पिक)' : 'Linked Milestone (Optional)'}
                </label>
                <select
                  value={selectedMilestoneId}
                  onChange={(e) => setSelectedMilestoneId(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                >
                  <option value="">-- Unassigned --</option>
                  {milestones.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} (₹{Number(m.tranche_amount).toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'टिप्पणी' : 'Notes / Voucher Details'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Voucher #1024"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700"
                >
                  {isHindi ? 'सहेजें' : 'Log Line Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
