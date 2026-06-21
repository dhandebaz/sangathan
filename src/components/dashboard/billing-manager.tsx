'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Invoice, Unit } from '@/types/dashboard'
import { Badge } from '@/components/ui/badge'

interface BillingManagerProps {
  invoices: Invoice[]
  units: Unit[]
  isAdminOrEditor: boolean
}

export function BillingManager({ invoices, units, isAdminOrEditor }: BillingManagerProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-primary/5 border-primary/10">
           <CardContent className="p-5">
             <div className="text-sm text-primary font-medium uppercase tracking-wide">Total Pending</div>
             <div className="text-3xl font-bold text-primary mt-1">
               ₹{invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
             </div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-5">
             <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total Overdue</div>
             <div className="text-3xl font-bold text-red-600 mt-1">
               ₹{invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
             </div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-5">
             <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total Units</div>
             <div className="text-3xl font-bold text-foreground mt-1">{units.length}</div>
           </CardContent>
         </Card>
      </div>

      <div className="content-card rounded-lg overflow-hidden border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
             <tr>
                <th className="py-3 px-4 font-medium text-gray-500">Unit</th>
                <th className="py-3 px-4 font-medium text-gray-500">Type</th>
                <th className="py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="py-3 px-4 font-medium text-gray-500">Due Date</th>
                <th className="py-3 px-4 font-medium text-gray-500">Status</th>
             </tr>
          </thead>
          <tbody className="divide-y">
             {invoices.map((invoice) => {
                const unit = units.find(u => u.id === invoice.unit_id)
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                     <td className="py-3 px-4 font-medium text-gray-900">
                        {unit ? `${unit.block_building ? unit.block_building + '-' : ''}${unit.unit_number}` : 'Unknown Unit'}
                     </td>
                     <td className="py-3 px-4 capitalize text-gray-600">
                        {invoice.type.replace('_', ' ')}
                     </td>
                     <td className="py-3 px-4 font-bold">
                        ₹{invoice.amount.toLocaleString()}
                     </td>
                     <td className="py-3 px-4 text-gray-600">
                        {new Date(invoice.due_date).toLocaleDateString()}
                     </td>
                     <td className="py-3 px-4">
                        {invoice.status === 'paid' ? (
                           <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Paid</Badge>
                        ) : invoice.status === 'pending' ? (
                           <Badge variant="outline" className="text-yellow-800 border-yellow-200 bg-yellow-50">Pending</Badge>
                        ) : invoice.status === 'overdue' ? (
                           <Badge variant="destructive">Overdue</Badge>
                        ) : (
                           <Badge variant="secondary" className="capitalize">{invoice.status.replace('_', ' ')}</Badge>
                        )}
                     </td>
                  </tr>
                )
             })}
             {invoices.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-8 text-center text-gray-500">No invoices generated yet.</td>
                </tr>
             )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
