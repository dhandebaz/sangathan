import { cn } from '@/lib/utils'

interface StepProgressProps {
  total: number
  current: number
  className?: string
}

export function StepProgress({ total, current, className }: StepProgressProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {Array.from({ length: total }, (_, i) => {
        const stepNum = i + 1
        const isActive = stepNum === current
        const isCompleted = stepNum < current
        return (
          <div
            key={i}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              isActive && 'w-8 bg-brand-600',
              isCompleted && 'w-2 bg-brand-600',
              !isActive && !isCompleted && 'w-2 bg-slate-200'
            )}
          />
        )
      })}
    </div>
  )
}
