import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

export function MetricCard({ title, value, subtext, trend, icon: Icon }: { title: string, value: string | number, subtext?: string, trend?: 'up' | 'down' | 'neutral', icon?: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(subtext || trend) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend === 'up' && <ArrowUp className="h-3 w-3 text-green-500" />}
            {trend === 'down' && <ArrowDown className="h-3 w-3 text-red-500" />}
            {trend === 'neutral' && <Minus className="h-3 w-3" />}
            {subtext}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
