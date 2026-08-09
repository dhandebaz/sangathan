import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  icon?: React.ElementType
  emoji?: string
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({ icon: Icon, emoji, title, description, actionLabel, actionHref, className }: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center py-8 px-4 text-center">
        {Icon && (
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        {emoji && (
          <div className="text-4xl mb-3">{emoji}</div>
        )}
        <p className="text-sm font-medium text-foreground mb-1">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mb-3 max-w-[200px]">{description}</p>
        )}
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            {actionLabel}
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
