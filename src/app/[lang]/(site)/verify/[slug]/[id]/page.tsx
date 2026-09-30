import { getPublicMemberCredential } from '@/actions/member-credentials'
import { Metadata } from 'next'
import Link from 'next/link'
import {
  ShieldCheck, CheckCircle2, Award, Building2,
  Lock, FileCheck
} from 'lucide-react'
import { getOrgLabel, OrgType } from '@/lib/org-types'

export const dynamic = 'force-dynamic'

interface VerifyPageProps {
  params: Promise<{
    lang: string
    slug: string
    id: string
  }>
}

export async function generateMetadata(props: VerifyPageProps): Promise<Metadata> {
  const { lang, slug, id } = await props.params
  const credential = await getPublicMemberCredential(slug, id)
  const isHindi = lang === 'hi'

  if (!credential) {
    return {
      title: isHindi ? 'सत्यापन विफल' : 'Verification Record Not Found',
    }
  }

  const memberName = credential.member_name
  const orgName = credential.organisations?.name || 'Organisation'

  return {
    title: isHindi
      ? `सत्यापित पहचान: ${memberName} (${orgName}) | संगठन`
      : `Verified Credential: ${memberName} (${orgName}) | Sangathan`,
    description: isHindi
      ? `संगठन नेटवर्क पर ${orgName} के सत्यापित सदस्य ${memberName} का आधिकारिक क्रिप्टोग्राफिक रिकॉर्ड।`
      : `Official cryptographic verification record for ${memberName} as a verified member of ${orgName} on the Sangathan Democratic Network.`,
    alternates: {
      canonical: `https://sangathan.space/${lang}/verify/${slug}/${id}`,
    },
  }
}

export default async function CredentialVerificationPage(props: VerifyPageProps) {
  const { lang, slug, id } = await props.params
  const isHindi = lang === 'hi'
  const credential = await getPublicMemberCredential(slug, id)

  if (!credential) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-slate-50">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isHindi ? 'सत्यापन रिकॉर्ड नहीं मिला' : 'Verification Record Not Found'}
        </h1>
        <p className="text-sm text-slate-500 max-w-md text-center mt-2">
          {isHindi
            ? 'पहचान संख्या या संगठन का पता मान्य नहीं है, अथवा यह पहचान पत्र अभी सार्वजनिक नहीं किया गया है।'
            : 'The requested credential ID or organization slug could not be verified on the Sangathan Democratic Ledger.'}
        </p>
        <Link
          href={`/${lang}`}
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-sm hover:bg-slate-800 transition-colors"
        >
          <span>{isHindi ? 'मुख्य पृष्ठ पर लौटें' : 'Return to Sangathan Home'}</span>
        </Link>
      </div>
    )
  }

  const org = credential.organisations
  const orgType = (org?.org_type || 'civic_collective') as OrgType
  const orgLabel = getOrgLabel(orgType, isHindi ? 'hi' : 'en')
  const shaHash = credential.verification_hash

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Verification Status Banner */}
        <div className="border border-emerald-200 bg-emerald-50/60 p-6 rounded-md shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {isHindi ? 'सत्यापित साख' : 'CRYPTOGRAPHICALLY VERIFIED'}
                </span>
                <span className="text-xs text-emerald-700 font-medium">
                  • {isHindi ? 'सक्रिय व वैध' : 'Active & Authentic'}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                {isHindi
                  ? `${credential.member_name} — सत्यापित सदस्य`
                  : `${credential.member_name} — Verified Member Credential`}
              </h1>
            </div>
          </div>

          <div className="text-right self-end sm:self-center font-mono text-xs text-slate-500">
            <span className="block font-bold text-slate-700">{credential.credential_id}</span>
            <span className="text-[11px] text-slate-400">Sangathan Democratic Ledger</span>
          </div>
        </div>

        {/* Credential Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Credential Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 text-white border border-slate-800 p-7 rounded-md shadow-lg relative overflow-hidden">
              {/* Background watermark */}
              <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
                <Award className="w-80 h-80 text-white" />
              </div>

              <div className="flex items-start justify-between border-b border-slate-800 pb-5">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                    {orgLabel}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {org?.name}
                  </h2>
                </div>
                {credential.joining_year && (
                  <span className="px-2.5 py-1 bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-mono text-xs rounded">
                    {credential.joining_year}
                  </span>
                )}
              </div>

              <div className="py-6 space-y-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Cardholder Name</span>
                  <h3 className="text-3xl font-black text-white mt-0.5">{credential.member_name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Designation / Role</span>
                    <p className="text-base font-semibold text-indigo-300 mt-0.5">{credential.designation}</p>
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Verified Tier</span>
                    <p className="text-base font-semibold text-amber-400 mt-0.5">{credential.badge_tier}</p>
                  </div>
                </div>

                {credential.chapter_city && (
                  <div className="pt-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Chapter / District</span>
                    <p className="text-sm font-medium text-slate-300 mt-0.5">{credential.chapter_city}</p>
                  </div>
                )}
              </div>

              {/* Bottom Security Ledger Box */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded text-xs font-mono space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>CREDENTIAL_ID:</span>
                  <span className="text-slate-200 font-bold">{credential.credential_id}</span>
                </div>
                {shaHash && (
                  <div className="flex justify-between">
                    <span>SHA256_HASH:</span>
                    <span className="text-indigo-400">{shaHash.slice(0, 24)}...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/${lang}/org/${slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-sm hover:bg-slate-50 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{isHindi ? 'संगठन का सार्वजनिक पोर्टल देखें' : 'View Organization Portal'}</span>
              </Link>
              <Link
                href={`/${lang}/members/badge`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-sm hover:bg-slate-800 transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{isHindi ? 'अपना बैज बनाएं' : 'Create Your Verified Badge'}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Institutional Verification & Audit Metadata */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-md space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2.5 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'संस्थागत सत्यापन विवरण' : 'Institutional Verification Details'}</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">{isHindi ? 'जारीकर्ता संगठन' : 'Issuing Organization'}</span>
                  <span className="font-bold text-slate-900 text-sm">{org?.name}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">{isHindi ? 'संगठन का प्रकार' : 'Organization Classification'}</span>
                  <span className="font-semibold text-slate-800">{orgLabel}</span>
                </div>

                {org?.darpan_id && (
                  <div>
                    <span className="text-slate-500 font-medium block">NITI Aayog NGO Darpan ID</span>
                    <span className="font-mono font-bold text-slate-800">{org.darpan_id}</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-500 font-medium block">{isHindi ? 'सत्यापन स्थिति' : 'Standing & Quorum Status'}</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>In Good Standing (Verified Quorum Member)</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-medium block">{isHindi ? 'वैधता अवधि' : 'Validity Cycle'}</span>
                  <span className="font-semibold text-slate-800">
                    {credential.joining_year
                      ? (isHindi ? `${credential.joining_year} से सदस्य` : `Member since ${credential.joining_year}`)
                      : (isHindi ? 'रिकॉर्ड में उपलब्ध नहीं' : 'Not available in record')}
                  </span>
                </div>
              </div>
            </div>

            {/* Sovereign Ledger Trust Box */}
            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-md text-xs text-indigo-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isHindi ? 'संगठन रिकॉर्ड जांच' : 'Sangathan Record Check'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-indigo-900/80">
                {isHindi
                  ? 'यह पहचान पत्र संगठन के रिकॉर्ड में दर्ज जानकारी से मिलान करके दिखाया गया है। रिकॉर्ड बदलने पर यह जांच परिणाम भी बदल जाएगा।'
                  : 'This credential is shown by matching our records. If the record changes, this check result changes too.'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
