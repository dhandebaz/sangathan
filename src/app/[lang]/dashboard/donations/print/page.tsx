import { createClient } from '@/lib/supabase/server'
import { getUserContext } from '@/lib/auth/context'
import { Donation, Organisation } from '@/types/dashboard'
import { PrintLayout } from '@/components/print/print-layout'

export const dynamic = 'force-dynamic'

export default async function PrintDonationLedger() {
  const supabase = await createClient()
  const ctx = await getUserContext()
  
  const { data } = await supabase
    .from('donations')
    .select('*')
    .order('date', { ascending: false })
  
  const donations = data as Donation[] | null

  const { data: orgData } = await supabase
    .from('organisations')
    .select('name, whitelabel_enabled')
    .eq('id', ctx.organizationId)
    .single()
  
  const org = orgData as (Organisation & { whitelabel_enabled?: boolean }) | null

  const totalAmount = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0

  const meta = (
    <div className="flex gap-8 mt-2 text-sm">
       <p><strong>Total Collected:</strong> ₹{totalAmount.toLocaleString()}</p>
       <p><strong>Transactions:</strong> {donations?.length}</p>
    </div>
  )

  return (
    <PrintLayout
      title="Donation Ledger"
      orgName={org?.name || 'Organisation'}
      meta={meta}
      whitelabelEnabled={org?.whitelabel_enabled ?? false}
    >
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
              <tr key={i} className="border-b border-border">
                 <td className="py-2 px-2 whitespace-nowrap">{new Date(d.date).toLocaleDateString()}</td>
                 <td className="py-2 px-2 font-medium">{d.donor_name}</td>
                 <td className="py-2 px-2 text-right">₹{d.amount.toLocaleString()}</td>
                 <td className="py-2 px-2 text-center uppercase text-xs">{d.payment_method}</td>
                 <td className="py-2 px-2 text-xs font-mono text-muted-foreground max-w-xs truncate">
                    {d.upi_reference} {d.notes ? `(${d.notes})` : ''}
                 </td>
                 <td className="py-2 px-2 text-center">
                    {d.verified_by ? '✓' : '-'}
                 </td>
              </tr>
           ))}
        </tbody>
      </table>
    </PrintLayout>
  )
}
