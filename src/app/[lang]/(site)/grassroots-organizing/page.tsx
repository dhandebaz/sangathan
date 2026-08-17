import Link from 'next/link'
import { Metadata } from 'next'
import { 
  Megaphone, CheckCircle2, ArrowRight, Printer, 
  Clock, ShieldAlert, Activity, HelpCircle, ChevronRight,
  Calendar, Vote, Scale
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
    ? 'जमीनी आंदोलन व जन अधिकार सॉफ्टवेयर | ग्रासरूट्स ऑर्गेनाइजिंग | संगठन'
    : 'Grassroots Organizing Software India | Movement Field OS | Sangathan'
  const description = isHindi
    ? 'जमीनी कार्यकर्ताओं और जन आंदोलनों के लिए ऑफलाइन PWA। ₹1 प्रिंटेबल पर्चे, 15-दिवसीय आरटीआई टाइमर, फील्ड स्पॉट ऑडिट और आपातकालीन विधिक SOS।'
    : 'Ground operating system for Indian grassroots movements, worker fronts, and colony activists. ₹1 A4 printable flyers, offline spot sensor audits, 15-day RTI countdowns, and legal SOS.'

  return {
    title,
    description,
    keywords: [
      'grassroots organizing software India',
      'movement organizing tool',
      'activist field app offline',
      'RTI 15-day escalation tracker',
      'printable A4 parcha generator',
      'legal SOS rapid response tool',
      'citizen science ground audit'
    ],
    alternates: {
      canonical: `https://sangathan.space/${lang}/grassroots-organizing`,
      languages: {
        en: 'https://sangathan.space/en/grassroots-organizing',
        hi: 'https://sangathan.space/hi/grassroots-organizing',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sangathan.space/${lang}/grassroots-organizing`,
      siteName: 'Sangathan',
      type: 'website',
    },
  }
}

export default async function GrassrootsOrganizingPage({ params }: PageProps) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const faqs = [
    {
      question: isHindi
        ? 'क्या बिना इंटरनेट के फील्ड में डेटा दर्ज किया जा सकता है?'
        : 'Can field data be recorded without active internet connectivity?',
      answer: isHindi
        ? 'हाँ। संगठन का ऑफलाइन PWA बिना इंटरनेट के स्पॉट ऑडिट, प्रदूषण आंकड़े और हस्ताक्षर दर्ज करता है और नेटवर्क मिलने पर स्वतः सिंक करता है।'
        : 'Yes. Sangathan’s offline-first PWA allows logging spot sensor readings, GPS evidence, and signatures without internet, syncing seamlessly once reconnected.',
    },
    {
      question: isHindi
        ? '15-दिवसीय स्टैम्प्ड रिसीविंग टाइमर कैसे काम करता है?'
        : 'How does the 15-day stamped municipal receiving tracker work?',
      answer: isHindi
        ? 'सरकारी कार्यालय से मुहर लगी रिसीविंग कॉपी अपलोड करते ही 15 दिन का उल्टी गिनती टाइमर शुरू होता है। समय सीमा बीतने पर स्वतः धारा 6(1) आरटीआई आवेदन तैयार होता है।'
        : 'Upload a photo of the stamped diary receipt from the ward office to activate a 15-day statutory countdown. If unresponsive, an automated Section 6(1) RTI application is generated.',
    },
  ]

  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'ग्रासरूट्स ऑर्गेनाइजिंग' : 'Grassroots Organizing', url: `https://sangathan.space/${lang}/grassroots-organizing` },
        ]}
      />
      <FAQJsonLd questions={faqs} />

      <div className="relative z-10">
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-wider text-amber-700 uppercase block mb-3">
              {isHindi ? 'जमीनी लड़ाई व नागरिक अधिकार' : 'Ground Resistance & Grassroots Infrastructure'}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">
              {isHindi ? (
                <>
                  हवा-हवाई बातें नहीं, <br />
                  <span className="text-indigo-600">जमीन पर वास्तविक बदलाव।</span>
                </>
              ) : (
                <>
                  Built for the Street, the Basti, <br />
                  <span className="text-indigo-600">and the Government Ward.</span>
                </>
              )}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              {isHindi
                ? 'जमीनी कार्यकर्ताओं के लिए ₹1 प्रिंटेबल पर्चे, नगर निगम की स्टैम्प्ड रिसीविंग डायरी, 15-दिवसीय आरटीआई काउंटडाउन और आपातकालीन विधिक सुरक्षा।'
                : 'Empower ground activists with ₹1 high-contrast photostat flyers, municipal receiving logs, automatic 15-day RTI countdowns, and instant legal defense SOS.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href={`/${lang}/login?tab=signup`}
                className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2.5 rounded-md shadow-sm min-h-[48px]"
              >
                <span>{isHindi ? 'निःशुल्क आंदोलन शुरू करें' : 'Start Grassroots Collective (Free)'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${lang}/solutions/civic-collective`}
                className="bg-white text-slate-800 px-6 py-3.5 font-bold text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 rounded-md min-h-[48px]"
              >
                <span>{isHindi ? 'नागरिक समूह विवरण' : 'Civic Collective Blueprint'}</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <Printer size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? '₹1 फोटोस्टेट पर्चा इंजन' : '₹1 Photostat Parcha Engine'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'चाय की दुकानों और बस्तियों में हस्ताक्षर अभियानों के लिए उच्च-कंट्रास्ट A4 पर्चे 1-क्लिक में तैयार करें।'
                  : 'Generate high-contrast black-and-white 1-page A4 leaflets optimized for neighborhood photocopiers and tea-stall drives.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <Clock size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? '15-दिवसीय आरटीआई एस्केलेशन' : '15-Day Stamped RTI Clock'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'वार्ड कार्यालय से प्राप्त डायरी संख्या दर्ज करें और अधिकारियों की जवाबदेही तय करने के लिए स्वचालित आरटीआई निकालें।'
                  : 'Log ward diary stamps and auto-trigger statutory Section 6(1) RTI applications when public officials fail to act.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'आपातकालीन लीगल SOS' : 'Emergency Legal SOS'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'हिरासत या पुलिस दबाव की स्थिति में 1-टैप आपातकालीन अलर्ट जो जीपीएस लोकेशन और थाना विवरण वकीलों के पैनल को भेजता है।'
                  : 'Instant 1-tap crisis alert broadcasting GPS coordinates and police station details to designated panel advocates.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <Activity size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'फील्ड स्पॉट सेंसर ऑडिट' : 'Spot Sensor Audits & Notices'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'PM2.5, पानी टीडीएस और कचरा दहन के आंकड़े दर्ज करें और DPCC/CPCB को विधिक नोटिस भेजें।'
                  : 'Log geotagged air and water sensor readings and draft formal statutory environmental violation notices.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <Calendar size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'सर्वेक्षक जोड़ी व कैलेंडर सिंक' : 'Surveyor Roster & Calendar'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'वार्ड-वार जमीनी सर्वेक्षणों के लिए कार्यकर्ताओं की जोड़ियां बनाएं और Apple/Google कैलेंडर से सिंक रखें।'
                  : 'Pair field organizers for target areas and sync deployments automatically with Apple & Google Calendar.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <Vote size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'प्रत्यक्ष लोकतंत्र व गुप्त मतदान' : 'Direct Democracy & Voting'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'आंदोलन की कार्ययोजना और नेतृत्व पर काडर का गोपनीय और छेड़छाड़-रहित डिजिटल जनमत।'
                  : 'Run encrypted, verifiable consensus ballots and leadership votes with instant mathematical tallies.'}
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
