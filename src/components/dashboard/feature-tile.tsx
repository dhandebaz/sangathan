import { Card, CardContent } from '@/components/ui/card'
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

const bgMap: Record<OrgColor, string> = {
  brand: 'bg-brand-50 border-brand-200 hover:border-brand-300',
  emerald: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300',
  amber: 'bg-amber-50 border-amber-200 hover:border-amber-300',
  sky: 'bg-sky-50 border-sky-200 hover:border-sky-300',
  rose: 'bg-rose-50 border-rose-200 hover:border-rose-300',
  indigo: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300',
}

const iconWrapMap: Record<OrgColor, string> = {
  brand: 'bg-brand-100 text-brand-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
  sky: 'bg-sky-100 text-sky-600',
  rose: 'bg-rose-100 text-rose-600',
  indigo: 'bg-indigo-100 text-indigo-600',
}

export function FeatureTile({ icon: Icon, emoji, title, subtitle, href, color = 'brand', className }: FeatureTileProps) {
  return (
    <Link
      href={href}
      className={cn(
        'block p-4 rounded-xl border-2 transition-all hover:shadow-md active:scale-[0.98]',
        bgMap[color],
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        {Icon && (
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconWrapMap[color])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        {emoji && (
          <span className="text-2xl">{emoji}</span>
        )}
        <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
      </div>
      <p className="text-sm font-semibold text-foreground mt-2">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{subtitle}</p>
    </Link>
  )
}
