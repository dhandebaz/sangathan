import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'

export default async function SiteLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans selection:bg-orange-100">
      <Navbar lang={lang} />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  )
}
