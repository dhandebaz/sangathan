import { Metadata } from 'next'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { getDomesticStaffList } from '@/actions/domestic-staff'
import { UserCheck, ShieldCheck, UserX, Plus, QrCode } from 'lucide-react'
import { DomesticStaffManager } from '@/components/rwa/domestic-staff-manager'

export const metadata: Metadata = {
  title: 'Domestic Staff & Gate Passes | Sangathan',
  description: 'Manage domestic help, drivers, security, verified passes and flat unit associations for RWAs.',
}

export default async function DomesticStaffPage(props: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const isHindi = lang === 'hi'
  const orgId = await getSelectedOrganisationId()

  let staff: any[] = []
  if (orgId) {
    const res = await getDomesticStaffList(orgId)
    if (res.success) staff = res.staff
  }

  const activeCount = staff.filter(s => s.status === 'active').length
  const verifiedCount = staff.filter(s => s.police_verified).length
  const barredCount = staff.filter(s => s.status === 'barred').length

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 shadow-2xs">
                <UserCheck className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {isHindi ? 'घरेलू सहायक एवं गेट पास रजिस्टर (Domestic Staff)' : 'Domestic Staff & Gate Passes'}
              </h1>
            </div>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
              {isHindi
                ? 'हाउस हेल्प, ड्राइवर, सुरक्षा गार्ड और सफाई कर्मियों का पुलिस सत्यापन, फ्लैट आवंटन और डिजिटल पास कोड प्रबंधित करें।'
                : 'Manage verified staff directory, digital entry passcodes, flat allocations, and police verification for your RWA.'}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'सक्रिय सहायक (Active Staff)' : 'Active Staff'}
            </span>
            <UserCheck className="w-4 h-4 text-sky-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{activeCount}</p>
          <p className="mt-1 text-xs text-slate-500">{isHindi ? 'सोसायटी गेट पास सक्रिय' : 'With valid gate pass'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'सत्यापित (Police Verified)' : 'Police Verified'}
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{verifiedCount}</p>
          <p className="mt-1 text-xs text-slate-500">{isHindi ? 'दस्तावेज व पुलिस जांच पूर्ण' : 'Background check certified'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'प्रतिबंधित / निलंबित' : 'Barred / Suspended'}
            </span>
            <UserX className="w-4 h-4 text-rose-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{barredCount}</p>
          <p className="mt-1 text-xs text-slate-500">{isHindi ? 'गेट प्रवेश निषेध' : 'Entry restricted at gates'}</p>
        </div>
      </div>

      {/* Main Interactive Manager */}
      <DomesticStaffManager initialStaff={staff} isHindi={isHindi} orgId={orgId || ''} />
    </div>
  )
}
