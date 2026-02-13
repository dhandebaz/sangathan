import Link from 'next/link'
import { Mail, ShieldAlert, CreditCard, MessageSquare } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'संपर्क करें | संगठन' : 'Contact Us | Sangathan',
    description: isHindi
      ? 'समर्थन, दुरुपयोग रिपोर्टिंग और पूछताछ के लिए हमसे संपर्क करें।'
      : 'Get in touch with us for support, abuse reporting, and inquiries.',
  }
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        {isHindi ? 'संपर्क करें' : 'Contact Us'}
      </h1>
      <p className="text-xl text-gray-500 mb-12 leading-relaxed">
        {isHindi 
          ? 'हम एक छोटी, समर्पित टीम हैं। कृपया तेजी से प्रतिक्रिया सुनिश्चित करने के लिए उचित चैनल का उपयोग करें।'
          : 'We are a small, dedicated team. Please use the appropriate channel to ensure a faster response.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-orange-500 transition-colors">
           <Mail className="w-8 h-8 text-gray-900 mb-4" />
           <h3 className="text-lg font-bold mb-2">{isHindi ? 'सामान्य सहायता' : 'General Support'}</h3>
           <p className="text-gray-600 text-sm mb-4">
              {isHindi
                ? 'अपने संगठन को स्थापित करने, डेटा आयात करने या तकनीकी समस्याओं के लिए सहायता।'
                : 'For help with setting up your organisation, importing data, or technical issues.'}
           </p>
           <a href="mailto:support@sangathan.space" className="text-orange-600 font-medium hover:underline">support@sangathan.space</a>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-red-500 transition-colors">
           <ShieldAlert className="w-8 h-8 text-red-600 mb-4" />
           <h3 className="text-lg font-bold mb-2">{isHindi ? 'विश्वास और सुरक्षा' : 'Trust & Safety'}</h3>
           <p className="text-gray-600 text-sm mb-4">
              {isHindi
                ? 'दुरुपयोग, अभद्र भाषा, स्पैम, या हमारी स्वीकार्य उपयोग नीति के उल्लंघन की रिपोर्ट करने के लिए।'
                : 'To report abuse, hate speech, spam, or violations of our Acceptable Use Policy.'}
           </p>
           <a href="mailto:abuse@sangathan.space" className="text-red-600 font-medium hover:underline">abuse@sangathan.space</a>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
           <CreditCard className="w-8 h-8 text-blue-600 mb-4" />
           <h3 className="text-lg font-bold mb-2">{isHindi ? 'बिलिंग और रिफंड' : 'Billing & Refunds'}</h3>
           <p className="text-gray-600 text-sm mb-4">
              {isHindi
                ? 'समर्थक सदस्यता, चालान, या धनवापसी अनुरोधों के बारे में प्रश्नों के लिए।'
                : 'For questions about Supporter Subscriptions, invoices, or refund requests.'}
           </p>
           <a href="mailto:billing@sangathan.space" className="text-blue-600 font-medium hover:underline">billing@sangathan.space</a>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-purple-500 transition-colors">
           <MessageSquare className="w-8 h-8 text-purple-600 mb-4" />
           <h3 className="text-lg font-bold mb-2">{isHindi ? 'मीडिया और प्रेस' : 'Media & Press'}</h3>
           <p className="text-gray-600 text-sm mb-4">
              {isHindi
                ? 'हमारे मंच या मिशन के बारे में पूछताछ करने वाले पत्रकारों और शोधकर्ताओं के लिए।'
                : 'For journalists and researchers inquiring about our platform or mission.'}
           </p>
           <a href="mailto:press@sangathan.space" className="text-purple-600 font-medium hover:underline">press@sangathan.space</a>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
         <h3 className="font-bold text-gray-900 mb-2">{isHindi ? 'प्रतिक्रिया समय की उम्मीदें' : 'Response Time Expectations'}</h3>
         <p className="text-gray-600 text-sm">
            {isHindi
              ? 'हम 24-48 व्यावसायिक घंटों के भीतर सभी पूछताछ का जवाब देने का लक्ष्य रखते हैं। सुरक्षा और दुरुपयोग रिपोर्टों को प्राथमिकता दी जाती है।'
              : 'We aim to respond to all inquiries within 24-48 business hours. Safety and abuse reports are prioritized and reviewed urgently.'}
         </p>
      </div>
    </div>
  )
}
