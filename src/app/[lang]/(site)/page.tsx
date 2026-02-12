import Link from 'next/link'
import { ArrowRight, Check, ShieldCheck, Heart, Users, FileText, Video, Banknote } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function LandingPage({ params }: PageProps) {
  const { lang } = await params
  
  // Hindi Content Dictionary
  const isHindi = lang === 'hi'
  const t = {
    hero: {
      title: isHindi ? 'मकसद के साथ संगठित हों।' : 'Organise with purpose.',
      subtitle: isHindi ? 'जमीनी संगठनों के लिए ऑपरेटिंग सिस्टम। सदस्यों, बैठकों, फॉर्म और दान को बिना किसी अराजकता के प्रबंधित करें।' : 'The operating system for grassroots organisations. Manage members, meetings, forms, and donations without the chaos.',
      ctaPrimary: isHindi ? 'संगठन बनाएं' : 'Create Organisation',
      ctaSecondary: isHindi ? 'दस्तावेज़ पढ़ें' : 'Read Documentation'
    },
    problem: {
      title: isHindi ? 'सामुदायिक कार्य की अराजकता' : 'The Chaos of Community Work',
      subtitle: isHindi ? 'अपने आंदोलन को बिखरे हुए टूल पर चलाना बंद करें।' : 'Stop running your movement on scattered tools.',
      cards: [
        {
          title: isHindi ? 'व्हाट्सएप की अराजकता' : 'WhatsApp Chaos',
          desc: isHindi ? 'सदस्यों की सूची समूहों में खो जाती है। कोई गोपनीयता नहीं। कोई सत्यापित पहचान नहीं। डेटा लीक।' : 'Member lists lost in groups. No privacy. No verified identity. Data leaks.'
        },
        {
          title: isHindi ? 'असत्यापित दान' : 'Unverified Donations',
          desc: isHindi ? 'बिना रिकॉर्ड के नकद लेन-देन। मैन्युअल रसीदें। पारदर्शिता की कमी।' : 'Cash handling without records. Manual receipts. Lack of transparency.'
        },
        {
          title: isHindi ? 'बिखरे हुए रिकॉर्ड' : 'Scattered Records',
          desc: isHindi ? 'कागज पर बैठक के मिनट। गूगल पर फॉर्म। कोई केंद्रीय मेमोरी नहीं।' : 'Meeting minutes on paper. Forms on Google. No central memory.'
        }
      ]
    },
    modules: {
      title: isHindi ? 'बुनियादी ढांचा' : 'Core Infrastructure',
      subtitle: isHindi ? 'एक गंभीर संगठन चलाने के लिए आपको जो कुछ भी चाहिए, वह एक सुरक्षित मंच में एकीकृत है।' : 'Everything you need to run a serious organisation, integrated into one secure platform.',
      items: [
        { title: isHindi ? 'सदस्य' : 'Members', desc: isHindi ? 'भूमिका-आधारित पहुंच के साथ सुरक्षित रजिस्ट्री। गोपनीयता-प्रथम डेटा भंडारण।' : 'Secure registry with role-based access. Privacy-first data storage.' },
        { title: isHindi ? 'फॉर्म' : 'Forms', desc: isHindi ? 'स्पैम सुरक्षा के साथ कस्टम इंटेक फॉर्म। स्वचालित डेटा लिंकिंग।' : 'Custom intake forms with spam protection. Automatic data linking.' },
        { title: isHindi ? 'बैठकें' : 'Meetings', desc: isHindi ? 'सभाओं को शेड्यूल करें, उपस्थिति ट्रैक करें, और जित्सी लिंक बनाएं।' : 'Schedule gatherings, track attendance, and generate Jitsi links.' },
        { title: isHindi ? 'दान' : 'Donations', desc: isHindi ? 'मैन्युअल भुगतान के लिए बहीखाता। यूपीआई रेफरी सत्यापित करें। रिपोर्ट बनाएं।' : 'Ledger for manual payments. Verify UPI refs. Generate reports.' }
      ]
    },
    trust: {
      title: isHindi ? 'विश्वास के लिए बनाया गया।' : 'Built for Trust.',
      items: [
        { title: isHindi ? 'मल्टी-टेनेंट अलगाव' : 'Multi-tenant Isolation', desc: isHindi ? 'आपका डेटा आपका है। अन्य संगठनों से सख्ती से अलग।' : 'Your data is yours. Strictly separated from other organisations.' },
        { title: isHindi ? 'कोई डेटा बिक्री नहीं' : 'No Data Selling', desc: isHindi ? 'हम आपको ट्रैक नहीं करते। हम विज्ञापन नहीं बेचते। हम आंदोलन की सेवा के लिए मौजूद हैं।' : "We don't track you. We don't sell ads. We exist to serve the movement." },
        { title: isHindi ? 'भूमिका-आधारित पहुंच' : 'Role-Based Access', desc: isHindi ? 'कौन क्या देखता है, इस पर दानेदार नियंत्रण। अपने सदस्यों की रक्षा करें।' : 'Granular control over who sees what. Protect your members.' }
      ],
      whyFree: {
        title: isHindi ? 'मुफ़्त क्यों?' : 'Why Free?',
        desc: isHindi ? 'संगठन बहुजन क्वीर फाउंडेशन की एक पहल है। हम मानते हैं कि प्रौद्योगिकी एक अधिकार है, विलासिता नहीं।' : 'Sangathan is an initiative by the Bahujan Queer Foundation. We believe technology is a right, not a luxury.',
        supporterTitle: isHindi ? 'समर्थक योजना (वैकल्पिक)' : 'Supporter Plan (Optional)',
        supporterDesc: isHindi ? 'ब्रांडिंग हटाने और हमारा समर्थन करने के लिए ₹99/माह।' : '₹99/month to remove branding & support us.'
      }
    },
    cta: {
      title: isHindi ? 'संगठित होने के लिए तैयार?' : 'Ready to organise?',
      subtitle: isHindi ? 'संगठन के साथ शक्ति बनाने वाले सैकड़ों समुदायों में शामिल हों।' : 'Join hundreds of communities building power with Sangathan.',
      button: isHindi ? 'अभी शुरू करें' : 'Get Started Now'
    }
  }
  
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="animate-fade-up">
           <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-gray-900">
             {isHindi ? <span><span className="text-orange-600">मकसद</span> के साथ संगठित हों।</span> : <span>Organise with <span className="text-orange-600">purpose</span>.</span>}
           </h1>
           <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
             {t.hero.subtitle}
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link 
               href="/signup" 
               className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
             >
               {t.hero.ctaPrimary} <ArrowRight size={20} />
             </Link>
             <Link 
               href={`/${lang}/docs`} 
               className="bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors"
             >
               {t.hero.ctaSecondary}
             </Link>
           </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold mb-4">{t.problem.title}</h2>
               <p className="text-gray-500">{t.problem.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {t.problem.cards.map((card, i) => (
                 <div key={i} className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-orange-600 mb-4 font-bold text-lg">{card.title}</div>
                    <p className="text-gray-600">{card.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Core Modules */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">{t.modules.title}</h2>
            <p className="text-gray-500 max-w-xl">{t.modules.subtitle}</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.modules.items.map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all">
                 {i === 0 && <Users className="text-orange-600 mb-4" size={32} />}
                 {i === 1 && <FileText className="text-orange-600 mb-4" size={32} />}
                 {i === 2 && <Video className="text-orange-600 mb-4" size={32} />}
                 {i === 3 && <Banknote className="text-orange-600 mb-4" size={32} />}
                 <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                 <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Security & Trust */}
      <section className="py-24 bg-black text-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-3xl font-bold mb-6">{t.trust.title}</h2>
                  <ul className="space-y-6">
                     {t.trust.items.map((item, i) => (
                       <li key={i} className="flex gap-4">
                          {i === 0 && <ShieldCheck className="text-orange-500 shrink-0" size={24} />}
                          {i > 0 && <Check className="text-orange-500 shrink-0" size={24} />}
                          <div>
                             <div className="font-bold text-lg">{item.title}</div>
                             <p className="text-gray-400">{item.desc}</p>
                          </div>
                       </li>
                     ))}
                  </ul>
               </div>
               <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                  <h3 className="font-bold text-xl mb-4 text-orange-500">{t.trust.whyFree.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                     {isHindi ? (
                       <>संगठन <strong>बहुजन क्वीर फाउंडेशन</strong> की एक पहल है। हम मानते हैं कि प्रौद्योगिकी एक अधिकार है, विलासिता नहीं।</>
                     ) : (
                       <>Sangathan is an initiative by the <strong>Bahujan Queer Foundation</strong>. We believe technology is a right, not a luxury.</>
                     )}
                  </p>
                  <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl">
                     <Heart className="text-orange-500" fill="currentColor" />
                     <div className="text-sm">
                        <div className="font-bold">{t.trust.whyFree.supporterTitle}</div>
                        <div className="text-gray-400">{t.trust.whyFree.supporterDesc}</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center px-4">
         <h2 className="text-4xl font-bold mb-6">{t.cta.title}</h2>
         <p className="text-gray-500 mb-10 max-w-xl mx-auto">{t.cta.subtitle}</p>
         <Link 
            href="/signup" 
            className="bg-orange-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
         >
            {t.cta.button}
         </Link>
      </section>
    </div>
  )
}
