'use client'

import React, { useState } from 'react'
import {
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles,
  ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { finalizeSignup } from '@/actions/auth'
import { ORG_TYPES, OrgType } from '@/lib/org-types'

interface OnboardingWizardProps {
  lang: string
}

const ORG_DESCRIPTIONS: Record<OrgType, { en: string; hi: string }> = {
  student_union: { en: 'Hostel & Mess audits, RTI/ATR assistant, election tallies & anti-ragging cell', hi: 'हॉस्टल और मेस ऑडिट, RTI/ATR सहायक, चुनाव गणना और एंटी-रैगिंग सेल' },
  workers_union: { en: 'Collective bargaining (CBA), strike ballots, workplace grievances & dues', hi: 'सामूहिक सौदेबाजी (CBA), हड़ताल मतदान, कार्यस्थल शिकायतें और शुल्क' },
  ngo: { en: 'Donor CRM, 80G tax receipts, grant matcher & transparency ledger', hi: 'दानदाता CRM, 80G टैक्स रसीदें, अनुदान मैचर और पारदर्शिता बही' },
  rwa: { en: 'Maintenance logs, estate operations & community voting', hi: 'रखरखाव लॉग, संपत्ति संचालन और सामुदायिक मतदान' },
}

const UI = {
  en: {
    step1Title: 'Organisation Identity & Public Web Address',
    step1Desc: 'Choose your organization name and reserve your unique public slug on Sangathan.',
    nameLabel: 'Official Collective Name *',
    namePlaceholder: 'e.g. All India Student Solidarity Front',
    slugLabel: 'Unique Public URL Slug *',
    descLabel: 'Mission Statement / Bio',
    descPlaceholder: 'Brief summary of your collective demands, causes, and democratic objectives...',
    step2Title: 'Collective Sector Blueprint',
    step2Desc: 'Select your organizational archetype to auto-configure compliant workflows, modules, and governance desks.',
    step3Title: 'Governance & Tiered Leadership',
    step3Desc: 'Define executive committee roles and administrative designations.',
    roleLabel: 'Your Initial Designation *',
    dualApproval: 'Dual-Approval Security Enabled',
    dualApprovalDesc: 'High-risk operations (such as broadcasting announcements to >1000 members or ledger adjustments) require dual executive approvals.',
    step4Title: 'Membership Policy & Dues Structure',
    step4Desc: 'Configure open grassroots membership or monthly dues collection.',
    freeMembership: 'Free Open Membership',
    freeMembershipDesc: 'No mandatory fee for cadre/students',
    paidDues: 'Monthly Contribution / Dues',
    paidDuesDesc: 'Automated UPI subscription & receipts',
    monthlyDuesLabel: 'Monthly Dues (INR)',
    monthlyDuesPlaceholder: '₹ 100',
    step5Title: 'Activate Growth & Governance Engines',
    step5Desc: 'Toggle the features you want to enable for your organisation.',
    petitionTitle: '1-Click Public Petition Studio',
    petitionDesc: 'Live signature counter & volunteer conversion',
    transparencyTitle: 'Public Transparency & Trust Ledger',
    transparencyDesc: 'SHA-256 verified real-time fund utilization',
    sosTitle: 'Emergency SOS & Legal Defense Network',
    sosDesc: '1-tap protest detention broadcast & advocate dispatch',
    back: 'Back',
    continue: 'Continue',
    launching: 'Initializing Collective...',
    launch: 'Launch Sangathan OS',
    nameRequired: 'Please enter your organization name.',
    slugRequired: 'Please enter a valid slug (at least 3 characters).',
    slugTaken: 'Please choose a different URL slug.',
    orgCreated: 'Organisation initialized and live on Sangathan!',
    setupFailed: 'Failed to complete setup.',
    unexpectedError: 'An unexpected error occurred.',
    checkingSlug: 'Checking availability...',
    slugAvailable: 'This URL is available',
    slugUnavailable: 'This URL is already taken',
    enabled: 'Enabled',
    disabled: 'Disabled',
  },
  hi: {
    step1Title: 'संगठन पहचान और सार्वजनिक वेब पता',
    step1Desc: 'अपने संगठन का नाम चुनें और Sangathan पर अपना अनूठा सार्वजनिक स्लग आरक्षित करें।',
    nameLabel: 'आधिकारिक सामूहिक नाम *',
    namePlaceholder: 'जैसे अखिल भारतीय छात्र एकता मोर्चा',
    slugLabel: 'अनूठा सार्वजनिक URL स्लग *',
    descLabel: 'मिशन स्टेटमेंट / परिचय',
    descPlaceholder: 'अपनी सामूहिक मांगों, कारणों और लोकतांत्रिक उद्देश्यों का संक्षिप्त सारांश...',
    step2Title: 'सामूहिक क्षेत्र ब्लूप्रिंट',
    step2Desc: 'स्वतः-कॉन्फ़िगर अनुपालन वर्कफ़्लो, मॉड्यूल और शासन डेस्क के लिए अपना संगठनात्मक आदर्श चुनें।',
    step3Title: 'शासन और स्तरीय नेतृत्व',
    step3Desc: 'कार्यकारी समिति भूमिकाओं और प्रशासनिक पदनामों को परिभाषित करें।',
    roleLabel: 'आपका प्रारंभिक पदनाम *',
    dualApproval: 'दोहरी-अनुमोदन सुरक्षा सक्षम',
    dualApprovalDesc: 'उच्च-जोखिम संचालन (जैसे >1000 सदस्यों को घोषणाएं प्रसारित करना या बही समायोजन) के लिए दोहरी कार्यकारी अनुमोदन आवश्यक हैं।',
    step4Title: 'सदस्यता नीति और शुल्क संरचना',
    step4Desc: 'खुली जमीनी सदस्यता या मासिक शुल्क संग्रह कॉन्फ़िगर करें।',
    freeMembership: 'मुफ्त खुली सदस्यता',
    freeMembershipDesc: 'काडर/छात्रों के लिए कोई अनिवार्य शुल्क नहीं',
    paidDues: 'मासिक योगदान / शुल्क',
    paidDuesDesc: 'स्वचालित UPI सदस्यता और रसीदें',
    monthlyDuesLabel: 'मासिक शुल्क (INR)',
    monthlyDuesPlaceholder: '₹ 100',
    step5Title: 'विकास और शासन इंजन सक्रिय करें',
    step5Desc: 'अपने संगठन के लिए सक्षम करने के लिए सुविधाओं को टॉगल करें।',
    petitionTitle: '1-क्लिक सार्वजनिक याचिका स्टूडियो',
    petitionDesc: 'लाइव हस्ताक्षर काउंटर और स्वयंसेवक रूपांतरण',
    transparencyTitle: 'सार्वजनिक पारदर्शिता और विश्वास बही',
    transparencyDesc: 'SHA-256 सत्यापित रियल-टाइम फंड उपयोग',
    sosTitle: 'आपातकालीन SOS और कानूनी रक्षा नेटवर्क',
    sosDesc: '1-टैप विरोध बंदीगृह प्रसारण और वकिल डिस्पैच',
    back: 'वापस',
    continue: 'जारी रखें',
    launching: 'सामूहिक प्रारंBBI कर रहा है...',
    launch: 'Sangathan OS लॉन्च करें',
    nameRequired: 'कृपया अपने संगठन का नाम दर्ज करें।',
    slugRequired: 'कृपया एक मान्य स्लग दर्ज करें (कम से कम 3 अक्षर)।',
    slugTaken: 'कृपया एक अलग URL स्लग चुनें।',
    orgCreated: 'संगठन प्रारंभ और Sangathan पर लाइव!',
    setupFailed: 'सेटअप पूरा करने में विफल।',
    unexpectedError: 'एक अप्रत्याशित त्रुटि हुई।',
    checkingSlug: 'उपलब्धता जांच रहा है...',
    slugAvailable: 'या URL उपलब्ध है',
    slugUnavailable: 'या URL पहले से ही लिया गया है',
    enabled: 'सक्षम',
    disabled: 'अक्षम',
  },
}

export function OnboardingWizard({ lang }: OnboardingWizardProps) {
   const t = (key: keyof typeof UI['en']) => UI[lang === 'hi' ? 'hi' : 'en'][key]
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Form State across 5 steps
  const [orgData, setOrgData] = useState({
    name: '',
    slug: '',
    type: 'ngo',
    registrationStatus: 'registered',
    registrationNumber: '',
    description: '',
    primaryRole: 'General Secretary',
    duesType: 'free',
    monthlyDues: '0',
    enablePublicPetitions: true,
    enableTransparencyLedger: true,
    enableEmergencySos: true,
  })

  const [slugChecking, setSlugChecking] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sangathan.space'

  async function checkSlugAvailability(slug: string) {
    if (slug.length < 3) {
      setSlugAvailable(null)
      return
    }
    setSlugChecking(true)
    try {
      const res = await fetch(`/api/org/slug-check?slug=${encodeURIComponent(slug)}`)
      const data = await res.json()
      setSlugAvailable(data.available)
    } catch {
      setSlugAvailable(null)
    } finally {
      setSlugChecking(false)
    }
  }

  const steps = [
    { number: 1, title: 'Identity & Slug' },
    { number: 2, title: 'Sector Blueprint' },
    { number: 3, title: 'Governance Roles' },
    { number: 4, title: 'Membership & Dues' },
    { number: 5, title: 'Launch Engine' },
  ]

  async function handleFinalSubmit() {
    if (!orgData.name) {
      toast.error('Organisation name is required.')
      return
    }

    setLoading(true)
    try {
      const res = await finalizeSignup({
        organizationName: orgData.name,
        organizationType: orgData.type,
        slug: orgData.slug,
        description: orgData.description,
        registrationStatus: orgData.registrationStatus,
        designation: orgData.primaryRole,
        membershipPolicy: orgData.duesType === 'free' ? 'open_auto' : 'admin_approval',
        monthlyDues: orgData.monthlyDues,
      })

      if (res.success) {
        toast.success(t('orgCreated'))
        router.push(`/${lang}/dashboard`)
      } else {
        toast.error(res.error || t('setupFailed'))
      }
    } catch {
      toast.error(t('unexpectedError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Step Progress Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            {steps.map((s) => (
              <div key={s.number} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    step === s.number
                      ? 'bg-slate-900 text-white'
                      : step > s.number
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step > s.number ? <CheckCircle2 className="w-4 h-4" /> : s.number}
                </div>
                <span
                  className={`text-xs font-semibold hidden md:inline ${
                    step === s.number ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Form Container */}
        <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm space-y-6">
           {/* STEP 1: IDENTITY & SLUG */}
           {step === 1 && (
             <div className="space-y-4">
               <div className="border-b border-slate-100 pb-3">
                 <h2 className="text-xl font-bold text-slate-900">Step 1: {t('step1Title')}</h2>
                 <p className="text-xs text-slate-500 mt-0.5">{t('step1Desc')}</p>
               </div>

               <div>
                 <Label className="text-xs font-semibold text-slate-700">{t('nameLabel')}</Label>
                 <Input
                   required
                   placeholder={t('namePlaceholder')}
                   value={orgData.name}
                   onChange={(e) => {
                     const name = e.target.value
                     const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                     setOrgData({ ...orgData, name, slug: orgData.slug || generatedSlug })
                   }}
                   className="mt-1 h-10 text-sm rounded-sm"
                 />
               </div>

               <div>
                 <Label className="text-xs font-semibold text-slate-700">{t('slugLabel')}</Label>
                 <div className="flex items-center mt-1">
                  <span className="bg-slate-100 text-slate-500 text-xs px-3 h-10 flex items-center border border-r-0 border-slate-200 rounded-l-sm font-mono">
                    {appUrl.replace(/^https?:\/\//, '')}/
                  </span>
                  <Input
                    required
                    placeholder="student-front"
                    value={orgData.slug}
                    onChange={(e) => {
                      const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      setOrgData({ ...orgData, slug: newSlug })
                      checkSlugAvailability(newSlug)
                    }}
                    className="h-10 text-xs font-mono rounded-r-sm rounded-l-none"
                  />
                </div>
                {slugChecking && <p className="text-xs text-slate-400 mt-1">{t('checkingSlug')}</p>}
                {slugAvailable === true && <p className="text-xs text-emerald-600 mt-1">{t('slugAvailable')}</p>}
                {slugAvailable === false && <p className="text-xs text-red-500 mt-1">{t('slugUnavailable')}</p>}
              </div>

               <div>
                 <Label className="text-xs font-semibold text-slate-700">{t('descLabel')}</Label>
                 <Textarea
                   rows={2}
                   placeholder={t('descPlaceholder')}
                   value={orgData.description}
                   onChange={(e) => setOrgData({ ...orgData, description: e.target.value })}
                   className="mt-1 text-xs rounded-sm"
                 />
              </div>
             </div>
           )}

           {/* STEP 2: SECTOR BLUEPRINT */}
           {step === 2 && (
             <div className="space-y-4">
               <div className="border-b border-slate-100 pb-3">
                 <h2 className="text-xl font-bold text-slate-900">Step 2: {t('step2Title')}</h2>
                 <p className="text-xs text-slate-500 mt-0.5">{t('step2Desc')}</p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                 {(Object.entries(ORG_TYPES) as [OrgType, typeof ORG_TYPES[OrgType]][]).map(([id, config]) => (
                   <button
                     key={id}
                     type="button"
                     onClick={() => setOrgData({ ...orgData, type: id })}
                     className={`p-4 text-left border rounded-sm transition-all ${
                       orgData.type === id
                         ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                         : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                     }`}
                   >
                     <div className="text-sm font-bold text-slate-900">{lang === 'hi' ? config.hi : config.en}</div>
                     <div className="text-xs text-slate-500 mt-1 leading-relaxed">{ORG_DESCRIPTIONS[id][lang === 'hi' ? 'hi' : 'en']}</div>
                   </button>
                 ))}
               </div>
             </div>
           )}

           {/* STEP 3: GOVERNANCE ROLES */}
           {step === 3 && (
             <div className="space-y-4">
               <div className="border-b border-slate-100 pb-3">
                 <h2 className="text-xl font-bold text-slate-900">Step 3: {t('step3Title')}</h2>
                 <p className="text-xs text-slate-500 mt-0.5">{t('step3Desc')}</p>
               </div>

               <div>
                 <Label className="text-xs font-semibold text-slate-700">{t('roleLabel')}</Label>
                 <Select
                   value={orgData.primaryRole}
                   onValueChange={(val) => setOrgData({ ...orgData, primaryRole: val })}
                 >
                   <SelectTrigger className="mt-1 h-10 text-xs rounded-sm">
                     <SelectValue placeholder={t('roleLabel')} />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="President">President (अध्यक्ष)</SelectItem>
                     <SelectItem value="Vice President">Vice President (उपाध्यक्ष)</SelectItem>
                     <SelectItem value="General Secretary">General Secretary (महासचिव)</SelectItem>
                     <SelectItem value="Convener">Convener / Coordinator (संयोजक)</SelectItem>
                     <SelectItem value="Legal Aid Head">Legal Aid Cell In-Charge</SelectItem>
                     <SelectItem value="Treasurer">Treasurer / Finance Lead</SelectItem>
                   </SelectContent>
                 </Select>
               </div>

               <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-600 space-y-1.5">
                 <div className="font-bold text-slate-800 flex items-center gap-1.5">
                   <ShieldCheck className="w-4 h-4 text-emerald-600" />
                   <span>{t('dualApproval')}</span>
                 </div>
                 <p>{t('dualApprovalDesc')}</p>
               </div>
             </div>
           )}

           {/* STEP 4: MEMBERSHIP & DUES */}
           {step === 4 && (
             <div className="space-y-4">
               <div className="border-b border-slate-100 pb-3">
                 <h2 className="text-xl font-bold text-slate-900">Step 4: {t('step4Title')}</h2>
                 <p className="text-xs text-slate-500 mt-0.5">{t('step4Desc')}</p>
               </div>

               <div className="grid grid-cols-2 gap-3">
                 <button
                   type="button"
                   onClick={() => setOrgData({ ...orgData, duesType: 'free' })}
                   className={`p-3.5 text-left border rounded-sm ${
                     orgData.duesType === 'free'
                       ? 'border-indigo-600 bg-indigo-50/50'
                       : 'border-slate-200 bg-slate-50'
                   }`}
                 >
                   <div className="text-xs font-bold text-slate-900">{t('freeMembership')}</div>
                   <p className="text-[11px] text-slate-500 mt-0.5">{t('freeMembershipDesc')}</p>
                 </button>

                 <button
                   type="button"
                   onClick={() => setOrgData({ ...orgData, duesType: 'paid' })}
                   className={`p-3.5 text-left border rounded-sm ${
                     orgData.duesType === 'paid'
                       ? 'border-indigo-600 bg-indigo-50/50'
                       : 'border-slate-200 bg-slate-50'
                   }`}
                 >
                   <div className="text-xs font-bold text-slate-900">{t('paidDues')}</div>
                   <p className="text-[11px] text-slate-500 mt-0.5">{t('paidDuesDesc')}</p>
                 </button>
               </div>

               {orgData.duesType === 'paid' && (
                 <div>
                   <Label className="text-xs font-semibold text-slate-700">{t('monthlyDuesLabel')}</Label>
                   <Input
                     type="number"
                     value={orgData.monthlyDues}
                     onChange={(e) => setOrgData({ ...orgData, monthlyDues: e.target.value })}
                     placeholder={t('monthlyDuesPlaceholder')}
                     className="mt-1 h-9 text-xs rounded-sm"
                   />
                 </div>
               )}
             </div>
           )}

           {/* STEP 5: LAUNCH ENGINE */}
           {step === 5 && (
             <div className="space-y-4">
               <div className="border-b border-slate-100 pb-3">
                 <h2 className="text-xl font-bold text-slate-900">Step 5: {t('step5Title')}</h2>
                 <p className="text-xs text-slate-500 mt-0.5">{t('step5Desc')}</p>
               </div>

               <div className="space-y-3">
                 <button
                   type="button"
                   onClick={() => setOrgData({ ...orgData, enablePublicPetitions: !orgData.enablePublicPetitions })}
                   className={`p-3.5 w-full text-left border rounded-sm flex items-center justify-between transition-all ${
                     orgData.enablePublicPetitions ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-slate-50'
                   }`}
                 >
                   <div>
                     <div className="text-xs font-bold text-slate-900">{t('petitionTitle')}</div>
                     <div className="text-[11px] text-slate-500">{t('petitionDesc')}</div>
                   </div>
                   <span className={`text-xs font-bold ${orgData.enablePublicPetitions ? 'text-emerald-600' : 'text-slate-400'}`}>
                     {orgData.enablePublicPetitions ? t('enabled') : t('disabled')}
                   </span>
                 </button>

                 <button
                   type="button"
                   onClick={() => setOrgData({ ...orgData, enableTransparencyLedger: !orgData.enableTransparencyLedger })}
                   className={`p-3.5 w-full text-left border rounded-sm flex items-center justify-between transition-all ${
                     orgData.enableTransparencyLedger ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-slate-50'
                   }`}
                 >
                   <div>
                     <div className="text-xs font-bold text-slate-900">{t('transparencyTitle')}</div>
                     <div className="text-[11px] text-slate-500">{t('transparencyDesc')}</div>
                   </div>
                   <span className={`text-xs font-bold ${orgData.enableTransparencyLedger ? 'text-emerald-600' : 'text-slate-400'}`}>
                     {orgData.enableTransparencyLedger ? t('enabled') : t('disabled')}
                   </span>
                 </button>

                 <button
                   type="button"
                   onClick={() => setOrgData({ ...orgData, enableEmergencySos: !orgData.enableEmergencySos })}
                   className={`p-3.5 w-full text-left border rounded-sm flex items-center justify-between transition-all ${
                     orgData.enableEmergencySos ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-slate-50'
                   }`}
                 >
                   <div>
                     <div className="text-xs font-bold text-slate-900">{t('sosTitle')}</div>
                     <div className="text-[11px] text-slate-500">{t('sosDesc')}</div>
                   </div>
                   <span className={`text-xs font-bold ${orgData.enableEmergencySos ? 'text-emerald-600' : 'text-slate-400'}`}>
                     {orgData.enableEmergencySos ? t('enabled') : t('disabled')}
                   </span>
                 </button>
               </div>
             </div>
           )}

           {/* Navigation Controls */}
           <div className="flex items-center justify-between pt-4 border-t border-slate-100">
             {step > 1 ? (
               <Button
                 type="button"
                 variant="outline"
                 size="sm"
                 onClick={() => setStep((s) => s - 1)}
                 className="text-xs border-slate-300"
               >
                 <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                 {t('back')}
               </Button>
             ) : <div />}

             {step < 5 ? (
               <Button
                 type="button"
                 size="sm"
                 onClick={() => {
                   if (step === 1) {
                     if (!orgData.name) {
                       toast.error(t('nameRequired'))
                       return
                     }
                     if (!orgData.slug || orgData.slug.length < 3) {
                       toast.error(t('slugRequired'))
                       return
                     }
                     if (slugAvailable === false) {
                       toast.error(t('slugTaken'))
                       return
                     }
                   }
                   setStep((s) => s + 1)
                 }}
                 className="bg-slate-900 text-white font-semibold text-xs h-9 px-4 rounded-sm"
               >
                 <span>{t('continue')}</span>
                 <ArrowRight className="w-3.5 h-3.5 ml-1" />
               </Button>
             ) : (
               <Button
                 type="button"
                 disabled={loading}
                 onClick={handleFinalSubmit}
                 className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-6 rounded-sm shadow-md"
               >
                 <Sparkles className="w-4 h-4 mr-1.5" />
                 {loading ? t('launching') : t('launch')}
               </Button>
             )}
           </div>
        </div>
      </div>
    </div>
  )
}
