'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { logDonation } from '@/actions/donations/actions'
import { useRouter } from 'next/navigation'

export function LogDonationDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError('')

    const result = await logDonation({
      donor_name: formData.get('donor_name') as string,
      amount: Number(formData.get('amount')),
      date: (formData.get('date') as string) || new Date().toISOString(),
      payment_method: formData.get('payment_method') as 'cash' | 'upi' | 'bank_transfer' | 'other',
      upi_reference: (formData.get('upi_reference') as string) || undefined,
      notes: (formData.get('notes') as string) || undefined,
    })

    if (result.success) {
      setIsOpen(false)
      router.refresh()
    } else {
      setError(result.error || 'Failed to log donation')
    }
    setLoading(false)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
      >
        <Plus size={16} />
        Log Donation
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
           <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Log Manual Donation</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">{error}</div>}

        <form action={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-sm font-medium mb-1">Donor Name *</label>
              <input name="donor_name" required className="w-full border rounded p-2" />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium mb-1">Amount (₹) *</label>
                 <input name="amount" type="number" required min="1" className="w-full border rounded p-2" />
              </div>
              <div>
                 <label className="block text-sm font-medium mb-1">Date</label>
                 <input name="date" type="datetime-local" defaultValue={new Date().toISOString().slice(0,16)} className="w-full border rounded p-2" />
              </div>
           </div>

           <div>
              <label className="block text-sm font-medium mb-1">Payment Method *</label>
              <select name="payment_method" className="w-full border rounded p-2 bg-white">
                 <option value="cash">Cash</option>
                 <option value="upi">UPI</option>
                 <option value="bank_transfer">Bank Transfer</option>
                 <option value="other">Other</option>
              </select>
           </div>

           <div>
              <label className="block text-sm font-medium mb-1">UPI Reference / Transaction ID</label>
              <input name="upi_reference" className="w-full border rounded p-2 font-mono text-sm" placeholder="Optional" />
           </div>

           <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea name="notes" rows={2} className="w-full border rounded p-2" placeholder="Phone number or details..." />
           </div>

           <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
           >
              {loading ? 'Saving...' : 'Save Record'}
           </button>
        </form>
      </div>
    </div>
  )
}
