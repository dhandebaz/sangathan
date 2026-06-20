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
        badge={isHindi ? 'नीतियां और सुरक्षा' : 'Policies & Protection'}
      />

      <div className="max-w-5xl mx-auto py-16 px-6 sm:px-8 space-y-24">
        
        {/* Anti-LLM / Data Protection Banner */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 sm:p-12 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                <BrainCircuit size={14} />
                {isHindi ? 'एआई और बड़े डेटा से सुरक्षित' : 'Protected from Big Data & LLMs'}
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                {isHindi ? 'आपका डेटा आपका है। यह एआई के लिए प्रशिक्षण चारा नहीं है।' : 'Your data is yours. It is not training fodder for AI.'}
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
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
                    <Shield className="text-emerald-400 mt-1 shrink-0" size={18} />
                    <span className="text-slate-200 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-48 h-48 sm:w-64 sm:h-64 shrink-0 bg-slate-800 rounded-full border-4 border-slate-700 flex items-center justify-center relative shadow-inner">
              <Lock className="text-slate-400 w-24 h-24" />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full" />
            </div>
          </div>
        </section>

        {/* Data Collection Transparency */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{isHindi ? 'डेटा संग्रह और उपयोग' : 'Data Collection & Usage'}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {isHindi ? 'हम केवल वह एकत्र करते हैं जो प्लेटफ़ॉर्म को चलाने के लिए आवश्यक है। कोई छिपा हुआ एजेंडा नहीं।' : 'We only collect what is strictly necessary to run the platform. No hidden agendas.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
               <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-3">
                  <Database className="w-6 h-6 text-indigo-500" /> {isHindi ? 'हम क्या एकत्र करते हैं' : 'What we collect'}
               </h3>
               <ul className="space-y-4">
                  <li className="flex flex-col">
                    <strong className="text-slate-900">{isHindi ? 'व्यवस्थापक पहचान' : 'Admin Identity'}</strong>
                    <span className="text-slate-600">{isHindi ? 'जवाबदेही के लिए संगठन निर्माताओं के सत्यापित फोन नंबर।' : 'Verified phone numbers of organisation creators for accountability.'}</span>
                  </li>
                  <li className="flex flex-col">
                    <strong className="text-slate-900">{isHindi ? 'संगठन डेटा' : 'Organisation Data'}</strong>
                    <span className="text-slate-600">{isHindi ? 'सदस्य, फॉर्म और लॉग जो आप दर्ज करते हैं। आप इसके मालिक हैं।' : 'Members, forms, and logs you enter. You own this entirely.'}</span>
                  </li>
                  <li className="flex flex-col">
                    <strong className="text-slate-900">{isHindi ? 'सिस्टम लॉग' : 'System Logs'}</strong>
                    <span className="text-slate-600">{isHindi ? 'स्पैम को रोकने के लिए आईपी पते और टाइमस्टैम्प।' : 'IP addresses and timestamps to prevent spam and abuse.'}</span>
                  </li>
               </ul>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
               <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-3">
                  <FileSearch className="w-6 h-6 text-red-500" /> {isHindi ? 'हम क्या एकत्र नहीं करते हैं' : 'What we DO NOT collect'}
               </h3>
               <ul className="space-y-4">
                  <li className="flex flex-col">
                    <strong className="text-slate-900">{isHindi ? 'राजनीतिक प्रोफाइलिंग डेटा' : 'Political Profiling Data'}</strong>
                    <span className="text-slate-600">{isHindi ? 'हम आपके राजनीतिक झुकाव का अनुमान या बिक्री नहीं करते हैं।' : 'We do not infer, sell, or analyze your political leanings.'}</span>
                  </li>
                  <li className="flex flex-col">
                    <strong className="text-slate-900">{isHindi ? 'विज्ञापन लक्ष्यीकरण डेटा' : 'Ad Targeting Data'}</strong>
                    <span className="text-slate-600">{isHindi ? 'कोई विज्ञापन नहीं। कोई गुप्त कुकीज़ नहीं।' : 'Zero ads. Zero secret cookies. Zero cross-site tracking.'}</span>
                  </li>
                  <li className="flex flex-col">
                    <strong className="text-slate-900">{isHindi ? 'डिवाइस फ़िंगरप्रिंट' : 'Device Fingerprints'}</strong>
                    <span className="text-slate-600">{isHindi ? 'हम पूरे वेब पर आपको ट्रैक नहीं करते हैं।' : 'We do not build a profile of you across the internet.'}</span>
                  </li>
               </ul>
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
                  ? 'संगठन मुफ़्त है क्योंकि हम "इंस्टीट्यूशन" योजना का भुगतान करने वाले संगठनों के समुदाय द्वारा समर्थित हैं। यह मॉडल हमारे प्रोत्साहनों को आपके साथ संरेखित करता है—रोशनी चालू रखने के लिए हमें आपका डेटा बेचने की आवश्यकता नहीं है। हम विज्ञापनदाताओं के प्रति नहीं, अपने उपयोगकर्ताओं के प्रति जवाबदेह हैं।'
                  : 'Sangathan is free for grassroots collectives because we are supported by larger organisations paying for the "Institution" plan. This aligns our incentives with yours—we do not need to sell your data to keep the lights on. We answer to our users, not to advertisers.'}
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
