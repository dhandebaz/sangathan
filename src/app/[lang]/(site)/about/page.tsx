import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Globe, Lock, Heart } from 'lucide-react'
import { Metadata } from 'next'
import { PageHeader } from '@/components/public/page-header'
import { OrganizationJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'हमारे बारे में | संगठन' : 'About Us | Sangathan',
    description: isHindi 
      ? 'जमीनी आंदोलनों के लिए डिजिटल बुनियादी ढांचा।'
      : 'Digital infrastructure for grassroots movements.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/about`,
      languages: {
        'en': 'https://sangathan.space/en/about',
        'hi': 'https://sangathan.space/hi/about',
      },
    },
    openGraph: {
      title: isHindi ? 'हमारे बारे में | संगठन' : 'About Us | Sangathan',
      description: isHindi 
        ? 'बहुजन क्वीर फाउंडेशन (सेक्शन 8 गैर-लाभकारी) द्वारा निर्मित नागरिक डिजिटल बुनियादी ढांचा।'
        : 'Civic digital infrastructure initiative built by Bahujan Queer Foundation (Section 8 Non-Profit).',
      url: `https://sangathan.space/${lang}/about`,
      siteName: 'Sangathan',
      type: 'website',
      images: [
        {
          url: `https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'संगठन के बारे में' : 'About Sangathan')}&desc=${encodeURIComponent(isHindi ? 'बहुजन क्वीर फाउंडेशन (सेक्शन 8 गैर-लाभकारी) द्वारा निर्मित नागरिक डिजिटल बुनियादी ढांचा।' : 'Civic digital infrastructure initiative built by Bahujan Queer Foundation (Section 8 Non-Profit).')}&type=ngo&tag=Section+8+Non-Profit&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: isHindi ? 'संगठन के बारे में' : 'About Sangathan',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@areynetaji',
      creator: '@areynetaji',
      title: isHindi ? 'हमारे बारे में | संगठन' : 'About Us | Sangathan',
      description: isHindi 
        ? 'बहुजन क्वीर फाउंडेशन (सेक्शन 8 गैर-लाभकारी) द्वारा निर्मित नागरिक डिजिटल बुनियादी ढांचा।'
        : 'Civic digital infrastructure initiative built by Bahujan Queer Foundation (Section 8 Non-Profit).',
      images: [`https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'संगठन के बारे में' : 'About Sangathan')}&desc=${encodeURIComponent(isHindi ? 'बहुजन क्वीर फाउंडेशन (सेक्शन 8 गैर-लाभकारी) द्वारा निर्मित नागरिक डिजिटल बुनियादी ढांचा।' : 'Civic digital infrastructure initiative built by Bahujan Queer Foundation (Section 8 Non-Profit).')}&type=ngo&tag=Section+8+Non-Profit&lang=${lang}`],
    },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="bg-white ">
      <OrganizationJsonLd />
      <BreadcrumbJsonLd items={[
        { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
        { name: isHindi ? 'हमारे बारे में' : 'About', url: `https://sangathan.space/${lang}/about` },
      ]} />
      <PageHeader 
        title={isHindi ? 'संगठन के बारे में' : 'About Sangathan'}
        description={isHindi 
          ? 'संगठन कोई स्टार्टअप या वाणिज्यिक कंपनी नहीं है। यह बहुजन क्वीर फाउंडेशन (सेक्शन 8 गैर-लाभकारी संगठन) की एक डिजिटल नागरिक अवसंरचना पहल है।'
          : 'Sangathan is not a startup or commercial enterprise. It is a digital civic infrastructure initiative of Bahujan Queer Foundation, a Section 8 non-profit organization.'}
      />

      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="prose prose-lg prose-slate max-w-none space-y-16">
          <section>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">{isHindi ? 'हमारा मिशन और पहचान' : 'Our Mission & Identity'}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Mission text */}
              <div className="lg:col-span-7 text-slate-600 space-y-6">
                <p>
                  {isHindi
                    ? 'संगठन नागरिक डिजिटल बुनियादी ढांचा है, जिसे गैर-सरकारी संगठनों (NGOs), पंजीकृत संगठनों और जमीनी स्तर के नागरिक समूहों को अधिक पारदर्शिता, गोपनीयता और जवाबदेही के साथ संगठित करने, शासन करने, संवाद करने और संचालित करने में मदद करने के लिए बनाया गया है।'
                    : 'Sangathan is civic digital infrastructure built to help NGOs, registered organizations, and grassroots civic collectives organize, govern, communicate, and operate with greater transparency, privacy, and accountability.'}
                </p>
                <p>
                  {isHindi
                    ? 'बहुत लंबे समय से, महत्वपूर्ण सामाजिक कार्य नाजुक स्प्रेडशीट, असुरक्षित मैसेजिंग ऐप और महंगे कॉर्पोरेट सॉफ़्टवेयर पर प्रबंधित किए गए हैं। हमने संगठन को गैर-लाभकारी सिद्धांतों पर बनाया है ताकि हर लोकतांत्रिक समूह को संप्रभु, सुरक्षित और स्वतंत्र तकनीकी उपकरण मिल सकें।'
                    : 'For too long, vital social work has been managed on fragile spreadsheets, unencrypted messaging groups, and expensive corporate software. We operate under Bahujan Queer Foundation as a non-profit initiative to provide lasting, neutral, and secure digital rails for democratic organizing.'}
                </p>
              </div>

              {/* Ground movement leader — geometric frame */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[280px] bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-slate-300 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-slate-300 pointer-events-none" />
                  <div className="relative w-full h-[300px] flex items-end justify-center">
                    <Image
                      src="/images/activist-leader.png"
                      alt={isHindi ? 'जमीनी आंदोलन नेतृत्व — संगठन' : 'Ground movement leadership — Sangathan'}
                      fill
                      sizes="(max-width: 768px) 100vw, 280px"
                      className="object-contain object-bottom"
                    />
                  </div>
                  <div className="pt-2 mt-1 border-t border-slate-200 text-center">
                    <span className="text-[11px] font-bold text-slate-900 block font-mono">
                      {isHindi ? 'जमीनी नेतृत्व • लिखित रिकॉर्ड संस्कृति' : 'Ground Leadership • Written Record Culture'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-8">{isHindi ? 'डिजाइन सिद्धांत' : 'Design Principles'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-4 text-slate-800">
                  <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">{isHindi ? 'संप्रभुता (स्वाभिमान)' : 'Sovereignty (Swabhiman)'}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'आपका डेटा आपका है। हम संरक्षक हैं, मालिक नहीं। आप किसी भी समय अपना पूरा डेटाबेस निर्यात कर सकते हैं।'
                    : 'Your data belongs to you. We are custodians, not owners. You can export your entire database at any time.'}
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-4 text-slate-800">
                  <Lock className="w-5 h-5 text-cyan-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">{isHindi ? 'निष्ठा' : 'Integrity (Nishtha)'}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'विश्वास समूहों की मुद्रा है। हमारा सिस्टम हर काम का ऑडिट रिकॉर्ड रखता है ताकि पूछताछ हमेशा संभव हो।'
                    : 'Trust is the currency of collectives. Our system keeps an audit record of every action so questions can always be answered.'}
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-4 text-slate-800">
                  <Globe className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">{isHindi ? 'लचीलापन (दृढ़ता)' : 'Resilience (Drudhta)'}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'आंदोलनों को बाहरी दबाव का सामना करना पड़ता है। हमारा बुनियादी ढांचा पकड़ बनाए रखने के लिए बनाया गया है, जिसमें अतिरेक और ऑफ़लाइन-प्रथम सोच है।'
                    : 'Movements face external pressure. Our infrastructure is built to hold, with redundancy and offline-first thinking.'}
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-4 text-slate-800">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">{isHindi ? 'पहुंच' : 'Accessibility'}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'प्रौद्योगिकी को बाहर नहीं करना चाहिए। हम सरल इंटरफेस, स्थानीय भाषाओं और कम-अंत वाले उपकरणों पर प्रदर्शन को प्राथमिकता देते हैं।'
                    : 'Technology should not exclude. We prioritize simple interfaces, local languages, and performance on low-end devices.'}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-slate-900  mb-6">{isHindi ? 'हमारा दर्शन' : 'Our Philosophy'}</h2>
            <div className="text-slate-600  space-y-6">
              <p>
                {isHindi
                  ? 'हम **बुनियादी ढांचा-प्रथम मानसिकता** के साथ काम करते हैं। हम आपके काम को "बाधित" करने या आपको आयोजन के एक विशिष्ट तरीके में मजबूर करने की कोशिश नहीं करते हैं। इसके बजाय, हम आपको स्वयं को प्रभावी ढंग से नियंत्रित करने के लिए आवश्यक तटस्थ, लचीले उपकरण प्रदान करते हैं।'
                  : 'We operate with an infrastructure-first mindset. We do not try to "disrupt" your work or force you into a specific way of organizing. Instead, we provide the neutral, flexible tools you need to govern yourselves effectively.'}
              </p>
              <p>
                {isHindi
                  ? 'हम कड़ाई से गैर-पक्षपाती हैं। हम लोकतंत्र के लिए उपकरण प्रदान करते हैं, लेकिन हम परिणामों को निर्धारित नहीं करते हैं।'
                  : 'We are strictly non-partisan. We provide the tools for democracy, but we do not dictate the outcomes.'}
              </p>
            </div>
          </section>
          
          <div className="pt-12 mt-12 border-t border-slate-200 ">
            <Link href={`/${lang}/vision`} className="inline-flex items-center gap-2 text-indigo-600  font-bold hover:gap-3 transition-all">
              {isHindi ? 'हमारी दीर्घकालिक दृष्टि के बारे में पढ़ें' : 'Read about our Long-term Vision'} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
