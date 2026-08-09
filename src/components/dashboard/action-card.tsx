import { Card, CardContent } from '@/components/ui/card'
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
  brand: 'bg-brand-100 text-brand-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
  sky: 'bg-sky-100 text-sky-600',
  rose: 'bg-rose-100 text-rose-600',
  indigo: 'bg-indigo-100 text-indigo-600',
}

export function ActionCard({ icon: Icon, title, description, actionLabel, actionHref, color = 'brand', onDismiss, className }: ActionCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', iconBgMap[color])}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0 p-0.5"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
            <Button asChild variant="ghost" className="h-10 px-0 mt-2 text-xs font-medium">
              <Link href={actionHref}>
                {actionLabel}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
