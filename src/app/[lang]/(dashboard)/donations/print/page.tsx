import { createClient } from '@/lib/supabase/server'
import { getUserContext } from '@/lib/auth/context'

export const dynamic = 'force-dynamic'

export default async function PrintDonationLedger() {
  const supabase = await createClient()
  const ctx = await getUserContext()
  
  const { data } = await supabase
    .from('donations')
    .select('*')
    .order('date', { ascending: false })
  
  const donations = data as any[]

  const { data: orgData } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', ctx.organizationId)
    .single()
  
  const org = orgData as any

  const totalAmount = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0

  return (
    <div className="p-8 bg-white min-h-screen text-black">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-1">{org?.name}</h2>
        <h1 className="text-3xl font-bold">Donation Ledger</h1>
        <div className="flex gap-8 mt-2 text-sm">
           <p><strong>Total Collected:</strong> ₹{totalAmount.toLocaleString()}</p>
           <p><strong>Transactions:</strong> {donations?.length}</p>
        </div>
      </div>

      <table className="w-full text-left text-sm border-collapse">
        <thead>
           <tr className="border-b border-black">
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2">Donor</th>
              <th className="py-2 px-2 text-right">Amount</th>
              <th className="py-2 px-2 text-center">Method</th>
              <th className="py-2 px-2">Ref/Notes</th>
              <th className="py-2 px-2 text-center">Verified</th>
           </tr>
        </thead>
        <tbody>
           {donations?.map((d, i) => (
              <tr key={i} className="border-b border-gray-100">
                 <td className="py-2 px-2 whitespace-nowrap">{new Date(d.date).toLocaleDateString()}</td>
                 <td className="py-2 px-2 font-medium">{d.donor_name}</td>
                 <td className="py-2 px-2 text-right">₹{d.amount.toLocaleString()}</td>
                 <td className="py-2 px-2 text-center uppercase text-xs">{d.payment_method}</td>
                 <td className="py-2 px-2 text-xs font-mono text-gray-600 max-w-xs truncate">
                    {d.upi_reference} {d.notes ? `(${d.notes})` : ''}
                 </td>
                 <td className="py-2 px-2 text-center">
                    {d.verified_by ? '✓' : '-'}
                 </td>
              </tr>
           ))}
        </tbody>
      </table>

      <div className="mt-12 pt-4 border-t text-xs text-center text-gray-400">
        Generated on {new Date().toLocaleDateString()} via Sangathan Platform
      </div>

      <style>{`
        @media print {
          @page { margin: 1cm; }
          body { -webkit-print-color-adjust: exact; }
        }
      `}</style>
      
      <script dangerouslySetInnerHTML={{__html: `window.print();`}} />
    </div>
  )
}
