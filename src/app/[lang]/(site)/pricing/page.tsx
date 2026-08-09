import { Metadata } from 'next'
import { ShieldCheck, HeartHandshake, HelpCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import { PageHeader } from '@/components/public/page-header'
import { PublicPricingGrid } from '@/components/pricing/public-pricing-grid'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'मूल्य निर्धारण | संगठन' : 'Pricing | Sangathan',
    description: isHindi
      ? 'पारदर्शी मूल्य निर्धारण। जमीनी स्तर के समूहों के लिए हमेशा के लिए मुफ्त।'
      : 'Transparent pricing. Free forever for grassroots collectives. Affordable for growing institutions.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/pricing`,
      languages: {
        en: 'https://sangathan.space/en/pricing',
        hi: 'https://sangathan.space/hi/pricing',
      },
    },
  }
}

export default async function PricingPage({ params }: { params: Promise<{ lang: string }> }) {
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
      question: isHindi ? 'क्या संगठन का उपयोग मुफ़्त है?' : 'Is Sangathan free to use?',
      answer: isHindi
        ? 'हाँ, समुदाय योजना 20 उपयोगकर्ताओं तक के छोटे नागरिक समूहों के लिए हमेशा के लिए मुफ़्त है। सभी मुख्य लोकतांत्रिक शासन सुविधाएँ शामिल हैं।'
        : 'Yes, the Community plan is free forever for small civic collectives with up to 20 users. All core democratic governance features are included.',
    },
    {
      question: isHindi ? 'यदि हम 20 सदस्यों की सीमा तक पहुँच जाते हैं तो क्या होगा?' : 'What happens if we reach the 20-member limit?',
      answer: isHindi
        ? 'आप कभी भी ₹1,000/माह या ₹10,000/वर्ष पर संस्थान योजना में अपग्रेड कर सकते हैं ताकि 1,000 सदस्यों तक और AI सुविधाएं अनलॉक की जा सकें।'
        : 'You can upgrade at any time to the Institution plan (₹1,000/month or ₹10,000/year) to unlock up to 1,000 members and full AI intelligence tools.',
    },
    {
      question: isHindi ? 'भुगतान के कौन से तरीके स्वीकार किए जाते हैं?' : 'What payment methods are accepted?',
      answer: isHindi
        ? 'हम रेज़रपे के माध्यम से यूपीआई (UPI), क्रेडिट/डेबिट कार्ड और नेट बैंकिंग स्वीकार करते हैं। सभी भुगतान भारतीय रुपयों (INR) में होते हैं।'
        : 'We accept UPI (GPay, PhonePe, Paytm), credit/debit cards, and Net Banking via Razorpay. All payments are processed securely in INR.',
    },
    {
      question: isHindi ? 'क्या धनवापसी नीति उपलब्ध है?' : 'Is there a refund policy?',
      answer: isHindi
        ? 'हाँ, यदि आप संतुष्ट नहीं हैं तो हम खरीद के 14 दिनों के भीतर 100% पूर्ण धनवापसी प्रदान करते हैं।'
        : 'Yes, we offer a full 14-day no-questions-asked money-back guarantee on all paid plan subscriptions.',
    },
  ]

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'मूल्य निर्धारण' : 'Pricing', url: `https://sangathan.space/${lang}/pricing` },
        ]}
      />
      <FAQJsonLd
        questions={faqs.map((f) => ({
          question: f.question,
          answer: f.answer,
        }))}
      />

      <PageHeader
        title={isHindi ? 'सरल और पारदर्शी मूल्य निर्धारण' : 'Simple, Transparent Pricing'}
        description={
          isHindi
            ? 'जमीनी स्तर के समूहों के लिए हमेशा के लिए मुफ्त। बड़े संघों और एनजीओ के लिए किफायती।'
            : 'Free forever for grassroots collectives. Predictable and affordable for growing institutions.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Interactive Pricing Grid */}
        <PublicPricingGrid orgId={orgId} lang={lang} isHindi={isHindi} />

        {/* Ethical Cross-Subsidy Assurance (Crisp technical light box, no dark blobs) */}
        <div className="mt-24 max-w-4xl mx-auto rounded-3xl border border-slate-200 bg-slate-50/80 p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isHindi ? 'निजी, सुरक्षित और आत्मनिर्भर' : 'Private, Sustainable & Mission-Aligned'}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {isHindi
              ? 'हम न तो डेटा बेचते हैं और न ही विज्ञापन चलाते हैं। संस्थागत योजना से प्राप्त राजस्व सर्वर लागतों को निधि देता है, जिससे यह प्लेटफ़ॉर्म छोटे नागरिक समूहों के लिए हमेशा मुफ़्त रहता है।'
              : 'We never sell user data or run advertisements. Revenue from paid Institution plans funds server infrastructure so grassroots collectives can operate completely free forever.'}
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isHindi
                ? 'मूल्य निर्धारण और सदस्यता के बारे में आपके सभी उत्तर।'
                : 'Everything you need to know about our billing and plans.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 transition-colors"
              >
                <h4 className="text-base font-bold text-slate-900 mb-2">{faq.question}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
