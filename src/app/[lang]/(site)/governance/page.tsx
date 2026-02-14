import Link from 'next/link'
import { Scale, Ban, ShieldAlert, Eye } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'शासन और तटस्थता | संगठन' : 'Governance & Neutrality | Sangathan',
    description: isHindi
      ? 'एक तटस्थ, सुरक्षित और विश्वसनीय मंच बनाए रखने के लिए हमारी रूपरेखा।'
      : 'Our framework for maintaining a neutral, safe, and reliable platform.',
  }
}

export default async function GovernancePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-[var(--text-primary)]">
        {isHindi ? 'शासन और तटस्थता' : 'Governance & Neutrality'}
      </h1>
      <p className="text-xl text-[var(--text-secondary)] mb-12 leading-relaxed">
        {isHindi 
          ? 'एक तटस्थ, सुरक्षित और विश्वसनीय मंच बनाए रखने के लिए हमारी रूपरेखा।'
          : 'Our framework for maintaining a neutral, safe, and reliable platform.'}
      </p>

      <div className="prose prose-slate max-w-none text-[var(--text-secondary)] space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-8 h-8 text-[var(--accent)]" />
            <h2 className="text-2xl font-bold text-[var(--text-primary)] m-0">{isHindi ? 'प्लेटफ़ॉर्म तटस्थता' : 'Platform Neutrality'}</h2>
          </div>
          <p>
            {isHindi
              ? 'संगठन केवल तकनीकी बुनियादी ढांचे के रूप में कार्य करता है। हम हमारे मंच पर किसी भी संगठन का समर्थन, वित्त पोषण या निर्देशन नहीं करते हैं। चाहे आप एक छात्र संघ हों, एक पड़ोस सामूहिक हों, या एक गैर-लाभकारी हों, हमारी भूमिका आपको स्वयं को नियंत्रित करने के लिए आवश्यक उपकरण प्रदान करना है।'
              : 'Sangathan acts solely as technical infrastructure. We do not endorse, fund, or direct any organisation on our platform. Whether you are a student union, a neighborhood collective, or a non-profit, our role is to provide the tools you need to govern yourself.'}
          </p>
          <p>
            {isHindi ? (
              <>
                हम वैचारिक सामग्री को तब तक पुलिस नहीं करते जब तक कि वह हमारी{' '}
                <Link href={`/${lang}/acceptable-use-policy`} className="text-[var(--accent)] hover:underline">
                  स्वीकार्य उपयोग नीति
                </Link>{' '}
                (जैसे, अभद्र भाषा, हिंसा, धोखाधड़ी) का उल्लंघन नहीं करती। हम सामग्री-अज्ञेयवादी हैं लेकिन सुरक्षा-अनिवार्य हैं।
              </>
            ) : (
              <>
                We do not police ideological content unless it violates our{' '}
                <Link href={`/${lang}/acceptable-use-policy`} className="text-[var(--accent)] hover:underline">
                  Acceptable Use Policy
                </Link>{' '}
                (e.g., hate speech, violence, fraud). We are content-agnostic but safety-mandatory.
              </>
            )}
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Ban className="w-8 h-8 text-[var(--accent)]" />
            <h2 className="text-2xl font-bold text-[var(--text-primary)] m-0">{isHindi ? 'निलंबन नीति' : 'Suspension Policy'}</h2>
          </div>
          <p>
            {isHindi
              ? 'हम प्रवर्तन के लिए एक स्तरीय दृष्टिकोण अपनाते हैं। मामूली उल्लंघनों के मामलों में, हम चेतावनी जारी कर सकते हैं। गंभीर उल्लंघनों के लिए- जैसे वित्तीय धोखाधड़ी, बाल शोषण, या आतंकवाद- हम बिना किसी पूर्व सूचना के खातों को तुरंत निलंबित या समाप्त करने का अधिकार सुरक्षित रखते हैं।'
              : 'We take a tiered approach to enforcement. In cases of minor violations, we may issue warnings. For serious violations—such as financial fraud, child exploitation, or terrorism—we reserve the right to suspend or terminate accounts immediately without prior notice.'}
          </p>
          <p>
            {isHindi
              ? 'सभी निलंबनों की हमारी आंतरिक सुरक्षा टीम द्वारा समीक्षा की जाती है। संगठनों को हमारे समर्पित अपील चैनल के माध्यम से अपील करने का अधिकार है।'
              : 'All suspensions are reviewed by our internal safety team. Organisations have the right to appeal via our dedicated appeals channel.'}
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-8 h-8 text-[var(--accent)]" />
            <h2 className="text-2xl font-bold text-[var(--text-primary)] m-0">{isHindi ? 'कानूनी होल्ड फ्रेमवर्क' : 'Legal Hold Framework'}</h2>
          </div>
          <p>
            {isHindi
              ? 'भारतीय कानून का पालन करने के लिए, हमने "लीगल होल्ड" सिस्टम लागू किया है। यदि हमें कोई वैध कानूनी आदेश प्राप्त होता है या हम गंभीर अपराधों के लिए जांच के तहत किसी खाते की पहचान करते हैं, तो हम खाते के डेटा को "फ्रीज" कर सकते हैं।'
              : 'To comply with Indian law, we have implemented a "Legal Hold" system. If we receive a valid legal order or identify an account under investigation for serious crimes, we can "freeze" the account\'s data.'}
          </p>
          <p>
            {isHindi
              ? 'यह जांच जारी रहने के दौरान डेटा को हटाए जाने या संशोधित किए जाने से रोकता है। यह प्लेटफॉर्म और सबूतों की अखंडता दोनों की रक्षा करता है।'
              : 'This prevents the data from being deleted or modified while the investigation is ongoing. This protects both the platform and the integrity of evidence.'}
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-8 h-8 text-[var(--accent)]" />
            <h2 className="text-2xl font-bold text-[var(--text-primary)] m-0">{isHindi ? 'पारदर्शिता प्रतिबद्धता' : 'Transparency Commitment'}</h2>
          </div>
          <p>
            {isHindi ? (
              <>
                हम अपने शासन में पारदर्शिता के लिए प्रतिबद्ध हैं। हम एक{' '}
                <Link href={`/${lang}/transparency`} className="text-[var(--accent)] hover:underline">
                  पारदर्शिता रिपोर्ट
                </Link>{' '}
                प्रकाशित करते हैं जिसमें सरकारी डेटा अनुरोधों, टेकडाउन नोटिस और प्लेटफॉर्म द्वारा की गई प्रवर्तन कार्रवाई का विवरण होता है।
              </>
            ) : (
              <>
                We are committed to transparency in our governance. We publish a{' '}
                <Link href={`/${lang}/transparency`} className="text-[var(--accent)] hover:underline">
                  Transparency Report
                </Link>{' '}
                detailing government data requests, takedown notices, and enforcement actions taken by the platform.
              </>
            )}
          </p>
        </section>
      </div>
    </div>
  )
}
