import { GitCommit } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'परिवर्तन लॉग | संगठन' : 'Changelog | Sangathan',
    description: isHindi
      ? 'हमारे अपडेट और सुधारों का एक पारदर्शी रिकॉर्ड।'
      : 'A transparent record of our updates and improvements.',
  }
}

export default async function ChangelogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        {isHindi ? 'परिवर्तन लॉग' : 'Changelog'}
      </h1>
      <p className="text-xl text-gray-500 mb-12">
        {isHindi 
          ? 'हमारे अपडेट और सुधारों का एक पारदर्शी रिकॉर्ड।'
          : 'A transparent record of our updates and improvements.'}
      </p>

      <div className="space-y-12 border-l-2 border-gray-100 pl-8 ml-4">
        {/* June 2026 */}
        <div className="relative">
           <span className="absolute -left-[41px] top-1 bg-green-100 text-green-600 p-2 rounded-full border-4 border-white">
              <GitCommit size={20} />
           </span>
           <div className="text-sm text-gray-500 mb-1">{isHindi ? 'जून 2026' : 'June 2026'}</div>
           <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'v1.4 - वास्तुकला, स्थिरता और समर्थन मॉडल' : 'v1.4 - Architecture, Stability, & Support Model'}</h2>
           <div className="prose prose-slate text-gray-600">
              <p>
                 {isHindi
                   ? 'इस महीने हमने प्लेटफ़ॉर्म की स्थिरता पर ध्यान केंद्रित किया और एक पारदर्शी स्वैच्छिक योगदान मॉडल पर स्थानांतरित हुए।'
                   : 'This month we focused on massive platform stabilization and shifted to a transparent voluntary contribution model.'}
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                 <li><strong>{isHindi ? 'समर्थन संगठन:' : 'Support Sangathan:'}</strong> {isHindi ? 'रेज़रपे को हटाकर वित्तीय पारदर्शिता और सीधे UPI योगदान वाला मॉडल लागू किया।' : 'Replaced Razorpay dependencies with a 100% voluntary UPI-based contribution model highlighting infrastructure costs.'}</li>
                 <li><strong>{isHindi ? 'त्रुटि ट्रैकिंग:' : 'Error Tracking:'}</strong> {isHindi ? 'एंटरप्राइज़-ग्रेड निगरानी के लिए Sentry का एकीकरण।' : 'Integrated Sentry for enterprise-grade observability and runtime error tracking.'}</li>
                 <li><strong>{isHindi ? 'सख्त टाइपिंग:' : 'Strict Typing:'}</strong> {isHindi ? 'सुपाबेस से सीधे डेटाबेस टाइपिंग लागू करके कई छिपी हुई त्रुटियों को ठीक किया और टर्बोपैक (Turbopack) संकलन में सुधार किया।' : 'Enforced strict Supabase database typing with the Next.js Turbopack compiler, discovering and patching numerous latent bugs.'}</li>
              </ul>
           </div>
        </div>

        {/* May 2026 */}
        <div className="relative">
           <span className="absolute -left-[41px] top-1 bg-blue-100 text-blue-600 p-2 rounded-full border-4 border-white">
              <GitCommit size={20} />
           </span>
           <div className="text-sm text-gray-500 mb-1">{isHindi ? 'मई 2026' : 'May 2026'}</div>
           <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'v1.3 - संगठन-विशिष्ट कार्यप्रवाह' : 'v1.3 - Organization-Specific Workflows'}</h2>
           <div className="prose prose-slate text-gray-600">
              <p>
                 {isHindi
                   ? 'विभिन्न प्रकार के संगठनों के लिए विशेष सुविधाएँ और डैशबोर्ड।'
                   : 'Specialized features and tailored dashboards for every type of organization.'}
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                 <li><strong>{isHindi ? 'विशेष डैशबोर्ड:' : 'Specialized Dashboards:'}</strong> {isHindi ? 'गैर सरकारी संगठनों (NGO), छात्र संघों, श्रमिक संघों और RWA के लिए कस्टम इंटरफ़ेस।' : 'Custom interfaces and capabilities for NGOs, Student Unions, Workers Unions, and RWAs.'}</li>
                 <li><strong>{isHindi ? 'अभियान और स्वयंसेवक:' : 'Campaigns & Volunteers:'}</strong> {isHindi ? 'सार्वजनिक अभियानों और स्वयंसेवकों के प्रबंधन के लिए एंड-टू-एंड सिस्टम।' : 'End-to-end CRUD systems for managing public campaigns and mobilising volunteers.'}</li>
                 <li><strong>{isHindi ? 'शिकायत और रखरखाव:' : 'Grievances & Maintenance:'}</strong> {isHindi ? 'शिकायतों और RWA रखरखाव अनुरोधों के लिए विशेष उपकरण।' : 'Dedicated workflows for Student Union grievances and RWA maintenance tracking.'}</li>
              </ul>
           </div>
        </div>

        {/* April 2026 */}
        <div className="relative">
           <span className="absolute -left-[41px] top-1 bg-purple-100 text-purple-600 p-2 rounded-full border-4 border-white">
              <GitCommit size={20} />
           </span>
           <div className="text-sm text-gray-500 mb-1">{isHindi ? 'अप्रैल 2026' : 'April 2026'}</div>
           <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'v1.2 - डायनामिक फॉर्म बिल्डर' : 'v1.2 - Dynamic Form Builder'}</h2>
           <div className="prose prose-slate text-gray-600">
              <p>
                 {isHindi
                   ? 'डेटा संग्रह को और अधिक लचीला और शक्तिशाली बनाना।'
                   : 'Making data collection flexible and powerful for administrators.'}
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                 <li><strong>{isHindi ? 'फॉर्म बिल्डर:' : 'Form Builder:'}</strong> {isHindi ? 'जटिल फ़ील्ड और सशर्त तर्क (conditional logic) के साथ विज़ुअल फॉर्म निर्माण उपकरण।' : 'Advanced visual form builder supporting complex fields like file uploads and date pickers.'}</li>
                 <li><strong>{isHindi ? 'सार्वजनिक सर्वेक्षण:' : 'Public Surveys:'}</strong> {isHindi ? 'सुरक्षित URL के साथ सार्वजनिक और केवल-सदस्य फॉर्म एक्सेस नियंत्रण।' : 'Granular access controls for public vs. members-only form submissions via secure URLs.'}</li>
              </ul>
           </div>
        </div>

        {/* March 2026 */}
        <div className="relative">
           <span className="absolute -left-[41px] top-1 bg-indigo-100 text-indigo-600 p-2 rounded-full border-4 border-white">
              <GitCommit size={20} />
           </span>
           <div className="text-sm text-gray-500 mb-1">{isHindi ? 'मार्च 2026' : 'March 2026'}</div>
           <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'v1.1 - सुदृढ़ीकरण और प्रदर्शन' : 'v1.1 - Hardening & Performance'}</h2>
           <div className="prose prose-slate text-gray-600">
              <p>
                 {isHindi
                   ? 'लॉन्च के बाद की स्थिरता, बेहतर गति और ऑफ़लाइन क्षमताओं पर काम।'
                   : 'Post-launch stabilization, improved speed, and offline resilience foundation.'}
              </p>
           </div>
        </div>

        {/* February 2026 */}
        <div className="relative">
           <span className="absolute -left-[41px] top-1 bg-orange-100 text-orange-600 p-2 rounded-full border-4 border-white">
              <GitCommit size={20} />
           </span>
           <div className="text-sm text-gray-500 mb-1">{isHindi ? '14 फरवरी 2026' : 'February 14, 2026'}</div>
           <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'v1.0 - सार्वजनिक लॉन्च' : 'v1.0 - Public Launch'}</h2>
           <div className="prose prose-slate text-gray-600">
              <p>
                 {isHindi
                   ? 'हमें संगठन के सार्वजनिक लॉन्च की घोषणा करते हुए गर्व हो रहा है। इस रिलीज में किसी भी सामूहिक को डिजिटल रूप से संचालित करने के लिए आवश्यक मुख्य बुनियादी ढांचा शामिल है।'
                   : 'We are proud to announce the public launch of Sangathan. This release includes the core infrastructure required for any collective to operate digitally.'}
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                 <li><strong>{isHindi ? 'रजिस्ट्री:' : 'Registry:'}</strong> {isHindi ? 'भूमिका-आधारित पहुंच के साथ सुरक्षित सदस्य प्रबंधन।' : 'Secure member management with role-based access.'}</li>
                 <li><strong>{isHindi ? 'फॉर्म:' : 'Forms:'}</strong> {isHindi ? 'स्पैम सुरक्षा के साथ सार्वजनिक इनटेक फॉर्म।' : 'Public intake forms with spam protection.'}</li>
                 <li><strong>{isHindi ? 'बहीखाता:' : 'Ledger:'}</strong> {isHindi ? 'दान लॉगिंग और यूपीआई संदर्भ सत्यापन।' : 'Donation logging and UPI reference verification.'}</li>
                 <li><strong>{isHindi ? 'बैठकें:' : 'Meetings:'}</strong> {isHindi ? 'उपस्थिति ट्रैकिंग और जित्सी एकीकरण।' : 'Attendance tracking and Jitsi integration.'}</li>
                 <li><strong>{isHindi ? 'सुरक्षा:' : 'Security:'}</strong> {isHindi ? 'व्यवस्थापक फोन सत्यापन और अपरिवर्तनीय ऑडिट लॉग।' : 'Admin phone verification and immutable audit logs.'}</li>
              </ul>
           </div>
        </div>

        {/* Beta Phase */}
        <div className="relative">
           <span className="absolute -left-[41px] top-1 bg-gray-100 text-gray-500 p-2 rounded-full border-4 border-white">
              <GitCommit size={20} />
           </span>
           <div className="text-sm text-gray-500 mb-1">{isHindi ? 'जनवरी 2026' : 'January 2026'}</div>
           <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'बीटा चरण' : 'Beta Phase'}</h2>
           <div className="prose prose-slate text-gray-600">
              <p>
                 {isHindi
                   ? '50 संस्थापक संगठनों के साथ निजी बीटा परीक्षण। लोड परीक्षण, सुरक्षा ऑडिटिंग और अनुपालन ढांचे के कार्यान्वयन पर केंद्रित।'
                   : 'Private beta testing with 50 founding organisations. Focused on load testing, security auditing, and compliance framework implementation.'}
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
