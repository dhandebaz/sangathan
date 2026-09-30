import { Flag, Zap, Sparkles } from 'lucide-react'
import { Metadata } from 'next'
import { PageHeader } from '@/components/public/page-header'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'उत्पाद रोडमैप' : 'Product Roadmap',
    description: isHindi
      ? 'आने वाले वर्ष के लिए हमारी तकनीकी प्राथमिकताएं और नागरिक उपकरण।'
      : 'Our open engineering priorities and ground governance tools for civil society.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/roadmap`,
      languages: {
        en: 'https://sangathan.space/en/roadmap',
        hi: 'https://sangathan.space/hi/roadmap',
      },
    },
  }
}

export default async function RoadmapPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
        { name: isHindi ? 'रोडमैप' : 'Roadmap', url: `https://sangathan.space/${lang}/roadmap` },
      ]} />

      <PageHeader
        title={isHindi ? 'सार्वजनिक रोडमैप' : 'Public Engineering Roadmap'}
        description={isHindi
          ? 'नागरिक समाज और जमीनी आंदोलनों के लिए हमारी खुली तकनीकी प्राथमिकताएं।'
          : 'Open-source engineering priorities and ground capabilities engineered for democratic organizing.'}
      />

      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-indigo-600" />
            <h2 className="text-2xl font-black text-slate-900">{isHindi ? 'सक्रिय विकास (2026)' : 'Active Engineering (2026)'}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-2">{isHindi ? 'उच्च-मात्रा प्रदर्शन व इंडेक्सिंग' : 'High-Volume Scalability'}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {isHindi
                  ? '100,000+ सदस्यों वाले महा-संगठनों और यूनियनों के लिए सब-मिलीसेकंड कर्सर पेजिनेशन और PostgreSQL विभाजन।'
                  : 'Cursor-based pagination and PostgreSQL query optimizations for mass movements with 100,000+ cadres.'}
              </p>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-2">{isHindi ? 'पूर्ण बहुभाषी स्थानीयकरण' : 'Regional Language Plurality'}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {isHindi
                  ? 'हिंदी के अलावा बंगाली, तमिल, मराठी और तेलुगु के लिए पूर्ण यूआई और प्रिंट पर्चा स्थानीयकरण।'
                  : 'Expanded full-fidelity translation support for Bengali, Tamil, Marathi, and Telugu.'}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <Flag className="w-5 h-5 text-indigo-600" />
            <h2 className="text-2xl font-black text-slate-900">{isHindi ? 'आगामी सुविधाएं' : 'Upcoming Ground Capabilities'}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-2">{isHindi ? 'सत्यापित ई-हस्ताक्षर व आरटीआई गेटवे' : 'Direct E-Filing Gateways'}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {isHindi
                  ? 'राज्य आरटीआई पोर्टलों और नगर निगमों के लिए स्वचालित डिजिटल ड्राफ्टिंग और ट्रैकिंग एकीकरण।'
                  : 'Automated municipal grievance portal synchronization and direct digital submission desks.'}
              </p>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-2">{isHindi ? 'ऑफलाइन ब्लूटूथ मेश सिंक' : 'Offline Bluetooth Mesh Sync'}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {isHindi
                  ? 'इंटरनेट शटडाउन या सुदूर ग्रामीण क्षेत्रों में पीयर-टू-पीयर ब्लूटूथ से मतदान और सदस्यता सिंक।'
                  : 'Local peer-to-peer Bluetooth synchronization for remote field camps and internet shutdowns.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
