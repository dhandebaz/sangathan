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
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] selection:bg-brand-200 selection:text-brand-900">
      <Navbar lang={lang} isAuthenticated={Boolean(user)} />
      <main id="main-content" className="flex-grow pt-16" tabIndex={-1}>
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  )
}
