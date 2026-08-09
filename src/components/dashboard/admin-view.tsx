'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatPill } from '@/components/dashboard/stat-pill'
import { ActionCard } from '@/components/dashboard/action-card'
import { FeatureTile } from '@/components/dashboard/feature-tile'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Calendar, Users, CheckSquare, ArrowRight, UsersRound, Ticket,
  HandCoins, Wrench, Scale, ScrollText, MessageSquare, Radio,
  Flag, ShieldCheck, Gift, HeartHandshake, Vote, Database,
  Megaphone, Landmark, HardHat, AlertCircle, UserCheck, Network,
  RefreshCw, Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { AdminStats, RecentActivityItem, DashboardEvent } from '@/types/dashboard'
import { getOrgLabel, OrgColor } from '@/lib/org-types'

type OrgFeature = {
  icon: React.ElementType
  title: string
  subtitle: string
  href: string
  color: 'brand' | 'emerald' | 'amber' | 'sky' | 'rose' | 'indigo'
}

function getOrgFeatures(type: string, lang: string): OrgFeature[] {
  switch (type) {
    case 'ngo':
      return [
        { icon: HandCoins, title: 'Donations', subtitle: 'Track contributions', href: `/${lang}/dashboard/donations`, color: 'emerald' },
        { icon: HeartHandshake, title: 'Volunteers', subtitle: 'Manage teams', href: `/${lang}/dashboard/volunteers`, color: 'brand' },
        { icon: ScrollText, title: 'Grants', subtitle: 'Find & apply', href: `/${lang}/dashboard/grants`, color: 'indigo' },
        { icon: ShieldCheck, title: 'Compliance', subtitle: 'Regulatory filings', href: `/${lang}/dashboard/compliance`, color: 'amber' },
      ]
    case 'student_union':
      return [
        { icon: Vote, title: 'Elections', subtitle: 'Manage polls', href: `/${lang}/dashboard/elections`, color: 'indigo' },
        { icon: Database, title: 'RTI & ATR', subtitle: 'File & track', href: `/${lang}/dashboard/rti-atr`, color: 'brand' },
        { icon: Wrench, title: 'Hostel Audit', subtitle: 'Mess & hostel', href: `/${lang}/dashboard/hostel-mess`, color: 'amber' },
        { icon: Scale, title: 'Legal Aid', subtitle: 'Anti-ragging cell', href: `/${lang}/dashboard/legal-aid`, color: 'rose' },
      ]
    case 'workers_union':
      return [
        { icon: ScrollText, title: 'CBA Documents', subtitle: 'Collective bargaining', href: `/${lang}/dashboard/cba`, color: 'amber' },
        { icon: AlertCircle, title: 'Grievances', subtitle: 'File complaints', href: `/${lang}/dashboard/grievances`, color: 'rose' },
        { icon: Vote, title: 'Strike Votes', subtitle: 'Ballots & polls', href: `/${lang}/dashboard/polls`, color: 'indigo' },
        { icon: HardHat, title: 'Job Dispatch', subtitle: 'Worker placement', href: `/${lang}/dashboard/jobs`, color: 'brand' },
      ]
    case 'rwa':
      return [
        { icon: Wrench, title: 'Maintenance', subtitle: 'Track requests', href: `/${lang}/dashboard/maintenance`, color: 'sky' },
        { icon: Calendar, title: 'Facilities', subtitle: 'Book amenities', href: `/${lang}/dashboard/facilities`, color: 'brand' },
        { icon: UserCheck, title: 'Visitors', subtitle: 'Log entries', href: `/${lang}/dashboard/visitors`, color: 'indigo' },
        { icon: Vote, title: 'Polls', subtitle: 'Community votes', href: `/${lang}/dashboard/polls`, color: 'amber' },
      ]
    default:
      return []
  }
}

function getOrgStats(type: string, stats: AdminStats, lang: string): { icon: React.ElementType; value: string | number; label: string; href: string; color: OrgColor }[] {
  const items: { icon: React.ElementType; value: string | number; label: string; href: string; color: OrgColor }[] = [
    { icon: Users, value: stats.members, label: 'Members', href: `/${lang}/dashboard/members`, color: 'brand' },
    { icon: Calendar, value: stats.events, label: 'Events', href: `/${lang}/dashboard/events`, color: 'indigo' },
    { icon: CheckSquare, value: stats.tasks, label: 'Tasks', href: `/${lang}/dashboard/tasks`, color: 'amber' },
  ]

  if (type === 'ngo') {
    items.push({ icon: HandCoins, value: `₹${(stats.donations / 1000).toFixed(0)}K`, label: 'Donations', href: `/${lang}/dashboard/donations`, color: 'emerald' })
  } else if (type === 'student_union') {
    items.push({ icon: Vote, value: stats.tasks, label: 'Pending', href: `/${lang}/dashboard/elections`, color: 'sky' })
  } else if (type === 'workers_union') {
    items.push({ icon: Scale, value: stats.tasks, label: 'Grievances', href: `/${lang}/dashboard/grievances`, color: 'rose' })
  } else if (type === 'rwa') {
    items.push({ icon: Wrench, value: stats.tasks, label: 'Tickets', href: `/${lang}/dashboard/maintenance`, color: 'sky' })
  }

  return items
}

function getPriorityActions(type: string, lang: string, membershipRequests: number) {
  const actions: { icon: React.ElementType; title: string; description: string; href: string; color: OrgColor }[] = []

  if (membershipRequests > 0) {
    actions.push({
      icon: UsersRound,
      title: `${membershipRequests} नए member requests pending`,
      description: 'नए सदस्यों को approve करें या reject करें',
      href: `/${lang}/dashboard/membership-requests`,
      color: 'amber',
    })
  }

  if (type === 'ngo') {
    actions.push({
      icon: HandCoins,
      title: 'Donations verify करें',
      description: 'नए donations को verify और receipt भेजें',
      href: `/${lang}/dashboard/donations`,
      color: 'emerald',
    })
  }

  if (type === 'student_union') {
    actions.push({
      icon: Vote,
      title: 'Election updates देखें',
      description: 'नामांकन और वोटिंग स्टेटस',
      href: `/${lang}/dashboard/elections`,
      color: 'indigo',
    })
  }

  if (type === 'workers_union') {
    actions.push({
      icon: AlertCircle,
      title: 'Grievances check करें',
      description: 'नई शिकायतें देखें और resolve करें',
      href: `/${lang}/dashboard/grievances`,
      color: 'rose',
    })
  }

  if (type === 'rwa') {
    actions.push({
      icon: Wrench,
      title: 'Maintenance tickets देखें',
      description: 'नए maintenance requests को assign करें',
      href: `/${lang}/dashboard/maintenance`,
      color: 'sky',
    })
  }

  return actions
}

function getTimeGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'सुप्रभात'
  if (hour < 17) return 'नमस्कार'
  if (hour < 21) return 'शुभ संध्या'
  return 'शुभ रात्रि'
}

export function AdminDashboard({
  lang,
  stats,
  recentActivity,
  upcomingEvents,
  membershipRequests,
  openAppeals,
  orgType,
  userName
}: {
  lang: string
  stats: AdminStats
  recentActivity: RecentActivityItem[]
  upcomingEvents: DashboardEvent[]
  membershipRequests: number
  openAppeals: number
  orgType?: string
  userName?: string
}) {
  const type = orgType || 'ngo'
  const features = getOrgFeatures(type, lang)
  const statItems = getOrgStats(type, stats, lang)
  const priorityActions = getPriorityActions(type, lang, membershipRequests)
  const [dismissedActions, setDismissedActions] = useState<number[]>([])

  const visibleActions = priorityActions.filter((_, i) => !dismissedActions.includes(i))

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Hero Welcome */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 md:p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-bold">{getTimeGreeting()}{userName ? `, ${userName}` : ''}! 👋</h1>
            </div>
            <p className="text-slate-300 text-sm">{getOrgLabel(type)} • {getOrgLabel(type, 'hi')}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white/10`}>
                <Sparkles className="h-3 w-3" /> Active
              </span>
              <span className="text-xs text-slate-400">Last updated: 2 min ago</span>
            </div>
          </div>
           <button type="button" className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Refresh dashboard">
             <RefreshCw className="h-5 w-5" />
           </button>
        </div>
      </div>

      {/* Quick Glance Stats */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Quick Glance</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible snap-x snap-mandatory">
          {statItems.map((item) => (
            <StatPill
              key={item.href}
              icon={item.icon}
              value={item.value}
              label={item.label}
              href={item.href}
              color={item.color}
              className="snap-start"
            />
          ))}
        </div>
      </div>

      {/* Invite Members CTA - Show for new orgs with few members */}
      {stats.members <= 1 && (
        <div className="bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
              <UsersRound className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Build Your Team</h3>
              <p className="text-xs text-slate-600 mb-3">
                Invite your core team members to collaborate. Share an invite link or add them directly.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" className="gap-2 h-8 text-xs">
                  <Link href={`/${lang}/dashboard/members`}>
                    <UsersRound className="w-3.5 h-3.5" />
                    Invite Members
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-2 h-8 text-xs">
                  <Link href={`/${lang}/dashboard/members/add`}>
                    <ArrowRight className="w-3.5 h-3.5" />
                    Add Manually
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Priority Actions */}
      {visibleActions.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">⚡ आज क्या करना है</h2>
          <div className="space-y-2">
            {visibleActions.map((action, i) => {
              const originalIndex = priorityActions.indexOf(action)
              return (
                <ActionCard
                  key={originalIndex}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  actionLabel="देखें"
                  actionHref={action.href}
                  color={action.color}
                  onDismiss={() => setDismissedActions([...dismissedActions, originalIndex])}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Key Features Grid */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">🎯 मुख्य सुविधाएं</h2>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f) => (
            <FeatureTile
              key={f.href}
              icon={f.icon}
              title={f.title}
              subtitle={f.subtitle}
              href={f.href}
              color={f.color}
            />
          ))}
        </div>
      </div>

      {/* Quick Tools */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">🛠️ Quick Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Unified Inbox</p>
                <p className="text-xs text-muted-foreground">WhatsApp & Telegram</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="shrink-0">
                <Link href={`/${lang}/dashboard/communications`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <Radio className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Master Channels</p>
                <p className="text-xs text-muted-foreground">QR & Bot setup</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="shrink-0">
                <Link href={`/${lang}/dashboard/channels`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Membership & Appeals */}
      {(membershipRequests > 0 || openAppeals > 0) && (
        <div className="grid grid-cols-2 gap-3">
          <Card className={membershipRequests > 0 ? 'border-amber-200 bg-amber-50/50' : ''}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{membershipRequests}</p>
              <p className="text-xs text-muted-foreground mt-1">Pending Requests</p>
              <Button asChild variant="outline" size="sm" className="mt-2 h-7 text-xs">
                <Link href={`/${lang}/dashboard/membership-requests`}>Review</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className={openAppeals > 0 ? 'border-rose-200 bg-rose-50/50' : ''}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{openAppeals}</p>
              <p className="text-xs text-muted-foreground mt-1">Open Appeals</p>
              <Button asChild variant="outline" size="sm" className="mt-2 h-7 text-xs">
                <Link href={`/${lang}/dashboard/appeals`}>Manage</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upcoming Events & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-600" />
              Upcoming Events
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-xs h-7">
              <Link href={`/${lang}/dashboard/events`}>View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingEvents.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={Calendar}
                  title="कोई event नहीं है"
                  description="नया event बनाएं"
                  actionLabel="Create Event"
                  actionHref={`/${lang}/dashboard/events/new`}
                />
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {upcomingEvents.map((event) => (
                  <Link key={event.id} href={`/${lang}/dashboard/events/${event.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors active:bg-muted">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(event.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {event.location || 'Online'}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Database className="h-4 w-4 text-brand-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentActivity.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  emoji="📋"
                  title="कोई activity नहीं है"
                  description="शुरू करें!"
                />
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.title || 'Untitled'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-medium text-muted-foreground capitalize">{item.type.replace('_', ' ')}</span>
                        <span className="text-xs text-muted-foreground">• {item.created_at}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
