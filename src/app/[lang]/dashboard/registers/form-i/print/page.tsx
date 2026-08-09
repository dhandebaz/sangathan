import { createServiceClient } from '@/lib/supabase/service'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PrintTrigger } from '@/components/dashboard/print-trigger'

export const dynamic = 'force-dynamic'

export default async function PrintFormIRegister({
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
    .single()

  const { data: members } = await adminClient
    .from('members')
    .select('id, full_name, phone, email, designation, area, joining_date, status, role')
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
          {isHindi ? 'सोसाइटी पंजीकरण अधिनियम 1860 / राज्य अपार्टमेंट स्वामित्व अधिनियम' : 'Prescribed Under Societies Registration Act 1860 / State Apartment Acts'}
        </p>
        <h1 className="text-2xl font-bold uppercase tracking-tight mt-1">
          {isHindi ? 'फॉर्म I: वैधानिक सदस्यता रजिस्टर' : 'FORM I: STATUTORY REGISTER OF MEMBERS'}
        </h1>
        <h2 className="text-lg font-bold font-sans mt-1 text-slate-800">
          {org?.name || 'Organisation'}
        </h2>
        <div className="text-xs font-sans text-slate-600 mt-1 flex flex-wrap justify-center gap-x-6">
          <span>
            <strong>Registration No:</strong> {org?.registration_number || 'N/A'}
          </span>
          <span>
            <strong>Generated On:</strong> {printDate}
          </span>
          <span>
            <strong>Total Members Enrolled:</strong> {members?.length || 0}
          </span>
        </div>
      </div>

      {/* Member Table */}
      <div className="border border-slate-900">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-900 font-bold text-slate-900 divide-x divide-slate-900">
              <th className="p-2 w-12 text-center">Sr. No.</th>
              <th className="p-2">Full Name & Particulars</th>
              <th className="p-2">Contact Details</th>
              <th className="p-2">Designation / Role</th>
              <th className="p-2">Unit / Flat / Area</th>
              <th className="p-2 w-24">Date of Admission</th>
              <th className="p-2 w-20 text-center">Voting Status</th>
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
                <td className="p-2 text-slate-600 font-mono text-[11px]">
                  <div>{m.phone}</div>
                  {m.email && <div className="text-slate-400">{m.email}</div>}
                </td>
                <td className="p-2 text-slate-700 font-medium">
                  {m.designation || m.role}
                </td>
                <td className="p-2 text-slate-600">
                  {m.area || '-'}
                </td>
                <td className="p-2 text-slate-600 font-mono text-[11px]">
                  {m.joining_date ? new Date(m.joining_date).toLocaleDateString('en-IN') : '-'}
                </td>
                <td className="p-2 text-center font-bold text-[11px]">
                  <span className={m.status === 'active' ? 'text-emerald-800' : 'text-slate-400'}>
                    {m.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Statutory Attestation Footer */}
      <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-3 gap-8 text-center text-xs font-sans">
        <div>
          <div className="h-16 border-b border-dashed border-slate-400 mb-2"></div>
          <p className="font-bold">Prepared by (Staff / Coordinator)</p>
        </div>
        <div>
          <div className="h-16 border-b border-dashed border-slate-400 mb-2"></div>
          <p className="font-bold">Verified by General Secretary</p>
        </div>
        <div>
          <div className="h-16 border-b border-dashed border-slate-400 mb-2"></div>
          <p className="font-bold">President / Authorized Signatory</p>
        </div>
      </div>

      <div className="mt-8 text-center text-[10px] font-sans text-slate-400">
        Certified authentic digital extract generated by Sangathan Civic Infrastructure (SHA-256 Audit Trail).
      </div>
    </div>
  )
}
