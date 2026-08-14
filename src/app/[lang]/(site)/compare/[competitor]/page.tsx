import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { 
  ArrowRight, ShieldCheck, CheckCircle2, XCircle, ArrowLeft, 
  HelpCircle, ChevronRight, Zap, Scale, Wallet, Lock, Users 
} from 'lucide-react'
import { COMPARISONS_DATA } from '@/lib/comparisons-data'
import { ComparisonJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

interface ComparisonPageProps {
  params: Promise<{
    lang: string
    competitor: string
  }>
}

export async function generateStaticParams() {
  const languages = ['en', 'hi']
  const params: { lang: string; competitor: string }[] = []

  for (const lang of languages) {
    for (const compKey of Object.keys(COMPARISONS_DATA)) {
      params.push({ lang, competitor: compKey })
    }
  }

  return params
}

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const { lang, competitor } = await params
  const comp = COMPARISONS_DATA[competitor]
  if (!comp) return {}

  const isHindi = lang === 'hi'
  const title = isHindi ? comp.metaTitleHi : comp.metaTitleEn
  const description = isHindi ? comp.metaDescHi : comp.metaDescEn

  return {
    title,
    description,
    keywords: comp.keywords,
    alternates: {
      canonical: `https://sangathan.space/${lang}/compare/${competitor}`,
      languages: {
        en: `https://sangathan.space/en/compare/${competitor}`,
        hi: `https://sangathan.space/hi/compare/${competitor}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sangathan.space/${lang}/compare/${competitor}`,
      siteName: 'Sangathan',
      type: 'website',
      images: [
        {
          url: '/images/activist-leader.png',
          width: 800,
          height: 600,
          alt: `Sangathan vs ${comp.competitorName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/activist-leader.png'],
    },
  }
}

export default async function CompetitorComparisonPage({ params }: ComparisonPageProps) {
  const { lang, competitor } = await params
  const comp = COMPARISONS_DATA[competitor]

  if (!comp) {
    notFound()
  }

  const isHindi = lang === 'hi'

  const structuredFaqs = comp.faqs.map((f) => ({
    question: isHindi ? f.questionHi : f.questionEn,
    answer: isHindi ? f.answerHi : f.answerEn,
  }))

  const siblingComparisons = Object.values(COMPARISONS_DATA).filter((c) => c.slug !== competitor)

  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      <ComparisonJsonLd
        title={`Sangathan vs ${comp.competitorName}`}
        description={isHindi ? comp.metaDescHi : comp.metaDescEn}
        url={`https://sangathan.space/${lang}/compare/${competitor}`}
        competitorName={comp.competitorName}
        faqs={structuredFaqs}
      />
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'तुलना' : 'Compare', url: `https://sangathan.space/${lang}/compare` },
          { name: `Sangathan vs ${comp.competitorName}`, url: `https://sangathan.space/${lang}/compare/${competitor}` },
        ]}
      />

      {/* Background Dot Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative z-10">

        {/* 1. HERO SECTION WITH ACTIVIST LEADER IMAGE */}
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          
          <div className="mb-6">
            <Link
              href={`/${lang}/compare`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>{isHindi ? '← सभी तुलना पृष्ठ देखें' : '← Back to All Comparisons'}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Comparison Focus */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-300 rounded text-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider font-mono">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                <span>Sangathan vs {comp.competitorName} • {isHindi ? 'विस्तृत विश्लेषण' : 'In-Depth Analysis'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-slate-900 leading-[1.08]">
                {isHindi ? comp.heroHeadlineHi : comp.heroHeadlineEn}
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {isHindi ? comp.heroSubheadlineHi : comp.heroSubheadlineEn}
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link 
                  href={`/${lang}/login?tab=signup`} 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2.5 rounded-md shadow-sm min-h-[48px]"
                >
                  <span>{isHindi ? 'संगठन पर निःशुल्क शुरू करें' : 'Switch to Sangathan (Free)'}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link 
                  href={`/${lang}/solutions`} 
                  className="bg-white text-slate-800 px-6 py-3.5 font-bold text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 rounded-md min-h-[48px]"
                >
                  <span>{isHindi ? 'समाधान देखें' : 'Explore All Solutions'}</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-200 text-[11px] font-semibold text-slate-600 text-left">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isHindi ? '₹0 निःशुल्क टियर' : '₹0 Community Tier'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isHindi ? '1-क्लिक डेटा माइग्रेशन' : '1-Click Data Importer'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isHindi ? 'शून्य डेटा बिक्री' : 'Zero Data Selling'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Activist Leader Hero Anchor */}
            <div className="lg:col-span-5 flex flex-col items-center relative">
              <div className="relative w-full max-w-md bg-gradient-to-b from-slate-50 via-slate-50/50 to-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs overflow-hidden">
                
                <div className="absolute top-0 right-0 w-28 h-28 border-b border-l border-slate-200 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-t border-r border-slate-200 pointer-events-none" />
                
                <div className="relative w-full h-[340px] sm:h-[400px] flex items-end justify-center">
                  <Image
                    src="/images/activist-leader.png"
                    alt={`Movement Leader - Sangathan vs ${comp.competitorName}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-contain object-bottom drop-shadow-md"
                    priority
                  />
                </div>

                <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-xs border border-slate-300 rounded p-2 text-left shadow-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <div className="text-[10px] font-mono leading-tight">
                      <strong className="text-slate-900 block">Sangathan vs {comp.competitorName}</strong>
                      <span className="text-slate-500">{isHindi ? 'नागरिक संप्रभुता बनाम कॉरपोरेट SaaS' : 'Civic Sovereignty vs Closed SaaS'}</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                  <div className="bg-slate-900/90 text-white backdrop-blur-xs border border-slate-700 rounded p-2.5 text-left shadow-xs flex items-center justify-between">
                    <div className="text-[11px] leading-tight">
                      <span className="font-bold text-emerald-400 block">Sangathan</span>
                      <span className="text-[10px] text-slate-300">₹0 Community Tier Forever</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-slate-600">
                      BQF Shield
                    </span>
                  </div>
                </div>

              </div>

              <div className="mt-3 text-center">
                <p className="text-xs font-bold text-slate-700">
                  {isHindi ? comp.activistQuoteHi : comp.activistQuoteEn}
                </p>
                <span className="text-[11px] text-slate-400 font-mono">
                  {isHindi ? comp.quoteAttributionHi : comp.quoteAttributionEn}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 2. SUMMARY VERDICT */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-10">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
              {isHindi ? 'निष्कर्ष व मुख्य अंतर' : 'Executive Verdict & Core Difference'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
              {isHindi ? 'संगठन क्यों बेहतर विकल्प है?' : `The Verdict: Sangathan vs ${comp.competitorName}`}
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {isHindi ? comp.summaryVerdictHi : comp.summaryVerdictEn}
            </p>
          </div>
        </section>

        {/* 3. HEAD-TO-HEAD COMPARISON MATRIX TABLE */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              {isHindi ? 'सुविधाओं की आमने-सामने तुलना' : 'Head-to-Head Feature Comparison'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {isHindi
                ? 'कीमत, भारतीय नियमों, ऑफलाइन सपोर्ट और गोपनीयता का विस्तृत विवरण।'
                : 'A transparent breakdown of capabilities, pricing models, and ground compliance.'}
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-900">
                  <th className="py-4 px-6 w-1/3">{isHindi ? 'सुविधा / क्षमता' : 'Feature / Capability'}</th>
                  <th className="py-4 px-6 w-1/3 bg-emerald-50/50 text-emerald-950 border-x border-slate-200">Sangathan</th>
                  <th className="py-4 px-6 w-1/3 text-slate-600">{comp.competitorName}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {comp.comparisonMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {isHindi ? row.featureNameHi : row.featureNameEn}
                    </td>
                    <td className="py-4 px-6 bg-emerald-50/30 text-emerald-950 font-semibold border-x border-slate-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span>{isHindi ? row.sangathanValueHi : row.sangathanValueEn}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <div className="flex items-center gap-2">
                        <XCircle size={16} className="text-slate-400 shrink-0" />
                        <span>{isHindi ? row.competitorValueHi : row.competitorValueEn}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. DEEP DIFFERENTIATION PILLARS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="space-y-12">
            {comp.pillars.map((pillar, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
                <h3 className="text-2xl font-black text-slate-900 mb-6">
                  {isHindi ? pillar.titleHi : pillar.titleEn}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-6">
                    <strong className="block text-emerald-900 font-bold mb-2 text-sm uppercase tracking-wider font-mono">
                      Sangathan Approach:
                    </strong>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                      {isHindi ? pillar.sangathanDetailHi : pillar.sangathanDetailEn}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <strong className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wider font-mono">
                      {comp.competitorName} Approach:
                    </strong>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {isHindi ? pillar.competitorDetailHi : pillar.competitorDetailEn}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-100 rounded-lg p-4 text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <span className="text-indigo-600 font-bold font-mono uppercase">Verdict:</span>
                  <span>{isHindi ? pillar.verdictHi : pillar.verdictEn}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FAQS FOR AI SEARCH & GOOGLE */}
        {comp.faqs.length > 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                {isHindi ? 'अक्सर पूछे जाने वाले सवाल (FAQ)' : 'Frequently Asked Questions'}
              </h2>
            </div>

            <div className="space-y-4">
              {comp.faqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                    <HelpCircle size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                    <span>{isHindi ? faq.questionHi : faq.questionEn}</span>
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6.5">
                    {isHindi ? faq.answerHi : faq.answerEn}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. SIBLING COMPARISONS EXPLORER */}
        {siblingComparisons.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900">
                {isHindi ? 'अन्य लोकप्रिय सॉफ्टवेयर तुलनाएं:' : 'Other Software Comparisons:'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {siblingComparisons.map((sib) => (
                <Link
                  key={sib.slug}
                  href={`/${lang}/compare/${sib.slug}`}
                  className="bg-white border border-slate-200 hover:border-indigo-400 p-4 rounded-lg transition-colors group flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                    Sangathan vs {sib.competitorName}
                  </span>
                  <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 7. LIGHT TECHNICAL CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              {isHindi ? `${comp.competitorName} से संगठन पर निःशुल्क माइग्रेट करें` : `Migrate from ${comp.competitorName} to Sangathan`}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-6">
              {isHindi
                ? 'जमीनी नागरिक समूहों के लिए ₹0 हमेशा निःशुल्क। यूनिवर्सल डेटा इंपोर्टर से 60 सेकंड में स्विच करें।'
                : '100% free forever for grassroots collectives. Switch in under 60 seconds with zero data loss.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/${lang}/login?tab=signup`}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 text-sm rounded-md shadow-sm transition-all"
              >
                {isHindi ? 'निःशुल्क खाता बनाएं' : 'Create Free Account'}
              </Link>
              <Link
                href={`/${lang}/compare`}
                className="w-full sm:w-auto bg-white text-slate-800 font-bold px-6 py-3.5 text-sm rounded-md border border-slate-300 hover:bg-slate-100 transition-all"
              >
                {isHindi ? 'सभी तुलनाएं देखें' : 'View All Comparisons'}
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
