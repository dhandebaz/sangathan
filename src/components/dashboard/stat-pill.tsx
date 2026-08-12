import { cn } from '@/lib/utils'
import Link from 'next/link'
import { OrgColor } from '@/lib/org-types'

interface StatPillProps {
  icon: React.ElementType
  value: string | number
  label: string
  href: string
  color?: OrgColor
  className?: string
}

const colorMap: Record<OrgColor, string> = {
  brand: 'border-indigo-200 bg-white hover:bg-indigo-50/40 text-indigo-900',
  emerald: 'border-emerald-200 bg-white hover:bg-emerald-50/40 text-emerald-900',
  amber: 'border-amber-200 bg-white hover:bg-amber-50/40 text-amber-900',
  sky: 'border-sky-200 bg-white hover:bg-sky-50/40 text-sky-900',
  rose: 'border-rose-200 bg-white hover:bg-rose-50/40 text-rose-900',
  indigo: 'border-indigo-200 bg-white hover:bg-indigo-50/40 text-indigo-900',
}

const iconWrapMap: Record<OrgColor, string> = {
  brand: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border border-amber-100',
  sky: 'bg-sky-50 text-sky-600 border border-sky-100',
  rose: 'bg-rose-50 text-rose-600 border border-rose-100',
  indigo: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
}

export function StatPill({ icon: Icon, value, label, href, color = 'brand', className }: StatPillProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all hover:shadow-xs active:scale-[0.98] min-h-[64px]',
        colorMap[color],
        className
      )}
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs', iconWrapMap[color])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-lg sm:text-xl font-extrabold leading-tight text-slate-900">{value}</div>
        <div className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">{label}</div>
      </div>
    </Link>
  )
}

