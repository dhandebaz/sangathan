import { Metadata } from 'next'
import {
  ShieldCheck,
  HeartHandshake,
  Server,
  Lock,
  Mail,
  Cpu,
  RefreshCw,
  Database,
  DownloadCloud,
  Network,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import { PageHeader } from '@/components/public/page-header'
import { PublicPricingGrid } from '@/components/pricing/public-pricing-grid'
import { ContributionGoalTracker } from '@/components/pricing/contribution-goal-tracker'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi
      ? 'योगदान और पहुंच (Pay & Price) | संगठन'
      : 'Pay & Price: Contribution & Civic Access | Sangathan',
    description: isHindi
      ? 'नागरिक डिजिटल बुनियादी ढांचा। स्वैच्छिक सामुदायिक पहुंच और संरक्षक समर्थन।'
      : 'Civic digital infrastructure by Bahujan Queer Foundation. Voluntary Community Access and Solidarity Sustainer contributions.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/pricing`,
      languages: {
        en: 'https://sangathan.space/en/pricing',
        hi: 'https://sangathan.space/hi/pricing',
      },
    },
  }
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  let orgId = ''
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('organisation_id')
      .eq('id', user.id)
      .single()
    if (profile?.organisation_id) {
      orgId = profile.organisation_id
    }
  }

  const faqs = [
    {
      question: isHindi
        ? 'संगठन किस प्रकार का संगठन है?'
        : 'What kind of organization is Sangathan?',
      answer: isHindi
        ? 'संगठन कोई वाणिज्यिक कंपनी या स्टार्टअप नहीं है। यह बहुजन क्वीर फाउंडेशन (सेक्शन 8 गैर-लाभकारी संस्था) की एक डिजिटल नागरिक अवसंरचना पहल है, जो गैर-सरकारी संगठनों और नागरिक समूहों को सशक्त बनाने के लिए समर्पित है।'
        : 'Sangathan is not a commercial SaaS startup or company. It is a digital civic infrastructure initiative of Bahujan Queer Foundation, a Section 8 non-profit organization registered in India.',
    },
    {
      question: isHindi
        ? 'सामुदायिक पहुंच (Community Access) के लिए भुगतान कैसे काम करता है?'
        : 'How does payment work for Community Access?',
      answer: isHindi
        ? 'सामुदायिक पहुंच एक स्वैच्छिक योगदान मॉडल पर आधारित है (सुझाए गए विकल्प: ₹5, ₹10, ₹50, ₹100, ₹500 या कोई भी कस्टम राशि)। जमीनी स्तर के नागरिक समूह और छात्र इकाइयां अपनी क्षमता अनुसार योगदान देकर तुरंत पहुंच प्राप्त कर सकते हैं।'
        : 'Community Access uses a voluntary contribution model (choices: ₹5, ₹10, ₹50, ₹100, ₹500, or custom). Grassroots collectives and student unions can contribute what they wish to access full democratic organizing tools.',
    },
    {
      question: isHindi
        ? 'संरक्षक पहुंच (Sustainer Access) क्या है?'
        : 'What is Sustainer Access?',
      answer: isHindi
        ? 'संरक्षक पहुंच बड़े एनजीओ और पंजीकृत संघों के लिए सुझाया गया ₹1,000/माह का एकजुटता योगदान है। यह आपके संगठन के लिए असीमित सदस्य और संगठन AI क्षमताएं अनलॉक करता है, और साथ ही छोटे नागरिक समूहों के लिए मुफ्त सर्वर अवसंरचना को निधि देता है।'
        : 'Sustainer Access is a suggested ₹1,000/month (pay-what-you-can) institutional solidarity contribution. It provides unlimited member capacity and Sangathan AI tools while directly cross-subsidizing infrastructure for smaller grassroots movements.',
    },
    {
      question: isHindi
        ? 'हमारा योगदान कहां खर्च होता है?'
        : 'Where does our contribution go?',
      answer: isHindi
        ? '100% योगदान सीधे सर्वर होस्टिंग, एन्क्रिप्टेड डेटाबेस स्टोरेज, SMS/ईमेल डिलीवरी, AI कंप्यूट इंफ्रास्ट्रक्चर और ओपन-सोर्स सॉफ्टवेयर रखरखाव में जाता है। हम कोई लाभ नहीं कमाते हैं।'
        : '100% of contributions directly cover secure high-availability servers, encrypted backups, email/SMS delivery, privacy-preserving AI compute, and ongoing non-profit software maintenance.',
    },
    {
      question: isHindi
        ? 'क्या हमारा डेटा कभी बेचा या विज्ञापनों में इस्तेमाल किया जाएगा?'
        : 'Is our organizational data private and sovereign?',
      answer: isHindi
        ? 'बिलकुल नहीं। हम शून्य डेटा साझाकरण नीति का पालन करते हैं। कोई विज्ञापन नहीं, कोई ट्रैकर नहीं, और एक संगठन का डेटा कभी दूसरे संगठन के AI को प्रशिक्षित नहीं करता है। आप कभी भी अपना पूरा डेटा JSON/CSV में निर्यात कर सकते हैं।'
        : 'Strictly zero commercial monetization. We run no ads and sell no telemetry. Organization data is never used to train external models, and you maintain complete sovereignty with 1-click full data export.',
    },
    {
      question: isHindi
        ? 'क्या गैर-पंजीकृत नागरिक समूह या जमीनी आंदोलन संगठन का उपयोग कर सकते हैं?'
        : 'Can unregistered grassroots movements and civic collectives join?',
      answer: isHindi
        ? 'हाँ, बिल्कुल। संगठन विशेष रूप से अनौपचारिक समूहों, विरोध मंचों, छात्र इकाइयों और नागरिक आंदोलनों का समर्थन करता है। आपको शुरू करने के लिए किसी सरकारी पंजीकरण संख्या की आवश्यकता नहीं है।'
        : 'Yes, absolutely. Sangathan is built for informal collectives, mutual-aid groups, student cells, and grassroots campaigns without requiring statutory registration numbers.',
    },
  ]

  const costBreakdown = [
    {
      icon: Server,
      titleEn: 'Secure Cloud & High-Availability Servers',
      titleHi: 'सुरक्षित क्लाउड व हाई-अवेलेबिलिटी सर्वर',
      descEn:
        'Dedicated compute instances and edge nodes ensuring 99.9% uptime for campaigns and continuous voting ballots.',
      descHi:
        'अभियानों और निरंतर मतदान मतपत्रों के लिए 99.9% अपटाइम सुनिश्चित करने वाले समर्पित कंप्यूट नोड्स।',
    },
    {
      icon: Database,
      titleEn: 'Encrypted Storage & Automated Backups',
      titleHi: 'एन्क्रिप्टेड स्टोरेज व स्वचालित बैकअप',
      descEn:
        'AES-256 encrypted file storage for resolution archives, legal evidence, member rosters, and point-in-time database snapshots.',
      descHi:
        'प्रस्ताव अभिलेखागार, कानूनी साक्ष्य और सदस्य रोस्टर के लिए AES-256 एन्क्रिप्टेड फ़ाइल संग्रहण।',
    },
    {
      icon: Mail,
      titleEn: 'Transactional Email & SMS Delivery',
      titleHi: 'लेन-देन ईमेल व SMS डिलीवरी',
      descEn:
        'Guaranteed delivery for emergency SOS alerts, meeting invites, voting OTPs, and statutory notice circulars.',
      descHi:
        'आपातकालीन अलर्ट, बैठक आमंत्रण, मतदान OTP और वैधानिक सूचनाओं के लिए विश्वसनीय डिलीवरी।',
    },
    {
      icon: Cpu,
      titleEn: 'Privacy-First AI Compute Infrastructure',
      titleHi: 'गोपनीयता-प्रथम AI कंप्यूट अवसंरचना',
      descEn:
        'Dedicated inference clusters for Sangathan AI (meeting minutes extraction, grant proposal assistance, ticket triage) with zero third-party training retention.',
      descHi:
        'संगठन AI (बैठक कार्यवृत्त, अनुदान मिलान, ट्राइएज) के लिए समर्पित कंप्यूट, जहां डेटा कभी साझा नहीं होता।',
    },
    {
      icon: Network,
      titleEn: 'Network Resilience & Offline PWA Sync',
      titleHi: 'नेटवर्क लचीलापन व ऑफलाइन PWA सिंक',
      descEn:
        'Multi-provider router fallback and offline-first PWA sync ensuring uninterrupted collective organizing during connectivity drops.',
      descHi:
        'बहु-प्रदाता अतिरेक और ऑफ़लाइन PWA सिंक ताकि नेटवर्क ड्रॉप के दौरान भी संगठन बिना बाधा कार्य कर सके।',
    },
    {
      icon: RefreshCw,
      titleEn: 'Open Maintenance & Security Audits',
      titleHi: 'ओपन रखरखाव व सुरक्षा ऑडिट',
      descEn:
        'Continuous patching, penetration testing, compliance updates, and dedicated engineering for democratic collective tooling.',
      descHi:
        'नियमित सुरक्षा पैचिंग, पेनिट्रेशन टेस्टिंग और नागरिक उपकरणों के लिए समर्पित इंजीनियरिंग।',
    },
  ]

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          {
            name: isHindi ? 'योगदान और पहुंच' : 'Pay & Price',
            url: `https://sangathan.space/${lang}/pricing`,
          },
        ]}
      />
      <FAQJsonLd
        questions={faqs.map((f) => ({
          question: f.question,
          answer: f.answer,
        }))}
      />

      <PageHeader
        title={isHindi ? 'नागरिक अवसंरचना: योगदान और पहुंच' : 'Civic Infrastructure: Pay & Price'}
        description={
          isHindi
            ? 'बहुजन क्वीर फाउंडेशन की एक गैर-लाभकारी पहल। सभी लोकतांत्रिक समूहों के लिए सुलभ, पारदर्शी और टिकाऊ डिजिटल मंच।'
            : 'A non-profit digital initiative of Bahujan Queer Foundation. Accessible, sovereign, and sustainable infrastructure for grassroots collectives and NGOs.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
        
        {/* 1. Contribution Goal Tracker (Live API) */}
        <ContributionGoalTracker lang={lang} isHindi={isHindi} />

        {/* 2. Interactive Pricing & Contribution Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isHindi ? 'पहुंच मॉडल चुनें' : 'Choose Your Access Model'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              {isHindi
                ? 'स्वैच्छिक सामुदायिक योगदान या संस्थागत संरक्षक समर्थन, हर संगठन को समान संप्रभु तकनीक प्राप्त होती है।'
                : 'Voluntary community contributions or institutional solidarity, every collective gets identical sovereign democratic tools.'}
            </p>
          </div>

          <PublicPricingGrid orgId={orgId} lang={lang} isHindi={isHindi} />
        </div>

        {/* 3. Where Your Contribution Goes (Operational Cost Breakdown) */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-indigo-700 font-medium text-xs">
              <HeartHandshake className="w-4 h-4" />
              <span>{isHindi ? '100% पारदर्शी व्यय' : '100% Transparent Utilization'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isHindi ? 'आपका योगदान कहाँ जाता है?' : 'Where Your Contribution Goes'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isHindi
                ? 'हम एक सेक्शन 8 गैर-लाभकारी पहल हैं। सभी योगदान सीधे वास्तविक तकनीकी अवसंरचना और नागरिक सुरक्षा को निधि देते हैं।'
                : 'As a Section 8 non-profit initiative, every rupee received directly funds real technical operations, reliability, and security for social organizing.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {costBreakdown.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {isHindi ? item.titleHi : item.titleEn}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isHindi ? item.descHi : item.descEn}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 4. Privacy-First & Mirrored Infrastructure Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {isHindi ? 'शून्य डेटा मुद्रीकरण' : 'Zero Commercial Monetization'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi
                ? 'कोई विज्ञापन नहीं, कोई डेटा ब्रोकर नहीं। आपकी सदस्यता सूची और आंतरिक चर्चाएँ पूरी तरह से गोपनीय और संप्रभु हैं।'
                : 'No ad networks, no data brokers. Member rosters, votes, and conversations remain completely confidential to your organization.'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Server className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {isHindi ? 'लचीला व प्रतिरूपित बुनियादी ढांचा' : 'Resilient Mirrored Infrastructure'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi
                ? 'बहु-प्रदाता अतिरेक (Multi-provider fallback) और ऑफ़लाइन-सक्षम PWA ताकि नेटवर्क आउटेज में भी आपका संगठन कार्य कर सके।'
                : 'Multi-provider router fallback and offline-first PWA sync ensure uninterrupted organizing even during regional network drops.'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {isHindi ? '1-क्लिक पूर्ण डेटा संप्रभुता' : '1-Click Full Sovereign Export'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi
                ? 'शून्य वेंडर लॉक-इन। आप किसी भी समय अपने संपूर्ण संगठन का डेटा, मतपत्र और दस्तावेज JSON/CSV में डाउनलोड कर सकते हैं।'
                : 'Zero vendor lock-in. Download your collective’s entire voting records, audit logs, and member data in open formats anytime.'}
            </p>
          </div>
        </div>

        {/* 5. FAQs Section */}
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isHindi
                ? 'नागरिक पहुंच, स्वैच्छिक योगदान और तकनीकी वास्तुकला के बारे में स्पष्टीकरण।'
                : 'Clear explanations regarding civic access, voluntary contributions, and non-profit governance.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors"
              >
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
                  {faq.question}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
