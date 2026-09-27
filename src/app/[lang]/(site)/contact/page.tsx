import { Mail, ShieldAlert, CreditCard, MessageSquare } from 'lucide-react'
import { Metadata } from 'next'
import { PageHeader } from '@/components/public/page-header'
import { ContactForm } from '@/components/public/contact-form'
import { OrganizationJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'संपर्क करें | संगठन' : 'Contact Us | Sangathan',
    description: isHindi
      ? 'समर्थन, दुरुपयोग रिपोर्टिंग और पूछताछ के लिए हमसे संपर्क करें।'
      : 'Get in touch with us for support, abuse reporting, and inquiries.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/contact`,
      languages: {
        'en': 'https://sangathan.space/en/contact',
        'hi': 'https://sangathan.space/hi/contact',
      },
    },
  }
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="bg-white  min-h-screen">
      <OrganizationJsonLd />
      <BreadcrumbJsonLd items={[
        { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
        { name: isHindi ? 'संपर्क' : 'Contact', url: `https://sangathan.space/${lang}/contact` },
      ]} />
      <PageHeader 
        title={isHindi ? 'संपर्क करें' : 'Contact Us'}
        description={isHindi 
          ? 'हम एक छोटी, समर्पित टीम हैं। कृपया तेजी से प्रतिक्रिया सुनिश्चित करने के लिए उचित चैनल का उपयोग करें।'
          : 'We are a small, dedicated team. Please use the appropriate channel to ensure a faster response.'}
      />

      <div className="max-w-5xl mx-auto py-16 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
          
          {/* Contact Form Section */}
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h2 className="text-2xl font-bold mb-2 text-slate-900">
              {isHindi ? 'हमें एक संदेश भेजें' : 'Send us a message'}
            </h2>
            <p className="text-slate-500 mb-8">
              {isHindi 
                ? 'आपकी पूछताछ स्वतः ही सही टीम को भेज दी जाएगी।' 
                : 'Your inquiry will be automatically routed to the right team.'}
            </p>
            <ContactForm isHindi={isHindi} />
          </div>

          {/* Department Information Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50  border border-slate-200  rounded-xl hover:border-indigo-500/50 transition-colors group">
               <div className="w-10 h-10 rounded-2xl bg-white  border border-slate-200  flex items-center justify-center mb-4">
                 <Mail className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-slate-900 ">{isHindi ? 'सामान्य सहायता' : 'General Support'}</h3>
               <p className="text-sm text-slate-500  mb-4">
                  {isHindi
                    ? 'अपने संगठन को स्थापित करने, डेटा आयात करने या तकनीकी समस्याओं के लिए सहायता।'
                    : 'For help with setting up your organisation, importing data, or technical issues.'}
               </p>
               <span className="text-sm text-indigo-600 font-medium">support@sangathan.space</span>
            </div>

            <div className="p-6 bg-slate-50  border border-slate-200  rounded-xl hover:border-red-500/50 transition-colors group">
               <div className="w-10 h-10 rounded-2xl bg-white  border border-slate-200  flex items-center justify-center mb-4">
                 <ShieldAlert className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-slate-900 ">{isHindi ? 'विश्वास और सुरक्षा' : 'Trust & Safety'}</h3>
               <p className="text-sm text-slate-500  mb-4">
                  {isHindi
                    ? 'दुरुपयोग, अभद्र भाषा, स्पैम, या नीति उल्लंघन की रिपोर्ट करने के लिए।'
                    : 'To report abuse, hate speech, spam, or violations of our Acceptable Use Policy.'}
               </p>
               <span className="text-sm text-red-500 font-medium">abuse@sangathan.space</span>
            </div>

            <div className="p-6 bg-slate-50  border border-slate-200  rounded-xl hover:border-emerald-500/50 transition-colors group">
               <div className="w-10 h-10 rounded-2xl bg-white  border border-slate-200  flex items-center justify-center mb-4">
                 <CreditCard className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-slate-900 ">{isHindi ? 'बिलिंग और रिफंड' : 'Billing & Refunds'}</h3>
               <p className="text-sm text-slate-500  mb-4">
                  {isHindi
                    ? 'समर्थक सदस्यता, चालान, या धनवापसी अनुरोधों के बारे में प्रश्नों के लिए।'
                    : 'For questions about Supporter Subscriptions, invoices, or refund requests.'}
               </p>
               <span className="text-sm text-emerald-600 font-medium">billing@sangathan.space</span>
            </div>

            <div className="p-6 bg-slate-50  border border-slate-200  rounded-xl hover:border-cyan-500/50 transition-colors group">
               <div className="w-10 h-10 rounded-2xl bg-white  border border-slate-200  flex items-center justify-center mb-4">
                 <MessageSquare className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-transform" />
               </div>
               <h3 className="text-lg font-bold mb-2 text-slate-900 ">{isHindi ? 'मीडिया और प्रेस' : 'Media & Press'}</h3>
               <p className="text-sm text-slate-500  mb-4">
                  {isHindi
                    ? 'हमारे मंच या मिशन के बारे में पूछताछ करने वाले पत्रकारों के लिए।'
                    : 'For journalists and researchers inquiring about our platform or mission.'}
               </p>
               <span className="text-sm text-cyan-600 font-medium">press@sangathan.space</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50  p-8 rounded-xl border border-slate-200  text-center max-w-2xl mx-auto">
           <h3 className="text-xl font-bold text-slate-900  mb-3">{isHindi ? 'प्रतिक्रिया समय की उम्मीदें' : 'Response Time Expectations'}</h3>
           <p className="text-slate-500 ">
              {isHindi
                ? 'हम 24-48 व्यावसायिक घंटों के भीतर सभी पूछताछ का जवाब देने का लक्ष्य रखते हैं। सुरक्षा और दुरुपयोग रिपोर्टों को प्राथमिकता दी जाती है।'
                : 'We aim to respond to all inquiries within 24-48 business hours. Safety and abuse reports are prioritized and reviewed urgently.'}
           </p>
        </div>

        <div className="mt-8 bg-slate-50 p-8 rounded-xl border border-slate-200 text-center max-w-2xl mx-auto">
           <h3 className="text-xl font-bold text-slate-900 mb-3">{isHindi ? 'पंजीकृत जानकारी' : 'Registered Information'}</h3>
           <div className="text-slate-500 space-y-2">
              <p><strong>{isHindi ? 'प्रोपराइटर' : 'Proprietor'}:</strong> Sheikh Arsalan Ullah Chishti</p>
              <p><strong>{isHindi ? 'पंजीकृत पता' : 'Registered Address'}:</strong> Sangathan, Street 8, Ghaffar Manzil, Jamia Nagar, 110025, Delhi, Okhla</p>
              <p><strong>{isHindi ? 'संपर्क नंबर (समर्थन)' : 'Contact Number (Support)'}:</strong> +918527976791</p>
           </div>
        </div>
      </div>
    </div>
  )
}
