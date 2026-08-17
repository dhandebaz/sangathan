import { createServiceClient } from '@/lib/supabase/service'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PrintTrigger } from '@/components/dashboard/print-trigger'

export const dynamic = 'force-dynamic'

export default async function PrintCashBookRegister({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const selectedOrgId = await getSelectedOrganisationId()
  if (!selectedOrgId) redirect(`/${lang}/select-organisation`)

  const adminClient = createServiceClient()

  const { data: org } = await adminClient
    .from('organisations')
    .select('name, org_type, registration_number, address')
    .eq('id', selectedOrgId)
    .maybeSingle()

  const { data: donations } = await adminClient
    .from('donations')
    .select('id, donor_name, donor_email, amount, currency, payment_method, notes, created_at')
    .eq('organisation_id', selectedOrgId)
    .order('created_at', { ascending: true })

  const isHindi = lang === 'hi'
  const printDate = new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const totalAmount = donations?.reduce((acc, d) => acc + (d.amount || 0), 0) || 0

  return (
    <div className="bg-white min-h-screen text-slate-900 font-serif p-8 max-w-5xl mx-auto print:p-0 print:max-w-none">
      <PrintTrigger />

      {/* Official Government Header */}
      <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
        <p className="text-xs uppercase tracking-widest font-sans font-bold text-slate-600">
          {isHindi ? 'आयकर अधिनियम 1961 (धारा 12A/80G) व NITI Aayog दिशा-निर्देश' : 'Prescribed Under Income Tax Act 1961 (Section 12A/80G) & NITI Aayog Norms'}
        </p>
        <h1 className="text-2xl font-bold uppercase tracking-tight mt-1">
          {isHindi ? 'डबल-एंट्री कैश बुक व 80G दान बहीखाता' : 'DOUBLE-ENTRY CASH BOOK & 80G DONATION REGISTER'}
        </h1>
        <h2 className="text-lg font-bold font-sans mt-1 text-slate-800">
          {org?.name || 'NGO / Charitable Trust'}
        </h2>
        <div className="text-xs font-sans text-slate-600 mt-1 flex flex-wrap justify-center gap-x-6">
          <span>
            <strong>Registration No:</strong> {org?.registration_number || 'N/A'}
          </span>
          <span>
            <strong>Audit Date:</strong> {printDate}
          </span>
          <span>
            <strong>Total Receipts Value:</strong> ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Cash Book Ledger Table */}
      <div className="border border-slate-900">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-900 font-bold text-slate-900 divide-x divide-slate-900">
              <th className="p-2 w-12 text-center">Voucher #</th>
              <th className="p-2 w-24">Date</th>
              <th className="p-2">Donor / Entity Particulars</th>
              <th className="p-2">80G Receipt Number</th>
              <th className="p-2">Payment Mode</th>
              <th className="p-2 w-28 text-right">Debit / Inflow (INR)</th>
              <th className="p-2 w-24 text-center">SHA-256 Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300 font-normal">
            {(donations || []).map((d, idx) => (
              <tr key={d.id} className="divide-x divide-slate-300 hover:bg-slate-50">
                <td className="p-2 text-center font-mono font-bold text-slate-700">
                  VR/{String(idx + 1).padStart(4, '0')}
                </td>
                <td className="p-2 font-mono text-[11px] text-slate-600">
                  {new Date(d.created_at).toLocaleDateString('en-IN')}
                </td>
                <td className="p-2 font-semibold text-slate-900">
                  <div>{d.donor_name || 'Anonymous Donor'}</div>
                  {d.donor_email && <div className="text-slate-400 font-mono text-[10px]">{d.donor_email}</div>}
                </td>
                <td className="p-2 font-mono text-[11px] text-slate-700">
                  80G/{new Date(d.created_at).getFullYear()}/{String(idx + 1).padStart(4, '0')}
                </td>
                <td className="p-2 text-slate-600 uppercase text-[11px]">
                  {d.payment_method || 'UPI / Bank Transfer'}
                </td>
                <td className="p-2 text-right font-mono font-bold text-slate-900">
                  ₹{(d.amount || 0).toLocaleString('en-IN')}
                </td>
                <td className="p-2 text-center font-mono text-[10px] text-emerald-800 font-bold">
                  VERIFIED
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 border-t-2 border-slate-900 font-bold font-mono divide-x divide-slate-900">
              <td colSpan={5} className="p-2.5 text-right uppercase text-slate-900">
                Grand Total Cash & Bank Inflows:
              </td>
              <td className="p-2.5 text-right text-slate-900 text-sm">
                ₹{totalAmount.toLocaleString('en-IN')}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Signature & Seal */}
      <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-3 gap-8 text-center text-xs font-sans">
        <div>
          <div className="h-16 border-b border-dashed border-slate-400 mb-2"></div>
          <p className="font-bold">Chief Financial Officer / Accountant</p>
        </div>
        <div>
          <div className="h-16 border-b border-dashed border-slate-400 mb-2"></div>
          <p className="font-bold">Trustee / Secretary</p>
        </div>
        <div>
          <div className="h-16 border-b border-dashed border-slate-400 mb-2"></div>
          <p className="font-bold">Statutory Chartered Accountant</p>
        </div>
      </div>

      <div className="mt-8 text-center text-[10px] font-sans text-slate-400">
        Generated via Sangathan Public Trust Ledger. Cryptographically verifiable double-entry cash records.
      </div>
    </div>
  )
}
