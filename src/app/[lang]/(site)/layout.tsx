import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  
  return {
    title: {
      template: isHindi ? '%s | संगठन' : '%s | Sangathan',
      default: isHindi ? 'संगठन - नागरिक समूहों के लिए बुनियादी ढांचा' : 'Sangathan - Infrastructure for Civic Collectives',
    },
    description: isHindi
      ? 'एनजीओ, छात्र संघों और सामुदायिक समूहों के लिए सदस्यों, निधियों और शासन का प्रबंधन करने के लिए डिजिटल बुनियादी ढांचा।'
      : 'Digital infrastructure for NGOs, student unions, and community groups to manage members, funds, and governance.',
    keywords: ['NGO', 'Governance', 'India', 'Civic Tech', 'Membership Management', 'Donation Ledger'],
    openGraph: {
      type: 'website',
      locale: isHindi ? 'hi_IN' : 'en_US',
      url: 'https://sangathan.space',
      siteName: 'Sangathan',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@sangathan_app',
    }
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
    <div className="relative flex min-h-screen flex-col bg-white dark:bg-[#0A0A0A] font-sans text-slate-900 dark:text-slate-50 selection:bg-indigo-200 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100">
      
      {/* Premium Global Background */}
      <div className="pointer-events-none fixed inset-0 flex justify-center -z-10">
        {/* Subtle mesh gradient top */}
        <div className="absolute top-0 w-[1000px] max-w-full h-[600px] bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-[#0A0A0A] dark:to-[#0A0A0A] rounded-full blur-3xl opacity-60"></div>
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzvy8unqg/image/upload/v1724213160/noise_uvwxxa.webp')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
      </div>

      <Navbar lang={lang} isAuthenticated={Boolean(user)} />
      
      <main id="main-content" className="flex-grow pt-24" tabIndex={-1}>
        {children}
      </main>
      
      <Footer lang={lang} />
    </div>
  )
}
