import { Download, Info, Image as ImageIcon } from 'lucide-react'
import { Metadata } from 'next'
import { PageHeader } from '@/components/public/page-header'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'प्रेस और मीडिया | संगठन' : 'Press & Media | Sangathan',
    description: isHindi
      ? 'भारत में नागरिक प्रौद्योगिकी को कवर करने वाले पत्रकारों और शोधकर्ताओं के लिए संसाधन।'
      : 'Resources for journalists and researchers covering civic technology in India.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/press`,
      languages: {
        en: 'https://sangathan.space/en/press',
        hi: 'https://sangathan.space/hi/press',
      },
    },
  }
}

export default async function PressPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
        { name: isHindi ? 'प्रेस और मीडिया' : 'Press', url: `https://sangathan.space/${lang}/press` },
      ]} />

      <PageHeader
        title={isHindi ? 'प्रेस और मीडिया संसाधन' : 'Press & Media Resources'}
        description={isHindi
          ? 'भारत में नागरिक अवसंरचना और डिजिटल संप्रभुता को कवर करने वाले पत्रकारों के लिए आधिकारिक किट।'
          : 'Verified resources for journalists, researchers, and editors covering sovereign civic technology.'}
      />

      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
        <section>
          <h2 className="text-2xl font-black text-slate-900 mb-4">{isHindi ? 'संगठन के बारे में' : 'About Sangathan'}</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            {isHindi
              ? 'संगठन जमीनी स्तर के नागरिक समूहों, एनजीओ और यूनियनों के लिए एक तटस्थ, ₹0 डिजिटल शासन बुनियादी ढांचा मंच है। यह संगठनों को सदस्यों, लोकतांत्रिक मतदान और कानूनी ऑडिट को स्वतंत्र रूप से प्रबंधित करने की शक्ति देता है।'
              : 'Sangathan is a neutral, free-to-use civic infrastructure platform built for grassroots collectives, registered trusts, and unions. It provides the sovereign digital foundation to manage members, funds, and democratic governance without corporate harvesting.'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-1">{isHindi ? 'स्थापना' : 'Founded'}</div>
              <div className="font-black text-slate-900 text-lg">2026</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-1">{isHindi ? 'मुख्यालय' : 'Headquarters'}</div>
              <div className="font-black text-slate-900 text-lg">{isHindi ? 'नई दिल्ली' : 'New Delhi'}</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-1">{isHindi ? 'मिशन' : 'Mission'}</div>
              <div className="font-black text-slate-900 text-sm leading-snug">{isHindi ? 'डिजिटल संप्रभुता' : 'Digital Sovereignty'}</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-1">{isHindi ? 'मॉडल' : 'Model'}</div>
              <div className="font-black text-slate-900 text-sm leading-snug">{isHindi ? 'सेक्शन 8 गैर-लाभकारी' : 'Public Utility'}</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black text-slate-900 mb-6">{isHindi ? 'मीडिया संपत्ति व किट' : 'Media Assets & Identity'}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-6 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900">{isHindi ? 'लोगो पैक (SVG, PNG)' : 'Brand Assets & Vectors'}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{isHindi ? 'लाइट और डार्क बैकग्राउंड के लिए उच्च-रिज़ॉल्यूशन वेक्टर लोगो और बैज।' : 'High-resolution SVGs and badges for light and dark backgrounds.'}</p>
              <span className="text-xs font-mono text-slate-400">Available on request</span>
            </div>
            <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-6 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900">{isHindi ? 'तथ्य पत्रक व तकनीकी दस्तावेज़' : 'Fact Sheet & Architecture Brief'}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{isHindi ? 'सुरक्षा मॉडल, ऑफ़लाइन-प्रथम सिंक, और नागरिक शासन वास्तुकला विवरण।' : 'Overview of zero-monetization policy and offline PWA architecture.'}</p>
              <span className="text-xs font-mono text-slate-400">PDF • v1.46 Edition</span>
            </div>
          </div>
        </section>

        <section className="p-8 bg-slate-50 border border-slate-200 rounded-xl">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{isHindi ? 'प्रेस संपर्क' : 'Press Inquiry Desk'}</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            {isHindi
              ? 'साक्षात्कार, पृष्ठभूमि ब्रीफिंग या डेटा संप्रभुता संबंधी पूछताछ के लिए:'
              : 'For interview requests, background briefings, or technical verification inquiries:'}
          </p>
          <a href="mailto:press@sangathan.space" className="text-base font-mono font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            press@sangathan.space
          </a>
        </section>
      </div>
    </div>
  )
}
