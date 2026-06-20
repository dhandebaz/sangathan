import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  badge?: string
  children?: ReactNode
}

export function PageHeader({ title, description, badge, children }: PageHeaderProps) {
  return (
    <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black">
      {/* Decorative Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-[800px] h-[300px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] rounded-full translate-y-[-50%]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {badge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold mb-6 border border-indigo-200 dark:border-indigo-500/30">
            {badge}
          </div>
        )}
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          {title}
        </h1>
        
        {description && (
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
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
