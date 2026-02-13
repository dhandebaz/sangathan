import { Shield, Lock, Server, EyeOff, Key, AlertTriangle } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'सुरक्षा और बुनियादी ढांचा | संगठन' : 'Security & Infrastructure | Sangathan',
    description: isHindi
      ? 'हम प्रतिकूल डिजिटल वातावरण में आपके डेटा की सुरक्षा कैसे करते हैं।'
      : 'How we protect your data in a hostile digital environment.',
  }
}

export default async function SecurityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        {isHindi ? 'सुरक्षा और बुनियादी ढांचा' : 'Security & Infrastructure'}
      </h1>
      <p className="text-xl text-gray-500 mb-12 leading-relaxed">
        {isHindi 
          ? 'हम प्रतिकूल डिजिटल वातावरण में आपके डेटा की सुरक्षा कैसे करते हैं।'
          : 'How we protect your data in a hostile digital environment.'}
      </p>

      <div className="prose prose-slate max-w-none text-gray-700 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'अलगाव की वास्तुकला' : 'Architecture of Isolation'}</h2>
          <p>
            {isHindi
              ? 'संगठन एक मल्टी-टेनेंट प्लेटफ़ॉर्म है, जिसका अर्थ है कि कई संगठन एक ही अंतर्निहित डेटाबेस साझा करते हैं। हालाँकि, हम डेटा को अलग रखने के लिए सरल सॉफ़्टवेयर तर्क पर भरोसा नहीं करते हैं।'
              : 'Sangathan is a multi-tenant platform, meaning many organisations share the same underlying database. However, we do not rely on simple software logic to keep data separate.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose my-6">
             <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <Lock className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-bold text-lg mb-2">{isHindi ? 'पंक्ति-स्तर की सुरक्षा (RLS)' : 'Row-Level Security (RLS)'}</h3>
                <p className="text-sm text-gray-600">
                   {isHindi
                     ? 'हम पोस्टग्रेएसक्यूएल रो-लेवल सिक्योरिटी का उपयोग करते हैं। इसका मतलब है कि डेटाबेस इंजन स्वयं प्रत्येक क्वेरी की जांच करता है ताकि यह सुनिश्चित हो सके कि आप केवल अपने संगठन आईडी से संबंधित डेटा तक ही पहुंचते हैं। भले ही हमारे एप्लिकेशन कोड में बग हो, डेटाबेस अनधिकृत पहुंच को अस्वीकार कर देगा।'
                     : 'We use PostgreSQL Row-Level Security. This means the database engine itself checks every single query to ensure you only access data belonging to your organisation ID. Even if our application code had a bug, the database would reject unauthorized access.'}
                </p>
             </div>
             <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <Key className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-bold text-lg mb-2">{isHindi ? 'भूमिका-आधारित पहुंच' : 'Role-Based Access'}</h3>
                <p className="text-sm text-gray-600">
                   {isHindi
                     ? 'आपके संगठन के भीतर, अनुमतियां सख्ती से लागू की जाती हैं। "दर्शक" संपादित नहीं कर सकते। "संपादक" संगठन को हटा नहीं सकते। ये नियम कोर एपीआई में बेक किए गए हैं।'
                     : 'Within your organisation, permissions are enforced strictly. "Viewers" cannot edit. "Editors" cannot delete the organisation. These rules are baked into the core API.'}
                </p>
             </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'डेटा सुरक्षा' : 'Data Protection'}</h2>
          <ul className="space-y-4">
             <li className="flex gap-3">
                <Server className="w-6 h-6 text-gray-400 shrink-0" />
                <div>
                   <strong>{isHindi ? 'आराम और पारगमन पर एन्क्रिप्शन:' : 'Encryption at Rest & Transit:'}</strong> {isHindi ? 'सभी डेटा हमारी डिस्क पर संग्रहीत होने और आपके डिवाइस और हमारे सर्वर (TLS 1.3) के बीच यात्रा करते समय एन्क्रिप्ट किया जाता है।' : 'All data is encrypted while stored on our disks and while traveling between your device and our servers (TLS 1.3).'}
                </div>
             </li>
             <li className="flex gap-3">
                <EyeOff className="w-6 h-6 text-gray-400 shrink-0" />
                <strong>{isHindi ? 'सॉफ्ट डिलीशन:' : 'Soft Deletion:'}</strong> {isHindi ? 'जब आप डेटा हटाते हैं, तो यह आकस्मिक डेटा हानि या दुर्भावनापूर्ण पोंछने को रोकने के लिए सुरक्षा अवधि (जैसे, 7 दिन) के लिए "सॉफ्ट-डिलीट" स्थिति में प्रवेश करता है।' : 'When you delete data, it enters a "soft-delete" state for a safety period (e.g., 7 days) to prevent accidental data loss or malicious wiping.'}
             </li>
             <li className="flex gap-3">
                <AlertTriangle className="w-6 h-6 text-gray-400 shrink-0" />
                <strong>{isHindi ? 'दुरुपयोग संरक्षण:' : 'Abuse Protection:'}</strong> {isHindi ? 'हम आपके खाते के खिलाफ ब्रूट-फोर्स हमलों और "क्रेडेंशियल स्टफिंग" प्रयासों को रोकने के लिए बुद्धिमान दर सीमित करने का उपयोग करते हैं।' : 'We use intelligent rate limiting to block brute-force attacks and "credential stuffing" attempts against your account.'}
             </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'सत्यापित प्रशासन' : 'Verified Administration'}</h2>
          <p>
            {isHindi
              ? 'हम सभी संगठन प्रशासकों के लिए फोन सत्यापन की आवश्यकता रखते हैं। यह जवाबदेही की एक परत जोड़ता है और बुरे अभिनेताओं के लिए स्पैम या उत्पीड़न के लिए डिस्पोजेबल खाते बनाना काफी कठिन बना देता है।'
              : 'We require phone verification for all Organisation Admins. This adds a layer of accountability and makes it significantly harder for bad actors to create disposable accounts for spam or harassment.'}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'तृतीय-पक्ष बुनियादी ढांचा' : 'Third-Party Infrastructure'}</h2>
          <p>
            {isHindi
              ? 'हम अपने स्वयं के सर्वर बनाने के बजाय विश्व स्तरीय प्रदाताओं पर भरोसा करते हैं। यह सुनिश्चित करता है कि आप उनकी विशाल सुरक्षा टीमों से लाभान्वित हों।'
              : 'We rely on world-class providers rather than building our own servers. This ensures you benefit from their massive security teams.'}
          </p>
          <ul className="list-disc pl-5 space-y-2">
             <li><strong>Supabase:</strong> Database & Authentication</li>
             <li><strong>Firebase:</strong> SMS Verification</li>
             <li><strong>Vercel:</strong> Global Edge Network</li>
             <li><strong>Razorpay:</strong> PCI-DSS Compliant Payments</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
