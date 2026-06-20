import { Mail, ShieldAlert, CreditCard, MessageSquare } from 'lucide-react'
import { Metadata } from 'next'
import { PageHeader } from '@/components/public/page-header'

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
    <div className="bg-white  min-h-screen">
      <PageHeader 
        title={isHindi ? 'संपर्क करें' : 'Contact Us'}
        description={isHindi 
          ? 'हम एक छोटी, समर्पित टीम हैं। कृपया तेजी से प्रतिक्रिया सुनिश्चित करने के लिए उचित चैनल का उपयोग करें।'
          : 'We are a small, dedicated team. Please use the appropriate channel to ensure a faster response.'}
        badge={isHindi ? 'मदद' : 'Get in Touch'}
      />

      <div className="max-w-5xl mx-auto py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="p-8 bg-slate-50  border border-slate-200  rounded-3xl hover:border-indigo-500/50 transition-colors group">
             <div className="w-12 h-12 rounded-2xl bg-white  border border-slate-200  flex items-center justify-center mb-6">
               <Mail className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform" />
             </div>
             <h3 className="text-xl font-bold mb-3 text-slate-900 ">{isHindi ? 'सामान्य सहायता' : 'General Support'}</h3>
             <p className="text-slate-500  mb-6">
                {isHindi
                  ? 'अपने संगठन को स्थापित करने, डेटा आयात करने या तकनीकी समस्याओं के लिए सहायता।'
                  : 'For help with setting up your organisation, importing data, or technical issues.'}
             </p>
             <a href="mailto:support@sangathan.space" className="text-indigo-600  font-bold hover:underline">support@sangathan.space</a>
          </div>

          <div className="p-8 bg-slate-50  border border-slate-200  rounded-3xl hover:border-red-500/50 transition-colors group">
             <div className="w-12 h-12 rounded-2xl bg-white  border border-slate-200  flex items-center justify-center mb-6">
               <ShieldAlert className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
             </div>
             <h3 className="text-xl font-bold mb-3 text-slate-900 ">{isHindi ? 'विश्वास और सुरक्षा' : 'Trust & Safety'}</h3>
             <p className="text-slate-500  mb-6">
                {isHindi
                  ? 'दुरुपयोग, अभद्र भाषा, स्पैम, या हमारी स्वीकार्य उपयोग नीति के उल्लंघन की रिपोर्ट करने के लिए।'
                  : 'To report abuse, hate speech, spam, or violations of our Acceptable Use Policy.'}
             </p>
             <a href="mailto:abuse@sangathan.space" className="text-red-500  font-bold hover:underline">abuse@sangathan.space</a>
          </div>

          <div className="p-8 bg-slate-50  border border-slate-200  rounded-3xl hover:border-emerald-500/50 transition-colors group">
             <div className="w-12 h-12 rounded-2xl bg-white  border border-slate-200  flex items-center justify-center mb-6">
               <CreditCard className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
             </div>
             <h3 className="text-xl font-bold mb-3 text-slate-900 ">{isHindi ? 'बिलिंग और रिफंड' : 'Billing & Refunds'}</h3>
             <p className="text-slate-500  mb-6">
                {isHindi
                  ? 'समर्थक सदस्यता, चालान, या धनवापसी अनुरोधों के बारे में प्रश्नों के लिए।'
                  : 'For questions about Supporter Subscriptions, invoices, or refund requests.'}
             </p>
             <a href="mailto:billing@sangathan.space" className="text-emerald-600  font-bold hover:underline">billing@sangathan.space</a>
          </div>

          <div className="p-8 bg-slate-50  border border-slate-200  rounded-3xl hover:border-cyan-500/50 transition-colors group">
             <div className="w-12 h-12 rounded-2xl bg-white  border border-slate-200  flex items-center justify-center mb-6">
               <MessageSquare className="w-6 h-6 text-cyan-500 group-hover:scale-110 transition-transform" />
             </div>
             <h3 className="text-xl font-bold mb-3 text-slate-900 ">{isHindi ? 'मीडिया और प्रेस' : 'Media & Press'}</h3>
             <p className="text-slate-500  mb-6">
                {isHindi
                  ? 'हमारे मंच या मिशन के बारे में पूछताछ करने वाले पत्रकारों और शोधकर्ताओं के लिए।'
                  : 'For journalists and researchers inquiring about our platform or mission.'}
             </p>
             <a href="mailto:press@sangathan.space" className="text-cyan-600  font-bold hover:underline">press@sangathan.space</a>
          </div>
        </div>

        <div className="bg-slate-50  p-8 rounded-3xl border border-slate-200  text-center max-w-2xl mx-auto">
           <h3 className="text-xl font-bold text-slate-900  mb-3">{isHindi ? 'प्रतिक्रिया समय की उम्मीदें' : 'Response Time Expectations'}</h3>
           <p className="text-slate-500 ">
              {isHindi
                ? 'हम 24-48 व्यावसायिक घंटों के भीतर सभी पूछताछ का जवाब देने का लक्ष्य रखते हैं। सुरक्षा और दुरुपयोग रिपोर्टों को प्राथमिकता दी जाती है।'
                : 'We aim to respond to all inquiries within 24-48 business hours. Safety and abuse reports are prioritized and reviewed urgently.'}
           </p>
        </div>
      </div>
    </div>
  )
}
