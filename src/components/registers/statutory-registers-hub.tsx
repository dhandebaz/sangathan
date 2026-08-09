'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer, FileSpreadsheet, ShieldCheck, Landmark, HardHat, Home, BookOpen, ExternalLink } from 'lucide-react'
import { getOrgLabel } from '@/lib/org-types'

interface StatutoryRegistersHubProps {
  org: {
    id: string
    name: string
    org_type: string
    registration_number?: string | null
    registration_status?: string | null
  }
  memberCount: number
  donationCount: number
  totalDonations: number
  lang: string
}

export function StatutoryRegistersHub({
  org,
  memberCount,
  donationCount,
  totalDonations,
  lang,
}: StatutoryRegistersHubProps) {
  const isHindi = lang === 'hi'

  const registers = [
    {
      id: 'form-i',
      titleEn: 'Form I: Statutory Member Roll Register',
      titleHi: 'फॉर्म I: वैधानिक सदस्य रजिस्टर',
      actEn: 'Societies Registration Act 1860 / State Apartment Ownership Acts',
      actHi: 'सोसाइटी पंजीकरण अधिनियम 1860 / राज्य अपार्टमेंट स्वामित्व अधिनियम',
      descEn: 'Official serialized roll of members with admission dates, unit/flat designations, and voting status for Registrar inspection.',
      descHi: 'पंजीयक निरीक्षण के लिए प्रवेश तिथियों, इकाई/फ्लैट पदों और मतदान स्थिति के साथ सदस्यों का आधिकारिक क्रमबद्ध रजिस्टर।',
      icon: Home,
      color: 'sky',
      printHref: `/${lang}/dashboard/registers/form-i/print`,
      applicableOrgs: ['ngo', 'rwa', 'student_union'],
    },
    {
      id: 'form-h',
      titleEn: 'Form H: Annual General Return & Subscription Ledger',
      titleHi: 'फॉर्म H: वार्षिक सामान्य रिटर्न व सदस्यता बहीखाता',
      actEn: 'Trade Unions Act 1926 (Section 28 / Regulation 18)',
      actHi: 'ट्रेड यूनियन अधिनियम 1926 (धारा 28 / विनियम 18)',
      descEn: 'Mandatory audited register of worker subscriptions, general fund balances, and executive office-bearer rolls for Labour Commissioner.',
      descHi: 'श्रम आयुक्त के लिए श्रमिक अंशदान, सामान्य निधि शेष और पदाधिकारियों की सूची का अनिवार्य ऑडिटेड रजिस्टर।',
      icon: HardHat,
      color: 'amber',
      printHref: `/${lang}/dashboard/registers/form-h/print`,
      applicableOrgs: ['workers_union'],
    },
    {
      id: 'cash-book',
      titleEn: 'NGO Double-Entry Cash Book & 80G Tax Register',
      titleHi: 'एनजीओ डबल-एंट्री कैश बुक व 80G कर रजिस्टर',
      actEn: 'Income Tax Act 1961 (Section 12A/80G) & NITI Aayog Norms',
      actHi: 'आयकर अधिनियम 1961 (धारा 12A/80G) व नीति आयोग मानदंड',
      descEn: 'Chronological double-entry cash book with donor PANs, voucher serials, 80G receipt numbers, and SHA-256 verification hashes.',
      descHi: 'दानदाता पैन, वाउचर क्रमांक, 80G रसीद संख्या और SHA-256 सत्यापन हैश के साथ कालानुक्रमिक कैश बुक।',
      icon: Landmark,
      color: 'emerald',
      printHref: `/${lang}/dashboard/registers/cash-book/print`,
      applicableOrgs: ['ngo'],
    },
  ]

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700 mb-1">
          <Printer className="w-4 h-4" />
          {isHindi ? 'वैधानिक रजिस्टर व ऑडिट बुक्स' : 'Statutory PDF Registers & Audit Books Exporter'}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isHindi ? 'सरकारी व विनियामक ऑडिट रजिस्टर्स' : 'Official Statutory Books & Audit Rolls'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isHindi
            ? 'पंजीयक (Registrar), श्रम आयुक्त (Labour Commissioner), और चार्टर्ड एकाउंटेंट ऑडिट के लिए 1-क्लिक प्रिंट-रेडी प्रारूप।'
            : 'Pre-formatted, print-ready official registers with institutional headers, serial numbering, and QR verification codes for government inspections.'}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-200 bg-white">
          <CardContent className="p-4">
            <div className="text-2xl font-extrabold text-slate-900">{memberCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{isHindi ? 'पंजीकृत सदस्य रिकॉर्ड्स' : 'Active Registered Members'}</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white">
          <CardContent className="p-4">
            <div className="text-2xl font-extrabold text-emerald-700">₹{totalDonations.toLocaleString('en-IN')}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{isHindi ? 'ऑडिटेड फंड / दान लेन-देन' : 'Total Audited Inflows'}</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white">
          <CardContent className="p-4">
            <div className="text-2xl font-extrabold text-orange-700">{donationCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{isHindi ? 'प्रमाणित वाउचर्स / रसीदें' : 'Verified Receipts Issued'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Registers Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          {isHindi ? 'उपलब्ध वैधानिक रजिस्टर प्रारूप' : 'Available Statutory Register Formats'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {registers.map((reg) => {
            const Icon = reg.icon
            return (
              <Card key={reg.id} className="border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {isHindi ? reg.actHi : reg.actEn}
                    </span>
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                    {isHindi ? reg.titleHi : reg.titleEn}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 leading-relaxed">
                    {isHindi ? reg.descHi : reg.descEn}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <a
                    href={reg.printHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    {isHindi ? 'आधिकारिक रजिस्टर प्रिंट / PDF निर्यात' : 'Open Print-Ready Register (PDF)'}
                  </a>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
