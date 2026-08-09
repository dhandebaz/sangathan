import Link from 'next/link'
import { Users, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { OrgPlanUsage } from '@/lib/plans/config'

interface PlanUsageBannerProps {
  usage: OrgPlanUsage
  lang: string
}

export function PlanUsageBanner({ usage, lang }: PlanUsageBannerProps) {
  // Only show banner for Community tier or if over 80% usage
  if (usage.planName !== 'Community' && !usage.isNearMemberLimit) {
    return null
  }

  const isFull = usage.isAtMemberLimit
  const isNear = usage.isNearMemberLimit

  const barColor = isFull
    ? 'bg-rose-600'
    : isNear
      ? 'bg-amber-500'
      : 'bg-indigo-600'

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm transition-all hover:border-slate-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isFull ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'}`}>
              <Users className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {usage.planTier.name} Plan Member Capacity
              </span>
              <span className="text-xs font-semibold text-slate-500">
                ({usage.memberCount} of {usage.maxMembers} slots used)
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md bg-slate-200 rounded-full h-2 overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-500 rounded-full ${barColor}`}
              style={{ width: `${Math.min(100, usage.memberUsagePercentage)}%` }}
            />
          </div>

          <p className="text-xs text-slate-600">
            {isFull ? (
              <span className="text-rose-700 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> Capacity limit reached. New member joins and invites are paused.
              </span>
            ) : isNear ? (
              <span className="text-amber-800 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> Approaching the 20-member free tier limit. Upgrade to unlock up to 1,000 members & AI intelligence.
              </span>
            ) : (
              <span>
                Free community tier supports up to 20 members. Upgrade anytime for unlimited growth.
              </span>
            )}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Link
            href={`/${lang}/dashboard/billing`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-colors"
          >
            <span>{isFull ? 'Upgrade to Unlock' : 'View Billing & Plans'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
