import Link from 'next/link'
import { Metadata } from 'next'
import { 
  UserCheck, CheckCircle2, ArrowRight, ShieldCheck, 
  FileSpreadsheet, Lock, BadgePercent, HelpCircle, ChevronRight,
  Award, HeartHandshake, Users
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
    ? 'सदस्यता प्रबंधन सॉफ्टवेयर भारत | संगठन काडर रजिस्टर | संगठन'
    : 'Member Management Software India | Association Cadres | Sangathan'
  const description = isHindi
    ? 'नागरिक संस्थाओं और सोसायटियों के लिए कानूनी सदस्य पंजी। सदस्यता शुल्क संग्रह, पहचान सत्यापन और गोपनीयता सुरक्षा।'
    : 'Statutory member register management for Indian associations and collectives. Member registers, dues tracking, ID verification, and phone privacy.'

  return {
    title,
    description,
    keywords: [
      'member management software India',
      'statutory member register',
      'association member management app',
      'cadre tracking tool',
      'membership dues collection UPI'
    ],
    alternates: {
      canonical: `https://sangathan.space/${lang}/member-management`,
      languages: {
        en: 'https://sangathan.space/en/member-management',
        hi: 'https://sangathan.space/hi/member-management',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sangathan.space/${lang}/member-management`,
      siteName: 'Sangathan',
      type: 'website',
    },
  }
}

export default async function MemberManagementPage({ params }: PageProps) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const faqs = [
    {
      question: isHindi
        ? 'क्या वैधानिक सदस्य रजिस्टर बनते हैं?'
        : 'Does Sangathan generate statutory member registers?',
      answer: isHindi
        ? 'हाँ। संगठन नियमानुसार सदस्यता शुल्क, प्रवेश तिथि और पदनाम के साथ स्वतः प्रिंट-रेडी रजिस्टर तैयार करता है।'
        : 'Yes. Sangathan automatically generates compliant member registers ready for registrar submission.',
    },
    {
      question: isHindi
        ? 'क्या सदस्यों के फोन नंबर सुरक्षित रहते हैं?'
        : 'Are member phone numbers protected from commercial harassment and leaks?',
      answer: isHindi
        ? 'हाँ। व्हाट्सएप ग्रुपों के विपरीत जहां हर किसी का नंबर खुला रहता है, संगठन भूमिका-आधारित सुरक्षा प्रदान करता है जिससे नंबर केवल अधिकृत व्यवस्थापकों को ही दिखते हैं।'
        : 'Yes. Unlike open WhatsApp groups where every contact is exposed, Sangathan enforces strict role-based access control to safeguard activist and resident privacy.',
    },
  ]

  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'सदस्यता प्रबंधन' : 'Member Management', url: `https://sangathan.space/${lang}/member-management` },
        ]}
      />
      <FAQJsonLd questions={faqs} />

      <div className="relative z-10">
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-600 uppercase block mb-3">
              {isHindi ? 'वैधानिक सदस्य पंजी व काडर सुरक्षा' : 'Statutory Member Rolls & Cadre Privacy'}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">
              {isHindi ? (
                <>
                  वैधानिक सदस्यता पंजी, <br />
                  <span className="text-indigo-600">सुरक्षित व व्यवस्थित।</span>
                </>
              ) : (
                <>
                  Statutory Member Rolls, <br />
                  <span className="text-indigo-600">Zero Spreadsheet Risk.</span>
                </>
              )}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              {isHindi
                ? 'नागरिक संस्थाओं के लिए कानूनी रूप से मान्य सदस्य पंजी। सदस्यता शुल्क की स्वचालित ट्रैकिंग और संपर्क गोपनीयता।'
                : 'Replace error-prone spreadsheets with audit-ready member registries. Track dues, verify voting eligibility, and safeguard member identities under DPDP Act compliance.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href={`/${lang}/login?tab=signup`}
                className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2.5 rounded-md shadow-sm min-h-[48px]"
              >
                <span>{isHindi ? 'सदस्य पंजी शुरू करें' : 'Create Member Roll Free'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${lang}/solutions/civic-collective`}
                className="bg-white text-slate-800 px-6 py-3.5 font-bold text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 rounded-md min-h-[48px]"
              >
                <span>{isHindi ? 'समाधान देखें' : 'Collective Blueprint'}</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'वैधानिक सदस्य रजिस्टर' : 'Statutory Member Registers'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'रजिस्ट्रार के लिए तैयार सदस्यता रजिस्टर स्वतः उत्पन्न करें।'
                  : 'Auto-generates official register PDFs with membership numbers, join dates, and fee logs.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <Award size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'सत्यापित डिजिटल आईडी व बैज' : 'Verified ID Badges Studio'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'गतिशील क्यूआर सत्यापन, हेराल्ड्री और 2048px हाई-रेज़ोल्यूशन निर्यात के साथ डिजिटल कार्ड बनाएं।'
                  : 'Generate official member passes with dynamic cryptographic QR verification and print layouts.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <BadgePercent size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'सदस्यता शुल्क व चंदा' : 'Monthly Dues & Chanda'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'सीधे यूपीआई से मासिक शुल्क एकत्र करें और स्वतः डिजिटल रसीदें जारी करें।'
                  : 'Collect recurring membership dues with zero middleman deductions and auto-receipting.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <Lock size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'गोपनीयता व डेटा सुरक्षा' : 'DPDP Privacy Shield'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'काडर फोन नंबर सुरक्षित रखें। किसी बाहरी डेटा ब्रोकर या विज्ञापनदाता को डेटा साझा नहीं।'
                  : 'Protects cadre identities with strict granular role permissions and zero data selling.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <HeartHandshake size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'स्वयंसेवक व सेवा प्रमाण पत्र' : 'Volunteers & Certificates'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'स्वयंसेवक घंटे ट्रैक करें और 1-क्लिक में आधिकारिक सत्यापित सेवा प्रमाण पत्र जारी करें।'
                  : 'Track volunteer hours and issue cryptographic, tamper-evident recognition certificates.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <Users size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'Google Contacts व CSV आयात' : 'Google & CSV Roster Importer'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? '1-क्लिक में अपने गूगल संपर्क या एक्सेल स्प्रेडशीट से संपूर्ण काडर रोस्टर आयात करें।'
                  : 'Instantly import your existing contact sheets or Google Contacts into the unified registry.'}
              </p>
            </div>
          </div>
        </section>

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
