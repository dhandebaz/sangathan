import { FileSearch, Database, HeartHandshake } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'पारदर्शिता | संगठन' : 'Transparency | Sangathan',
    description: isHindi
      ? 'हमारा मानना है कि विश्वास कट्टरपंथी खुलेपन के माध्यम से अर्जित किया जाता है।'
      : 'We believe that trust is earned through radical openness.',
  }
}

export default async function TransparencyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        {isHindi ? 'पारदर्शिता' : 'Transparency'}
      </h1>
      <p className="text-xl text-gray-500 mb-12 leading-relaxed">
        {isHindi 
          ? 'हमारा मानना है कि विश्वास कट्टरपंथी खुलेपन के माध्यम से अर्जित किया जाता है। यहाँ बताया गया है कि हम कैसे काम करते हैं।'
          : 'We believe that trust is earned through radical openness. Here is how we operate.'}
      </p>

      <div className="prose prose-slate max-w-none text-gray-700 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'डेटा संग्रह और उपयोग' : 'Data Collection & Usage'}</h2>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-gray-400" /> {isHindi ? 'हम क्या एकत्र करते हैं' : 'What we collect'}
             </h3>
             <ul className="list-disc pl-5 space-y-2 mb-6">
                <li><strong>{isHindi ? 'व्यवस्थापक पहचान:' : 'Admin Identity:'}</strong> {isHindi ? 'संगठन निर्माताओं के सत्यापित फोन नंबर।' : 'Verified phone numbers of organisation creators.'}</li>
                <li><strong>{isHindi ? 'संगठन डेटा:' : 'Organisation Data:'}</strong> {isHindi ? 'सदस्य, फॉर्म और लॉग जो आप दर्ज करते हैं।' : 'Members, forms, and logs you enter.'}</li>
                <li><strong>{isHindi ? 'सिस्टम लॉग:' : 'System Logs:'}</strong> {isHindi ? 'सुरक्षा के लिए आईपी पते और टाइमस्टैम्प।' : 'IP addresses and timestamps for security.'}</li>
             </ul>

             <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-gray-400" /> {isHindi ? 'हम क्या एकत्र नहीं करते हैं' : 'What we DO NOT collect'}
             </h3>
             <ul className="list-disc pl-5 space-y-2">
                <li><strong>{isHindi ? 'राजनीतिक प्रोफाइलिंग डेटा:' : 'Political Profiling Data:'}</strong> {isHindi ? 'हम आपके राजनीतिक झुकाव का अनुमान नहीं लगाते हैं।' : 'We do not infer your political leanings.'}</li>
                <li><strong>{isHindi ? 'विज्ञापन लक्ष्यीकरण डेटा:' : 'Ad Targeting Data:'}</strong> {isHindi ? 'हमारे लॉग-इन ऐप पर कोई विज्ञापन पिक्सेल नहीं है।' : 'We have no ad pixels on our logged-in app.'}</li>
                <li><strong>{isHindi ? 'डिवाइस फ़िंगरप्रिंट:' : 'Device Fingerprints:'}</strong> {isHindi ? 'हम पूरे वेब पर आपको ट्रैक नहीं करते हैं।' : 'We do not track you across the web.'}</li>
             </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'समर्थक मॉडल' : 'The Supporter Model'}</h2>
          <p>
            {isHindi
              ? 'संगठन मुफ़्त है क्योंकि हम भुगतान करने वाले संगठनों के समुदाय द्वारा समर्थित हैं। यह "समर्थक मॉडल" हमारे प्रोत्साहनों को आपके साथ संरेखित करता है।'
              : 'Sangathan is free because we are supported by a community of paying organisations. This "Supporter Model" aligns our incentives with yours.'}
          </p>
          <p>
            {isHindi
              ? 'रोशनी चालू रखने के लिए हमें आपका डेटा बेचने की आवश्यकता नहीं है। हम अपने उपयोगकर्ताओं के प्रति जवाबदेह हैं, विज्ञापनदाताओं के प्रति नहीं।'
              : 'We do not need to sell your data to keep the lights on. We answer to our users, not to advertisers.'}
          </p>
          <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-lg flex gap-4 items-center">
             <HeartHandshake className="text-orange-600 w-8 h-8" />
             <div>
                <div className="font-bold text-gray-900">{isHindi ? 'सामुदायिक विश्वास' : 'Community Trust'}</div>
                <div className="text-sm text-gray-600">
                  {isHindi
                    ? 'हमारा राजस्व वैकल्पिक सदस्यताओं से आता है, यह सुनिश्चित करते हुए कि हम स्वतंत्र और मिशन-संरेखित रहें।'
                    : 'Our revenue comes from optional subscriptions, ensuring we remain independent and mission-aligned.'}
                </div>
             </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'भविष्य के रोडमैप सिद्धांत' : 'Future Roadmap Principles'}</h2>
          <p>
            {isHindi ? 'जैसे-जैसे हम बढ़ते हैं, हम प्रतिबद्ध हैं:' : 'As we grow, we commit to:'}
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>{isHindi ? 'ओपन सोर्स घटक:' : 'Open Source Components:'}</strong> {isHindi ? 'प्रमुख पुस्तकालयों को समुदाय के लिए वापस जारी करना।' : 'Releasing key libraries back to the community.'}</li>
            <li><strong>{isHindi ? 'सार्वजनिक ऑडिट:' : 'Public Audits:'}</strong> {isHindi ? 'हमारे बुनियादी ढांचे का ऑडिट करने के लिए तीसरे पक्ष की सुरक्षा फर्मों को शामिल करना।' : 'Engaging third-party security firms to audit our infrastructure.'}</li>
            <li><strong>{isHindi ? 'गवर्नेंस बोर्ड:' : 'Governance Board:'}</strong> {isHindi ? 'अंततः प्लेटफ़ॉर्म नीति का मार्गदर्शन करने के लिए एक सामुदायिक सलाहकार बोर्ड की स्थापना करना।' : 'Eventually establishing a community advisory board to guide platform policy.'}</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
