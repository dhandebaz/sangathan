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
      ? 'एनजीओ, छात्र संघों और सामुदायिक समूहों के लिए सदस्यों, निधियों और शासन का प्रबंधन करने के लिए डिजिटल बुनियादी ढांचा।'
      : 'Digital infrastructure for NGOs, student unions, and community groups to manage members, funds, and governance.',
    keywords: [
      'NGO management software India', 'student union election software', 'RWA management app', 
      'housing society app India', 'workers union management', 'member management India', 
      'organization management platform', 'civic tech India', 'donation management NGO', 
      '80G tax receipt software', 'FCRA compliance tracker', 'RTI application tool', 
      'campus election management', 'Lyngdoh committee compliance', 'online voting platform India', 
      'maintenance billing housing society', 'resident welfare association software', 
      'trade union management system', 'collective bargaining agreement software', 
      'transparent governance platform', 'digital id card organization', 'event management NGO', 
      'volunteer management software India', 'sangathan app', 'संगठन', 'एनजीओ सॉफ्टवेयर', 'छात्र संघ'
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
      url: 'https://sangathan.space',
      siteName: 'Sangathan',
      title: isHindi ? 'संगठन - नागरिक समूहों के लिए बुनियादी ढांचा' : 'Sangathan - Infrastructure for Civic Collectives',
      description: isHindi
        ? 'एनजीओ, छात्र संघों और सामुदायिक समूहों के लिए सदस्यों, निधियों और शासन का प्रबंधन करने के लिए डिजिटल बुनियादी ढांचा।'
        : 'Digital infrastructure for NGOs, student unions, and community groups to manage members, funds, and governance.',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@areynetaji',
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
      
      <div className="pointer-events-none fixed inset-0 flex justify-center -z-10">
        {/* Subtle mesh gradient top */}
        <div className="absolute top-0 w-[1000px] max-w-full h-[600px] bg-gradient-to-b from-indigo-50/50 via-white to-white rounded-full blur-3xl opacity-60"></div>
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzvy8unqg/image/upload/v1724213160/noise_uvwxxa.webp')] opacity-[0.03] mix-blend-overlay"></div>
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
