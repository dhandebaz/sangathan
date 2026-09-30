import Link from 'next/link'
import { Metadata } from 'next'
import { 
  Layers, CheckCircle2, ArrowRight, ShieldCheck, 
  Workflow, Database, Users, HelpCircle, ChevronRight 
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
    ? 'संगठन प्रबंधन सॉफ्टवेयर | संस्थागत संचालन व प्रशासन | संगठन'
    : 'Organization Management Software | Unified Movement OS | Sangathan'
  const description = isHindi
    ? 'नागरिक संस्थाओं और गैर-लाभकारी संगठनों के लिए एकीकृत प्रबंधन प्लेटफॉर्म। सदस्य, निर्णय, कोष और फील्ड अभियानों का केंद्रीकृत नियंत्रण।'
    : 'Unified organization management platform for civic institutions, non-profits, and associations in India. Centralize cadres, assemblies, audits, and treasury.'

  return {
    title,
    description,
    keywords: [
      'organization management software India',
      'nonprofit operations platform',
      'civic organization software',
      'association management software India',
      'movement operating system',
      'membership and governance platform'
    ],
    alternates: {
      canonical: `https://sangathan.space/${lang}/organization-management`,
      languages: {
        en: 'https://sangathan.space/en/organization-management',
        hi: 'https://sangathan.space/hi/organization-management',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sangathan.space/${lang}/organization-management`,
      siteName: 'Sangathan',
      type: 'website',
    },
  }
}

export default async function OrganizationManagementPage({ params }: PageProps) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const faqs = [
    {
      question: isHindi
        ? 'संगठन किस प्रकार के संगठनों के लिए उपयुक्त है?'
        : 'Which types of organizations can use Sangathan?',
      answer: isHindi
        ? 'संगठन अनौपचारिक नागरिक समूहों और पंजीकृत एनजीओ के लिए विशेष रूप से डिज़ाइन किया गया है।'
        : 'Sangathan is designed for 2 movement archetypes: Grassroots Civic Collectives and Registered NGOs & Trusts.',
    },
    {
      question: isHindi
        ? 'क्या संगठन में भूमिका और अनुमति नियंत्रण (RBAC) मौजूद है?'
        : 'Does Sangathan support role-based access control (RBAC)?',
      answer: isHindi
        ? 'हाँ। अध्यक्ष, महासचिव, कोषाध्यक्ष, फील्ड कोऑर्डिनेटर और आम सदस्यों के लिए अलग-अलग सुरक्षित अनुमतियां निर्धारित की जा सकती हैं।'
        : 'Yes. Granular permissions allow assigning distinct operational roles for Conveners, General Secretaries, Treasurers, Field Leads, and General Cadres.',
    },
  ]

  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'संगठन प्रबंधन' : 'Organization Management', url: `https://sangathan.space/${lang}/organization-management` },
        ]}
      />
      <FAQJsonLd questions={faqs} />

      <div className="relative z-10">
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase block mb-3">
              {isHindi ? 'एकीकृत संस्थागत ढांचा' : 'Unified Institutional Operating System'}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">
              {isHindi ? (
                <>
                  संस्थागत मजबूती के लिए <br />
                  <span className="text-indigo-600">एक संपूर्ण ऑपरेटिंग सिस्टम।</span>
                </>
              ) : (
                <>
                  The Unified Operating System for <br />
                  <span className="text-indigo-600">Movement Institutions.</span>
                </>
              )}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              {isHindi
                ? 'काडर सूची, लोकतांत्रिक निर्णय, पारदर्शी वित्त और प्रशासनिक जवाबदेही को एक ही संप्रभु मंच पर लाएं।'
                : 'Unify member directories, secret ballots, double-entry cash books, and statutory administrative filings into a single sovereign platform.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href={`/${lang}/login?tab=signup`}
                className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2.5 rounded-md shadow-sm min-h-[48px]"
              >
                <span>{isHindi ? 'निःशुल्क शुरू करें' : 'Get Started Free'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${lang}/solutions`}
                className="bg-white text-slate-800 px-6 py-3.5 font-bold text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 rounded-md min-h-[48px]"
              >
                <span>{isHindi ? 'सभी समाधान देखें' : 'View All Solutions'}</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <Workflow size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'केंद्रीकृत कार्यप्रवाह' : 'Unified Workflows'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'शिकायतों के निवारण से लेकर आम सभा के प्रस्तावों तक सभी प्रक्रियाओं का व्यवस्थित संचालन।'
                  : 'Manage member appeals, field grievances, and assembly proposals under a transparent lifecycle.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <Database size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'संपूर्ण डेटा संप्रभुता' : 'Total Data Sovereignty'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'शून्य ट्रैकिंग और 1-क्लिक में पूरा डेटा एक्सपोर्ट। आपके संगठन का डेटा केवल आपके नियंत्रण में।'
                  : 'Zero third-party telemetry, end-to-end audit trails, and 1-click complete JSON/CSV data export.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'संस्थागत समर्थन व सत्यापन' : 'Institutional Backing & Verification'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'बहुजन क्वीर फाउंडेशन (सेक्शन 8 एनजीओ) द्वारा संचालित नागरिक पहल एवं सक्रिय समूहों हेतु सत्यापन कार्यक्रम।'
                  : 'Civic non-profit initiative of Bahujan Queer Foundation (Section 8 NGO) with verified recognition pathways for active collectives.'}
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
