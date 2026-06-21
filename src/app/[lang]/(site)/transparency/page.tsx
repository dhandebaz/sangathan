import { FileSearch, Database, HeartHandshake, Shield, Scale, Ban, Eye, Lock, BrainCircuit } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/public/page-header'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'पारदर्शिता और शासन | संगठन' : 'Transparency & Governance | Sangathan',
    description: isHindi
      ? 'कट्टरपंथी खुलेपन और डेटा सुरक्षा के माध्यम से विश्वास।'
      : 'Trust through radical openness and strict data sovereignty.',
  }
}

export default async function TransparencyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="bg-white min-h-screen">
      <PageHeader 
        title={isHindi ? 'पारदर्शिता और शासन' : 'Transparency & Governance'}
        description={isHindi 
          ? 'हमारा मानना है कि विश्वास कट्टरपंथी खुलेपन के माध्यम से अर्जित किया जाता है। यहाँ बताया गया है कि हम आपके डेटा की रक्षा कैसे करते हैं और प्लेटफ़ॉर्म को कैसे नियंत्रित करते हैं।'
          : 'We believe that trust is earned through radical openness. Here is how we protect your data, secure you from Big Tech, and govern the platform.'}
      />

      <div className="max-w-5xl mx-auto py-16 px-6 sm:px-8 space-y-24">
        
        {/* Anti-LLM / Data Protection Banner */}
        <section className="relative bg-slate-50 p-8 sm:p-12 border border-slate-200 rounded-[2.5rem]">
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                {isHindi ? 'आपका डेटा आपका है। यह एआई के लिए प्रशिक्षण चारा नहीं है।' : 'Your data is yours. It is not training fodder for AI.'}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                {isHindi 
                  ? 'संगठनों के पास अक्सर संवेदनशील डेटा होता है। बिग टेक प्लेटफ़ॉर्म (Facebook, WhatsApp) आपको विज्ञापनों से ट्रैक करते हैं और अपनी भाषा मॉडल (LLMs) को प्रशिक्षित करने के लिए आपके वार्तालापों को स्क्रैप करते हैं। संगठन अलग है।' 
                  : 'Grassroots collectives hold sensitive data. Big Tech platforms (like WhatsApp, Facebook) track you with ad pixels and actively scrape your conversations to train their Large Language Models (LLMs). Sangathan is built differently.'}
              </p>
              <ul className="space-y-4">
                {[
                  isHindi ? 'डिफ़ॉल्ट रूप से ऑप्ट-आउट: एआई प्रशिक्षण के लिए कोई डेटा स्क्रैपिंग नहीं।' : 'Opt-out by Default: Zero data scraping for external AI training.',
                  isHindi ? 'सख्त अलगाव: आपका डेटा बड़े डेटाबेस के साथ मिलाया नहीं जाता है।' : 'Strict Isolation: Your organisation data is never co-mingled with others.',
                  isHindi ? 'कोई विज्ञापन नहीं, कोई पिक्सेल नहीं: हम आपको वेब पर ट्रैक नहीं करते हैं।' : 'No Ads, No Pixels: We never track your users across the web.'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Shield className="text-indigo-600 mt-1 shrink-0" size={18} />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-48 h-48 sm:w-64 sm:h-64 shrink-0 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center relative shadow-sm">
              <Lock className="text-slate-300 w-24 h-24" />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full" />
            </div>
          </div>
        </section>

        {/* Anti-Practices Transparency */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{isHindi ? 'हम क्या नहीं करते हैं' : 'What we DO NOT do'}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {isHindi ? 'हमारा व्यवसाय मॉडल आपके ध्यान या डेटा का मुद्रीकरण करने पर निर्भर नहीं है। यहाँ वह सब कुछ है जो अन्य कंपनियाँ करती हैं, लेकिन हम नहीं करते।' : 'Our business model does not rely on monetizing your attention or data. Here are the common industry practices we explicitly refuse to engage in.'}
            </p>
          </div>

          <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
             <div className="flex items-center justify-center gap-3 mb-10">
                <FileSearch className="w-8 h-8 text-red-500" />
                <h3 className="font-bold text-2xl text-slate-900">
                  {isHindi ? 'हमारी सख्त ' : 'Our Strict '} <span className="text-red-500">Anti-Practices</span>
                </h3>
             </div>
             
             <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'राजनीतिक प्रोफाइलिंग' : 'Political Profiling'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम आपके राजनीतिक झुकाव का अनुमान या बिक्री नहीं करते हैं।' : 'We do not infer, sell, or analyze your political leanings or affiliations.'}</span>
                </div>
                
                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'विज्ञापन लक्ष्यीकरण' : 'Ad Targeting & Pixels'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'कोई विज्ञापन नहीं। कोई गुप्त कुकीज़ नहीं। कोई क्रॉस-साइट ट्रैकिंग नहीं।' : 'Zero ads. Zero secret cookies. Zero cross-site tracking pixels.'}</span>
                </div>
                
                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'डिवाइस फ़िंगरप्रिंटिंग' : 'Device Fingerprinting'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम पूरे वेब पर आपकी गतिविधियों का प्रोफाइल नहीं बनाते हैं।' : 'We do not build a shadow profile of you across the internet using your hardware footprint.'}</span>
                </div>
                
                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'लोकेशन ट्रैकिंग' : 'Location Tracking'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम आपकी जीपीएस स्थिति या पृष्ठभूमि आंदोलनों को ट्रैक नहीं करते हैं।' : 'We never track or store your GPS coordinates or background movements.'}</span>
                </div>
                
                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'इनबॉक्स स्कैनिंग' : 'Inbox Scanning'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम विज्ञापन या AI प्रशिक्षण के लिए आपके संचार नहीं पढ़ते हैं।' : 'We do not read or scan your communications for ad-profiling or AI training.'}</span>
                </div>

                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'एआई के लिए डेटा स्क्रैपिंग' : 'Data Scraping for AI'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम बाहरी एलएलएम को प्रशिक्षित करने के लिए आपके संगठन के डेटा का उपयोग नहीं करते हैं।' : 'We refuse to use your organisation\'s private data to train external Large Language Models.'}</span>
                </div>

                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'वेंडर लॉक-इन' : 'Vendor Lock-in'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम आपके डेटा को बंधक नहीं बनाते। आप कभी भी अपना डेटा निर्यात कर सकते हैं।' : 'We don\'t hold your data hostage. You can export your member lists and data in CSV format at any time.'}</span>
                </div>

                <div className="flex flex-col">
                  <strong className="text-slate-900 text-lg flex items-center gap-2 mb-1">
                    <Ban className="w-4 h-4 text-red-500" /> {isHindi ? 'डेटा ब्रोकर्स को बिक्री' : 'Selling to Data Brokers'}
                  </strong>
                  <span className="text-slate-600 leading-relaxed">{isHindi ? 'हम तीसरे पक्ष के डेटा दलालों से आपकी जानकारी नहीं खरीदते या बेचते हैं।' : 'We never purchase shadow profiles or sell your member lists to third-party data brokers.'}</span>
                </div>
             </div>
          </div>
        </section>

        {/* Governance & Neutrality */}
        <section className="space-y-8 border-t border-slate-200 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{isHindi ? 'शासन और तटस्थता' : 'Governance & Neutrality'}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {isHindi ? 'एक सुरक्षित और निष्पक्ष मंच बनाए रखने के लिए हमारी रूपरेखा।' : 'Our framework for maintaining a neutral, safe, and reliable platform for all.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6">
                <Scale className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{isHindi ? 'प्लेटफ़ॉर्म तटस्थता' : 'Platform Neutrality'}</h3>
              <p className="text-slate-600 leading-relaxed">
                {isHindi
                  ? 'हम केवल तकनीकी बुनियादी ढांचे के रूप में कार्य करते हैं। हम हमारे मंच पर किसी भी संगठन का समर्थन या वित्त पोषण नहीं करते हैं। हम वैचारिक सामग्री को पुलिस नहीं करते हैं जब तक कि वह हमारी स्वीकार्य उपयोग नीति का उल्लंघन न करे। हम सामग्री-अज्ञेयवादी हैं लेकिन सुरक्षा-अनिवार्य हैं।'
                  : 'We act solely as infrastructure. We do not endorse or fund any organisation on our platform. We do not police ideological content unless it violates our Acceptable Use Policy. We are content-agnostic but safety-mandatory.'}
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-6">
                <Ban className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{isHindi ? 'निलंबन नीति' : 'Suspension Policy'}</h3>
              <p className="text-slate-600 leading-relaxed">
                {isHindi
                  ? 'गंभीर उल्लंघनों (वित्तीय धोखाधड़ी, हिंसा, बाल शोषण) के लिए, हम बिना किसी पूर्व सूचना के खातों को तुरंत निलंबित कर सकते हैं। सभी निलंबनों की सुरक्षा टीम द्वारा समीक्षा की जाती है, और संगठनों को अपील करने का अधिकार है।'
                  : 'For serious violations (financial fraud, violence, exploitation), we reserve the right to suspend accounts immediately without prior notice. All suspensions are reviewed by our safety team, and organisations have the right to appeal.'}
              </p>
            </div>
          </div>
        </section>

        {/* The Supporter Model */}
        <section className="bg-indigo-50 rounded-3xl p-8 sm:p-12 border border-indigo-100">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm border border-indigo-100">
              <HeartHandshake className="w-10 h-10 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">{isHindi ? 'समर्थक मॉडल' : 'The Supporter Model'}</h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                {isHindi
                  ? 'संगठन मुफ़्त है क्योंकि हम "इंस्टीट्यूशन" योजना का भुगतान करने वाले संगठनों के समुदाय द्वारा समर्थित हैं। यह मॉडल हमारे प्रोत्साहनों को आपके साथ संरेखित करता है-रोशनी चालू रखने के लिए हमें आपका डेटा बेचने की आवश्यकता नहीं है। हम विज्ञापनदाताओं के प्रति नहीं, अपने उपयोगकर्ताओं के प्रति जवाबदेह हैं।'
                  : 'Sangathan is free for grassroots collectives because we are supported by larger organisations paying for the "Institution" plan. This aligns our incentives with yours - we do not need to sell your data to keep the lights on. We answer to our users, not to advertisers.'}
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
