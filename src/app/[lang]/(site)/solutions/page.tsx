import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { ArrowRight, Sparkles, ShieldCheck, Activity, Printer, Clock, FileText, CheckCircle2, ChevronRight } from 'lucide-react'
import { SOLUTIONS_DATA } from '@/lib/solutions-data'
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'नागरिक समाधान व संगठन प्रकार | संगठन' : 'Civic Solutions & Movement Archetypes | Sangathan',
    description: isHindi
      ? 'नागरिक समूहों और पंजीकृत एनजीओ के लिए उद्देश्य-निर्मित डिजिटल समाधान।'
      : 'Purpose-built civic solutions for grassroots collectives and registered NGOs.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/solutions`,
      languages: {
        en: 'https://sangathan.space/en/solutions',
        hi: 'https://sangathan.space/hi/solutions',
      },
    },
    openGraph: {
      title: isHindi ? 'नागरिक समाधान व संगठन प्रकार | संगठन' : 'Civic Solutions & Movement Archetypes | Sangathan',
      description: isHindi
        ? 'नागरिक समूहों और पंजीकृत एनजीओ के लिए उद्देश्य-निर्मित डिजिटल समाधान।'
        : 'Purpose-built civic solutions for grassroots collectives and registered NGOs.',
      url: `https://sangathan.space/${lang}/solutions`,
      siteName: 'Sangathan',
      type: 'website',
      images: [
        {
          url: `https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'नागरिक समाधान एवं संगठन ब्लूप्रिंट्स' : 'Civic Solutions & Movement Archetypes')}&desc=${encodeURIComponent(isHindi ? 'नागरिक समूहों और एनजीओ के लिए डिजिटल समाधान।' : 'Purpose-built civic solutions for grassroots collectives and NGOs.')}&type=collective&tag=Movement+Solutions&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: 'Sangathan Solutions',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@areynetaji',
      creator: '@areynetaji',
      title: isHindi ? 'नागरिक समाधान व संगठन प्रकार | संगठन' : 'Civic Solutions & Movement Archetypes | Sangathan',
      description: isHindi
        ? 'नागरिक समूहों और पंजीकृत एनजीओ के लिए उद्देश्य-निर्मित डिजिटल समाधान।'
        : 'Purpose-built civic solutions for grassroots collectives and registered NGOs.',
      images: [`https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'नागरिक समाधान एवं संगठन ब्लूप्रिंट्स' : 'Civic Solutions & Movement Archetypes')}&desc=${encodeURIComponent(isHindi ? 'नागरिक समूहों और एनजीओ के लिए डिजिटल समाधान।' : 'Purpose-built civic solutions for grassroots collectives and NGOs.')}&type=collective&tag=Movement+Solutions&lang=${lang}`],
    },
  }
}

export default async function SolutionsDirectoryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'
  const solutions = Object.values(SOLUTIONS_DATA)

  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'समाधान' : 'Solutions', url: `https://sangathan.space/${lang}/solutions` },
        ]}
      />

      {/* Background Dot Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative z-10">
        {/* HERO SECTION with Activist Leader Anchor */}
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08]">
                {isHindi ? (
                  <>
                    हर प्रकार के संगठन के लिए <br className="hidden sm:inline" />
                    <span className="text-indigo-600">विशेष डिजिटल हथियार।</span>
                  </>
                ) : (
                  <>
                    Purpose-Built Digital Weapons for <br className="hidden sm:inline" />
                    <span className="text-indigo-600">Every Movement Archetype.</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {isHindi
                  ? 'चाहे आप अनौपचारिक कॉलोनी समूह हों या पंजीकृत एनजीओ—संगठन आपकी जमीनी वास्तविकताओं के अनुरूप वैधानिक उपकरण प्रदान करता है।'
                  : 'Whether you lead an unregistered basti collective or a registered 80G non-profit—Sangathan provides ground-tested tools engineered for Indian statutory realities.'}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href={`/${lang}/login?tab=signup`}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2.5 rounded-md shadow-sm"
                >
                  <span>{isHindi ? 'निःशुल्क संगठन शुरू करें' : 'Start Collective (Free Forever)'}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href={`/${lang}/compare`}
                  className="bg-white text-slate-800 px-6 py-3.5 font-bold text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 rounded-md"
                >
                  <span>{isHindi ? 'अन्य ऐप्स से तुलना देखें' : 'Compare with Other Apps'}</span>
                </Link>
              </div>
            </div>

            {/* Activist Leader Anchor Card */}
            <div className="lg:col-span-5 flex flex-col items-center relative">
              <div className="relative w-full max-w-md bg-gradient-to-b from-slate-50 via-slate-50/60 to-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 border-b border-l border-slate-200 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-t border-r border-slate-200 pointer-events-none" />

                <div className="relative w-full h-[320px] sm:h-[380px] flex items-end justify-center">
                  <Image
                    src="/images/activist-leader.png"
                    alt="Grassroots Movement Leader - Sangathan Solutions"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-contain object-bottom drop-shadow-md"
                    priority
                  />
                </div>

                <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                  <div className="bg-slate-900/90 text-white backdrop-blur-xs border border-slate-700 rounded p-2.5 text-left shadow-xs flex items-center justify-between">
                    <div className="text-[11px] leading-tight">
                      <span className="font-bold text-indigo-400 block">Sovereign Civic Infrastructure</span>
                      <span className="text-[10px] text-slate-300">2 Archetypes • 8 Blueprints</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700">
                      ₹0 Community Tier
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5 CORE SOLUTIONS GRID */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              {isHindi ? 'संगठन मॉडल चुनें' : 'Choose Your Movement Archetype'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {isHindi
                ? 'प्रत्येक संगठन प्रकार के लिए समर्पित वर्कफ़्लो, कानूनी प्रावधान और जमीनी टूल्स।'
                : 'Explore deep-dive capabilities, statutory compliance frameworks, and operational ground tools tailored to your exact organization type.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((sol) => (
              <div
                key={sol.id}
                className="bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-6 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-slate-700">
                      {isHindi ? sol.categoryBadgeHi : sol.categoryBadgeEn}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {sol.subtypes.length} {isHindi ? 'ब्लूप्रिंट्स' : 'Blueprints'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                    {isHindi ? sol.titleHi : sol.titleEn}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {isHindi ? sol.metaDescHi : sol.metaDescEn}
                  </p>

                  <div className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                      {isHindi ? 'मुख्य टूल्स व ब्लूप्रिंट्स:' : 'Key Blueprints & Tools:'}
                    </span>
                    {sol.subtypes.map((st) => (
                      <Link
                        key={st.id}
                        href={`/${lang}/solutions/${sol.slug}/${st.slug}`}
                        className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors py-1 group"
                      >
                        <span className="truncate">{isHindi ? st.titleHi : st.titleEn}</span>
                        <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={`/${lang}/solutions/${sol.slug}`}
                    className="w-full bg-slate-50 hover:bg-indigo-50 text-slate-900 hover:text-indigo-700 font-bold text-xs py-2.5 px-4 rounded-md border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{isHindi ? 'पूर्ण समाधान देखें' : 'View Full Solution'}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LIGHT TECHNICAL CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              {isHindi ? 'आज ही अपने संगठन के लिए शुरू करें' : 'Start Organizing Your Collective Today'}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-6">
              {isHindi
                ? 'जमीनी नागरिक समूहों के लिए ₹0 हमेशा निःशुल्क। कोई क्रेडिट कार्ड या अग्रिम भुगतान नहीं।'
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
                href={`/${lang}/docs`}
                className="w-full sm:w-auto bg-white text-slate-800 font-bold px-6 py-3.5 text-sm rounded-md border border-slate-300 hover:bg-slate-100 transition-all"
              >
                {isHindi ? 'दस्तावेज़ीकरण पढ़ें' : 'Read Documentation'}
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
