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
      ? 'मूल्य निर्धारण: ₹0, ₹11, ₹999 | संगठन'
      : 'Pricing: ₹0, ₹11, ₹999 | Sangathan',
    description: isHindi
      ? '5 सदस्यों तक मुफ्त। उसके बाद हर सक्रिय साथी ₹11/माह। व्हाइट-लेबल ₹999 एकमुश्त। कोई वार्षिक बंधन नहीं।'
      : 'Free up to 5 members. Then ₹11/month per active member beyond 5. Whitelabel ₹999 one-time. No annual lock-in, no slabs.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/pricing`,
      languages: {
        en: 'https://sangathan.space/en/pricing',
        hi: 'https://sangathan.space/hi/pricing',
      },
    },
    openGraph: {
      title: isHindi ? 'मूल्य निर्धारण: ₹0, ₹11, ₹999 | संगठन' : 'Pricing: ₹0, ₹11, ₹999 | Sangathan',
      description: isHindi
        ? '5 सदस्यों तक मुफ्त। उसके बाद हर सक्रिय साथी ₹11/माह। व्हाइट-लेबल ₹999 एकमुश्त।'
        : 'Free up to 5 members. Then ₹11/month per active member beyond 5. Whitelabel ₹999 one-time.',
      url: `https://sangathan.space/${lang}/pricing`,
      siteName: 'Sangathan',
      type: 'website',
      images: [
        {
          url: `https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'मूल्य: ₹0, ₹11, ₹999' : 'Pricing: ₹0, ₹11, ₹999')}&desc=${encodeURIComponent(isHindi ? '5 तक मुफ्त, उसके बाद ₹11/साथी/माह। कोई वार्षिक बंधन नहीं।' : 'Free up to 5 members, then ₹11/member/month. No annual lock-in.')}&type=ngo&tag=Pricing&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: isHindi ? 'संगठन मूल्य निर्धारण' : 'Sangathan Pricing',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@areynetaji',
      creator: '@areynetaji',
      title: isHindi ? 'मूल्य निर्धारण: ₹0, ₹11, ₹999 | संगठन' : 'Pricing: ₹0, ₹11, ₹999 | Sangathan',
      description: isHindi
        ? '5 सदस्यों तक मुफ्त। उसके बाद हर सक्रिय साथी ₹11/माह। व्हाइट-लेबल ₹999 एकमुश्त।'
        : 'Free up to 5 members. Then ₹11/month per active member beyond 5. Whitelabel ₹999 one-time.',
      images: [`https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'मूल्य: ₹0, ₹11, ₹999' : 'Pricing: ₹0, ₹11, ₹999')}&desc=${encodeURIComponent(isHindi ? '5 तक मुफ्त, उसके बाद ₹11/साथी/माह। कोई वार्षिक बंधन नहीं।' : 'Free up to 5 members, then ₹11/member/month. No annual lock-in.')}&type=ngo&tag=Pricing&lang=${lang}`],
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
      .maybeSingle()
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
        ? 'मुफ्त सामुदायिक पहुंच (Community Access) में क्या मिलता है?'
        : 'What does free Community Access include?',
      answer: isHindi
        ? '5 सदस्य प्रोफाइल (एडमिन सहित) तक सब कुछ मुफ्त: मतदान, सर्वेक्षण, फील्ड-डेटा, रजिस्टर, 80G-तैयार रसीदें, पर्चा, याचिकाएं व पारदर्शिता पेज। मतदाता व हस्ताक्षरकर्ता गिनती में नहीं आते। यही मुफ्त ट्रायल है — कोई समय सीमा नहीं।'
        : 'Up to 5 member profiles (admin included) with everything: voting, surveys, field-data tools, registers, 80G-ready receipts, parcha, petitions and transparency page. Voters and signers are never counted. This free tier is the trial — no time limit.',
    },
    {
      question: isHindi
        ? 'मीटर बिलिंग (₹11/साथी) कैसे काम करती है?'
        : 'How does metered billing (₹11/member) work?',
      answer: isHindi
        ? 'कोई बेस फीस नहीं, कोई प्लान खरीदना नहीं। UPI ऑटोपे लगाओ और मीटर चल पड़ेगा: (सक्रिय सदस्य − 5) × ₹11/माह, माह-अंत गणना। सक्रिय = 60 दिन में लॉगिन। जैसे 30 सदस्य = ₹275/माह। कभी भी रोको — डेटा रहेगा। कोई वार्षिक बंधन नहीं।'
        : 'No base fee, no plan to buy. Add UPI autopay and the meter runs: (active members − 5) × ₹11/month, counted month-end. Active = logged in within 60 days. E.g. 30 members = ₹275/month. Pause anytime — data stays. No annual lock-in.',
    },
    {
      question: isHindi
        ? 'व्हाइट-लेबल (₹999) में क्या मिलता है?'
        : 'What does the ₹999 whitelabel give?',
      answer: isHindi
        ? 'एकमुश्त ₹999 भुगतान पर सार्वजनिक पेजों, कार्यक्रमों, पत्रों व बैज से "Powered by Sangathan" हमेशा के लिए हटेगा और आपका प्रतीक पहले आएगा। मुफ्त व मीटर वाली दोनों श्रेणियां खरीद सकती हैं।'
        : 'A one-time ₹999 payment removes "Powered by Sangathan" branding and puts your emblem first across public pages, events, letters and badges — forever. Buyable on both Free and Metered.',
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
        ? 'हाँ, बिल्कुल। संगठन विशेष रूप से अनौपचारिक समूहों, विरोध मंचों और नागरिक आंदोलनों का समर्थन करता है। आपको शुरू करने के लिए किसी सरकारी पंजीकरण संख्या की आवश्यकता नहीं है।'
        : 'Yes, absolutely. Sangathan is built for informal collectives, mutual-aid groups, and grassroots campaigns without requiring statutory registration numbers.',
    },
    {
      question: isHindi
        ? 'बहुजन क्वीर फाउंडेशन (BQF) मान्यता कैसे काम करती है?'
        : 'How does Bahujan Queer Foundation (BQF) recognition work for collectives?',
      answer: isHindi
        ? 'सक्रिय जमीनी समूह बहुजन क्वीर फाउंडेशन (दिल्ली पंजीकृत सेक्शन 8 NGO) से सामुदायिक संबद्धता मांग सकते हैं, जिससे उनकी विश्वसनीयता बढ़ती है। यह किसी गैर-लाभकारी की मान्यता है — कानूनी छूट, सरकारी पंजीकरण या गिरफ्तारी से सुरक्षा नहीं। आधिकारिक पत्र हमेशा अपने नाम से भेजें।'
        : 'Active grassroots groups can seek community affiliation with Bahujan Queer Foundation (Delhi Reg. Section 8 NGO) for credibility. This is a non-profit recognition — not legal immunity, government registration, or protection from arrest. Always send official letters in your own name.',
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
        'Best-effort delivery for SOS alerts, meeting invites and voting OTPs via email/SMS providers. Delivery depends on telecom networks and cannot be guaranteed.',
      descHi:
        'ईमेल/SMS से अलर्ट, बैठक आमंत्रण और OTP भेजने की भरसक कोशिश। डिलीवरी टेलीकॉम नेटवर्क पर निर्भर है, गारंटी नहीं।',
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
        title={isHindi ? 'मूल्य निर्धारण: ₹0, ₹11, ₹999' : 'Pricing: ₹0, ₹11, ₹999'}
        description={
          isHindi
            ? '5 सदस्यों तक मुफ्त। उसके बाद हर सक्रिय साथी ₹11/माह। व्हाइट-लेबल ₹999 एकमुश्त। कोई वार्षिक बंधन, कोई स्लैब नहीं।'
            : 'Free up to 5 members. Then ₹11/month per active member beyond 5. Whitelabel ₹999 one-time. No annual lock-in, no slabs.'
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
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
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
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
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
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
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

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
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

          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
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
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition-colors"
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
