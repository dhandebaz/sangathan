import Link from 'next/link'
import { CheckCircle, Activity } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'सिस्टम स्थिति | संगठन' : 'System Status | Sangathan',
    description: isHindi
      ? 'वास्तविक समय प्रदर्शन निगरानी और घटना इतिहास।'
      : 'Real-time performance monitoring and incident history.',
  }
}

export default async function StatusPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
         <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
            <CheckCircle size={32} />
         </div>
         <h1 className="text-3xl font-bold mb-4 text-gray-900">{isHindi ? 'सिस्टम स्थिति' : 'System Status'}</h1>
         <p className="text-gray-500">
            {isHindi 
              ? 'वास्तविक समय प्रदर्शन निगरानी और घटना इतिहास।'
              : 'Real-time performance monitoring and incident history.'}
         </p>
      </div>

      <div className="space-y-4 mb-16">
         <div className="p-4 border border-gray-200 rounded-xl flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
               <Activity className="text-gray-400" size={20} />
               <span className="font-medium text-gray-900">{isHindi ? 'कोर एप्लिकेशन' : 'Core Application'}</span>
            </div>
            <span className="inline-flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">
               <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span> {isHindi ? 'संचालन में' : 'Operational'}
            </span>
         </div>
         <div className="p-4 border border-gray-200 rounded-xl flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
               <Activity className="text-gray-400" size={20} />
               <span className="font-medium text-gray-900">{isHindi ? 'डेटाबेस (Supabase)' : 'Database (Supabase)'}</span>
            </div>
            <span className="inline-flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">
               <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span> {isHindi ? 'संचालन में' : 'Operational'}
            </span>
         </div>
         <div className="p-4 border border-gray-200 rounded-xl flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
               <Activity className="text-gray-400" size={20} />
               <span className="font-medium text-gray-900">{isHindi ? 'ओटीपी डिलीवरी (Firebase)' : 'OTP Delivery (Firebase)'}</span>
            </div>
            <span className="inline-flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">
               <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span> {isHindi ? 'संचालन में' : 'Operational'}
            </span>
         </div>
      </div>

      <div className="prose prose-slate max-w-none text-gray-700 space-y-8">
         <section>
            <h3 className="text-xl font-bold text-gray-900">{isHindi ? 'हम अपटाइम की निगरानी कैसे करते हैं' : 'How we monitor uptime'}</h3>
            <p>
               {isHindi
                 ? 'हम हर मिनट हमारे एपीआई एंडपॉइंट्स, डेटाबेस कनेक्टिविटी और बैकग्राउंड जॉब कतारों की जांच करने के लिए स्वचालित जांच का उपयोग करते हैं। यदि कोई जांच विफल हो जाती है, तो हमारी इंजीनियरिंग टीम को तुरंत सूचित किया जाता है।'
                 : 'We use automated probes to check our API endpoints, database connectivity, and background job queues every minute. If any check fails, our engineering team is alerted immediately.'}
            </p>
         </section>

         <section>
            <h3 className="text-xl font-bold text-gray-900">{isHindi ? 'डिग्रेडेड मोड' : 'Degraded Mode'}</h3>
            <p>
               {isHindi
                 ? 'आंशिक विफलता की स्थिति में (उदाहरण के लिए, यदि हमारा एसएमएस प्रदाता डाउन है), संगठन "डिग्रेडेड मोड" में प्रवेश कर सकता है। इस स्थिति में:'
                 : 'In the event of a partial failure (e.g., if our SMS provider is down), Sangathan may enter "Degraded Mode." In this state:'}
            </p>
            <ul className="list-disc pl-5 text-sm">
               <li>{isHindi ? 'कोर डेटा सुलभ रहता है (केवल पढ़ने के लिए)।' : 'Core data remains accessible (Read-only).'}</li>
               <li>{isHindi ? 'गैर-आवश्यक सुविधाएँ (जैसे नए साइनअप) को रोका जा सकता है।' : 'Non-essential features (like new signups) may be paused.'}</li>
               <li>{isHindi ? 'सीमा को समझाने के लिए आपके डैशबोर्ड पर एक बैनर दिखाई देगा।' : 'A banner will appear on your dashboard explaining the limitation.'}</li>
            </ul>
         </section>

         <section>
            <h3 className="text-xl font-bold text-gray-900">{isHindi ? 'घटना पारदर्शिता' : 'Incident Transparency'}</h3>
            <p>
               {isHindi
                 ? 'हम आउटेज नहीं छिपाते हैं। यदि हम नीचे जाते हैं, तो हम यह समझाने के लिए एक पोस्ट-मॉर्टम प्रकाशित करेंगे कि क्या हुआ और पुनरावृत्ति को रोकने के लिए हम इसे कैसे ठीक कर रहे हैं।'
                 : 'We do not hide outages. If we go down, we will publish a post-mortem explaining what happened and how we are fixing it to prevent recurrence.'}
            </p>
         </section>
      </div>
    </div>
  )
}
