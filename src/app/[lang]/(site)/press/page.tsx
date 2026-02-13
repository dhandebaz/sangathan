import Link from 'next/link'
import { Download, Info, Image as ImageIcon } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'प्रेस और मीडिया | संगठन' : 'Press & Media | Sangathan',
    description: isHindi
      ? 'भारत में नागरिक प्रौद्योगिकी को कवर करने वाले पत्रकारों और शोधकर्ताओं के लिए संसाधन।'
      : 'Resources for journalists and researchers covering civic technology in India.',
  }
}

export default async function PressPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        {isHindi ? 'प्रेस और मीडिया' : 'Press & Media'}
      </h1>
      <p className="text-xl text-gray-500 mb-12 leading-relaxed">
        {isHindi 
          ? 'भारत में नागरिक प्रौद्योगिकी को कवर करने वाले पत्रकारों और शोधकर्ताओं के लिए संसाधन।'
          : 'Resources for journalists and researchers covering civic technology in India.'}
      </p>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'संगठन के बारे में' : 'About Sangathan'}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {isHindi
              ? 'संगठन जमीनी स्तर के समूहों, एनजीओ और छात्र संघों के लिए डिज़ाइन किया गया एक तटस्थ, ओपन-सोर्स शासन बुनियादी ढांचा मंच है। यह संगठनों को सदस्यों, निधियों और लोकतांत्रिक निर्णय लेने को सुरक्षित रूप से प्रबंधित करने के लिए डिजिटल "ऑपरेटिंग सिस्टम" प्रदान करता है।'
              : 'Sangathan is a neutral, open-source governance infrastructure platform designed for grassroots collectives, NGOs, and student unions. It provides the digital "operating system" for organizations to manage members, funds, and democratic decision-making securely.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
             <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-bold text-gray-500 uppercase mb-1">{isHindi ? 'स्थापना' : 'Founded'}</div>
                <div className="font-bold text-gray-900">2026</div>
             </div>
             <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-bold text-gray-500 uppercase mb-1">{isHindi ? 'मुख्यालय' : 'Headquarters'}</div>
                <div className="font-bold text-gray-900">{isHindi ? 'नई दिल्ली, भारत' : 'New Delhi, India'}</div>
             </div>
             <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-bold text-gray-500 uppercase mb-1">{isHindi ? 'मिशन' : 'Mission'}</div>
                <div className="font-bold text-gray-900">{isHindi ? 'नागरिक समाज के लिए डिजिटल संप्रभुता' : 'Digital Sovereignty for Civil Society'}</div>
             </div>
             <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-bold text-gray-500 uppercase mb-1">{isHindi ? 'स्थिति' : 'Status'}</div>
                <div className="font-bold text-gray-900">{isHindi ? 'सार्वजनिक उपयोगिता (गैर-लाभकारी समर्थित)' : 'Public Utility (Non-Profit Backed)'}</div>
             </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'मीडिया संपत्ति' : 'Media Assets'}</h2>
          <div className="grid md:grid-cols-2 gap-6">
             <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center">
                <ImageIcon className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="font-bold mb-2">{isHindi ? 'लोगो पैक' : 'Logo Pack'}</h3>
                <p className="text-sm text-gray-500 mb-4">{isHindi ? 'लाइट और डार्क मोड में हाई-रेस वेक्टर लोगो (SVG, PNG)।' : 'High-res vector logos (SVG, PNG) in light and dark modes.'}</p>
                <button className="flex items-center gap-2 text-orange-600 font-bold hover:underline" disabled>
                   <Download size={16} /> {isHindi ? '.zip डाउनलोड करें' : 'Download .zip'}
                </button>
             </div>
             <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center">
                <Info className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="font-bold mb-2">{isHindi ? 'तथ्य पत्रक' : 'Fact Sheet'}</h3>
                <p className="text-sm text-gray-500 mb-4">{isHindi ? 'मुख्य आंकड़े, संस्थापक बायो, और तकनीकी वास्तुकला सारांश।' : 'Key statistics, founder bios, and technical architecture summary.'}</p>
                <button className="flex items-center gap-2 text-orange-600 font-bold hover:underline" disabled>
                   <Download size={16} /> {isHindi ? 'पीडीएफ डाउनलोड करें' : 'Download PDF'}
                </button>
             </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{isHindi ? 'संपर्क' : 'Contact'}</h2>
          <p className="text-gray-700">
             {isHindi
               ? 'साक्षात्कार अनुरोधों या अतिरिक्त जानकारी के लिए, कृपया हमारी मीडिया टीम से संपर्क करें।'
               : 'For interview requests or additional information, please contact our media team.'}
          </p>
          <div className="mt-4">
             <a href="mailto:press@sangathan.space" className="text-xl font-bold text-orange-600 hover:underline">press@sangathan.space</a>
          </div>
        </section>
      </div>
    </div>
  )
}
