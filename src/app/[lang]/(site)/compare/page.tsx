import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { ArrowRight, ChevronRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import { COMPARISONS_DATA } from '@/lib/comparisons-data'
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'ऐप तुलना व विकल्प | संगठन बनाम अन्य सॉफ्टवेयर' : 'Sangathan vs Other Apps | Competitor Comparisons & Alternatives',
    description: isHindi
      ? 'संगठन की तुलना एक्शन नेटवर्क, नेशनबिल्डर, एवरीएक्शन, मोबिलाइज, CiviCRM, मायगेट और व्हाट्सएप ग्रुप्स से करें।'
      : 'Compare Sangathan against Action Network, NationBuilder, EveryAction, Mobilize, CiviCRM, MyGate, and WhatsApp Groups.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/compare`,
      languages: {
        en: 'https://sangathan.space/en/compare',
        hi: 'https://sangathan.space/hi/compare',
      },
    },
    openGraph: {
      title: isHindi ? 'ऐप तुलना व विकल्प | संगठन बनाम अन्य सॉफ्टवेयर' : 'Sangathan vs Other Apps | Platform Comparisons',
      description: isHindi
        ? 'संगठन की तुलना एक्शन नेटवर्क, नेशनबिल्डर, एवरीएक्शन, मोबिलाइज, CiviCRM, मायगेट और व्हाट्सएप से करें।'
        : 'Compare Sangathan against Action Network, NationBuilder, EveryAction, Mobilize, CiviCRM, MyGate, and WhatsApp.',
      url: `https://sangathan.space/${lang}/compare`,
      siteName: 'Sangathan',
      type: 'website',
      images: [
        {
          url: `https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'संगठन बनाम अन्य सॉफ्टवेयर व विकल्प' : 'Sangathan vs Other Movement Platforms')}&desc=${encodeURIComponent(isHindi ? 'एक्शन नेटवर्क, नेशनबिल्डर, एवरीएक्शन, मोबिलाइज और CiviCRM की विस्तृत तुलना।' : 'Feature-by-feature comparison against Action Network, NationBuilder, EveryAction, and CiviCRM.')}&type=compare&tag=Platform+Comparison&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: 'Sangathan Comparisons',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@areynetaji',
      creator: '@areynetaji',
      title: isHindi ? 'ऐप तुलना व विकल्प | संगठन बनाम अन्य सॉफ्टवेयर' : 'Sangathan vs Other Apps | Platform Comparisons',
      description: isHindi
        ? 'संगठन की तुलना एक्शन नेटवर्क, नेशनबिल्डर, एवरीएक्शन, मोबिलाइज, CiviCRM, मायगेट और व्हाट्सएप से करें।'
        : 'Compare Sangathan against Action Network, NationBuilder, EveryAction, Mobilize, CiviCRM, MyGate, and WhatsApp.',
      images: [`https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'संगठन बनाम अन्य सॉफ्टवेयर व विकल्प' : 'Sangathan vs Other Movement Platforms')}&desc=${encodeURIComponent(isHindi ? 'एक्शन नेटवर्क, नेशनबिल्डर, एवरीएक्शन, मोबिलाइज और CiviCRM की विस्तृत तुलना।' : 'Feature-by-feature comparison against Action Network, NationBuilder, EveryAction, and CiviCRM.')}&type=compare&tag=Platform+Comparison&lang=${lang}`],
    },
  }
}

export default async function CompareDirectoryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'
  const comparisons = Object.values(COMPARISONS_DATA)

  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'तुलना' : 'Compare', url: `https://sangathan.space/${lang}/compare` },
        ]}
      />

      {/* Background Dot Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative z-10">

        {/* HERO SECTION WITH ACTIVIST LEADER ANCHOR */}
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08]">
                {isHindi ? (
                  <>
                    संगठन बनाम अन्य सॉफ्टवेयर: <br className="hidden sm:inline" />
                    <span className="text-indigo-600">अंतर क्यों महत्वपूर्ण है?</span>
                  </>
                ) : (
                  <>
                    Sangathan vs Alternatives: <br className="hidden sm:inline" />
                    <span className="text-indigo-600">Why Movement Infrastructure Wins.</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {isHindi
                  ? 'अधिकांश सॉफ्टवेयर पश्चिमी कॉरपोरेट नियमों या महंगे विदेशी कार्डों के लिए बने हैं। संगठन भारतीय जन आंदोलनों, ₹0 नागरिक एकजुटता और कानूनी सुरक्षा के लिए उद्देश्य-निर्मित है।'
                  : 'Most tools were designed for US email campaigns or commercial data harvesting. Sangathan was built specifically for Indian ground organizers, 80G tax laws, offline PWA field audits, and democratic secret ballots.'}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href={`/${lang}/login?tab=signup`}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2.5 rounded-md shadow-sm"
                >
                  <span>{isHindi ? 'निःशुल्क संगठन शुरू करें' : 'Start Collective (Free)'}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href={`/${lang}/solutions`}
                  className="bg-white text-slate-800 px-6 py-3.5 font-bold text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 rounded-md"
                >
                  <span>{isHindi ? 'संगठन समाधान देखें' : 'View Solutions'}</span>
                </Link>
              </div>
            </div>

            {/* Activist Leader Anchor Card */}
            <div className="lg:col-span-5 flex flex-col items-center relative">
              <div className="relative w-full max-w-md bg-gradient-to-b from-slate-50 via-slate-50/50 to-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 border-b border-l border-slate-200 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-t border-r border-slate-200 pointer-events-none" />

                <div className="relative w-full h-[320px] sm:h-[380px] flex items-end justify-center">
                  <Image
                    src="/images/activist-leader.png"
                    alt="Movement Leader - Sangathan vs Competitors"
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
                      <span className="text-[10px] text-slate-300">Zero Ads • Zero Data Selling</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700">
                      ₹0 Tier
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* COMPARISONS GRID */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              {isHindi ? 'सभी विस्तृत तुलना पृष्ठ' : 'All Head-to-Head Comparison Pages'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {isHindi
                ? 'प्रत्येक टूल की कीमत, भारतीय नियमों, ऑफलाइन सपोर्ट और डेटा गोपनीयता के आधार पर गहन तुलना।'
                : 'Individual standalone deep-dives comparing pricing, statutory compliance, offline mobile capabilities, and data sovereignty.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisons.map((comp) => (
              <div
                key={comp.slug}
                className="bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-6 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-slate-700 block mb-3 w-fit">
                    {isHindi ? comp.competitorCategoryHi : comp.competitorCategoryEn}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Sangathan vs {comp.competitorName}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {isHindi ? comp.metaDescHi : comp.metaDescEn}
                  </p>

                  <div className="space-y-2 mb-6 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 size={14} className="shrink-0" />
                      <span>{isHindi ? '₹0 कम्युनिटी सॉलिडैरिटी टियर' : '₹0 Community Solidarity Tier'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 size={14} className="shrink-0" />
                      <span>{isHindi ? '100% ऑफलाइन PWA फील्ड ऑडिट' : '100% Offline PWA Field Audits'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 size={14} className="shrink-0" />
                      <span>{isHindi ? 'भारतीय वैधानिक रजिस्टर (80G/10BD)' : 'Indian Statutory Registers (80G/10BD)'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={`/${lang}/compare/${comp.slug}`}
                    className="w-full bg-slate-50 hover:bg-indigo-50 text-slate-900 hover:text-indigo-700 font-bold text-xs py-2.5 px-4 rounded-md border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{isHindi ? 'पूरी तुलना पढ़ें' : 'Read Full Comparison'}</span>
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
              {isHindi ? 'बिना किसी खर्चे के आज ही स्विच करें' : 'Switch to Sangathan at Zero Cost'}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-6">
              {isHindi
                ? 'हमारे यूनिवर्सल डेटा इंपोर्टर से 1-क्लिक में पुराने एक्सेल व स्प्रेडशीट का पूरा डेटा ट्रांसफर करें।'
                : 'Migrate your existing supporter lists and spreadsheet records in under 60 seconds with our Universal Data Importer.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/${lang}/login?tab=signup`}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 text-sm rounded-md shadow-sm transition-all"
              >
                {isHindi ? 'निःशुल्क शुरू करें' : 'Get Started Free'}
              </Link>
              <Link
                href={`/${lang}/solutions`}
                className="w-full sm:w-auto bg-white text-slate-800 font-bold px-6 py-3.5 text-sm rounded-md border border-slate-300 hover:bg-slate-100 transition-all"
              >
                {isHindi ? 'समाधान देखें' : 'Explore Solutions'}
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
