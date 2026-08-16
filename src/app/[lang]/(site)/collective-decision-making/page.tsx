import Link from 'next/link'
import { Metadata } from 'next'
import { 
  Vote, CheckCircle2, ArrowRight, ShieldCheck, 
  Lock, CheckSquare, BarChart, HelpCircle, ChevronRight 
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
    ? 'सामूहिक निर्णय व गुप्त मतदान सॉफ्टवेयर | लोकतांत्रिक वोटिंग | संगठन'
    : 'Collective Decision Making Software | Secret Ballot & AGM Voting | Sangathan'
  const description = isHindi
    ? 'नागरिक संस्थाओं, छात्र संघों और आरडब्ल्यूए के लिए डिजिटल गुप्त मतदान। क्रिप्टोग्राफिक निष्पक्षता, 1-व्यक्ति-1-वोट और एजीएम आम सभा जनमत।'
    : 'Cryptographic secret voting and collective decision making software for Indian NGOs, unions, and RWAs. Tamper-evident 1-person-1-vote elections and AGM resolutions.'

  return {
    title,
    description,
    keywords: [
      'collective decision making software',
      'online secret voting NGO India',
      'AGM election software RWA',
      'tamper proof digital voting union',
      'consensus polling collective governance',
      'student union election platform'
    ],
    alternates: {
      canonical: `https://sangathan.space/${lang}/collective-decision-making`,
      languages: {
        en: 'https://sangathan.space/en/collective-decision-making',
        hi: 'https://sangathan.space/hi/collective-decision-making',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sangathan.space/${lang}/collective-decision-making`,
      siteName: 'Sangathan',
      type: 'website',
    },
  }
}

export default async function CollectiveDecisionMakingPage({ params }: PageProps) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const faqs = [
    {
      question: isHindi
        ? 'क्या मतदान की गोपनीयता की गारंटी है?'
        : 'Is voter anonymity mathematically guaranteed?',
      answer: isHindi
        ? 'हाँ। क्रिप्टोग्राफिक तकनीक से यह सुनिश्चित किया जाता है कि कौन किस विकल्प को वोट दे रहा है, यह कोई भी व्यवस्थापक नहीं देख सकता।'
        : 'Yes. Sangathan separates voter identity from the ballot choice using cryptographic tokens, ensuring nobody—not even system admins—can trace votes back to individuals.',
    },
    {
      question: isHindi
        ? 'क्या छात्र संघ और आरडब्ल्यूए चुनाव नियमों का पालन होता है?'
        : 'Is it compliant with Lyngdoh Committee & Societies election rules?',
      answer: isHindi
        ? 'हाँ। लिंगदोह समिति के दिशा-निर्देशों और सोसायटी नियमों के अनुसार निष्पक्ष आंतरिक चुनाव कराए जा सकते हैं।'
        : 'Yes. Designed to adhere to Lyngdoh Committee norms for student councils and statutory AGM quorum rules for housing societies and unions.',
    },
  ]

  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'सामूहिक निर्णय' : 'Collective Decision Making', url: `https://sangathan.space/${lang}/collective-decision-making` },
        ]}
      />
      <FAQJsonLd questions={faqs} />

      <div className="relative z-10">
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-700 uppercase block mb-3">
              {isHindi ? 'आंतरिक लोकतंत्र व निष्पक्ष चुनाव' : 'Internal Democracy & Cryptographic Secret Ballots'}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">
              {isHindi ? (
                <>
                  पारदर्शी आम सभा, <br />
                  <span className="text-indigo-600">निष्पक्ष गुप्त मतदान।</span>
                </>
              ) : (
                <>
                  Democratic Governance, <br />
                  <span className="text-indigo-600">Mathematically Secret Ballots.</span>
                </>
              )}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              {isHindi
                ? 'खुले व्हाट्सएप पोल और विवादित हाथ उठाने की प्रथा को समाप्त करें। संगठन 1-व्यक्ति-1-वोट की पूर्ण गोपनीयता के साथ आंतरिक लोकतंत्र को सुदृढ़ बनाता है।'
                : 'Replace easily rigged chat polls with tamper-evident digital ballots. Conduct executive committee elections, general body resolutions, and consensus polling with verifiable quorum.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href={`/${lang}/login?tab=signup`}
                className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2.5 rounded-md shadow-sm min-h-[48px]"
              >
                <span>{isHindi ? 'मतदान शुरू करें' : 'Start Democratic Ballot Free'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${lang}/solutions/student-union`}
                className="bg-white text-slate-800 px-6 py-3.5 font-bold text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 rounded-md min-h-[48px]"
              >
                <span>{isHindi ? 'छात्र संघ समाधान' : 'Student Union Blueprint'}</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <Lock size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'पूर्ण गुप्त मतदान' : 'True Secret Ballot'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'क्रिप्टोग्राफिक टोकन से मतदाता पहचान और दिए गए वोट को अलग रखा जाता है।'
                  : 'Voter choice is decoupled from identity, preventing coercion and retaliation.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <CheckSquare size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'कोरम व पात्रता सत्यापन' : 'Quorum & Eligibility Checks'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'केवल सक्रिय व सत्यापित काडर ही वोट कर सकते हैं। कोरम पूरा होने पर ही परिणाम मान्य।'
                  : 'Enforce statutory quorum thresholds and membership verification before voting.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <BarChart size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'तत्काल ऑडिट-रेडी परिणाम' : 'Instant Audit Trails'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'मतदान समाप्त होते ही पारदर्शी गणना रिपोर्ट और एजीएम मिनट्स पीडीएफ में डाउनलोड करें।'
                  : 'Generate tamper-evident election result certificates and GBM minutes in 1 click.'}
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
