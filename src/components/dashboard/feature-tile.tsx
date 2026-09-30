import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { OrgColor } from '@/lib/org-types'

interface FeatureTileProps {
  icon: React.ElementType
  emoji?: string
  title: string
  subtitle: string
  href: string
  color?: OrgColor
  className?: string
}

const iconWrapMap: Record<OrgColor, string> = {
  brand: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border border-amber-100',
  sky: 'bg-sky-50 text-sky-600 border border-sky-100',
  rose: 'bg-rose-50 text-rose-600 border border-rose-100',
  indigo: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
}

export function FeatureTile({ icon: Icon, emoji, title, subtitle, href, color = 'brand', className }: FeatureTileProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col justify-between p-4 sm:p-5 rounded-sm border border-slate-200 bg-white hover:bg-slate-50  transition-colors shadow-xs min-h-[110px]',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        {Icon && (
          <div className={cn('w-11 h-11 rounded-sm flex items-center justify-center shrink-0 shadow-2xs', iconWrapMap[color])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        {emoji && (
          <span className="text-2xl">{emoji}</span>
        )}
        <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
      <div>
        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{title}</p>
        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 leading-normal">{subtitle}</p>
      </div>
    </Link>
  )
}

