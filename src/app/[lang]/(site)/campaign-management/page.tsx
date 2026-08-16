import Link from 'next/link'
import { Metadata } from 'next'
import { 
  Megaphone, CheckCircle2, ArrowRight, ShieldCheck, 
  FileCheck, Users, Calendar, HelpCircle, ChevronRight 
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
    ? 'नागरिक अभियान प्रबंधन सॉफ्टवेयर | याचिका व स्वयंसेवक लामबंदी | संगठन'
    : 'Campaign Management Software India | Civic Action & Petitions | Sangathan'
  const description = isHindi
    ? 'नागरिक अभियानों, सार्वजनिक याचिकाओं और विरोध प्रदर्शनों के लिए डिजिटल प्लेटफॉर्म। मुहर लगे मांग पत्र, व्हाट्सएप रिमाइंडर और क्यूआर चेक-इन।'
    : 'Digital campaign operating system for civic advocacy, petitions, and mobilization in India. Stamped administrative demands, WhatsApp broadcasts, and QR rally check-ins.'

  return {
    title,
    description,
    keywords: [
      'campaign management software India',
      'civic petition software',
      'grassroots mobilization tool',
      'public petition studio India',
      'volunteer shift management app',
      'protest and rally check-in software'
    ],
    alternates: {
      canonical: `https://sangathan.space/${lang}/campaign-management`,
      languages: {
        en: 'https://sangathan.space/en/campaign-management',
        hi: 'https://sangathan.space/hi/campaign-management',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sangathan.space/${lang}/campaign-management`,
      siteName: 'Sangathan',
      type: 'website',
    },
  }
}

export default async function CampaignManagementPage({ params }: PageProps) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const faqs = [
    {
      question: isHindi
        ? 'क्या संगठन पर सार्वजनिक याचिकाएं बनाई जा सकती हैं?'
        : 'Can public petitions and digital signature drives be hosted on Sangathan?',
      answer: isHindi
        ? 'हाँ। सार्वजनिक याचिका पेज बनाएं, व्हाट्सएप पर शेयर करें और हस्ताक्षरों को सीधे सरकारी ज्ञापन व मांग पत्र में बदलें।'
        : 'Yes. Create high-converting public petition landing pages with OTP-verified signatures that convert directly into printable administrative representations.',
    },
    {
      question: isHindi
        ? 'इवेंट और रैली में उपस्थित लोगों की जांच कैसे होती है?'
        : 'How are rally attendees and event participants managed?',
      answer: isHindi
        ? 'संगठन क्यूआर कोड टिकटिंग, स्वयंसेवक शिफ्ट प्रबंधन और स्वचालित व्हाट्सएप रिमाइंडर प्रदान करता है।'
        : 'Sangathan provides 1-tap QR check-in, volunteer shift allocation, and automated WhatsApp reminder broadcasts.',
    },
  ]

  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'अभियान प्रबंधन' : 'Campaign Management', url: `https://sangathan.space/${lang}/campaign-management` },
        ]}
      />
      <FAQJsonLd questions={faqs} />

      <div className="relative z-10">
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-wider text-indigo-600 uppercase block mb-3">
              {isHindi ? 'नागरिक पैरवी व जन लामबंदी' : 'Advocacy, Petitions & Mass Mobilization'}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-6">
              {isHindi ? (
                <>
                  हस्ताक्षर से लेकर <br />
                  <span className="text-indigo-600">सड़क तक संपूर्ण अभियान।</span>
                </>
              ) : (
                <>
                  From Public Petitions to <br />
                  <span className="text-indigo-600">Administrative Victory.</span>
                </>
              )}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              {isHindi
                ? 'केवल ऑनलाइन क्लिक नहीं, बल्कि वास्तविक नागरिक परिणाम। डिजिटल याचिकाओं को प्रशासनिक मांग पत्रों, कानूनी नोटिसों और अनुशासित स्वयंसेवक दस्तों में बदलें।'
                : 'Turn online supporters into on-ground power. Create verifiable public petitions, organize volunteer squads, and bridge street turnouts with bureaucratic accountability.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href={`/${lang}/login?tab=signup`}
                className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2.5 rounded-md shadow-sm min-h-[48px]"
              >
                <span>{isHindi ? 'अभियान शुरू करें' : 'Launch Campaign Free'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${lang}/features`}
                className="bg-white text-slate-800 px-6 py-3.5 font-bold text-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 rounded-md min-h-[48px]"
              >
                <span>{isHindi ? 'विशेषताएं देखें' : 'Explore Features'}</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <FileCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'सत्यापित याचिकाएं' : 'Verified Petitions'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'ओटीपी सत्यापन के साथ फर्जी हस्ताक्षरों से मुक्त जन समर्थन जुटाएं और प्रिंट-रेडी मांग पत्र तैयार करें।'
                  : 'OTP-verified citizen signatures ready for printing as formal statutory representations.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <Calendar size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'इवेंट व क्यूआर चेक-इन' : 'Events & QR Check-in'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'धरना प्रदर्शनों, रैलियों और कार्यशालाओं के लिए त्वरित चेक-इन और स्वयंसेवक प्रबंधन।'
                  : 'Fast participant check-in, volunteer duty rosters, and WhatsApp alert broadcasts.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center mb-4 font-bold">
                <Users size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {isHindi ? 'स्वयंसेवक दस्ते व कार्यदल' : 'Volunteer Action Squads'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHindi
                  ? 'कार्यकर्ताओं को वार्ड और जिम्मेदारियों के आधार पर अलग-अलग दस्तों में बांटकर काम सौंपें।'
                  : 'Assign localized tasks, flyer distribution targets, and follow-ups to specific cadre squads.'}
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
