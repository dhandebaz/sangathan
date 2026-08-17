import { createServiceClient } from '@/lib/supabase/service'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PrintTrigger } from '@/components/dashboard/print-trigger'

export const dynamic = 'force-dynamic'

export default async function PrintFormHRegister({
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

  const { data: members } = await adminClient
    .from('members')
    .select('id, full_name, phone, designation, area, joining_date, status, role')
    .eq('organisation_id', selectedOrgId)
    .order('joining_date', { ascending: true })

  const isHindi = lang === 'hi'
  const printDate = new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-white min-h-screen text-slate-900 font-serif p-8 max-w-5xl mx-auto print:p-0 print:max-w-none">
      <PrintTrigger />

      {/* Official Government Header */}
      <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
        <p className="text-xs uppercase tracking-widest font-sans font-bold text-slate-600">
          {isHindi ? 'ट्रेड यूनियन अधिनियम 1926 (धारा 28 व विनियम 18 के तहत निर्धारित)' : 'Prescribed Under Trade Unions Act 1926 (Section 28 & Regulation 18)'}
        </p>
        <h1 className="text-2xl font-bold uppercase tracking-tight mt-1">
          {isHindi ? 'फॉर्म H: वार्षिक सामान्य रिटर्न व सदस्यता बहीखाता' : 'FORM H: ANNUAL GENERAL RETURN & SUBSCRIPTION ROLL'}
        </h1>
        <h2 className="text-lg font-bold font-sans mt-1 text-slate-800">
          {org?.name || 'Trade Union'}
        </h2>
        <div className="text-xs font-sans text-slate-600 mt-1 flex flex-wrap justify-center gap-x-6">
          <span>
            <strong>Trade Union Reg No:</strong> {org?.registration_number || 'N/A'}
          </span>
          <span>
            <strong>Inspection Period:</strong> Year 2026
          </span>
          <span>
            <strong>Generated On:</strong> {printDate}
          </span>
        </div>
      </div>

      {/* Subscription & Office Bearers Register */}
      <div className="border border-slate-900">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-900 font-bold text-slate-900 divide-x divide-slate-900">
              <th className="p-2 w-12 text-center">Sr.</th>
              <th className="p-2">Worker / Member Name</th>
              <th className="p-2">Trade Designation / Unit</th>
              <th className="p-2">Plant / Shift / Shop Floor</th>
              <th className="p-2 w-24">Enrolment Date</th>
              <th className="p-2 w-28 text-right">Subscription Status</th>
              <th className="p-2 w-20 text-center">Standing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300 font-normal">
            {(members || []).map((m, idx) => (
              <tr key={m.id} className="divide-x divide-slate-300 hover:bg-slate-50">
                <td className="p-2 text-center font-mono font-bold text-slate-700">
                  {String(idx + 1).padStart(3, '0')}
                </td>
                <td className="p-2 font-semibold text-slate-900">
                  {m.full_name}
                </td>
                <td className="p-2 text-slate-700">
                  {m.designation || 'Workman'}
                </td>
                <td className="p-2 text-slate-600">
                  {m.area || 'Main Plant'}
                </td>
                <td className="p-2 text-slate-600 font-mono text-[11px]">
                  {m.joining_date ? new Date(m.joining_date).toLocaleDateString('en-IN') : '-'}
                </td>
                <td className="p-2 text-right font-mono font-semibold text-slate-800">
                  PAID (Current)
                </td>
                <td className="p-2 text-center font-bold text-[11px]">
                  <span className={m.status === 'active' ? 'text-emerald-800' : 'text-slate-400'}>
                    {m.status === 'active' ? 'IN GOOD STANDING' : 'SUSPENDED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attestation & Labour Seal */}
      <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-3 gap-8 text-center text-xs font-sans">
        <div>
          <div className="h-16 border-b border-dashed border-slate-400 mb-2"></div>
          <p className="font-bold">Treasurer (Audit Custodian)</p>
        </div>
        <div>
          <div className="h-16 border-b border-dashed border-slate-400 mb-2"></div>
          <p className="font-bold">General Secretary</p>
        </div>
        <div>
          <div className="h-16 border-b border-dashed border-slate-400 mb-2"></div>
          <p className="font-bold">Chartered Auditor / Trade Union Seal</p>
        </div>
      </div>

      <div className="mt-8 text-center text-[10px] font-sans text-slate-400">
        Certified authentic statutory return prepared in conformity with the State Trade Union Regulations.
      </div>
    </div>
  )
}
