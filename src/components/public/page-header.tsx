import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="relative pt-28 pb-14 md:pt-36 md:pb-20 overflow-hidden border-b border-slate-200 bg-slate-50/50">
      {/* Background dot pattern matching landing page */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4 sm:mb-6">
          {title}
        </h1>
        
        {description && (
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
        
        {children && (
          <div className="mt-8 flex justify-center">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
