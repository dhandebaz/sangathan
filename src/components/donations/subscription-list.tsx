'use client'

import { useState } from 'react'
import { Calendar, CreditCard } from 'lucide-react'
import { DonationSubscription } from '@/types/dashboard'
import { Badge } from '@/components/ui/badge'

export function SubscriptionList({ subscriptions }: { subscriptions: DonationSubscription[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b">
           <tr>
              <th className="py-3 px-4 font-medium text-gray-500">Next Payment</th>
              <th className="py-3 px-4 font-medium text-gray-500">Amount</th>
              <th className="py-3 px-4 font-medium text-gray-500">Frequency</th>
              <th className="py-3 px-4 font-medium text-gray-500">Status</th>
           </tr>
        </thead>
        <tbody className="divide-y">
           {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                 <td className="py-3 px-4 text-gray-600 whitespace-nowrap flex items-center gap-2">
                    <Calendar size={14} className="text-muted-foreground" />
                    {new Date(sub.next_payment_date).toLocaleDateString()}
                 </td>
                 <td className="py-3 px-4 font-bold text-gray-900">
                    {sub.currency === 'INR' ? '₹' : sub.currency}{sub.amount.toLocaleString()}
                 </td>
                 <td className="py-3 px-4 capitalize text-gray-600">
                    {sub.frequency}
                 </td>
                 <td className="py-3 px-4">
                    {sub.status === 'active' ? (
                       <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Active</Badge>
                    ) : sub.status === 'paused' ? (
                       <Badge variant="outline" className="text-yellow-800 border-yellow-200 bg-yellow-50">Paused</Badge>
                    ) : sub.status === 'past_due' ? (
                       <Badge variant="destructive">Past Due</Badge>
                    ) : (
                       <Badge variant="secondary">Cancelled</Badge>
                    )}
                 </td>
              </tr>
           ))}
           {subscriptions.length === 0 && (
              <tr>
                 <td colSpan={4} className="py-8 text-center text-gray-500">No recurring subscriptions found.</td>
              </tr>
           )}
        </tbody>
      </table>
    </div>
  )
}
