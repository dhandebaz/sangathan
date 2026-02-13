import Link from 'next/link'
import { ArrowRight, Check, ShieldCheck, Heart, Users, FileText, Video, Banknote, HelpCircle, ChevronDown } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'नागरिक समूहों के लिए ऑपरेटिंग सिस्टम | संगठन' : 'The Operating System for Civic Collectives | Sangathan',
    description: isHindi
      ? 'एनजीओ, छात्र संघों और सामुदायिक समूहों के लिए सदस्यों, निधियों और शासन का प्रबंधन करने के लिए डिजिटल बुनियादी ढांचा।'
      : 'Digital infrastructure for NGOs, student unions, and community groups to manage members, funds, and governance.',
  }
}

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'
  
  return (
    <div className="overflow-hidden bg-white text-gray-900">
      {/* Hero Section - Institutional & Calm */}
      <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="animate-fade-up">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mb-8 border border-gray-200">
             <span className="w-2 h-2 rounded-full bg-green-500"></span>
             {isHindi ? 'भारत में संचालित' : 'Operational in India'}
           </div>
           <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
             {isHindi ? 'नागरिक समूहों के लिए' : 'The operating system for'} <br className="hidden md:block"/>
             <span className="text-orange-600">{isHindi ? 'ऑपरेटिंग सिस्टम' : 'civic collectives'}</span>.
           </h1>
           <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
             {isHindi
               ? 'संगठन एनजीओ, छात्र संघों और सामुदायिक समूहों को संस्थागत अखंडता के साथ सदस्यों, निधियों और शासन का प्रबंधन करने के लिए डिजिटल बुनियादी ढांचा प्रदान करता है।'
               : 'Sangathan provides the digital infrastructure for NGOs, student unions, and community groups to manage members, funds, and governance with institutional integrity.'}
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link 
               href="/signup" 
               className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-black transition-all flex items-center justify-center gap-2"
             >
               {isHindi ? 'संगठन बनाएं' : 'Create Organisation'} <ArrowRight size={18} />
             </Link>
             <Link 
               href={`/${lang}/docs`} 
               className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg border border-gray-200 hover:bg-gray-50 transition-colors"
             >
               {isHindi ? 'दस्तावेज़' : 'Documentation'}
             </Link>
           </div>
           <div className="mt-12 text-sm text-gray-500">
             {isHindi
               ? 'कोर उपयोग के लिए हमेशा मुफ़्त • क्रेडिट कार्ड की आवश्यकता नहीं • खुले मानक'
               : 'Free forever for core use • No credit card required • Open standards'}
           </div>
        </div>
      </section>

      {/* Problem Statement - Operational Chaos */}
      <section className="py-24 bg-gray-50 border-y border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold mb-4 text-gray-900">{isHindi ? 'अनौपचारिक बुनियादी ढांचे की लागत।' : 'The cost of informal infrastructure.'}</h2>
               <p className="text-gray-500 max-w-2xl mx-auto">
                 {isHindi
                   ? 'अधिकांश समूह नाजुक स्प्रेडशीट और अराजक चैट समूहों पर चलते हैं। यह पैमाने को सीमित करता है, विश्वास को कम करता है, और डेटा गोपनीयता को खतरे में डालता है।'
                   : 'Most collectives run on fragile spreadsheets and chaotic chat groups. This limits scale, erodes trust, and endangers data privacy.'}
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="text-red-600 mb-4 font-bold text-lg">{isHindi ? 'डेटा विखंडन' : 'Data Fragmentation'}</div>
                  <p className="text-gray-600 leading-relaxed">
                    {isHindi
                      ? 'सदस्य सूची व्हाट्सएप समूहों और व्यक्तिगत ड्राइव पर बिखरी हुई है। सत्य का कोई एकल स्रोत नहीं। नेताओं के बदलने पर कोई संस्थागत स्मृति नहीं।'
                      : 'Member lists scattered across WhatsApp groups and personal drives. No single source of truth. No institutional memory when leaders change.'}
                  </p>
               </div>
               <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="text-red-600 mb-4 font-bold text-lg">{isHindi ? 'विश्वास की कमी' : 'Trust Deficit'}</div>
                  <p className="text-gray-600 leading-relaxed">
                    {isHindi
                      ? 'नकद दान बिना डिजिटल लॉग के संभाला जाता है। मैन्युअल रसीदें जो खो सकती हैं। सदस्यों को वित्तीय अखंडता साबित करने में कठिनाई।'
                      : 'Cash donations handled without digital logs. Manual receipts that can be lost. Difficulty in proving financial integrity to members.'}
                  </p>
               </div>
               <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="text-red-600 mb-4 font-bold text-lg">{isHindi ? 'परिचालन बाधा' : 'Operational Drag'}</div>
                  <p className="text-gray-600 leading-relaxed">
                    {isHindi
                      ? 'सदस्यों को सत्यापित करने, फॉर्म बनाने और भुगतान का पीछा करने में घंटों खर्च किए गए। मिशन के बजाय रसद पर ऊर्जा बर्बाद हुई।'
                      : 'Hours spent manually verifying members, creating forms, and chasing payments. Energy wasted on logistics instead of the mission.'}
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Core Modules - Infrastructure First */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">{isHindi ? 'संस्थागत-ग्रेड बुनियादी ढांचा।' : 'Institutional-grade infrastructure.'}</h2>
            <p className="text-gray-500 max-w-xl">
               {isHindi
                 ? 'शासन के लिए डिज़ाइन किए गए एकीकृत उपकरण, न कि केवल संचार।'
                 : 'Integrated tools designed for governance, not just communication.'}
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-gray-200 hover:border-orange-500 transition-colors group">
               <Users className="text-gray-400 group-hover:text-orange-600 mb-4" size={32} />
               <h3 className="text-xl font-bold mb-2">{isHindi ? 'रजिस्ट्री' : 'Registry'}</h3>
               <p className="text-gray-500 text-sm">{isHindi ? 'गोपनीयता नियंत्रण और ऑडिट ट्रेल्स के साथ सुरक्षित, भूमिका-आधारित सदस्य डेटाबेस।' : 'Secure, role-based member database with privacy controls and audit trails.'}</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 hover:border-orange-500 transition-colors group">
               <FileText className="text-gray-400 group-hover:text-orange-600 mb-4" size={32} />
               <h3 className="text-xl font-bold mb-2">{isHindi ? 'फॉर्म' : 'Forms'}</h3>
               <p className="text-gray-500 text-sm">{isHindi ? 'इनटेक फॉर्म, याचिकाएं और सर्वेक्षण सीधे आपके डेटाबेस से जुड़े हैं।' : 'Intake forms, petitions, and surveys linked directly to your database.'}</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 hover:border-orange-500 transition-colors group">
               <Video className="text-gray-400 group-hover:text-orange-600 mb-4" size={32} />
               <h3 className="text-xl font-bold mb-2">{isHindi ? 'बैठकें' : 'Meetings'}</h3>
               <p className="text-gray-500 text-sm">{isHindi ? 'सभाओं को शेड्यूल करें, उपस्थिति ट्रैक करें, और आधिकारिक तौर पर मिनट रिकॉर्ड करें।' : 'Schedule gatherings, track attendance, and record minutes officially.'}</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 hover:border-orange-500 transition-colors group">
               <Banknote className="text-gray-400 group-hover:text-orange-600 mb-4" size={32} />
               <h3 className="text-xl font-bold mb-2">{isHindi ? 'बहीखाता' : 'Ledger'}</h3>
               <p className="text-gray-500 text-sm">{isHindi ? 'दान लॉग करें, यूपीआई संदर्भों को सत्यापित करें, और पारदर्शिता रिपोर्ट तैयार करें।' : 'Log donations, verify UPI references, and generate transparency reports.'}</p>
            </div>
         </div>
      </section>

      {/* Security & Trust */}
      <section className="py-24 bg-gray-900 text-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
               <div>
                  <h2 className="text-3xl font-bold mb-6">{isHindi ? 'सुरक्षा हमारा जनादेश है।' : 'Security is our mandate.'}</h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                     {isHindi
                       ? 'हम समझते हैं कि नागरिक डेटा संवेदनशील है। हमारा बुनियादी ढांचा आपके संगठन की संप्रभुता और आपके सदस्यों की गोपनीयता की रक्षा के लिए बनाया गया है।'
                       : 'We understand that civic data is sensitive. Our architecture is built to protect your organisation\'s sovereignty and your members\' privacy.'}
                  </p>
                  <ul className="space-y-6">
                     <li className="flex gap-4">
                        <ShieldCheck className="text-orange-500 shrink-0" size={24} />
                        <div>
                           <div className="font-bold text-lg">{isHindi ? 'पंक्ति-स्तर अलगाव' : 'Row-Level Isolation'}</div>
                           <p className="text-gray-400 text-sm">{isHindi ? 'डेटाबेस स्तर पर डेटा को क्रिप्टोग्राफ़िक रूप से अलग किया जाता है। संगठनों के बीच कोई डेटा लीक नहीं।' : 'Data is cryptographically isolated at the database level. No data leaks between organisations.'}</p>
                        </div>
                     </li>
                     <li className="flex gap-4">
                        <Check className="text-orange-500 shrink-0" size={24} />
                        <div>
                           <div className="font-bold text-lg">{isHindi ? 'सत्यापित प्रशासन' : 'Verified Administration'}</div>
                           <p className="text-gray-400 text-sm">{isHindi ? 'दुरुपयोग को रोकने के लिए सभी संगठन प्रशासकों का अनिवार्य फोन सत्यापन होता है।' : 'All organisation admins undergo mandatory phone verification to prevent abuse.'}</p>
                        </div>
                     </li>
                     <li className="flex gap-4">
                        <Check className="text-orange-500 shrink-0" size={24} />
                        <div>
                           <div className="font-bold text-lg">{isHindi ? 'कोई डेटा मुद्रीकरण नहीं' : 'No Data Monetization'}</div>
                           <p className="text-gray-400 text-sm">{isHindi ? 'हम डेटा नहीं बेचते हैं। हम विज्ञापन नहीं चलाते हैं। आपका डेटा आपका है।' : 'We do not sell data. We do not run ads. Your data belongs to you.'}</p>
                        </div>
                     </li>
                  </ul>
                  <div className="mt-8">
                     <Link href={`/${lang}/security`} className="text-orange-400 hover:text-orange-300 font-medium flex items-center gap-2">
                        {isHindi ? 'सुरक्षा वास्तुकला पढ़ें' : 'Read Security Architecture'} <ArrowRight size={16} />
                     </Link>
                  </div>
               </div>
               
               <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                  <h3 className="font-bold text-xl mb-4 text-white">{isHindi ? 'यह मुफ़्त क्यों है?' : 'Why is it free?'}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                     {isHindi ? 'संगठन' : 'Sangathan is an initiative by the'} <strong>Bahujan Queer Foundation</strong>{isHindi ? ' की एक पहल है। हमारा मानना ​​है कि मजबूत डिजिटल बुनियादी ढांचा एक लोकतांत्रिक अधिकार है, लक्जरी उत्पाद नहीं।' : '. We believe robust digital infrastructure is a democratic right, not a luxury product.'}
                  </p>
                  
                  <div className="border-t border-gray-700 pt-6 mt-6">
                     <div className="flex items-center gap-3 mb-2">
                        <Heart className="text-orange-500" fill="currentColor" size={20} />
                        <span className="font-bold text-white">{isHindi ? 'समर्थक मॉडल' : 'Supporter Model'}</span>
                     </div>
                     <p className="text-gray-400 text-sm mb-4">
                        {isHindi
                          ? 'हम उन संगठनों से स्वैच्छिक योगदान द्वारा बनाए रखे जाते हैं जो हमारे काम को महत्व देते हैं।'
                          : 'We are sustained by voluntary contributions from organisations that value our work.'}
                     </p>
                     <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                        <div>
                           <div className="font-medium text-white">{isHindi ? 'समर्थक सदस्यता' : 'Supporter Subscription'}</div>
                           <div className="text-xs text-gray-500">{isHindi ? 'वैकल्पिक • ₹99/माह' : 'Optional • ₹99/month'}</div>
                        </div>
                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">{isHindi ? 'ब्रांडिंग हटाता है' : 'Removes Branding'}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
         <h2 className="text-3xl font-bold mb-10 text-center">{isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}</h2>
         <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
               <AccordionTrigger>{isHindi ? 'क्या संगठन वास्तव में मुफ़्त है?' : 'Is Sangathan really free?'}</AccordionTrigger>
               <AccordionContent>
                  {isHindi
                    ? 'हाँ। मुख्य बुनियादी ढांचा- सदस्यों, फॉर्म, बैठकों का प्रबंधन और दान लॉगिंग- सभी संगठनों के लिए मुफ़्त है। हम प्रति उपयोगकर्ता शुल्क नहीं लेते हैं। हम उन संगठनों से वैकल्पिक "समर्थक सदस्यता" के माध्यम से प्लेटफ़ॉर्म को बनाए रखते हैं जो योगदान दे सकते हैं।'
                    : 'Yes. All core features (Membership, Forms, Meetings, Ledger) are free for all organisations. We do not charge per-seat or per-member fees. We rely on optional Supporter Subscriptions to cover server costs.'}
               </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
               <AccordionTrigger>{isHindi ? 'डेटा का मालिक कौन है?' : 'Who owns the data?'}</AccordionTrigger>
               <AccordionContent>
                  {isHindi
                    ? 'आप। आपका संगठन सभी सदस्य डेटा और रिकॉर्ड का पूर्ण स्वामित्व रखता है। आप किसी भी समय मानक प्रारूपों (CSV/JSON) में अपना पूरा डेटाबेस निर्यात कर सकते हैं। हम केवल डेटा प्रोसेसर के रूप में कार्य करते हैं।'
                    : 'You do. Your organisation retains full ownership of all member data and records. You can export your entire database at any time in standard formats (CSV/JSON). We act only as a data processor.'}
               </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
               <AccordionTrigger>{isHindi ? 'क्या मेरा डेटा अन्य संगठनों को दिखाई देता है?' : 'Is my data visible to other organisations?'}</AccordionTrigger>
               <AccordionContent>
                  {isHindi
                    ? 'नहीं। संगठन सख्त मल्टी-टेनेंट अलगाव का उपयोग करता है। आपका डेटा डेटाबेस स्तर पर पंक्ति-स्तर सुरक्षा (RLS) नीतियों का उपयोग करके अन्य संगठनों से भौतिक रूप से अलग किया जाता है।'
                    : 'No. Sangathan uses strict multi-tenant isolation. Your data is physically separated from other organisations using Row-Level Security (RLS) policies at the database level.'}
               </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
               <AccordionTrigger>{isHindi ? 'क्या आप दान संसाधित करते हैं?' : 'Do you process donations?'}</AccordionTrigger>
               <AccordionContent>
                  {isHindi
                    ? 'नहीं। संगठन दान को <strong>लॉग</strong> करने और यूपीआई संदर्भों को सत्यापित करने के लिए एक बहीखाता प्रदान करता है, लेकिन वास्तविक धन हस्तांतरण सीधे दाता और आपके संगठन (यूपीआई, बैंक हस्तांतरण, या नकद के माध्यम से) के बीच होता है। हम धन नहीं रखते हैं।'
                    : 'No. Sangathan provides a ledger to <strong>log</strong> donations and verify UPI references, but the actual money transfer happens directly between the donor and your organisation (via UPI, Bank Transfer, or Cash). We do not hold funds.'}
               </AccordionContent>
            </AccordionItem>
         </Accordion>
         <div className="mt-8 text-center">
            <Link href={`/${lang}/faq`} className="text-orange-600 font-medium hover:underline">{isHindi ? 'सभी प्रश्न देखें' : 'View all FAQs'}</Link>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center px-4 bg-gray-50 border-t border-gray-200">
         <h2 className="text-4xl font-bold mb-6 text-gray-900">{isHindi ? 'एक स्थायी संस्थान बनाएं।' : 'Build a lasting institution.'}</h2>
         <p className="text-gray-500 mb-10 max-w-xl mx-auto">
            {isHindi
              ? 'संगठन के साथ शक्ति बनाने वाले एनजीओ, यूनियनों और समूहों के समुदाय में शामिल हों।'
              : 'Join the community of NGOs, unions, and collectives building power with Sangathan.'}
         </p>
         <Link 
            href="/signup" 
            className="bg-orange-600 text-white px-10 py-5 rounded-lg font-bold text-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200/50"
         >
            {isHindi ? 'अभी शुरू करें' : 'Get Started Now'}
         </Link>
      </section>
    </div>
  )
}
