import { Layers, Network, Code, Globe } from 'lucide-react'
import { Metadata } from 'next'
import { PageHeader } from '@/components/public/page-header'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'दीर्घकालिक दृष्टि | संगठन' : 'Long-Term Vision | Sangathan',
    description: isHindi
      ? 'नागरिक समाज और अगली सदी के लोकतांत्रिक आंदोलनों के लिए डिजिटल बुनियादी ढांचा।'
      : 'Building sovereign digital infrastructure for the next century of democratic civic engagement.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/vision`,
      languages: {
        en: 'https://sangathan.space/en/vision',
        hi: 'https://sangathan.space/hi/vision',
      },
    },
  }
}

export default async function VisionPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
        { name: isHindi ? 'दीर्घकालिक दृष्टि' : 'Vision', url: `https://sangathan.space/${lang}/vision` },
      ]} />

      <PageHeader
        title={isHindi ? 'दीर्घकालिक दृष्टि' : 'The Future Vision'}
        description={isHindi
          ? 'नागरिक समाज के लिए डिजिटल "गवर्नेंस ऑपरेटिंग सिस्टम" का निर्माण।'
          : 'Building the sovereign digital governance operating system for the next century of civic resistance.'}
      />

      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900">{isHindi ? 'सदस्य प्रबंधन से आगे: संप्रभु स्वायत्तता' : 'Beyond Member Management: Sovereign Autonomy'}</h2>
          <p className="text-slate-600 leading-relaxed">
            {isHindi
              ? 'आज, संगठन सदस्यों और धन के प्रबंधन के लिए एक मजबूत मंच है। कल, यह विकेंद्रीकृत नागरिक शासन के लिए एक संपूर्ण बुनियादी ढांचा होगा—जहां नागरिकों का कोई भी समूह कुछ ही मिनटों में एक पूरी तरह से कार्यात्मक, पारदर्शी और लोकतांत्रिक संस्था शुरू कर सकता है।'
              : 'Today, Sangathan is a robust tool for grassroots organizers to manage members, funds, and campaigns. Tomorrow, it will be a comprehensive infrastructure for decentralized civic governance—where any collective can deploy an accountable democratic institution in minutes.'}
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{isHindi ? 'मॉड्यूलर गवर्नेंस' : 'Modular Governance'}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {isHindi
                ? 'विशेष कार्यक्षेत्रों (जैसे पर्यावरण जांच, दान प्रबंधन, शिकायत डायरी) के लिए मॉड्यूलर संरचना।'
                : 'Plug-and-play modular architecture tailored for environmental checks, donation records, and complaint diaries.'}
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{isHindi ? 'संयुक्त मोर्चा व फेडरेशन' : 'Federated Coalitions'}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {isHindi
                ? 'स्वतंत्र नागरिक समूहों को अपनी स्वायत्तता बनाए रखते हुए बड़े राज्यव्यापी या राष्ट्रव्यापी मोर्चों में सहयोग करने की क्षमता।'
                : 'Empowering independent grassroots collectives to federate into broad coalitions while retaining complete organizational sovereignty.'}
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{isHindi ? 'ओपन एपीआई इकोसिस्टम' : 'Open API Ecosystem'}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {isHindi
                ? 'नागरिक-तकनीक डेवलपर्स के लिए खुले मानक, ताकि तीसरे पक्ष के उपकरण सुरक्षित रूप से संगठन डेटाबेस के साथ एकीकृत हो सकें।'
                : 'Open standards for civic-tech developers enabling third-party tools to integrate securely without compromising privacy.'}
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{isHindi ? 'डेटा संप्रभुता और शून्य लॉक-इन' : 'Radical Sovereignty'}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {isHindi
                ? 'कोई कॉर्पोरेट एकाधिकार नहीं। प्रत्येक संगठन किसी भी समय अपना पूरा डेटा और इतिहास खुले प्रारूपों में डाउनलोड कर सकता है।'
                : 'Guaranteed 1-click open export forever. No corporate lock-in or data harvesting.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
