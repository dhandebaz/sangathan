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

type StatPillItem = {
  icon: React.ElementType
  value: string | number
  label: string
  href: string
  color: 'brand' | 'emerald' | 'amber' | 'sky' | 'rose' | 'indigo'
}

const colorMap: Record<OrgColor, string> = {
  brand: 'border-brand-200 bg-brand-50 text-brand-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  sky: 'border-sky-200 bg-sky-50 text-sky-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
}

const iconColorMap: Record<OrgColor, string> = {
  brand: 'text-brand-600',
  emerald: 'text-emerald-600',
  amber: 'text-amber-600',
  sky: 'text-sky-600',
  rose: 'text-rose-600',
  indigo: 'text-indigo-600',
}

export function StatPill({ icon: Icon, value, label, href, color = 'brand', className }: StatPillProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:shadow-md active:scale-[0.98] min-w-[140px] shrink-0',
        colorMap[color],
        className
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0', iconColorMap[color])} />
      <div className="min-w-0">
        <div className="text-lg font-bold leading-tight">{value}</div>
        <div className="text-[11px] font-medium opacity-80 truncate">{label}</div>
      </div>
    </Link>
  )
}
