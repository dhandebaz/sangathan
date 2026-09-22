'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, ExternalLink, FileText, Landmark, Scale, ShieldCheck } from 'lucide-react'
import { getOrgLabel } from '@/lib/org-types'

interface StatutoryKnowledgeProps {
  orgType: string
  lang: string
}

interface StatutoryFramework {
  primaryActs: {
    name: { en: string; hi: string }
    authority: { en: string; hi: string }
    description: { en: string; hi: string }
    link: string
  }[]
  docSlug: string
  docTitle: { en: string; hi: string }
  keyProvisions: { en: string; hi: string }[]
  templates: {
    title: { en: string; hi: string }
    description: { en: string; hi: string }
    type: string
  }[]
}

const STATUTORY_DATA: Record<string, StatutoryFramework> = {
  civic_collective: {
    primaryActs: [
      {
        name: { en: 'Constitution of India — Article 19(1)(c): Right to Form Associations', hi: 'भारत का संविधान — अनुच्छेद 19(1)(c): संघ बनाने का अधिकार' },
        authority: { en: 'Fundamental Right — Supreme Court of India', hi: 'मौलिक अधिकार — भारत का सर्वोच्च न्यायालय' },
        description: { en: 'Constitutional guarantee of citizens\' right to form associations and unions, subject to reasonable restrictions under Article 19(4).', hi: 'अनुच्छेद 19(4) के तहत उचित प्रतिबंधों के अधीन नागरिकों को संघ बनाने का संवैधानिक गारंटी।' },
        link: 'https://legislative.gov.in/constitution-of-india/',
      },
      {
        name: { en: 'Right to Information Act, 2005 (RTI)', hi: 'सूचना का अधिकार अधिनियम, 2005 (RTI)' },
        authority: { en: 'Central Information Commission (CIC)', hi: 'केंद्रीय सूचना आयोग (CIC)' },
        description: { en: 'Empowers citizens to access government information. Civic collectives can file RTI applications to hold public authorities accountable.', hi: 'नागरिकों को सरकारी जानकारी तक पहुंचने का अधिकार देता है। नागरिक समूह सार्वजनिक प्राधिकरणों को जवाबदेह ठहराने के लिए RTI आवेदन दाखिल कर सकते हैं।' },
        link: 'https://rtionline.gov.in/',
      },
      {
        name: { en: 'Gram Sabha & Ward Sabha Provisions (Panchayati Raj / Municipal Acts)', hi: 'ग्राम सभा व वार्ड सभा प्रावधान (पंचायती राज / नगरपालिका अधिनियम)' },
        authority: { en: 'State Panchayati Raj / Urban Local Bodies', hi: 'राज्य पंचायती राज / शहरी स्थानीय निकाय' },
        description: { en: 'Citizens have statutory right to participate in Gram Sabha / Ward Sabha meetings for local governance and budget allocation oversight.', hi: 'नागरिकों को स्थानीय शासन और बजट आवंटन निगरानी के लिए ग्राम सभा / वार्ड सभा बैठकों में भाग लेने का वैधानिक अधिकार है।' },
        link: 'https://panchayat.gov.in/',
      },
    ],
    docSlug: 'civic-collective-playbook',
    docTitle: { en: 'Civic Collective & Grassroots Handbook', hi: 'नागरिक समूह व जमीनी संगठन हैंडबुक' },
    keyProvisions: [
      { en: 'No statutory registration required. Civic collectives operate as informal associations under constitutional freedom of association.', hi: 'कोई वैधानिक पंजीकरण आवश्यक नहीं। नागरिक समूह संघ बनाने की संवैधानिक स्वतंत्रता के तहत अनौपचारिक संगठनों के रूप में कार्य करते हैं।' },
      { en: 'Active collectives can apply for formal institutional verification via BQF after meeting community audit milestones.', hi: 'सक्रिय नागरिक समूह सामुदायिक ऑडिट मानदंड पूरे करने के बाद BQF सत्यापन के माध्यम से संस्थागत सहयोग प्राप्त कर सकते हैं।' },
      { en: 'RTI applications, public hearings (jan sunwai), and social audit participation are key tools for civic accountability.', hi: 'RTI आवेदन, सार्वजनिक सुनवाई (जन सुनवाई), और सामाजिक ऑडिट भागीदारी नागरिक जवाबदेही के प्रमुख उपकरण हैं।' },
      { en: 'BQF Verification Pathway: Bahujan Queer Foundation (BQF Section 8 NGO) provides milestone-based institutional verification for active grassroots collectives meeting verified ground audit and community criteria.', hi: 'BQF सत्यापन कार्यक्रम: बहुजन क्वीर फाउंडेशन (BQF सेक्शन 8 NGO) सत्यापित जमीनी कार्य और नागरिक ऑडिट करने वाले सक्रिय समूहों को समीक्षा-आधारित संस्थागत सत्यापन प्रदान करता है।' },
    ],
    templates: [
      {
        title: { en: 'RTI Application Format (Hindi/English)', hi: 'RTI आवेदन प्रारूप (हिन्दी/अंग्रेज़ी)' },
        description: { en: 'Standardized Right to Information application format with proper addressing, fee details, and first appeal instructions.', hi: 'उचित पता, शुल्क विवरण और प्रथम अपील निर्देशों के साथ मानकीकृत सूचना का अधिकार आवेदन प्रारूप।' },
        type: 'Citizen Advocacy',
      },
      {
        title: { en: 'Gram Sabha / Ward Sabha Demand Letter', hi: 'ग्राम सभा / वार्ड सभा मांग पत्र' },
        description: { en: 'Formal representation letter for placing civic demands on the Gram Sabha/Ward Sabha agenda with signature roster.', hi: 'हस्ताक्षर सूची के साथ ग्राम सभा/वार्ड सभा एजेंडा पर नागरिक मांगें रखने के लिए औपचारिक प्रतिनिधित्व पत्र।' },
        type: 'Local Governance',
      },
    ],
  },
  ngo: {
    primaryActs: [
      {
        name: { en: 'Indian Trusts Act 1882 / Societies Act 1860 / Companies Act 2013', hi: 'भारतीय ट्रस्ट अधिनियम 1882 / सोसाइटी पंजीकरण 1860 / कंपनी अधिनियम 2013' },
        authority: { en: 'Sub-Registrar / Ministry of Corporate Affairs (MCA)', hi: 'उप-पंजीयक / कॉर्पोरेट कार्य मंत्रालय (MCA)' },
        description: { en: 'Governs legal incorporation, Board of Trustees, and Section 8 non-profit licensing.', hi: 'कानूनी निगमन, ट्रस्टी बोर्ड और धारा 8 गैर-लाभकारी लाइसेंस को नियंत्रित करता है।' },
        link: 'https://www.mca.gov.in/',
      },
      {
        name: { en: 'Income Tax Act 1961 (Sections 12A, 80G, 10(23C))', hi: 'आयकर अधिनियम 1961 (धारा 12A, 80G, 10(23C))' },
        authority: { en: 'Central Board of Direct Taxes (CBDT)', hi: 'केंद्रीय प्रत्यक्ष कर बोर्ड (CBDT)' },
        description: { en: 'Surplus tax exemptions for non-profits and 50% tax deductions for registered donors.', hi: 'गैर-लाभकारी संस्थाओं के लिए अधिशेष कर छूट और दानदाताओं के लिए 50% कर कटौती।' },
        link: 'https://www.incometax.gov.in/iec/foportal/',
      },
      {
        name: { en: 'NITI Aayog NGO Darpan Guidelines', hi: 'नीति आयोग एनजीओ दर्पण दिशानिर्देश' },
        authority: { en: 'NITI Aayog, Government of India', hi: 'नीति आयोग, भारत सरकार' },
        description: { en: 'Mandatory registration portal providing unique Darpan ID for central ministry grants & CSR eligibility.', hi: 'केंद्रीय अनुदान और सीएसआर पात्रता के लिए अद्वितीय दर्पण आईडी प्रदान करने वाला अनिवार्य पोर्टल।' },
        link: 'https://ngodarpan.gov.in/',
      },
      {
        name: { en: 'Foreign Contribution Regulation Act 2010 (FCRA)', hi: 'विदेशी अंशदान विनियमन अधिनियम 2010 (FCRA)' },
        authority: { en: 'Ministry of Home Affairs (MHA)', hi: 'गृह मंत्रालय (MHA)' },
        description: { en: 'Regulates foreign donations and mandate exclusive account with SBI New Delhi Main Branch.', hi: 'विदेशी दान को नियंत्रित करता है और एसबीआई नई दिल्ली मुख्य शाखा में विशेष खाता अनिवार्य करता है।' },
        link: 'https://fcraonline.nic.in/',
      },
    ],
    docSlug: 'ngo-playbook',
    docTitle: { en: 'NGO & Civil Society Playbook', hi: 'एनजीओ व नागरिक समाज संपूर्ण हैंडबुक' },
    keyProvisions: [
      { en: 'Mandatory 12A/80G renewal every 5 years via Income Tax e-filing portal Form 10A/10AB.', hi: 'आयकर ई-फाइलिंग पोर्टल फॉर्म 10A/10AB के माध्यम से हर 5 साल में अनिवार्य 12A/80G नवीनीकरण।' },
      { en: 'Form CSR-1 must be filed with the MCA prior to receiving CSR corporate grant disbursements.', hi: 'सीएसआर कॉर्पोरेट अनुदान प्राप्त करने से पहले MCA के साथ फॉर्म CSR-1 दर्ज किया जाना चाहिए।' },
      { en: 'Public Trust Ledger: Real-time SHA-256 digital receipt issuance for donor transparency.', hi: 'सार्वजनिक विश्वास लेजर: दानदाता पारदर्शिता के लिए रीयल-टाइम SHA-256 डिजिटल रसीद जारी करना।' },
    ],
    templates: [
      {
        title: { en: '80G Compliant Digital Tax Receipt Format', hi: '80G अनुपालन डिजिटल कर रसीद प्रारूप' },
        description: { en: 'Standardized receipt with donor PAN, registration number, and cryptographic verification hash.', hi: 'दानदाता पैन, पंजीकरण संख्या और सत्यापन हैश के साथ मानकीकृत रसीद।' },
        type: 'Tax Compliance',
      },
      {
        title: { en: 'Model NGO Board Resolution for Bank & Darpan', hi: 'बैंक और दर्पण के लिए मॉडल एनजीओ बोर्ड प्रस्ताव' },
        description: { en: 'Draft board resolution authorising office bearers for statutory portal filings.', hi: 'वैधानिक पोर्टल फाइलिंग के लिए पदाधिकारियों को अधिकृत करने वाला ड्राफ्ट बोर्ड प्रस्ताव।' },
        type: 'Governance',
      },
    ],
  },
}

export function OrgStatutoryKnowledge({ orgType, lang }: StatutoryKnowledgeProps) {
  const isHindi = lang === 'hi'
  const normalizedType = STATUTORY_DATA[orgType] ? orgType : 'ngo'
  const data = STATUTORY_DATA[normalizedType]

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-orange-400 border border-white/10">
              <Landmark className="w-3.5 h-3.5" />
              {isHindi ? 'वैधानिक ज्ञान केंद्र' : 'Statutory & Regulatory Knowledge Hub'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isHindi ? `${getOrgLabel(orgType, 'hi')} कानूनी दिशानिर्देश व डेटा` : `${getOrgLabel(orgType, 'en')} Legal Data & Statutory Framework`}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {isHindi
                ? 'आपके संगठन प्रकार के लिए लागू कानूनी अधिनियम, आधिकारिक सरकारी पंजीकरण पोर्टल, और मानकीकृत प्रारूप।'
                : 'Applicable legal statutes, official government registration portals, and standardized regulatory templates tailored to your organisation archetype.'}
            </p>
          </div>
          <Link
            href={`/${lang}/docs/${data.docSlug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all shadow-sm shrink-0 self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            {isHindi ? data.docTitle.hi : data.docTitle.en}
          </Link>
        </div>
      </div>

      {/* Governing Statutes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-slate-900" />
          <h3 className="text-lg font-bold text-slate-900">
            {isHindi ? 'लागू प्रमुख अधिनियम और विनियामक प्राधिकरण' : 'Applicable Acts & Regulatory Authorities'}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.primaryActs.map((act, i) => (
            <Card key={i} className="border border-slate-200 bg-white hover:border-slate-300 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                    {isHindi ? act.name.hi : act.name.en}
                  </CardTitle>
                  <a
                    href={act.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-900 transition-colors shrink-0"
                    title={isHindi ? 'आधिकारिक पोर्टल खोलें' : 'Open Official Portal'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <CardDescription className="text-xs font-semibold text-orange-700 mt-1">
                  {isHindi ? act.authority.hi : act.authority.en}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 leading-relaxed font-normal">
                {isHindi ? act.description.hi : act.description.en}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Statutory Benchmarks */}
      <Card className="border border-slate-200 bg-slate-50/50">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {isHindi ? 'महत्वपूर्ण अनुपालन आवश्यकताएं' : 'Critical Statutory Benchmarks & Rules'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {data.keyProvisions.map((prov, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>{isHindi ? prov.hi : prov.en}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Standard Formats & Templates */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-900" />
          <h3 className="text-lg font-bold text-slate-900">
            {isHindi ? 'मानकीकृत कानूनी प्रारूप व टेम्पलेट्स' : 'Standard Regulatory Templates & Formats'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.templates.map((tpl, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-md">
                  {tpl.type}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-2">
                  {isHindi ? tpl.title.hi : tpl.title.en}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {isHindi ? tpl.description.hi : tpl.description.en}
                </p>
              </div>
              <Link
                href={`/${lang}/docs/${data.docSlug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-orange-700 transition-colors mt-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {isHindi ? 'हैंडबुक में प्रारूप देखें' : 'View in Handbook'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
