import { DocsSidebar } from '@/components/docs/docs-sidebar'

export default async function DocsLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="lg:flex lg:gap-12">
        {/* Left Column: Navigation */}
        <DocsSidebar lang={lang} />
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
