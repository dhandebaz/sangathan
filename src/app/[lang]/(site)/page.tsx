import Link from 'next/link'
import { Metadata } from 'next'
import { 
  ArrowRight, ShieldCheck, Activity, Printer, Clock, FileText, 
  Users, Vote, Scale, Check, CheckSquare, Building2, Megaphone,
  Smartphone, MessageSquare, Banknote, Globe, Sparkles, Lock
} from 'lucide-react'
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: {
      absolute: isHindi
        ? 'संगठन - नागरिक समूहों और एनजीओ के लिए डिजिटल बुनियादी ढांचा | संगठन'
        : 'Sangathan - Digital Operating System for Civic Movements & Collectives | Sangathan',
    },
    description: isHindi
      ? 'नागरिक समूहों, पर्यावरण कार्यकर्ताओं और एनजीओ के लिए जमीनी डिजिटल हथियार। 1-टैप फील्ड जांच, ₹1 पर्चे, आरटीआई ट्रैकर एवं विधिक सुरक्षा।'
      : 'The zero-tech, mobile-first operating system for civic collectives, citizen science networks, and NGOs. 1-tap spot audits, ₹1 printable Parchas, 30-day RTI reminders, and BQF community recognition.',
    alternates: {
      canonical: `https://sangathan.space/${lang}`,
      languages: {
        'en': 'https://sangathan.space/en',
        'hi': 'https://sangathan.space/hi',
      },
    },
    openGraph: {
      title: isHindi ? 'संगठन — नागरिक आंदोलनों व समूहों का डिजिटल ऑपरेटिंग सिस्टम' : 'Sangathan — Digital Operating System for Civic Movements & Collectives',
      description: isHindi
        ? 'नागरिक समूहों, पर्यावरण कार्यकर्ताओं और एनजीओ के लिए जमीनी डिजिटल हथियार।'
        : 'The zero-tech, mobile-first operating system for civic collectives, citizen science networks, and NGOs.',
      url: `https://sangathan.space/${lang}`,
      siteName: 'Sangathan',
      locale: isHindi ? 'hi_IN' : 'en_US',
      images: [
        {
          url: `https://sangathan.space/api/og?lang=${lang}&type=collective&tag=Civic+Operating+System`,
          width: 1200,
          height: 630,
          alt: isHindi ? 'संगठन - नागरिक आंदोलनों का डिजिटल बुनियादी ढांचा' : 'Sangathan - Civic Movement Operating System',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@areynetaji',
      creator: '@areynetaji',
      title: isHindi ? 'संगठन — नागरिक आंदोलनों व समूहों का डिजिटल ऑपरेटिंग सिस्टम' : 'Sangathan — Digital Operating System for Civic Movements & Collectives',
      description: isHindi
        ? 'नागरिक समूहों, पर्यावरण कार्यकर्ताओं और एनजीओ के लिए जमीनी डिजिटल हथियार।'
        : 'The zero-tech, mobile-first operating system for civic collectives, citizen science networks, and NGOs.',
      images: [`https://sangathan.space/api/og?lang=${lang}&type=collective&tag=Civic+Operating+System`],
    },
  }
}

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-rose-100 overflow-x-hidden">
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd items={[
        { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
      ]} />
      
      {/* Background Dot Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative z-10">
        
        {/* 1. HERO SECTION - High-Energy Activist-Anchored & Mobile-First */}
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Mission & Core Value */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-black tracking-tight text-slate-900 leading-[1.08]">
                {isHindi ? (
                  <>
                    अपनी बस्ती के लिए अनुमति नहीं, <br className="hidden sm:inline" />
                    <span className="text-rose-600">संगठन चाहिए।</span>
                  </>
                ) : (
                  <>
                    You Don&apos;t Need Permission to Fix Your Colony. <br className="hidden sm:inline" />
                    <span className="text-rose-600">You Need Sangathan.</span>
                  </>
                )}
              </h1>
              
              {/* Subheading */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {isHindi
                  ? 'नागरिक समूहों, पर्यावरण शोधकर्ताओं और एनजीओ के लिए पूर्ण डिजिटल हथियार। 1-टैप जांच, ₹1 फोटोस्टेट पर्चे, 30-दिवसीय आरटीआई याद एवं सामुदायिक मान्यता।'
                  : 'The zero-tech, mobile-first operating system for civic collectives, citizen science networks, and NGOs. 1-tap spot audits, ₹1 printable Parchas, 30-day RTI reminders, and BQF community recognition.'}
              </p>
              
              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link 
                  href={`/${lang}/login?tab=signup`} 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-4 font-bold text-sm transition-all flex items-center justify-center gap-2.5 rounded-md shadow-sm min-h-[48px]"
                >
                  <span>{isHindi ? 'संगठन शुरू करें (निःशुल्क)' : 'Start Your Collective (Free)'}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link 
                  href={`/${lang}/solutions`} 
                  className="bg-white text-slate-800 px-6 py-4 font-bold text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 rounded-md min-h-[48px]"
                >
                  <Sparkles size={16} className="text-rose-600" />
                  <span>{isHindi ? 'सभी समाधान व ब्लूप्रिंट्स देखें' : 'Explore All Solutions & Blueprints'}</span>
                </Link>
              </div>

              {/* Mobile-Friendly Micro-Proof Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-200 text-[11px] font-semibold text-slate-600 text-left">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Mobile & PWA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>₹1 A4 Photostat Parcha</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>30-Day RTI Reminder</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>BQF Sec 8 Indemnity</span>
                </div>
              </div>
            </div>

            {/* Right Column: Geometric Field Toolkit Panel */}
            <div className="lg:col-span-5 flex flex-col items-center relative">
              <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">

                {/* Corner geometry */}
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-slate-300 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-slate-300 pointer-events-none" />

                {/* Panel header */}
                <div className="px-5 pt-5 pb-3 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-900">
                    {isHindi ? 'फील्ड टूलकिट' : 'FIELD TOOLKIT'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">01–04</span>
                </div>

                {/* Module stack — real platform modules */}
                <div className="px-5 py-4 space-y-0">
                  {[
                    { icon: Activity, name: isHindi ? 'स्पॉट सेंसर ऑडिट' : 'Spot Sensor Audits', meta: 'PM2.5 · PM10 · TDS', href: `/${lang}/features` },
                    { icon: Printer, name: isHindi ? '₹1 फोटोस्टेट पर्चे' : '₹1 Photostat Parchas', meta: isHindi ? 'ए4 काला-सफेद' : 'A4 Monochrome', href: `/${lang}/features` },
                    { icon: Clock, name: isHindi ? 'शिकायत डायरी व आरटीआई' : 'Complaint Diary & RTI', meta: isHindi ? '30-दिवसीय याद' : '30-Day Reminder', href: `/${lang}/features` },
                    { icon: Vote, name: isHindi ? 'गुप्त मतदान' : 'Secret Ballots', meta: isHindi ? 'गुमनाम मतदान' : 'Anonymous Voting', href: `/${lang}/features` },
                  ].map((mod, idx) => (
                    <div key={idx} className="relative">
                      {idx > 0 && <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-200" />}
                      <Link href={mod.href} className="relative flex items-center gap-3.5 py-3.5 group">
                        <div className="w-10 h-10 shrink-0 bg-slate-50 border border-slate-200 rounded flex items-center justify-center group-hover:border-slate-400 transition-colors">
                          <mod.icon className="text-slate-700" size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 leading-tight">{mod.name}</div>
                          <div className="text-[10px] font-mono text-slate-500 mt-0.5">{mod.meta}</div>
                        </div>
                        <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Panel footer */}
                <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50/60">
                  <Link href={`/${lang}/features`} className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-700 hover:text-slate-900 transition-colors">
                    <span>{isHindi ? 'पूरा टूलकिट देखें' : 'VIEW FULL TOOLKIT'}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              <div className="mt-4 text-center max-w-md">
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  {isHindi ? '“अधिकारियों से मौखिक शिकायत नहीं, तारीख वाली लिखित रिसीविंग से हिसाब रखें।”' : '“Don’t rely on verbal complaints. Keep dated written records with stamped receiving numbers.”'}
                </p>
                <span className="text-[11px] text-slate-400 font-mono">
                  Ground Movement Standard • Citizen Science & Civic Collectives
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 2. ACTIVIST MANIFESTO & THE 4 PILLARS OF GROUND ACTION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                {isHindi ? 'लिखित रिकॉर्ड से जवाब कैसे मिलता है?' : 'Why Written Records Get Responses'}
              </h2>
            </div>
            <p className="text-slate-500 max-w-md text-xs sm:text-sm leading-relaxed">
              {isHindi
                ? 'सरकारी बाबू और निगम अधिकारी मौखिक बातों को नजरअंदाज करते हैं। वे केवल लिखित, स्टैम्प्ड और वैधानिक रिकॉर्ड से जवाबदेह बनते हैं।'
                : 'Babus and politicians ignore verbal pleas and casual tweets. They only act when faced with physical stamped receiving and statutory RTI penalties.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Pillar 1: Field Audits */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-rose-300 transition-colors shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  1-Tap Spot Sensor Audits
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Log geotagged PM2.5, PM10, TDS water readings, and waste burning on the spot. Generate instant DPCC/CPCB violation notices citing the Air Act 1981 and CAQM GRAP.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-mono text-rose-700 font-bold">
                Citizen Science Model
              </div>
            </div>

            {/* Pillar 2: Printable Parchas */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-rose-300 transition-colors shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                  <Printer className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  ₹1 Photostat Parchas
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  1-page high-contrast A4 leaflets for cheap colony photocopy machines, paired with pen-and-paper resident signature sheets for park meetings and chai stalls.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-mono text-slate-700 font-bold">
                Photostat & Chai Stall Ready
              </div>
            </div>

            {/* Pillar 3: Stamped Receiving & RTI */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-amber-300 transition-colors shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Complaint Diary & RTI Helper
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Save stamped diary numbers with photos and dates. Get a 30-day reminder and a Section 6(1) RTI draft that you print, sign and submit yourself.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-mono text-amber-800 font-bold">
                Dated Written Record
              </div>
            </div>

            {/* Pillar 4: BQF Legal Shield */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-indigo-300 transition-colors shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  BQF Community Recognition
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Active collectives can seek affiliation with Bahujan Queer Foundation (Delhi Reg. Section 8 NGO) for community credibility. This is recognition by a non-profit, not legal immunity or government registration.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-mono text-indigo-700 font-bold">
                No Registration Needed
              </div>
            </div>

          </div>
        </section>

        {/* 3. THE 2 MOVEMENT ARCHETYPES */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 mb-2">
              {isHindi ? 'हर प्रकार के नागरिक समूह के लिए समर्पित व्यवस्था' : 'Choose Your Battlefield & Launch Your Workspace'}
            </h2>
            <p className="text-slate-600 text-sm">
              {isHindi ? '2 मुख्य संगठन मॉडल और 8 विशेष कार्यक्षेत्र ब्लूप्रिंट्स।' : '2 movement archetypes and 8 specialized focus blueprints.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Civic Collectives */}
            <Link 
              href={`/${lang}/solutions/civic-collective`} 
              className="bg-white border-2 border-rose-200 rounded-lg p-6 hover:border-rose-400 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-rose-50 text-rose-700 rounded flex items-center justify-center">
                    <Megaphone className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {isHindi ? 'नागरिक समूह व जमीनी आंदोलन' : 'Civic Collectives & Movements'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Neighborhood action groups, environmental & citizen science researchers, basti committees, and mutual aid collectives.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium mb-4">
                  <li className="flex items-center gap-1.5"><Check size={14} className="text-rose-600" /> Spot Sensor Audits (PM2.5/TDS)</li>
                  <li className="flex items-center gap-1.5"><Check size={14} className="text-rose-600" /> Printable A4 Parchas & Signatures</li>
                  <li className="flex items-center gap-1.5"><Check size={14} className="text-rose-600" /> Stamped Receiving & RTI Tracker</li>
                  <li className="flex items-center gap-1.5"><Check size={14} className="text-rose-600" /> BQF Community Recognition</li>
                </ul>
              </div>
              <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                Explore Civic Solutions <ArrowRight size={14} />
              </span>
            </Link>

            {/* 2. NGOs */}
            <Link 
              href={`/${lang}/solutions/ngo`} 
              className="bg-white border border-slate-200 rounded-lg p-6 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {isHindi ? 'पंजीकृत स्वयंसेवी संगठन (NGO)' : 'Registered NGOs & Trusts'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Non-profits managing field staff, donors, and state compliance.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium mb-4">
                  <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> 80G-Ready Tax Receipts</li>
                  <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Grant Tranche Accounting</li>
                  <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> AI CSR Scheme Matcher</li>
                  <li className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Volunteer Hour Certificates</li>
                </ul>
              </div>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                Explore NGO Solutions <ArrowRight size={14} />
              </span>
            </Link>

            {/* 6. Quick Start Box (Clean, Light, Technical Design) */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isHindi ? '60 सेकंड में शुरू करें' : 'Ready in 60 Seconds'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {isHindi
                    ? 'कोई सर्वर सेटअप नहीं। बस अपना संगठन प्रकार चुनें, साथियों को आमंत्रित करें और जमीनी काम शुरू करें।'
                    : 'No complex IT setups. Select your movement archetype, invite comrades, and deploy ground tools immediately.'}
                </p>
              </div>
              <Link 
                href={`/${lang}/login?tab=signup`} 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                <span>{isHindi ? 'नया संगठन शुरू करें' : 'Launch Workspace'}</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        </section>

        {/* 4. CORE TECHNICAL CAPABILITIES (Grid) */}
        <section className="py-20 border-t border-slate-200 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 mb-2">
                {isHindi ? 'पूर्ण संप्रभु व सुरक्षित बुनियादी ढांचा' : 'Built for Sovereign Data & High-Stakes Governance'}
              </h2>
              <p className="text-slate-600 text-sm">
                {isHindi ? 'लोकतांत्रिक पारदर्शिता, अपरिवर्तनीय ऑडिट लॉग्स और पूर्ण डेटा स्वायत्तता।' : 'Democratic transparency, immutable audit logs, and complete data autonomy.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: MessageSquare, title: 'Unified Inbox & Google Meet', desc: 'Direct 2-way member chats, Telegram bots, and 1-click Google Meet video rooms.' },
                { icon: CheckSquare, title: 'Centralized Calendar & iCal', desc: 'Synchronized assemblies, meeting schedules, and Apple/Google Calendar live sync.' },
                { icon: Users, title: 'Verified Badges & People Hub', desc: 'Member rolls, printable digital ID credentials, and committee management.' },
                { icon: Vote, title: 'Secret Anonymous Ballots', desc: 'Cryptographic voting with instant tamper-evident tallies.' },
                { icon: Banknote, title: 'Transparent Ledgers', desc: 'Auto-reconciled UPI donations and public expenditure books.' },
                { icon: ShieldCheck, title: 'Immutable Audit Logs', desc: 'WORM log storage ensuring absolute administrative accountability.' },
                { icon: Smartphone, title: 'Offline-First PWA', desc: 'Zero-connectivity door-to-door data capture with auto-sync.' },
                { icon: Lock, title: 'Tenant Data Isolation', desc: 'PostgreSQL Row Level Security (RLS) across all tables.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-5 rounded-lg shadow-2xs hover:border-slate-300 transition-colors">
                  <item.icon className="text-slate-700 mb-3" size={22} strokeWidth={1.75} />
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BUILT FOR INDIA & WHATSAPP GENERATION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4">
                  {isHindi ? 'भारतीय प्रशासनिक व सामाजिक संरचनाओं के अनुरूप' : 'Engineered for Indian Wards, Bastis & Campuses'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
                {isHindi 
                  ? 'संगठन को भारत की जमीनी चुनौतियों के लिए तैयार किया गया है। कम कीमत वाले स्मार्टफोन, धीमे 2G/3G नेटवर्क, और हिंदी तथा क्षेत्रीय भाषाओं में सहजता से काम करता है।' 
                  : 'Sangathan is engineered from the ground up for Indian civic realities: low-cost smartphones, poor connectivity, bilingual workflows, and statutory legal accountability.'}
              </p>
              <div className="space-y-3 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="text-rose-600 w-4 h-4" />
                  <span>Direct UPI & QR Code integration for chanda and membership fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-rose-600 w-4 h-4" />
                  <span>Full Hindi & English bilingual user experience across all modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-rose-600 w-4 h-4" />
                  <span>Compliant with RTI Act 2005, Air Act 1981, and DMC Municipal Rules</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="border border-slate-200 p-5 bg-white rounded-lg">
                <Smartphone className="text-rose-600 mb-2.5" size={22} />
                <h4 className="text-slate-900 font-bold text-xs mb-1">Low-End Android Ready</h4>
                <p className="text-slate-500 text-xs">Lightweight bundle loading instantly even on ₹6,000 devices.</p>
              </div>
              <div className="border border-slate-200 p-5 bg-white rounded-lg">
                <Globe className="text-rose-600 mb-2.5" size={22} />
                <h4 className="text-slate-900 font-bold text-xs mb-1">Hindi & Regional Plurality</h4>
                <p className="text-slate-500 text-xs">Zero English jargon barrier for colony and basti members.</p>
              </div>
              <div className="border border-slate-200 p-5 bg-white rounded-lg">
                <Scale className="text-rose-600 mb-2.5" size={22} />
                <h4 className="text-slate-900 font-bold text-xs mb-1">Community Recognition</h4>
                <p className="text-slate-500 text-xs">Community recognition through BQF Section 8 Non-Profit affiliation (not legal immunity).</p>
              </div>
              <div className="border border-slate-200 p-5 bg-white rounded-lg">
                <Printer className="text-rose-600 mb-2.5" size={22} />
                <h4 className="text-slate-900 font-bold text-xs mb-1">A4 Printable Dispatch</h4>
                <p className="text-slate-500 text-xs">1-click black & white print layouts for ₹1 photostat shops.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. LATEST GROUND RELEASE */}
        <section className="py-16 border-t border-b border-slate-200 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {isHindi ? 'हालिया नागरिक विज्ञान व फील्ड सुविधाएं' : 'Latest Citizen Science & Ground Features'}
                </h2>
              </div>
              <Link href={`/${lang}/changelog`} className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1">
                {isHindi ? 'सभी अपडेट देखें' : 'View Full Changelog'} <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="border border-slate-200 p-4 bg-white rounded-lg">
                <h4 className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                  <span>Unified Inbox & Google Meet</span>
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">2-way member chats, Telegram bots, and instant Google Meet video rooms</p>
              </div>
              <div className="border border-slate-200 p-4 bg-white rounded-lg">
                <h4 className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Centralized Calendar & iCal</span>
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">Live Apple iCal background sync and 1-click Google Calendar API integration</p>
              </div>
              <div className="border border-slate-200 p-4 bg-white rounded-lg">
                <h4 className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-600" />
                  <span>Spot Sensor Audits</span>
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">Geotagged PM2.5, PM10, and TDS field testing desk with legal notices</p>
              </div>
              <div className="border border-slate-200 p-4 bg-white rounded-lg">
                <h4 className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5 text-rose-600" />
                  <span>1-Page A4 Parchas</span>
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">Printable monochrome flyers and physical signature sheets for colonies</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. TRANSPARENT DATA PRACTICES & VERIFIED GOOGLE INTEGRATIONS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 mb-2">
                {isHindi ? 'डेटा संप्रभुता, सुरक्षा और पारदर्शी एकीकरण' : 'Transparent Data Architecture & Verified Google Sync'}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
                {isHindi
                  ? 'संगठन आपके आंदोलन के डेटा की संप्रभुता और गोपनीयता का सम्मान करता है। हम केवल वही डेटा मांगते हैं जो सदस्य आमंत्रण और प्रशासनिक समन्वय के लिए आवश्यक हो।'
                  : 'Sangathan is built on sovereign data isolation and strict privacy commitments. Optional Google integrations exist solely to empower grassroots organizers to onboard members, migrate past survey data, and coordinate community assemblies.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link 
                href={`/${lang}/privacy`} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1"
              >
                <ShieldCheck size={14} className="text-indigo-600" />
                <span>{isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}</span>
              </Link>
              <Link 
                href={`/${lang}/data-practices`} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded transition-colors"
              >
                {isHindi ? 'डेटा प्रथाएं' : 'Data Practices'}
              </Link>
              <Link 
                href={`/${lang}/terms`} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded transition-colors"
              >
                {isHindi ? 'सेवा शर्तें' : 'Terms of Service'}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Google Contacts */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors shadow-2xs flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isHindi ? 'गूगल संपर्क व कैडर आमंत्रण' : 'Google Contacts & Member Intake'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isHindi
                    ? '1-क्लिक में अपने Google Contacts से नाम, ईमेल और फोन नंबर चुनकर सीधे सदस्य डायरेक्टरी में जोड़ें या आमंत्रण भेजें।'
                    : '1-click selectively import names, emails, and phone numbers from your address book to invite organizers and populate your collective roster with zero manual typing.'}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] font-mono text-rose-700 font-bold">
                contacts.readonly
              </div>
            </div>

            {/* Card 2: Google Sheets & Forms */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors shadow-2xs flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isHindi ? 'गूगल शीट्स व फॉर्म्स माइग्रेटर' : 'Sheets & Forms Ingestion'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'अपनी मौजूदा सदस्य शीट्स या पुराने गूगल फॉर्म सर्वे रिस्पॉन्स को सीधे संगठन फॉर्म स्टूडियो में आयात करें।'
                    : 'Connect Google Sheets or Forms to migrate legacy survey responses, questions, and volunteer intake data with automated column detection and deduplication.'}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] font-mono text-emerald-700 font-bold">
                spreadsheets & forms.readonly
              </div>
            </div>

            {/* Card 3: Google Calendar */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors shadow-2xs flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isHindi ? 'कैलेंडर व सभा समन्वय' : 'Calendar & Assembly Sync'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'संगठन की आम सभाओं, वार्ड बैठकों और फील्ड सर्वेयर ड्यूटी को अपने व्यक्तिगत या संगठन कैलेंडर के साथ सिंक करें।'
                    : 'Synchronize community assemblies, ward grievance hearings, and field survey pairings directly with Google Calendar and Apple iCal live feeds.'}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] font-mono text-amber-700 font-bold">
                calendar.events
              </div>
            </div>

            {/* Card 4: Limited Use & Sovereign Isolation */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors shadow-2xs flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isHindi ? 'गूगल लिमिटेड यूज़ व RLS सुरक्षा' : 'Limited Use & PostgreSQL RLS'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'डेटा कभी बेचा या विज्ञापनों के लिए उपयोग नहीं किया जाता। रो-लेवल सिक्योरिटी (RLS) द्वारा पूर्ण अलगाव और 1-क्लिक अनुमति निरस्तीकरण।'
                    : 'Strict adherence to Google API Services User Data Policy. No data sales, no advertising/profiling, encrypted PostgreSQL RLS isolation, and 1-click user revocation.'}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] font-mono text-indigo-700 font-bold">
                Limited Use Compliant
              </div>
            </div>

          </div>
        </section>

        {/* 8. FINAL CALL TO ACTION - Light, Crisp, Geometric Technical Design */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="border border-slate-300 p-8 sm:p-14 bg-slate-50 rounded-xl space-y-6 shadow-xs">
            <div className="w-12 h-12 bg-white border border-slate-200 text-slate-800 rounded-lg mx-auto flex items-center justify-center shadow-2xs">
              <Megaphone className="w-6 h-6" />
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              {isHindi ? 'अपनी कॉलोनी का पहला संगठन आज ही शुरू करें।' : 'Build Power in Your Colony Today.'}
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              {isHindi
                ? 'निःशुल्क कार्यक्षेत्र बनाएं। अपने पड़ोसियों और कार्यकर्ताओं को जोड़ें। कागजी पर्चे प्रिंट करें और अधिकारियों से जवाबदेही सुनिश्चित करें।'
                : 'Claim your free movement workspace. Mobilize your neighbors and comrades. Print physical Parchas and enforce statutory administrative accountability.'}
            </p>
            
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                href={`/${lang}/login?tab=signup`} 
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 font-bold text-xs sm:text-sm transition-colors rounded-md shadow-xs min-h-[48px] flex items-center justify-center gap-2"
              >
                <span>{isHindi ? 'संगठन शुरू करें (100% निःशुल्क)' : 'Start Your Collective (100% Free)'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link 
                href={`/${lang}/docs`} 
                className="w-full sm:w-auto bg-white text-slate-900 px-6 py-4 font-bold text-xs sm:text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-colors rounded-md min-h-[48px] flex items-center justify-center"
              >
                {isHindi ? 'दस्तावेज़ पढ़ें' : 'Read Documentation'}
              </Link>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  )
}
