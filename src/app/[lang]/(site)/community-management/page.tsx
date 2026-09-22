import Link from 'next/link'
import { Metadata } from 'next'
import { 
  Users, CheckCircle2, ArrowRight, ShieldCheck, 
  MessageSquare, Vote, Activity, HelpCircle, ChevronRight,
  Calendar, Award, Radio
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
    ? 'कम्युनिटी मैनेजमेंट सॉफ्टवेयर भारत | नागरिक समूह व समुदाय संचालन | संगठन'
    : 'Community Management Software India | Grassroots & Civic Collectives | Sangathan'
  const description = isHindi
    ? 'नागरिक समूहों, मोहल्ला समितियों और जमीनी समुदायों के लिए डिजिटल ऑपरेटिंग सिस्टम। सदस्य सूची, गुप्त मतदान, पारदर्शी बहीखाता और ₹0 निःशुल्क कम्युनिटी टियर।'
    : 'Purpose-built community management software for civic collectives, neighborhood associations, and grassroots groups in India. Member rosters, secret ballots, UPI ledgers, and ₹0 free community tier.'

  return {
    title,
    description,
    keywords: [
      'community management software India',
      'civic community app',
      'grassroots collective management',
      'neighborhood community software',
      'community organizing platform free',
      'collective tools'
    ],
    alternates: {
      canonical: `https://sangathan.space/${lang}/community-management`,
      languages: {
        en: 'https://sangathan.space/en/community-management',
        hi: 'https://sangathan.space/hi/community-management',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sangathan.space/${lang}/community-management`,
      siteName: 'Sangathan',
      type: 'website',
    },
  }
}

export default async function CommunityManagementPage({ params }: PageProps) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const faqs = [
    {
      question: isHindi
        ? 'क्या संगठन अनौपचारिक नागरिक समुदायों के लिए पूरी तरह निःशुल्क है?'
        : 'Is Sangathan completely free for informal community groups?',
      answer: isHindi
        ? 'हाँ। संगठन का कम्युनिटी टियर 20 कोर लीडर्स और असीमित सार्वजनिक समर्थकों के लिए हमेशा ₹0 निःशुल्क है।'
        : 'Yes. Sangathan provides a ₹0 Forever Community Tier for grassroots collectives with up to 20 core leaders and unlimited public supporters.',
    },
    {
      question: isHindi
        ? 'व्हाट्सएप ग्रुप की तुलना में संगठन से कम्युनिटी कैसे बेहतर संचालित होती है?'
        : 'How does Sangathan manage communities better than WhatsApp groups?',
      answer: isHindi
        ? 'व्हाट्सएप पर संदेश और फाइलें खो जाती हैं। संगठन सदस्यों की सुरक्षित सूची, आधिकारिक शिकायत डायरी, गुप्त मतदान और पारदर्शी वित्तीय बहीखाता प्रदान करता है।'
        : 'WhatsApp suffers from message clutter, exposed phone numbers, and lost files. Sangathan provides structured member rolls, 1-person-1-vote cryptographic ballots, and transparent ledgers.',
    },
    {
      question: isHindi
        ? 'क्या सदस्य सीधे मोबाइल ब्राउज़र से जुड़ सकते हैं?'
        : 'Can community members join directly from mobile browsers without app store downloads?',
      answer: isHindi
        ? 'हाँ। संगठन एक प्रोग्रेसिव वेब ऐप (PWA) है जो किसी भी स्मार्टफोन ब्राउज़र पर बिना इंस्टॉल किए तुरंत काम करता है और ऑफलाइन भी डेटा सुरक्षित रखता है।'
        : 'Yes. Sangathan is an offline-first Progressive Web App (PWA) that works instantly across any smartphone or browser with zero app-store gatekeeping.',
    },
  ]

  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'कम्युनिटी मैनेजमेंट' : 'Community Management', url: `https://sangathan.space/${lang}/community-management` },
        ]}
      />
      <FAQJsonLd questions={faqs} />

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-600 uppercase block mb-3">
              {isHindi ? 'नागरिक समुदाय प्रबंधन' : 'Civic Community Infrastructure'}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">
              {isHindi ? (
                <>
                  बिखरे हुए व्हाट्सएप चैट नहीं, <br />
                  <span className="text-indigo-600">एक अनुशासित समुदाय शक्ति।</span>
                </>
              ) : (
                <>
                  From Scattered Group Chats to <br />
                  <span className="text-indigo-600">Disciplined Community Power.</span>
                </>
              )}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              {isHindi
                ? 'नागरिक समूहों, मोहल्ला कार्यकर्ताओं और जन आंदोलनों के लिए संपूर्ण ऑपरेटिंग सिस्टम। सदस्यों का प्रबंधन करें, पारदर्शी चंदा जुटाएं, गुप्त मतदान कराएं और बिना किसी कॉर्पोरेट विज्ञापन के अपने समुदाय को आगे बढ़ाएं।'
                : 'The sovereign operating system for Indian civic collectives, colony associations, and volunteer networks. Manage cadres, run tamper-evident secret ballots, collect zero-commission UPI dues, and drive real-world civic impact.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href={`/${lang}/login?tab=signup`}
                className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2.5 rounded-md shadow-sm min-h-[48px]"
              >
                <span>{isHindi ? '₹0 में कम्युनिटी शुरू करें' : 'Start Free Community (₹0 Forever)'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${lang}/solutions/civic-collective`}
                className="bg-white text-slate-800 px-6 py-3.5 font-bold text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 rounded-md min-h-[48px]"
              >
                <span>{isHindi ? 'विस्तृत समाधान देखें' : 'Explore Civic Solutions'}</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-8 border-t border-slate-200 mt-8 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHindi ? '100% विज्ञापन-मुक्त' : '100% Ad-Free'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHindi ? 'गोपनीय फोन नंबर सुरक्षा' : 'Phone Privacy Shield'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHindi ? 'ऑफ़लाइन PWA सपोर्ट' : 'Offline-First PWA'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* PILLARS / CORE CAPABILITIES */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
              {isHindi ? 'समुदाय संचालन के लिए उद्देश्य-निर्मित उपकरण' : 'Engineered for Community Democracy & Action'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              {isHindi
                ? 'पारंपरिक सोशल मीडिया या कॉर्पोरेट ऐप्स के विपरीत, संगठन समुदाय को संगठित शक्ति में बदलता है।'
                : 'Unlike commercial social networks or chat apps, Sangathan gives your collective the institutional tools to govern and execute.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                  <Users size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isHindi ? 'संरचित सदस्य सूची व काडर रोल' : 'Structured Member & Cadre Rolls'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'भूमिका-आधारित पहुंच नियंत्रण (RBAC) के साथ सदस्यों को संगठित करें। आम समर्थकों से लेकर कोर समन्वयकों तक प्रत्येक सदस्य का सुरक्षित सत्यापन।'
                    : 'Organize members with granular role-based permissions. Separate public supporters from verified cadres without exposing personal phone numbers.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                  <MessageSquare size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isHindi ? 'ऑल-इन-वन इनबॉक्स व Google Meet' : 'All-in-One Inbox & Google Meet'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? '2-तरफा सदस्य चैट, टेलीग्राम बॉट डिस्पैच, 1-क्लिक Google Meet वीडियो कॉलिंग और आपातकालीन संकट SOS।'
                    : '2-way direct member chats, automated Telegram bots, instant Google Meet rooms, and rapid emergency SOS alert desk.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                  <Calendar size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isHindi ? 'केंद्रीकृत कैलेंडर व Apple/Google सिंक' : 'Centralized Calendar & Live Sync'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'सभाओं, बैठकों और फील्ड जोड़ियों के लिए कैलेंडर, Apple iCal (webcal://) व Google Calendar API स्वतः-सिंक सहित।'
                    : 'Unified schedule for meetings and field survey pairings with live Apple iCal and Google Calendar background sync.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                  <Vote size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isHindi ? 'क्रिप्टोग्राफिक गुप्त डिजिटल मतदान' : 'Cryptographic Secret Ballots'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? '1-व्यक्ति-1-वोट की पूर्ण निष्पक्षता। सार्वजनिक आम सभा और नेतृत्व चयन के लिए छेड़छाड़-रहित डिजिटल जनमत।'
                    : 'Conduct tamper-evident, 1-person-1-vote democratic elections and consensus polls with verifiable quorum and mathematical voter secrecy.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                  <Activity size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isHindi ? '0% कमीशन यूपीआई पारदर्शी बहीखाता' : 'Zero-Commission UPI Treasury'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'सीधे अपने समुदाय के बैंक खाते या क्यूआर से चंदा एकत्र करें। स्वचालित वाउचर रसीदें और सार्वजनिक वित्तीय पारदर्शिता।'
                    : 'Collect member contributions directly to your collective bank account with zero payment gateway deduction and live, audited cash ledgers.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                  <Award size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {isHindi ? 'सत्यापित बैज व पहचान पत्र' : 'Verified ID Badges Studio'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'सत्यापित डिजिटल सदस्य बैज, क्यूआर कोड प्रमाणीकरण और प्रिंट-रेडी पास जनरेट करें।'
                    : 'Issue cryptographic, QR-verifiable digital member credentials and printable physical passes.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON CALLOUT */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase block mb-1">
                {isHindi ? 'सॉफ्टवेयर तुलना' : 'Direct Comparison'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isHindi ? 'व्हाट्सएप ग्रुप और गूगल शीट्स से तुलना करें' : 'See How Sangathan Compares to WhatsApp & Spreadsheets'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                {isHindi
                  ? 'जानें क्यों गंभीर जन आंदोलन और एनजीओ खोई हुई फाइलों से बचकर पारदर्शी बहीखाते और गुप्त मतदान के लिए संगठन अपनाते हैं।'
                  : 'Discover why community organizers switch from messy group chats and broken spreadsheets to Sangathan’s sovereign infrastructure.'}
              </p>
            </div>
            <Link
              href={`/${lang}/compare/whatsapp-sheets`}
              className="bg-white border border-slate-300 hover:border-indigo-500 text-slate-900 hover:text-indigo-600 px-6 py-3 rounded-md font-bold text-xs sm:text-sm transition-all shrink-0 flex items-center gap-2"
            >
              <span>{isHindi ? 'तुलना देखें' : 'Read Full Comparison'}</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>

        {/* FAQS */}
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
