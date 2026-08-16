import Link from 'next/link'
import { Metadata } from 'next'
import { 
  Building2, CheckCircle2, ArrowRight, ShieldCheck, 
  FileText, Landmark, BarChart3, HelpCircle, ChevronRight, Scale 
} from 'lucide-react'
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'

interface PageProps {
  params: Promise<{
    lang: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const title = isHindi
    ? 'एनजीओ मैनेजमेंट सॉफ्टवेयर भारत | 80G टैक्स रसीद व डोनर CRM | संगठन'
    : 'NGO Management Software India | 80G Donor CRM & Compliance | Sangathan'
  const description = isHindi
    ? 'भारतीय गैर-लाभकारी संस्थाओं, ट्रस्टों और सोसायटियों के लिए संपूर्ण सॉफ्टवेयर। स्वचालित 80G/12A PDF रसीदें, फॉर्म 10BD एक्सपोर्ट, दर्पण आईडी ट्रैकिंग और ₹0-₹1,000 मूल्य।'
    : 'All-in-one NGO management software for Indian non-profits, trusts, and Section 8 companies. Automated 80G/12A tax receipts, Form 10BD filing exports, Darpan ID tracking, and ₹0-₹1,000 INR pricing.'

  return {
    title,
    description,
    keywords: [
      'NGO management software India',
      '80G donor management software',
      'non-profit CRM India free',
      'Form 10BD donation filing software',
      'Darpan ID NGO compliance',
      'trust and society accounting software India',
      'FCRA compliant NGO database'
    ],
    alternates: {
      canonical: `https://sangathan.space/${lang}/ngo-management`,
      languages: {
        en: 'https://sangathan.space/en/ngo-management',
        hi: 'https://sangathan.space/hi/ngo-management',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sangathan.space/${lang}/ngo-management`,
      siteName: 'Sangathan',
      type: 'website',
    },
  }
}

export default async function NgoManagementPage({ params }: PageProps) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const faqs = [
    {
      question: isHindi
        ? 'क्या संगठन 80G और 12A आयकर प्रमाणित टैक्स रसीदें स्वतः जारी करता है?'
        : 'Does Sangathan automatically issue 80G and 12A tax exemption receipts?',
      answer: isHindi
        ? 'हाँ। दानदाता का पैन (PAN) नंबर दर्ज होते ही संगठन QR कोड और संस्था के पंजीकरण नंबर के साथ कानूनी रूप से मान्य PDF रसीद उत्पन्न करता है।'
        : 'Yes. Upon receiving a donation, Sangathan automatically generates compliant PDF tax receipts featuring the donor’s PAN, organization 80G approval number, and QR verification.',
    },
    {
      question: isHindi
        ? 'क्या वार्षिक आयकर फॉर्म 10BD फाइलिंग के लिए डेटा एक्सपोर्ट उपलब्ध है?'
        : 'Does Sangathan support annual Income Tax Form 10BD export?',
      answer: isHindi
        ? 'हाँ। वित्तीय वर्ष समाप्त होने पर 1-क्लिक में आयकर पोर्टल के फॉर्मेट में पूर्ण फॉर्म 10BD CSV फाइल डाउनलोड की जा सकती है।'
        : 'Yes. You can export a pre-formatted Form 10BD CSV report ready for direct upload to the Indian Income Tax e-filing portal.',
    },
    {
      question: isHindi
        ? 'विदेशी एनजीओ सॉफ्टवेयर (जैसे EveryAction/Blackbaud) की तुलना में संगठन कितना सस्ता है?'
        : 'How does Sangathan compare in price to US non-profit CRMs?',
      answer: isHindi
        ? 'विदेशी सॉफ्टवेयर ₹30,000 से ₹1,50,000/माह ($350-$1,800/mo USD) चार्ज करते हैं। संगठन जमीनी संस्थाओं के लिए ₹0 कम्युनिटी और 500 काडर के लिए मात्र ₹1,000/माह में उपलब्ध है।'
        : 'US legacy CRMs cost ₹30,000 to ₹1,50,000/month ($350 - $1,800/mo USD). Sangathan offers a ₹0 Community Tier and ₹1,000/mo Sustainer Tier for 500 active cadres in Indian Rupees.',
    },
  ]

  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'एनजीओ मैनेजमेंट' : 'NGO Management', url: `https://sangathan.space/${lang}/ngo-management` },
        ]}
      />
      <FAQJsonLd questions={faqs} />

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-700 uppercase block mb-3">
              {isHindi ? 'भारतीय वैधानिक व गैर-लाभकारी अनुपालन' : 'Indian Statutory & Non-Profit Operating System'}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">
              {isHindi ? (
                <>
                  भारतीय एनजीओ के लिए <br />
                  <span className="text-indigo-600">उद्देश्य-निर्मित सॉफ्टवेयर।</span>
                </>
              ) : (
                <>
                  Purpose-Built Software for <br />
                  <span className="text-indigo-600">Indian Non-Profits & Trusts.</span>
                </>
              )}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              {isHindi
                ? 'विदेशी डॉलर भुगतानों और जटिल अमेरिकी सीआरएम से मुक्ति पाएं। संगठन विशेष रूप से भारतीय आयकर 80G/12A रसीदों, फॉर्म 10BD एक्सपोर्ट, सीएसआर-1 ग्रांट्स और नीति आयोग दर्पण ट्रैकिंग के लिए बना है।'
                : 'Say goodbye to expensive USD contracts and western CRMs. Sangathan is engineered specifically for Indian statutory realities: automated 80G/12A PDF receipts, annual Form 10BD filings, NITI Aayog Darpan ID, and multi-program CSR grant tracking.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href={`/${lang}/login?tab=signup`}
                className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2.5 rounded-md shadow-sm min-h-[48px]"
              >
                <span>{isHindi ? 'निःशुल्क एनजीओ खाता बनाएं' : 'Create Free NGO Account'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${lang}/solutions/registered-ngo`}
                className="bg-white text-slate-800 px-6 py-3.5 font-bold text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 rounded-md min-h-[48px]"
              >
                <span>{isHindi ? 'पंजीकृत एनजीओ समाधान' : 'Registered NGO Blueprint'}</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-8 border-t border-slate-200 mt-8 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHindi ? '80G व 10BD तैयार' : '80G & 10BD Ready'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHindi ? 'नीति आयोग दर्पण अनुकूल' : 'Darpan ID Support'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHindi ? '₹0 - ₹1,000 भारतीय मूल्य' : '₹0 - ₹1,000 INR Pricing'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* STATUTORY PILLARS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
              {isHindi ? 'भारतीय विधिक नियमों के अनुरूप संपूर्ण नियंत्रण' : 'Complete Statutory Alignment Out of the Box'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              {isHindi
                ? 'सोसायटी पंजीकरण अधिनियम 1860, भारतीय ट्रस्ट अधिनियम 1882 एवं कंपनी अधिनियम धारा 8 के तहत पूर्ण अनुपालन।'
                : 'Designed from day one to comply with the Societies Registration Act 1860, Indian Trusts Act 1882, and Section 8 company audit guidelines.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                  <FileText size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isHindi ? 'स्वचालित 80G व 12A PDF रसीदें' : 'Automated 80G/12A PDF Receipts'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'पैन कार्ड सत्यापन के साथ प्रत्येक ऑनलाइन या ऑफलाइन दान पर स्वतः डिजिटल टैक्स रसीद जारी करें। दानदाता सीधे अपने फोन से रसीद डाउनलोड कर सकते हैं।'
                    : 'Issue official PDF receipts instantly upon donation with donor PAN, registration timestamps, and automatic email/WhatsApp delivery.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                  <BarChart3 size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isHindi ? 'वार्षिक फॉर्म 10BD एक्सपोर्ट' : 'Annual Form 10BD Filing Exporter'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'वित्तीय वर्ष के अंत में चार्टर्ड अकाउंटेंट (CA) को देने के लिए तैयार 10BD प्रारूप में दानदाताओं का संपूर्ण विवरण 1-क्लिक में डाउनलोड करें।'
                    : 'Download audit-ready Form 10BD reports formatted specifically for direct submission to the Income Tax Department.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                  <Landmark size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isHindi ? 'सीएसआर-1 व परियोजना बजट ट्रैकिंग' : 'CSR-1 Grant & Project Accounting'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'स्वीकृत सीएसआर बजट बनाम वास्तविक खर्च, वाउचर अटैचमेंट और फंड उपयोग प्रमाणपत्रों (UC) की लाइव ट्रैकिंग।'
                    : 'Track sanctioned CSR grants against actual field expenses with bill attachments, milestone reporting, and utilization certificates.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON CALLOUT */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase block mb-1">
                {isHindi ? 'लागत व क्षमता तुलना' : 'Cost & Capability Comparison'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isHindi ? 'एवरीएक्शन (EveryAction/Bonterra) बनाम संगठन' : 'Sangathan vs EveryAction / Bonterra'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                {isHindi
                  ? 'देखें कैसे विदेशी सॉफ्टवेयर के ₹30,000-₹1.5 लाख/माह खर्च के मुकाबले संगठन भारतीय कानूनों के साथ ₹1,000/माह में उपलब्ध है।'
                  : 'Compare the total cost of ownership, Indian tax compliance, and ground readiness between Sangathan and expensive legacy non-profit CRMs.'}
              </p>
            </div>
            <Link
              href={`/${lang}/compare/everyaction`}
              className="bg-white border border-slate-300 hover:border-indigo-500 text-slate-900 hover:text-indigo-600 px-6 py-3 rounded-md font-bold text-xs sm:text-sm transition-all shrink-0 flex items-center gap-2"
            >
              <span>{isHindi ? 'तुलना देखें' : 'Read Full Comparison'}</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>

        {/* FAQS */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-center">
            {isHindi ? 'अक्सर पूछे जाने वाले सवाल (FAQ)' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-6 bg-white">
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                  <HelpCircle size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6.5">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
