import { Metadata } from 'next'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { getVolunteerCertificates } from '@/actions/volunteer-certificates'
import { Award, ShieldCheck, Clock, Users } from 'lucide-react'
import { CertificatesManager } from '@/components/volunteers/certificates-manager'

export const metadata: Metadata = {
  title: 'Volunteer Recognition & Verified Certificates | Sangathan',
  description: 'Issue cryptographic, QR-verifiable service certificates recognized for civil society and non-profit volunteer hours.',
}

export default async function VolunteerCertificatesPage(props: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const isHindi = lang === 'hi'
  const orgId = await getSelectedOrganisationId()

  let certificates: any[] = []
  if (orgId) {
    const res = await getVolunteerCertificates(orgId)
    if (res.success) certificates = res.certificates
  }

  const totalCerts = certificates.length
  const totalHours = certificates.reduce((sum, c) => sum + Number(c.service_hours_recognized || 0), 0)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {isHindi ? 'स्वयंसेवक प्रमाण पत्र व सम्मान (Volunteer Certificates)' : 'Volunteer Recognition Certificates'}
              </h1>
            </div>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
              {isHindi
                ? 'निस्वार्थ सेवा घंटों के आधार पर स्वयंसेवकों को SHA-256 सत्यापित व QR-सत्यापनीय आधिकारिक प्रमाण पत्र जारी करें।'
                : 'Issue cryptographic, tamper-proof certificates recognizing volunteer service hours with dynamic digital verification hashes.'}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'जारी प्रमाण पत्र' : 'Certificates Issued'}
            </span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{totalCerts}</p>
          <p className="mt-1 text-xs text-slate-500">{isHindi ? 'आधिकारिक डिजिटल प्रमाण पत्र' : 'Official digital credentials'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isHindi ? 'मान्यता प्राप्त सेवा घंटे' : 'Service Hours Recognized'}
            </span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{totalHours} hrs</p>
          <p className="mt-1 text-xs text-slate-500">{isHindi ? 'सत्यापित नागरिक योगदान' : 'Certified civic service contribution'}</p>
        </div>
      </div>

      {/* Main Interactive Manager */}
      <CertificatesManager initialCertificates={certificates} isHindi={isHindi} orgId={orgId || ''} />
    </div>
  )
}
