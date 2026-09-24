import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { splitGst, invoiceNoFor, sellerInfo } from '@/lib/billing/invoices'

export const dynamic = 'force-dynamic'

const ADMIN_ROLES = ['admin', 'second_admin', 'executive']

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ lang: string; txId: string }>
}) {
  const { lang, txId } = await params
  const isHindi = lang === 'hi'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${lang}/login`)

  const admin = createServiceClient()
  const { data: tx } = await admin
    .from('billing_transactions')
    .select('*')
    .eq('id', txId)
    .maybeSingle()
  if (!tx) notFound()

  // Caller must be an admin of the billed org.
  const { data: membership } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .eq('organisation_id', tx.organisation_id)
    .maybeSingle()
  if (!membership || !ADMIN_ROLES.includes((membership.role as string) || '')) {
    redirect(`/${lang}/dashboard/billing`)
  }

  const { data: org } = await admin
    .from('organisations')
    .select('name, address, registration_state, contact_email')
    .eq('id', tx.organisation_id)
    .maybeSingle()

  const seller = sellerInfo()
  const buyerState = (org?.registration_state as string) || ''
  const split = splitGst(Number(tx.amount) || 0, buyerState)
  const invoiceNo = invoiceNoFor(tx.created_at, tx.id)
  const isInterState = split.igst > 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/${lang}/dashboard/billing`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {isHindi ? 'बिलिंग पर वापस' : 'Back to billing'}
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
        >
          <Printer className="h-4 w-4" />
          {isHindi ? 'प्रिंट / PDF' : 'Print / PDF'}
        </button>
      </div>

      <div className="rounded-xl border border-slate-300 bg-white p-8 shadow-sm print:border-none print:shadow-none sm:p-10">
        <div className="flex items-start justify-between border-b-4 border-double border-slate-900 pb-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              {isHindi ? 'कर चालान' : 'Tax Invoice'}
            </p>
            <h1 className="mt-1 text-2xl font-black text-slate-900">{seller.name}</h1>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-600">{seller.address}</p>
            <p className="mt-1 text-xs text-slate-600">
              GSTIN: {seller.gstin || (isHindi ? 'प्रतीक्षित — support@sangathan.space' : 'Awaited — support@sangathan.space')}
            </p>
          </div>
          <div className="text-right text-xs text-slate-600">
            <p className="font-extrabold text-slate-900">{invoiceNo}</p>
            <p>Date: {new Date(tx.created_at).toLocaleDateString('en-IN')}</p>
            <p className="mt-1 font-mono text-[11px]">{tx.razorpay_payment_id || tx.razorpay_order_id || ''}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              {isHindi ? 'खरीदार' : 'Billed To'}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">{org?.name || 'Organisation'}</p>
            {org?.address ? <p className="text-xs text-slate-600">{org.address as string}</p> : null}
            {org?.contact_email ? <p className="text-xs text-slate-600">{org.contact_email as string}</p> : null}
          </div>
          <div className="sm:text-right">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">SAC</p>
            <p className="mt-1 font-mono text-sm font-bold text-slate-900">9983</p>
            <p className="text-[11px] text-slate-500">Information Technology Services · 18% GST</p>
          </div>
        </div>

        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="border border-slate-200 px-3 py-2 font-extrabold text-slate-900">Description</th>
              <th className="border border-slate-200 px-3 py-2 text-right font-extrabold text-slate-900">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 px-3 py-2 text-slate-700">
                {tx.plan_name} ({tx.plan_period}) — Sangathan civic infrastructure
              </td>
              <td className="border border-slate-200 px-3 py-2 text-right font-mono">
                {split.subtotal.toFixed(2)}
              </td>
            </tr>
            {isInterState ? (
              <tr>
                <td className="border border-slate-200 px-3 py-2 text-slate-700">IGST @ 18%</td>
                <td className="border border-slate-200 px-3 py-2 text-right font-mono">{split.igst.toFixed(2)}</td>
              </tr>
            ) : (
              <>
                <tr>
                  <td className="border border-slate-200 px-3 py-2 text-slate-700">CGST @ 9%</td>
                  <td className="border border-slate-200 px-3 py-2 text-right font-mono">{split.cgst.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-3 py-2 text-slate-700">SGST @ 9%</td>
                  <td className="border border-slate-200 px-3 py-2 text-right font-mono">{split.sgst.toFixed(2)}</td>
                </tr>
              </>
            )}
            <tr className="bg-slate-50">
              <td className="border border-slate-200 px-3 py-2 font-extrabold text-slate-900">Total (incl. GST)</td>
              <td className="border border-slate-200 px-3 py-2 text-right font-mono font-extrabold text-slate-900">
                ₹{split.total.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-5 text-[11px] leading-relaxed text-slate-500">
          {isHindi
            ? 'यह सिस्टम-जनित चालान है। प्रश्नों के लिए support@sangathan.space पर लिखें।'
            : 'System-generated invoice. For questions, write to support@sangathan.space.'}
        </p>
      </div>
    </div>
  )
}
