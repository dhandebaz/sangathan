'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown, LayoutDashboard, Users,
  Calendar, Vote,
  AlertCircle,
  Landmark,
  DollarSign,
  Printer, ShieldCheck,
  Sparkles, MessageSquare,
  FolderLock, BookOpen,
  Activity, Clock, HandCoins, PlugZap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarNavProps {
  lang: string
  isAdmin: boolean
  capabilities: Record<string, boolean>
  orgType?: string
}

type NavItem = {
  href: string
  icon: React.ElementType
  label: string
  show: boolean
  badge?: string
}

type NavGroup = {
  id: string
  title: string
  items: NavItem[]
}

function useActiveGroup(pathname: string | null, groups: NavGroup[]) {
  return useMemo(() => {
    const active: Record<string, boolean> = {}
    for (const g of groups) {
      active[g.id] = g.items.some(
        item => pathname === item.href || (item.href !== `/${item.href.split('/')[1]}/dashboard` && pathname?.startsWith(item.href))
      )
    }
    return active
  }, [pathname, groups])
}

export function SidebarNav({ lang, isAdmin, capabilities, orgType }: SidebarNavProps) {
  const pathname = usePathname()

  const groups: NavGroup[] = useMemo(() => {
    const c = capabilities

    // 1. Universal Core Operations Workspace (5 Primary Parent Hubs)
    const coreWorkspaceGroup: NavGroup = {
      id: 'core_hubs',
      title: 'Home',
      items: [
        { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: 'Home', show: true },
        { href: `/${lang}/dashboard/inbox`, icon: MessageSquare, label: 'Messages', show: true },
        { href: `/${lang}/dashboard/calendar`, icon: Calendar, label: 'Meetings', show: true },
        { href: `/${lang}/dashboard/people`, icon: Users, label: 'People', show: true },
        { href: `/${lang}/dashboard/forms`, icon: Sparkles, label: 'Forms', show: true },
        { href: `/${lang}/dashboard/integrations`, icon: PlugZap, label: 'Integrations', show: true },
      ].filter(i => i.show)
    }

    // 2. Consolidated Operations & Governance (2 Powerful Parent Workspaces)
    const operationsGroup: NavGroup = {
      id: 'operations_governance',
      title: 'Work',
      items: [
        { href: `/${lang}/dashboard/governance`, icon: Landmark, label: 'Money and votes', show: true },
        { href: `/${lang}/dashboard/administration`, icon: FolderLock, label: 'Files and records', show: true },
      ].filter(i => i.show)
    }

    // 3. Org desk — only civic_collective and ngo
    let specializedDeskGroup: NavGroup

    if (orgType === 'civic_collective') {
      specializedDeskGroup = {
        id: 'specialized_desk',
        title: 'Field work',
        items: [
          { href: `/${lang}/dashboard/field-audits`, icon: Activity, label: 'Field checks', show: true },
          { href: `/${lang}/dashboard/parcha`, icon: Printer, label: 'Parcha', show: true },
          { href: `/${lang}/dashboard/receiving-tracker`, icon: Clock, label: 'Complaint and RTI', show: true },
          { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Votes', show: true },
          { href: `/${lang}/dashboard/compliance/bqf-verification`, icon: ShieldCheck, label: 'ID check', show: true },
        ].filter(i => i.show)
      }
    } else {
      // Default: NGO
      specializedDeskGroup = {
        id: 'specialized_desk',
        title: 'NGO desk',
        items: [
          { href: `/${lang}/dashboard/donations`, icon: HandCoins, label: 'Donations', show: true },
          { href: `/${lang}/dashboard/grants`, icon: DollarSign, label: 'Grants', show: true },
          { href: `/${lang}/dashboard/registers`, icon: BookOpen, label: 'Registers', show: true },
          { href: `/${lang}/dashboard/helpdesk`, icon: AlertCircle, label: 'Helpdesk', show: true },
          { href: `/${lang}/dashboard/municipal-letters`, icon: Printer, label: 'Letters', show: true },
        ].filter(i => i.show)
      }
    }

    return [
      coreWorkspaceGroup,
      operationsGroup,
      specializedDeskGroup
    ]
  }, [lang, capabilities, isAdmin, orgType])

  const visibleGroups = useMemo(() =>
    groups
      .map(g => ({ ...g, items: g.items.filter(i => i.show) }))
      .filter(g => g.items.length > 0),
    [groups]
  )

  const hasActiveGroup = useActiveGroup(pathname, visibleGroups)

  const autoCollapsed = useMemo(() => {
    const init: Record<string, boolean> = {}
    for (const g of visibleGroups) {
      init[g.id] = false // Keep primary groups open for easy 1-tap navigation
    }
    return init
  }, [visibleGroups])

  const [userToggles, setUserToggles] = useState<Record<string, boolean>>({})

  const collapsed = useMemo(() => {
    const result = { ...autoCollapsed }
    for (const [id, val] of Object.entries(userToggles)) {
      if (id in result) result[id] = val
    }
    return result
  }, [autoCollapsed, userToggles])

  const toggleGroup = useCallback((id: string) => {
    setUserToggles(prev => {
      const isCurrentlyCollapsed = id in prev ? prev[id] : autoCollapsed[id]
      return { ...prev, [id]: !isCurrentlyCollapsed }
    })
  }, [autoCollapsed])

  const isActive = useCallback((href: string) => {
    if (href === `/${lang}/dashboard`) {
      return pathname === href
    }
    return pathname === href || pathname?.startsWith(href + '/')
  }, [pathname, lang])

  return (
    <nav className="flex-1 overflow-y-auto py-5 px-3 native-scroll-y" aria-label="Dashboard navigation">
      {visibleGroups.map((group) => {
        const isCollapsed = collapsed[group.id]
        return (
          <div key={group.id} className="mb-5">
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center justify-between w-full px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors group"
            >
              <span>{group.title}</span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-200 text-slate-500 group-hover:text-slate-950 dark:group-hover:text-white',
                  isCollapsed && '-rotate-90'
                )}
              />
            </button>

            {!isCollapsed && (
              <div className="mt-1 space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition-all',
                        active
                          ? 'bg-orange-50/90 text-orange-950 font-black border border-orange-300/80 shadow-2xs dark:bg-slate-800 dark:text-white dark:border-slate-700'
                          : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400')} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
