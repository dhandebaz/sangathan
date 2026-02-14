import { Flag, Zap, Box } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'उत्पाद रोडमैप | संगठन' : 'Product Roadmap | Sangathan',
    description: isHindi
      ? 'आने वाले वर्ष के लिए हमारी रणनीतिक प्राथमिकताएं।'
      : 'Our strategic priorities for the coming year.',
  }
}

export default async function RoadmapPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        {isHindi ? 'उत्पाद रोडमैप' : 'Product Roadmap'}
      </h1>
      <p className="text-xl text-gray-500 mb-12 leading-relaxed">
        {isHindi
          ? 'आने वाले वर्ष के लिए हमारी रणनीतिक प्राथमिकताएं।'
          : 'Our strategic priorities for the coming year.'}
      </p>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
             <Zap className="w-6 h-6 text-orange-600" />
             <h2 className="text-2xl font-bold text-gray-900 m-0">{isHindi ? 'अल्पावधि (Q1 2026)' : 'Short Term (Q1 2026)'}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
             <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h3 className="font-bold mb-2">{isHindi ? 'प्रदर्शन अनुकूलन' : 'Performance Optimization'}</h3>
                <p className="text-gray-600 text-sm">
                  {isHindi
                    ? '100,000+ सदस्यों वाले संगठनों का समर्थन करने के लिए कर्सर-आधारित पेजिनेशन और डेटाबेस इंडेक्सिंग लागू करना।'
                    : 'Implementing cursor-based pagination and database indexing to support organisations with 100,000+ members.'}
                </p>
             </div>
             <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h3 className="font-bold mb-2">{isHindi ? 'क्षेत्रीय भाषाएं' : 'Regional Languages'}</h3>
                <p className="text-gray-600 text-sm">
                  {isHindi
                    ? 'जमीनी स्तर पर अपनाने के लिए हिंदी, मराठी, तमिल और मलयालम के लिए पूर्ण यूआई स्थानीयकरण।'
                    : 'Full UI localization for Hindi, Marathi, Tamil, and Malayalam to support grassroots adoption.'}
                </p>
             </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
             <Flag className="w-6 h-6 text-blue-600" />
             <h2 className="text-2xl font-bold text-gray-900 m-0">{isHindi ? 'मध्यावधि (Q2-Q3 2026)' : 'Medium Term (Q2-Q3 2026)'}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
             <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h3 className="font-bold mb-2">{isHindi ? 'सार्वजनिक पारदर्शिता पोर्टल' : 'Public Transparency Portals'}</h3>
                <p className="text-gray-600 text-sm">
                  {isHindi
                    ? 'संगठनों को वेब पर अपने प्रभाव और वित्त के "लाइव डैशबोर्ड" प्रकाशित करने की अनुमति देना।'
                    : 'Allowing organisations to publish "Live Dashboards" of their impact and financials to the web.'}
                </p>
             </div>
             <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h3 className="font-bold mb-2">{isHindi ? 'स्वयंसेवक प्रबंधन' : 'Volunteer Management'}</h3>
                <p className="text-gray-600 text-sm">
                  {isHindi
                    ? 'शिफ्ट शेड्यूल करने, घंटे ट्रैक करने और स्वयंसेवक योगदान को पहचानने के लिए समर्पित उपकरण।'
                    : 'Dedicated tools for scheduling shifts, tracking hours, and recognizing volunteer contributions.'}
                </p>
             </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
             <Box className="w-6 h-6 text-purple-600" />
             <h2 className="text-2xl font-bold text-gray-900 m-0">{isHindi ? 'दीर्घावधि (2027+)' : 'Long Term (2027+)'}</h2>
          </div>
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
             <h3 className="font-bold mb-2">{isHindi ? '"गवर्नेंस ओएस" विजन' : 'The "Governance OS" Vision'}</h3>
             <p className="text-gray-600">
               {isHindi
                 ? 'हम एक मॉड्यूलर प्लगइन सिस्टम बनाने का लक्ष्य रखते हैं जहां तीसरे पक्ष के डेवलपर्स संगठन डेटाबेस के शीर्ष पर विशेष उपकरण (जैसे चुनाव प्रबंधन या अनुदान रिपोर्टिंग) बना सकते हैं।'
                 : 'We aim to build a modular plugin system where third-party developers can build specialized tools (like Election Management or Grant Reporting) on top of the Sangathan database.'}
             </p>
          </div>
        </section>
      </div>
    </div>
  )
}
