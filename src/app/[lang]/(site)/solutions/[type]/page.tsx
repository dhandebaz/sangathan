import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { 
  ArrowRight, ShieldCheck, Activity, Printer, Clock, FileText, 
  Receipt, Wallet, Users, Vote, Scale, AlertTriangle, CheckSquare, 
  Building2, HardHat, ChevronRight, HelpCircle, Sparkles, CheckCircle2 
} from 'lucide-react'
import { SOLUTIONS_DATA } from '@/lib/solutions-data'
import { SolutionJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

interface SolutionPageProps {
  params: Promise<{
    lang: string
    type: string
  }>
}

export async function generateStaticParams() {
  const types = Object.keys(SOLUTIONS_DATA)
  const languages = ['en', 'hi']
  const params: { lang: string; type: string }[] = []

  for (const lang of languages) {
    for (const type of types) {
      params.push({ lang, type })
    }
  }

  return params
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { lang, type } = await params
  const solution = SOLUTIONS_DATA[type]
  if (!solution) return {}

  const isHindi = lang === 'hi'
  const title = isHindi ? solution.metaTitleHi : solution.metaTitleEn
  const description = isHindi ? solution.metaDescHi : solution.metaDescEn

  return {
    title,
    description,
    keywords: solution.keywords,
    alternates: {
      canonical: `https://sangathan.space/${lang}/solutions/${type}`,
      languages: {
        en: `https://sangathan.space/en/solutions/${type}`,
        hi: `https://sangathan.space/hi/solutions/${type}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sangathan.space/${lang}/solutions/${type}`,
      siteName: 'Sangathan',
      type: 'website',
      images: [
        {
          url: '/images/activist-leader.png',
          width: 800,
          height: 600,
          alt: isHindi ? solution.titleHi : solution.titleEn,
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
    default: return <Sparkles className={className} />
  }
}

export default async function SolutionOrgTypePage({ params }: SolutionPageProps) {
  const { lang, type } = await params
  const solution = SOLUTIONS_DATA[type]

  if (!solution) {
    notFound()
  }

  const isHindi = lang === 'hi'

  const structuredFeatures = solution.coreTools.map((t) => ({
    name: isHindi ? t.nameHi : t.nameEn,
    description: isHindi ? t.descHi : t.descEn,
  }))

  const structuredFaqs = solution.faqs.map((f) => ({
    question: isHindi ? f.questionHi : f.questionEn,
    answer: isHindi ? f.answerHi : f.answerEn,
  }))

  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      <SolutionJsonLd
        title={isHindi ? solution.titleHi : solution.titleEn}
        description={isHindi ? solution.metaDescHi : solution.metaDescEn}
        url={`https://sangathan.space/${lang}/solutions/${type}`}
        category="CivicGovernanceApplication"
        features={structuredFeatures}
        faqs={structuredFaqs}
      />
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'समाधान' : 'Solutions', url: `https://sangathan.space/${lang}/solutions` },
          { name: isHindi ? solution.titleHi : solution.titleEn, url: `https://sangathan.space/${lang}/solutions/${type}` },
        ]}
      />

      {/* Background Dot Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative z-10">
        
        {/* 1. HERO SECTION WITH PROMINENT ACTIVIST LEADER IMAGE */}
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Mission & Core Value */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black tracking-tight text-slate-900 leading-[1.08]">
                {isHindi ? solution.heroHeadlineHi : solution.heroHeadlineEn}
              </h1>
              
              {/* Subheading */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {isHindi ? solution.heroSubheadlineHi : solution.heroSubheadlineEn}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link 
                  href={`/${lang}/login?tab=signup`} 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-4 font-bold text-sm transition-all flex items-center justify-center gap-2.5 rounded-md shadow-sm min-h-[48px]"
                >
                  <span>{isHindi ? 'निःशुल्क संगठन शुरू करें' : 'Start Collective (Free)'}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link 
                  href={`/${lang}/compare`} 
                  className="bg-white text-slate-800 px-6 py-4 font-bold text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 rounded-md min-h-[48px]"
                >
                  <span>{isHindi ? 'अन्य टूल्स से तुलना' : 'Compare with Other Tools'}</span>
                </Link>
              </div>

              {/* Micro Proof Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-200 text-[11px] font-semibold text-slate-600 text-left">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>₹0 Free Tier</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Mobile PWA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Indian Acts Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero Data Selling</span>
                </div>
              </div>
            </div>

            {/* Right Column: Charismatic Activist Leader Anchor */}
            <div className="lg:col-span-5 flex flex-col items-center relative">
              <div className="relative w-full max-w-md bg-gradient-to-b from-slate-50 via-slate-50/50 to-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs overflow-hidden">
                
                {/* Tech Geometry */}
                <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-slate-200 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 border-t border-r border-slate-200 pointer-events-none" />
                
                {/* Main Leader Image */}
                <div className="relative w-full h-[360px] sm:h-[430px] flex items-end justify-center">
                  <Image
                    src="/images/activist-leader.png"
                    alt={`Activist and Leader - ${isHindi ? solution.titleHi : solution.titleEn}`}
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
                      <strong className="text-slate-900 block">{isHindi ? 'सत्यापित आंदोलन अवसंरचना' : 'Verified Movement Infrastructure'}</strong>
                      <span className="text-slate-500">{isHindi ? solution.titleHi : solution.titleEn}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded border border-emerald-300">
                      Active
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                  <div className="bg-slate-900/90 text-white backdrop-blur-xs border border-slate-700 rounded p-2.5 text-left shadow-xs flex items-center justify-between">
                    <div className="text-[11px] leading-tight">
                      <span className="font-bold text-emerald-400 block">{isHindi ? 'वैधानिक सुरक्षा सक्रिय' : 'Statutory Shield Active'}</span>
                      <span className="text-[10px] text-slate-300">{isHindi ? solution.categoryBadgeHi : solution.categoryBadgeEn}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-slate-600">
                      BQF Verified
                    </span>
                  </div>
                </div>

              </div>

              <div className="mt-3 text-center">
                <p className="text-xs font-bold text-slate-700">
                  {isHindi ? solution.activistQuoteHi : solution.activistQuoteEn}
                </p>
                <span className="text-[11px] text-slate-400 font-mono">
                  {isHindi ? solution.quoteAttributionHi : solution.quoteAttributionEn}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 2. FOUR GROUND PILLARS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              {isHindi ? 'जमीनी मोर्चे के 4 मुख्य आधार' : '4 Pillars of Ground Execution'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {isHindi
                ? 'कागजी खानापूर्ति नहीं, वास्तविक प्रशासनिक दबाव और सामूहिक शक्ति।'
                : 'Engineered specifically to solve real administrative roadblocks faced by Indian organizers.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solution.groundPillars.map((pillar, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800 mb-4 shadow-xs">
                  {renderIcon(pillar.icon)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isHindi ? pillar.titleHi : pillar.titleEn}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {isHindi ? pillar.descHi : pillar.descEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SUBTYPES & FOCUS BLUEPRINTS SELECTOR */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {isHindi ? 'अपने कार्यक्षेत्र का ब्लूप्रिंट चुनें' : 'Tailored for Your Exact Ground Focus'}
              </h2>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm max-w-md">
              {isHindi
                ? 'प्रत्येक ब्लूप्रिंट पूर्व-कॉन्फ़िगर की गई भूमिकाओं, कानूनी नोटिस प्रारूपों और कार्यप्रणाली से लैस है।'
                : 'Each blueprint comes pre-loaded with specialized governance roles, statutory notice formats, and ground desks.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solution.subtypes.map((st) => (
              <Link
                key={st.id}
                href={`/${lang}/solutions/${type}/${st.slug}`}
                className="group bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-6 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700">
                      {isHindi ? 'ब्लूप्रिंट' : 'Blueprint'}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {isHindi ? 'विस्तार से देखें' : 'Explore Blueprint'}
                      <ChevronRight size={14} />
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {isHindi ? st.titleHi : st.titleEn}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {isHindi ? st.taglineHi : st.taglineEn}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{st.keyTools.length} {isHindi ? 'विशेष उपकरण' : 'Ground Tools'}</span>
                  <span>{st.statutoryActs.length} {isHindi ? 'वैधानिक कानून' : 'Statutory Provisions'}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. CORE DIGITAL TOOLS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              {isHindi ? 'उद्देश्य-निर्मित मुख्य टूल्स' : 'Purpose-Built Ground Tool Suite'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {isHindi
                ? 'फील्ड में काम करने वाले कार्यकर्ताओं के लिए सरल और शक्तिशाली डिजिटल हथियार।'
                : 'Zero-clutter ground interfaces designed for rapid mobile action in field conditions.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solution.coreTools.map((tool, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                      {renderIcon(tool.icon)}
                    </div>
                    {tool.badge && (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
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

        {/* 5. STATUTORY & LEGAL COMPLIANCE */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                {isHindi ? 'कानूनी अनुपालन व ऑडिट सुरक्षा' : 'Legal Compliance & Audit Shield'}
              </h2>
              <p className="text-slate-600 text-sm">
                {isHindi
                  ? 'संगठन भारतीय कानूनों, अपीलों और ऑडिट आवश्यकताओं के अनुसार स्वतः दस्तावेज तैयार करता है।'
                  : 'Sangathan automatically maps operational records directly to applicable Indian statutory acts and court mandates.'}
              </p>
            </div>

            <div className="space-y-4">
              {solution.statutoryCompliance.map((stat, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="font-bold text-slate-900 text-sm sm:text-base">
                    {stat.actName}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600">
                    <strong className="block text-slate-800 font-semibold mb-1">
                      {isHindi ? 'पंजीकरण स्थिति:' : 'Registration Standing:'}
                    </strong>
                    {isHindi ? stat.registrationRequirementHi : stat.registrationRequirementEn}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600">
                    <strong className="block text-slate-800 font-semibold mb-1">
                      {isHindi ? 'वैधानिक फाइलिंग:' : 'Key Filings & Registers:'}
                    </strong>
                    {isHindi ? stat.keyFilingsHi : stat.keyFilingsEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. HIGH-VALUE FAQ ACCORDION FOR SEARCH & AI */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
              {isHindi ? 'अक्सर पूछे जाने वाले सवाल (FAQ)' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              {isHindi ? 'आपके प्रश्नों के स्पष्ट व सीधे उत्तर।' : 'Clear, factual answers for organizers, leaders, and search engines.'}
            </p>
          </div>

          <div className="space-y-4">
            {solution.faqs.map((faq, idx) => (
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

        {/* 7. LIGHT TECHNICAL CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              {isHindi ? `अपने ${solution.titleHi} को आज ही सक्रिय करें` : `Start Your ${solution.titleEn} Today`}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-6">
              {isHindi
                ? 'जमीनी नागरिक समूहों के लिए ₹0 हमेशा निःशुल्क। 60 सेकंड में शुरू करें।'
                : '100% free forever for grassroots civic collectives. Set up in under 60 seconds.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/${lang}/login?tab=signup`}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 text-sm rounded-md shadow-sm transition-all"
              >
                {isHindi ? 'निःशुल्क खाता बनाएं' : 'Create Free Account'}
              </Link>
              <Link
                href={`/${lang}/solutions`}
                className="w-full sm:w-auto bg-white text-slate-800 font-bold px-6 py-3.5 text-sm rounded-md border border-slate-300 hover:bg-slate-100 transition-all"
              >
                {isHindi ? 'अन्य सभी मॉडल देखें' : 'Explore All Models'}
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
