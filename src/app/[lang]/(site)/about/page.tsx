import Link from 'next/link'
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
            <div className="text-slate-600 space-y-6">
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
          </section>

          <section>
            <h2 className="text-3xl font-bold text-slate-900  mb-8">{isHindi ? 'डिजाइन सिद्धांत' : 'Design Principles'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
              <div className="p-8 bg-slate-50  rounded-3xl border border-slate-200  hover:border-indigo-500/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-white  border border-slate-200  flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 ">{isHindi ? 'संप्रभुता (स्वाभिमान)' : 'Sovereignty (Swabhiman)'}</h3>
                <p className="text-slate-500 ">
                  {isHindi
                    ? 'आपका डेटा आपका है। हम संरक्षक हैं, मालिक नहीं। आप किसी भी समय अपना पूरा डेटाबेस निर्यात कर सकते हैं।'
                    : 'Your data belongs to you. We are custodians, not owners. You can export your entire database at any time.'}
                </p>
              </div>
              <div className="p-8 bg-slate-50  rounded-3xl border border-slate-200  hover:border-cyan-500/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-white  border border-slate-200  flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6 text-cyan-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 ">{isHindi ? 'निष्ठा' : 'Integrity (Nishtha)'}</h3>
                <p className="text-slate-500 ">
                  {isHindi
                    ? 'विश्वास समूहों की मुद्रा है। हमारा सिस्टम अपरिवर्तनीय ऑडिट लॉग और सत्यापित पहचान के माध्यम से इसे लागू करता है।'
                    : 'Trust is the currency of collectives. Our system enforces it through immutable audit logs and verified identities.'}
                </p>
              </div>
              <div className="p-8 bg-slate-50  rounded-3xl border border-slate-200  hover:border-emerald-500/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-white  border border-slate-200  flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 ">{isHindi ? 'लचीलापन (दृढ़ता)' : 'Resilience (Drudhta)'}</h3>
                <p className="text-slate-500 ">
                  {isHindi
                    ? 'आंदोलनों को बाहरी दबाव का सामना करना पड़ता है। हमारा बुनियादी ढांचा पकड़ बनाए रखने के लिए बनाया गया है, जिसमें अतिरेक और ऑफ़लाइन-प्रथम सोच है।'
                    : 'Movements face external pressure. Our infrastructure is built to hold, with redundancy and offline-first thinking.'}
                </p>
              </div>
              <div className="p-8 bg-slate-50  rounded-3xl border border-slate-200  hover:border-purple-500/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-white  border border-slate-200  flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 ">{isHindi ? 'पहुंच' : 'Accessibility'}</h3>
                <p className="text-slate-500 ">
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
