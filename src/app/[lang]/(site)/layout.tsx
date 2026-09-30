import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { OrganizationJsonLd, WebSiteJsonLd, SoftwareApplicationJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  
  return {
    metadataBase: new URL('https://sangathan.space'),
    title: {
      template: isHindi ? '%s | संगठन' : '%s | Sangathan',
      default: isHindi ? 'संगठन - नागरिक समूहों के लिए बुनियादी ढांचा' : 'Sangathan - Infrastructure for Civic Collectives',
    },
    description: isHindi
      ? 'एनजीओ और सामुदायिक समूहों के लिए सदस्यों, निधियों और शासन का प्रबंधन करने के लिए डिजिटल बुनियादी ढांचा।'
      : 'Digital infrastructure for NGOs and community groups to manage members, funds, and governance.',
    keywords: [
      'NGO management software India',
      'member management India', 
      'organization management platform', 'civic tech India', 'donation management NGO', 
      '80G tax receipt software', 'FCRA compliance tracker', 'RTI application tool', 
      'online voting platform India', 
      'transparent governance platform', 'digital id card organization', 'event management NGO', 
      'volunteer management software India', 'sangathan app', 'संगठन', 'एनजीओ सॉफ्टवेयर'
    ],
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: '/en',
        hi: '/hi',
      },
    },
    openGraph: {
      type: 'website',
      locale: isHindi ? 'hi_IN' : 'en_US',
      url: `https://sangathan.space/${lang}`,
      siteName: 'Sangathan',
      title: isHindi ? 'संगठन — नागरिक आंदोलनों व समूहों का डिजिटल ऑपरेटिंग सिस्टम' : 'Sangathan — Civic Digital Infrastructure for Movements & Collectives',
      description: isHindi
        ? 'नागरिक समूहों और एनजीओ के लिए 1-टैप जांच, ₹1 पर्चे, 30-दिवसीय आरटीआई याद व गुप्त मतदान।'
        : 'The zero-tech, mobile-first operating system for civic collectives, citizen science networks, and NGOs.',
      images: [
        {
          url: `https://sangathan.space/api/og?lang=${lang}&type=collective`,
          width: 1200,
          height: 630,
          alt: isHindi ? 'संगठन - नागरिक डिजिटल बुनियादी ढांचा' : 'Sangathan - Civic Digital Infrastructure',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@areynetaji',
      creator: '@areynetaji',
      title: isHindi ? 'संगठन — नागरिक आंदोलनों व समूहों का डिजिटल ऑपरेटिंग सिस्टम' : 'Sangathan — Civic Digital Infrastructure for Movements & Collectives',
      description: isHindi
        ? 'नागरिक समूहों और एनजीओ के लिए 1-टैप जांच, ₹1 पर्चे, 30-दिवसीय आरटीआई याद व गुप्त मतदान।'
        : 'The zero-tech, mobile-first operating system for civic collectives, citizen science networks, and NGOs.',
      images: [`https://sangathan.space/api/og?lang=${lang}&type=collective`],
    },
    verification: {
      google: 'google-site-verification=placeholder',
    },
  }
}

export default async function SiteLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return (
    <div className="relative flex min-h-screen flex-col bg-white font-sans text-slate-900 selection:bg-indigo-200 selection:text-indigo-900">
      
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        {/* Crisp geometric dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        {/* Thin structural rule wash at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-slate-200/70" />
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-slate-50/80 to-transparent" />
      </div>

      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <SoftwareApplicationJsonLd />

      <Navbar lang={lang} isAuthenticated={Boolean(user)} />
      
      <main id="main-content" className="flex-grow pt-24" tabIndex={-1}>
        {children}
      </main>
      
      <Footer lang={lang} />
    </div>
  )
}
