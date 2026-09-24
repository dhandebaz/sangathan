import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
  SoftwareApplicationJsonLd,
} from '@/components/seo/json-ld'

/**
 * Guides layout mirrors the (site) chrome (Navbar/Footer + org schema)
 * but lives outside /[lang] so article URLs stay clean (/guides/[slug])
 * and English-only. Articles are intentionally NOT linked from navigation.
 */
export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-white font-sans text-slate-900 selection:bg-indigo-200 selection:text-indigo-900">
      <div className="pointer-events-none fixed inset-0 -z-10 flex justify-center">
        <div className="absolute top-0 h-[600px] w-[1000px] max-w-full rounded-full bg-gradient-to-b from-indigo-50/50 via-white to-white opacity-60 blur-3xl" />
      </div>

      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <SoftwareApplicationJsonLd />

      <Navbar lang="en" isAuthenticated={false} />

      <main id="main-content" className="flex-grow pt-24" tabIndex={-1}>
        {children}
      </main>

      <Footer lang="en" />
    </div>
  )
}
