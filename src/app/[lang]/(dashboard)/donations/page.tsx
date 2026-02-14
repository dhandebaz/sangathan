import { createClient } from '@/lib/supabase/server'
import { LogDonationDialog } from '@/components/donations/log-donation-dialog'
import { DonationList } from '@/components/donations/donation-list'
import { Printer } from 'lucide-react'
import { Donation } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    q?: string
    status?: string
    page?: string
  }>
}

export default async function DonationsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.q || ''
  const status = params.status || 'all'
  
  const supabase = await createClient()

  let dbQuery = supabase
    .from('donations')
    .select('*')
    .order('date', { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`donor_name.ilike.%${query}%,upi_reference.ilike.%${query}%`)
  }

  // Filter by status (verified_by is not null = verified)
  if (status === 'verified') {
    dbQuery = dbQuery.not('verified_by', 'is', null)
  } else if (status === 'pending') {
    dbQuery = dbQuery.is('verified_by', null)
  }

  const { data, error } = await dbQuery
  
  const donations = data as Donation[] | null

  if (error) {
    return <div className="p-4 text-red-500">Error loading donations</div>
  }

  // Calculate Total
  const totalAmount = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
           <p className="text-gray-500 mt-1">Track manual payments and contributions.</p>
        </div>
        <div className="flex gap-2">
            <a 
               href="/dashboard/donations/print" 
               target="_blank"
               className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50"
            >
               <Printer size={16} />
               Export Ledger
            </a>
            <LogDonationDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         <div className="content-card rounded-lg p-4 bg-orange-50 border-orange-100">
            <div className="text-sm text-orange-800 font-medium uppercase tracking-wide">Total Collected</div>
            <div className="text-3xl font-bold text-orange-900 mt-1">₹{totalAmount.toLocaleString()}</div>
         </div>
         <div className="content-card rounded-lg p-4">
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Transactions</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">{donations?.length || 0}</div>
         </div>
         <div className="content-card rounded-lg p-4">
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Pending Verification</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">
               {donations?.filter(d => !d.verified_by).length || 0}
            </div>
         </div>
      </div>

      <div className="content-card rounded-lg p-0 overflow-hidden">
         <DonationList donations={donations || []} />
      </div>
    </div>
  )
}
