'use client'

import { useState } from 'react'
import { Check, Trash2, Receipt } from 'lucide-react'
import { verifyDonation, deleteDonation, generateTaxReceipt } from '@/actions/donations/actions'
import { useRouter } from 'next/navigation'

interface Donation {
  id: string
  donor_name: string
  amount: number
  date: string
  upi_reference: string | null
  verified_by: string | null
  notes: string | null
  donor_id?: string | null
  tax_receipt_issued?: boolean | null
}

export function DonationList({ donations }: { donations: Donation[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleVerify = async (id: string) => {
    setLoading(id)
    await verifyDonation({ donationId: id })
    router.refresh()
    setLoading(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this donation record?')) return
    setLoading(id)
    await deleteDonation({ donationId: id })
    router.refresh()
    setLoading(null)
  }

  const handleGenerateReceipt = async (donation: Donation) => {
    if (!donation.donor_id) {
        alert('Cannot generate receipt: Donor ID is missing. Please ensure the donation is linked to a donor profile.');
        return;
    }
    setLoading(`receipt-${donation.id}`)
    
    const financialYear = new Date(donation.date).getMonth() < 3 
        ? `${new Date(donation.date).getFullYear() - 1}-${new Date(donation.date).getFullYear()}`
        : `${new Date(donation.date).getFullYear()}-${new Date(donation.date).getFullYear() + 1}`;

    const res = await generateTaxReceipt({
        donationId: donation.id,
        donor_id: donation.donor_id,
        receipt_number: `TR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        financial_year: financialYear
    })
    
    if (res?.error) {
        alert(res.error)
    } else if (res?.success) {
        alert('Tax receipt generated successfully!')
    }
    
    router.refresh()
    setLoading(null)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b">
           <tr>
              <th className="py-3 px-4 font-medium text-gray-500">Date</th>
              <th className="py-3 px-4 font-medium text-gray-500">Donor</th>
              <th className="py-3 px-4 font-medium text-gray-500">Amount</th>
              <th className="py-3 px-4 font-medium text-gray-500">UPI / Ref</th>
              <th className="py-3 px-4 font-medium text-gray-500">Status</th>
              <th className="py-3 px-4 font-medium text-gray-500 text-right">Actions</th>
           </tr>
        </thead>
        <tbody className="divide-y">
           {donations.map((donation) => (
              <tr key={donation.id} className="hover:bg-gray-50">
                 <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                    {new Date(donation.date).toLocaleDateString()}
                 </td>
                 <td className="py-3 px-4 font-medium">
                    {donation.donor_name}
                    {donation.notes && <div className="text-xs text-gray-400 font-normal">{donation.notes}</div>}
                 </td>
                 <td className="py-3 px-4 font-bold text-gray-900">
                    ₹{donation.amount.toLocaleString()}
                 </td>
                 <td className="py-3 px-4 font-mono text-xs text-gray-600">
                    {donation.upi_reference || '-'}
                 </td>
                 <td className="py-3 px-4">
                    {donation.verified_by ? (
                       <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Verified
                       </span>
                    ) : (
                       <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                       </span>
                    )}
                 </td>
                 <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {!donation.verified_by && (
                          <button 
                             onClick={() => handleVerify(donation.id)}
                             disabled={loading === donation.id}
                             className="text-green-600 hover:bg-green-50 p-1.5 rounded disabled:opacity-50"
                             title="Verify Payment"
                          >
                             <Check size={16} />
                          </button>
                       )}
                       {donation.verified_by && !donation.tax_receipt_issued && (
                          <button 
                             onClick={() => handleGenerateReceipt(donation)}
                             disabled={loading === `receipt-${donation.id}`}
                             className="text-blue-600 hover:bg-blue-50 p-1.5 rounded disabled:opacity-50"
                             title="Generate Tax Receipt (80G)"
                          >
                             <Receipt size={16} />
                          </button>
                       )}
                       {donation.verified_by && donation.tax_receipt_issued && (
                          <span className="text-xs text-green-600 font-medium px-2">Receipt Issued</span>
                       )}
                       <button 
                          onClick={() => handleDelete(donation.id)}
                          disabled={loading === donation.id}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded disabled:opacity-50"
                          title="Delete Record"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </td>
              </tr>
           ))}
           {donations.length === 0 && (
              <tr>
                 <td colSpan={6} className="py-8 text-center text-gray-500">No donations recorded yet.</td>
              </tr>
           )}
        </tbody>
      </table>
    </div>
  )
}
