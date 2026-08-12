import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, X } from 'lucide-react'
import Link from 'next/link'
import { OrgColor } from '@/lib/org-types'

interface ActionCardProps {
  icon: React.ElementType
  title: string
  description: string
  actionLabel: string
  actionHref: string
  color?: OrgColor
  onDismiss?: () => void
  className?: string
}

const iconBgMap: Record<OrgColor, string> = {
  brand: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border border-amber-100',
  sky: 'bg-sky-50 text-sky-600 border border-sky-100',
  rose: 'bg-rose-50 text-rose-600 border border-rose-100',
  indigo: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
}

export function ActionCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  color = 'brand',
  onDismiss,
  className,
}: ActionCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm',
        className
      )}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs',
            iconBgMap[color]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{title}</p>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-slate-400 hover:text-slate-700 transition-colors shrink-0 p-1 -mr-1 -mt-1 rounded-full hover:bg-slate-100"
                aria-label="Dismiss task"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{description}</p>
          <div className="mt-3">
            <Button
              asChild
              size="sm"
              className="h-8 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all active:scale-95 shadow-xs"
            >
              <Link href={actionHref}>
                {actionLabel}
                <ArrowRight className="h-3 w-3 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

