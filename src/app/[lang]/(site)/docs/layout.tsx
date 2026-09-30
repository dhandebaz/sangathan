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
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="lg:flex lg:gap-10 xl:gap-12">
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
