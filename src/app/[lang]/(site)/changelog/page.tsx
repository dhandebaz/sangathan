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
        {/* Release 1.0 */}
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
