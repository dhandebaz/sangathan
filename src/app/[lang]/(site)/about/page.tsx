import Link from 'next/link'
import { ArrowRight, Shield, Globe, Lock, Heart } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'हमारे बारे में | संगठन' : 'About Us | Sangathan',
    description: isHindi 
      ? 'जमीनी आंदोलनों के लिए डिजिटल बुनियादी ढांचा।'
      : 'Digital infrastructure for grassroots movements.',
  }
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        {isHindi ? 'संगठन के बारे में' : 'About Sangathan'}
      </h1>
      <p className="text-xl text-gray-500 mb-12 leading-relaxed">
        {isHindi 
          ? 'संगठन कोई स्टार्टअप नहीं है। यह नागरिक क्षेत्र के लिए डिजिटल सार्वजनिक बुनियादी ढांचा है।'
          : 'Sangathan is not a startup. It is digital public infrastructure for the civic sector.'}
      </p>

      <div className="prose prose-slate max-w-none text-gray-700 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'हम क्यों मौजूद हैं' : 'Why we exist'}</h2>
          <p>
            {isHindi
              ? 'बहुत लंबे समय से, महत्वपूर्ण नागरिक कार्य नाजुक स्प्रेडशीट, अराजक व्हाट्सएप समूहों और महंगे कॉर्पोरेट सॉफ़्टवेयर पर प्रबंधित किए गए हैं। यह विखंडन जमीनी आंदोलनों के पैमाने और प्रभाव को सीमित करता है।'
              : 'For too long, vital civic work has been managed on fragile spreadsheets, chaotic WhatsApp groups, and expensive corporate software. This fragmentation limits the scale and impact of grassroots movements.'}
          </p>
          <p>
            {isHindi
              ? 'हमने संगठन को **उबाऊ, विश्वसनीय रेल** प्रदान करने के लिए बनाया है जो आंदोलनों को ढीले समूहों से स्थायी संस्थानों में बदलने की अनुमति देता है। हमारा मानना ​​है कि मजबूत शासन बुनियादी ढांचा एक लोकतांत्रिक अधिकार है, लक्जरी उत्पाद नहीं।'
              : 'We built Sangathan to provide the **boring, reliable rails** that allow movements to transition from loose groups to lasting institutions. We believe that robust governance infrastructure is a democratic right, not a luxury product.'}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'डिजाइन सिद्धांत' : 'Design Principles'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <Shield className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">{isHindi ? 'संप्रभुता (स्वाभिमान)' : 'Sovereignty (Swabhiman)'}</h3>
              <p className="text-gray-600 text-sm">
                {isHindi
                  ? 'आपका डेटा आपका है। हम संरक्षक हैं, मालिक नहीं। आप किसी भी समय अपना पूरा डेटाबेस निर्यात कर सकते हैं।'
                  : 'Your data belongs to you. We are custodians, not owners. You can export your entire database at any time.'}
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <Lock className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">{isHindi ? 'निष्ठा' : 'Integrity (Nishtha)'}</h3>
              <p className="text-gray-600 text-sm">
                {isHindi
                  ? 'विश्वास समूहों की मुद्रा है। हमारा सिस्टम अपरिवर्तनीय ऑडिट लॉग और सत्यापित पहचान के माध्यम से इसे लागू करता है।'
                  : 'Trust is the currency of collectives. Our system enforces it through immutable audit logs and verified identities.'}
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <Globe className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">{isHindi ? 'लचीलापन (दृढ़ता)' : 'Resilience (Drudhta)'}</h3>
              <p className="text-gray-600 text-sm">
                {isHindi
                  ? 'आंदोलनों को बाहरी दबाव का सामना करना पड़ता है। हमारा बुनियादी ढांचा पकड़ बनाए रखने के लिए बनाया गया है, जिसमें अतिरेक और ऑफ़लाइन-प्रथम सोच है।'
                  : 'Movements face external pressure. Our infrastructure is built to hold, with redundancy and offline-first thinking.'}
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <Heart className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">{isHindi ? 'पहुंच' : 'Accessibility'}</h3>
              <p className="text-gray-600 text-sm">
                {isHindi
                  ? 'प्रौद्योगिकी को बाहर नहीं करना चाहिए। हम सरल इंटरफेस, स्थानीय भाषाओं और कम-अंत वाले उपकरणों पर प्रदर्शन को प्राथमिकता देते हैं।'
                  : 'Technology should not exclude. We prioritize simple interfaces, local languages, and performance on low-end devices.'}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'हमारा दर्शन' : 'Our Philosophy'}</h2>
          <p>
            {isHindi
              ? 'हम **बुनियादी ढांचा-प्रथम मानसिकता** के साथ काम करते हैं। हम आपके काम को "बाधित" करने या आपको आयोजन के एक विशिष्ट तरीके में मजबूर करने की कोशिश नहीं करते हैं। इसके बजाय, हम आपको स्वयं को प्रभावी ढंग से नियंत्रित करने के लिए आवश्यक तटस्थ, लचीले उपकरण प्रदान करते हैं।'
              : 'We operate with an **infrastructure-first mindset**. We do not try to "disrupt" your work or force you into a specific way of organizing. Instead, we provide the neutral, flexible tools you need to govern yourselves effectively.'}
          </p>
          <p>
            {isHindi
              ? 'हम कड़ाई से गैर-पक्षपाती हैं। हम लोकतंत्र के लिए उपकरण प्रदान करते हैं, लेकिन हम परिणामों को निर्धारित नहीं करते हैं।'
              : 'We are strictly non-partisan. We provide the tools for democracy, but we do not dictate the outcomes.'}
          </p>
        </section>
        
        <div className="pt-8 border-t border-gray-200">
          <Link href={`/${lang}/vision`} className="text-orange-600 font-bold flex items-center gap-2 hover:underline">
            {isHindi ? 'हमारी दीर्घकालिक दृष्टि के बारे में पढ़ें' : 'Read about our Long-term Vision'} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
