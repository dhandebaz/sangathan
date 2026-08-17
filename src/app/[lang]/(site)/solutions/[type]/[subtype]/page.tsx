import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { 
  ArrowRight, ShieldCheck, Activity, Printer, Clock, FileText, 
  Receipt, Wallet, Users, Vote, Scale, AlertTriangle, CheckSquare, 
  Building2, HardHat, ChevronRight, HelpCircle, CheckCircle2, ArrowLeft 
} from 'lucide-react'
import { SOLUTIONS_DATA } from '@/lib/solutions-data'
import { SolutionJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

interface SubtypePageProps {
  params: Promise<{
    lang: string
    type: string
    subtype: string
  }>
}

export async function generateStaticParams() {
  const languages = ['en', 'hi']
  const params: { lang: string; type: string; subtype: string }[] = []

  for (const lang of languages) {
    for (const [typeKey, typeVal] of Object.entries(SOLUTIONS_DATA)) {
      for (const st of typeVal.subtypes) {
        params.push({ lang, type: typeKey, subtype: st.slug })
      }
    }
  }

  return params
}

export async function generateMetadata({ params }: SubtypePageProps): Promise<Metadata> {
  const { lang, type, subtype } = await params
  const orgType = SOLUTIONS_DATA[type]
  if (!orgType) return {}

  const st = orgType.subtypes.find((s) => s.slug === subtype)
  if (!st) return {}

  const isHindi = lang === 'hi'
  const title = isHindi ? st.metaTitleHi : st.metaTitleEn
  const description = isHindi ? st.metaDescHi : st.metaDescEn

  return {
    title,
    description,
    keywords: st.keywords,
    alternates: {
      canonical: `https://sangathan.space/${lang}/solutions/${type}/${subtype}`,
      languages: {
        en: `https://sangathan.space/en/solutions/${type}/${subtype}`,
        hi: `https://sangathan.space/hi/solutions/${type}/${subtype}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sangathan.space/${lang}/solutions/${type}/${subtype}`,
      siteName: 'Sangathan',
      type: 'website',
      images: [
        {
          url: `https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? st.titleHi : st.titleEn)}&desc=${encodeURIComponent(description)}&type=${type}&tag=Movement+Playbook&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: isHindi ? st.titleHi : st.titleEn,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? st.titleHi : st.titleEn)}&desc=${encodeURIComponent(description)}&type=${type}&tag=Movement+Playbook&lang=${lang}`],
      creator: '@areynetaji',
    },
  }
}

// Icon helper
function renderIcon(iconName: string, className: string = 'w-5 h-5') {
  switch (iconName) {
    case 'Printer': return <Printer className={className} />
    case 'Clock': return <Clock className={className} />
    case 'Activity': return <Activity className={className} />
    case 'ShieldCheck': return <ShieldCheck className={className} />
    case 'Receipt': return <Receipt className={className} />
    case 'Wallet': return <Wallet className={className} />
    case 'Users': return <Users className={className} />
    case 'Vote': return <Vote className={className} />
    case 'Scale': return <Scale className={className} />
    case 'AlertTriangle': return <AlertTriangle className={className} />
    case 'CheckSquare': return <CheckSquare className={className} />
    case 'Building2': return <Building2 className={className} />
    case 'HardHat': return <HardHat className={className} />
    case 'FileText': return <FileText className={className} />
    default: return <Activity className={className} />
  }
}

export default async function SolutionSubtypePage({ params }: SubtypePageProps) {
  const { lang, type, subtype } = await params
  const orgType = SOLUTIONS_DATA[type]
  if (!orgType) notFound()

  const st = orgType.subtypes.find((s) => s.slug === subtype)
  if (!st) notFound()

  const isHindi = lang === 'hi'

  const structuredFeatures = st.keyTools.map((t) => ({
    name: isHindi ? t.nameHi : t.nameEn,
    description: isHindi ? t.descHi : t.descEn,
  }))

  const structuredFaqs = st.faqs.map((f) => ({
    question: isHindi ? f.questionHi : f.questionEn,
    answer: isHindi ? f.answerHi : f.answerEn,
  }))

  const siblingSubtypes = orgType.subtypes.filter((s) => s.slug !== subtype)

  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      <SolutionJsonLd
        title={isHindi ? st.titleHi : st.titleEn}
        description={isHindi ? st.metaDescHi : st.metaDescEn}
        url={`https://sangathan.space/${lang}/solutions/${type}/${subtype}`}
        category="CivicGovernanceApplication"
        features={structuredFeatures}
        faqs={structuredFaqs}
      />
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'समाधान' : 'Solutions', url: `https://sangathan.space/${lang}/solutions` },
          { name: isHindi ? orgType.titleHi : orgType.titleEn, url: `https://sangathan.space/${lang}/solutions/${type}` },
          { name: isHindi ? st.titleHi : st.titleEn, url: `https://sangathan.space/${lang}/solutions/${type}/${subtype}` },
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
              href={`/${lang}/solutions/${type}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>{isHindi ? `← ${orgType.titleHi} पर वापस` : `← Back to ${orgType.titleEn}`}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Subtype Focus */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-slate-900 leading-[1.08]">
                {isHindi ? st.titleHi : st.titleEn}
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {isHindi ? st.taglineHi : st.taglineEn}
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link 
                  href={`/${lang}/login?tab=signup`} 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2.5 rounded-md shadow-sm min-h-[48px]"
                >
                  <span>{isHindi ? 'यह ब्लूप्रिंट शुरू करें (निःशुल्क)' : 'Deploy Blueprint (Free)'}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link 
                  href={`/${lang}/compare`} 
                  className="bg-white text-slate-800 px-6 py-3.5 font-bold text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 rounded-md min-h-[48px]"
                >
                  <span>{isHindi ? 'अन्य टूल्स से तुलना' : 'Compare with Other Apps'}</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-200 text-[11px] font-semibold text-slate-600 text-left">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isHindi ? '₹0 निःशुल्क टियर' : '₹0 Free Tier'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isHindi ? 'ऑफलाइन मोबाइल PWA' : 'Offline Mobile PWA'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isHindi ? 'वैधानिक सुरक्षा' : 'Statutory Shield'}</span>
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
                    alt={`Activist Leader - ${isHindi ? st.titleHi : st.titleEn}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-contain object-bottom drop-shadow-md"
                    priority
                  />
                </div>

                {/* Ground Status Cards */}
                <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-xs border border-slate-300 rounded p-2 text-left shadow-xs flex items-center justify-between">
                    <div className="text-[10px] font-mono leading-tight">
                      <strong className="text-slate-900 block">{isHindi ? st.titleHi : st.titleEn}</strong>
                      <span className="text-slate-500">{isHindi ? 'सक्रिय जमीनी कार्यप्रणाली' : 'Active Ground Playbook'}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded border border-emerald-300">
                      Active
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                  <div className="bg-slate-900/90 text-white backdrop-blur-xs border border-slate-700 rounded p-2.5 text-left shadow-xs flex items-center justify-between">
                    <div className="text-[11px] leading-tight">
                      <span className="font-bold text-emerald-400 block">{isHindi ? 'वैधानिक प्रावधान' : 'Statutory Act'}</span>
                      <span className="text-[10px] text-slate-300">{st.statutoryActs[0]?.provision || 'Section 8 Shield'}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-slate-600">
                      BQF Verified
                    </span>
                  </div>
                </div>

              </div>

              <div className="mt-3 text-center">
                <p className="text-xs font-bold text-slate-700">
                  {isHindi ? st.activistQuoteHi : st.activistQuoteEn}
                </p>
                <span className="text-[11px] text-slate-400 font-mono">
                  {isHindi ? orgType.quoteAttributionHi : orgType.quoteAttributionEn}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 2. GROUND CHALLENGE VS SANGATHAN SOLUTION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-8">
              <h3 className="text-2xl font-black text-slate-900 mb-4">
                {isHindi ? 'बिना संगठित डिजिटल रिकॉर्ड के क्या होता है?' : 'What Fails in Conventional Organizing?'}
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {isHindi ? st.groundChallengeHi : st.groundChallengeEn}
              </p>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-8">
              <h3 className="text-2xl font-black text-slate-900 mb-4">
                {isHindi ? 'संगठन प्रशासनिक बदलाव कैसे लाता है?' : 'How Sangathan Forces Action'}
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {isHindi ? st.solutionOverviewHi : st.solutionOverviewEn}
              </p>
            </div>
          </div>
        </section>

        {/* 3. GROUND ACTION TOOLS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              {isHindi ? 'इस ब्लूप्रिंट के विशेष टूल्स' : 'Specialized Ground Tools for this Blueprint'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {isHindi ? 'आपकी जमीनी टीम के लिए 1-क्लिक समाधान।' : 'Engineered for instant ground mobilization and accountability.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {st.keyTools.map((tool, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
                    {renderIcon(tool.icon)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {isHindi ? tool.nameHi : tool.nameEn}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {isHindi ? tool.descHi : tool.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. STEP-BY-STEP EXECUTION WORKFLOW */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              {isHindi ? 'जमीन पर काम कैसे होता है?' : 'How Leaders Execute on Ground'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {st.stepWorkflow.map((step, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative">
                <span className="text-3xl font-black text-slate-300 font-mono block mb-3">
                  {isHindi ? step.stepHi : step.stepEn}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {isHindi ? step.titleHi : step.titleEn}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {isHindi ? step.detailHi : step.detailEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. STATUTORY LEGAL PROVISIONS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                {isHindi ? 'कानूनी प्रावधान व अदालती आदेश' : 'Legal Provisions & Court Mandates'}
              </h2>
            </div>

            <div className="space-y-4">
              {st.statutoryActs.map((act, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">
                      {isHindi ? act.titleHi : act.titleEn}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm">
                      {isHindi ? act.descHi : act.descEn}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded border border-slate-300 shrink-0 self-start md:self-center">
                    {act.provision}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. SUBTYPE FAQS FOR AI & GOOGLE */}
        {st.faqs.length > 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                {isHindi ? 'अक्सर पूछे जाने वाले सवाल (FAQ)' : 'Frequently Asked Questions'}
              </h2>
            </div>

            <div className="space-y-4">
              {st.faqs.map((faq, idx) => (
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

        {/* 7. SIBLING BLUEPRINTS EXPLORER */}
        {siblingSubtypes.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900">
                {isHindi ? `${orgType.titleHi} के अन्य ब्लूप्रिंट्स:` : `Other Blueprints in ${orgType.titleEn}:`}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {siblingSubtypes.map((sib) => (
                <Link
                  key={sib.id}
                  href={`/${lang}/solutions/${type}/${sib.slug}`}
                  className="bg-white border border-slate-200 hover:border-indigo-400 p-4 rounded-lg transition-colors group flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                    {isHindi ? sib.titleHi : sib.titleEn}
                  </span>
                  <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 8. LIGHT TECHNICAL CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              {isHindi ? 'यह ब्लूप्रिंट अपने संगठन में लागू करें' : 'Deploy This Blueprint with Sangathan'}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-6">
              {isHindi
                ? 'जमीनी नागरिक समूहों के लिए ₹0 हमेशा निःशुल्क। 60 सेकंड में शुरू करें।'
                : '100% free forever for grassroots civic collectives. Ready to deploy in seconds.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/${lang}/login?tab=signup`}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 text-sm rounded-md shadow-sm transition-all"
              >
                {isHindi ? 'निःशुल्क शुरू करें' : 'Get Started Free'}
              </Link>
              <Link
                href={`/${lang}/solutions/${type}`}
                className="w-full sm:w-auto bg-white text-slate-800 font-bold px-6 py-3.5 text-sm rounded-md border border-slate-300 hover:bg-slate-100 transition-all"
              >
                {isHindi ? 'संगठन मॉडल देखें' : 'View Archetype Overview'}
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
