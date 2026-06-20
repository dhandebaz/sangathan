'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown, LayoutDashboard, Users, Settings, Megaphone,
  Calendar, CheckSquare, BarChart, Vote, Globe, Scale,
  AlertCircle, Wrench, Gift, Flag, Badge,
  HeartHandshake, Network, Landmark, ScrollText,
  GalleryVerticalEnd, Gavel, UserCog, DollarSign, FileText, UserCheck
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
        item => pathname === item.href || pathname?.startsWith(item.href + '/')
      )
    }
    return active
  }, [pathname, groups])
}

export function SidebarNav({ lang, isAdmin, capabilities, orgType }: SidebarNavProps) {
  const pathname = usePathname()

  const groups: NavGroup[] = useMemo(() => [
    {
      id: 'overview',
      title: 'Overview',
      items: [
        { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: 'Overview', show: true },
        { href: `/${lang}/dashboard/announcements`, icon: Megaphone, label: 'Announcements', show: true },
        { href: `/${lang}/dashboard/events`, icon: Calendar, label: 'Events', show: true },
      ]
    },
    {
      id: 'people',
      title: 'People & Members',
      items: [
        { href: `/${lang}/dashboard/members`, icon: Users, label: 'Members', show: true },
        { href: `/${lang}/dashboard/subgroups`, icon: Network, label: 'Teams & Committees', show: true },
        { href: `/${lang}/dashboard/volunteers`, icon: HeartHandshake, label: 'Volunteers', show: !!capabilities.volunteers },
        { href: `/${lang}/dashboard/student-ids`, icon: Badge, label: 'Student IDs', show: !!capabilities.student_ids },
        { href: `/${lang}/dashboard/networks`, icon: Globe, label: 'Networks', show: !!capabilities.federation_mode },
      ]
    },
    {
      id: 'governance',
      title: 'Governance & Operations',
      items: [
        { href: `/${lang}/dashboard/governance/proposals`, icon: ScrollText, label: 'Proposals', show: true },
        { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Voting & Decisions', show: true },
        { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Tasks', show: true },
        { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Campaigns', show: !!capabilities.campaigns },
        { href: `/${lang}/dashboard/financials`, icon: Landmark, label: 'Financial Ledger', show: true },
        { href: `/${lang}/dashboard/donations`, icon: Gift, label: 'Donations', show: !!capabilities.donations },
        { href: `/${lang}/dashboard/grants`, icon: DollarSign, label: 'Grants', show: orgType === 'ngo' },
      ]
    },
    {
      id: 'support_compliance',
      title: orgType === 'workers_union' ? 'Grievances & Legal' :
             orgType === 'rwa' ? 'Maintenance & Compliance' :
             orgType === 'student_union' ? 'Support & Guidelines' :
             'Support & Compliance',
      items: [
        { 
          href: `/${lang}/dashboard/helpdesk`, 
          icon: orgType === 'workers_union' ? Scale : orgType === 'rwa' ? Wrench : AlertCircle, 
          label: orgType === 'workers_union' ? 'Grievances' : orgType === 'rwa' ? 'Maintenance' : 'Helpdesk', 
          show: !!capabilities.grievances || !!capabilities.complaints || !!capabilities.maintenance || true // We can show it by default or based on a common capability
        },
        { href: `/${lang}/dashboard/cba`, icon: FileText, label: 'CBA Documents', show: orgType === 'workers_union' },
        { href: `/${lang}/dashboard/visitors`, icon: UserCheck, label: 'Visitors', show: orgType === 'rwa' },
        { href: `/${lang}/dashboard/compliance`, icon: ScrollText, label: 'Compliance Tracker', show: isAdmin },
      ]
    },
    {
      id: 'admin',
      title: 'Admin',
      items: [
        { href: `/${lang}/dashboard/analytics`, icon: BarChart, label: 'Analytics', show: !!capabilities.advanced_analytics && isAdmin },
        { href: `/${lang}/dashboard/forms`, icon: GalleryVerticalEnd, label: 'Forms', show: isAdmin },
        { href: `/${lang}/dashboard/roles`, icon: UserCog, label: 'Custom Roles', show: isAdmin },
        { href: `/${lang}/dashboard/settings`, icon: Settings, label: 'Settings', show: isAdmin },
      ]
    }
  ], [lang, isAdmin, capabilities, orgType])

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
      init[g.id] = !(g.id === 'overview' || hasActiveGroup[g.id])
    }
    return init
  }, [visibleGroups, hasActiveGroup])

  const [userToggles, setUserToggles] = useState<Record<string, boolean>>({})

  const collapsed = useMemo(() => {
    const result = { ...autoCollapsed }
    for (const [id, val] of Object.entries(userToggles)) {
      if (id in result) result[id] = val
    }
    return result
  }, [autoCollapsed, userToggles])

  const toggleGroup = useCallback((id: string) => {
    setUserToggles(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const isActive = useCallback((href: string) => {
    return pathname === href || pathname?.startsWith(href + '/')
  }, [pathname])

  return (
    <nav className="flex-1 overflow-y-auto py-6 px-3 native-scroll-y" aria-label="Dashboard navigation">
      {visibleGroups.map((group) => {
        const isCollapsed = collapsed[group.id]
        return (
          <div key={group.id} className="mb-5">
            <button
              onClick={() => toggleGroup(group.id)}
              className={cn(
                "flex w-full items-center justify-between px-3 py-1.5 text-xs font-semibold tracking-wider",
                "text-sidebar-fg/60 hover:text-sidebar-fg transition-colors"
              )}
              aria-expanded={!isCollapsed}
            >
              {group.title}
              <ChevronDown className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                !isCollapsed && "rotate-180"
              )} />
            </button>

            <div
              className={cn(
                "grid transition-all duration-250 ease-in-out",
                isCollapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
              )}
            >
              <div className="overflow-hidden">
                <div className="mt-1 space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                          active
                            ? "bg-sidebar-bg-active text-sidebar-fg-active"
                            : "text-sidebar-fg hover:bg-accent hover:text-foreground"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-500 rounded-full" />
                        )}
                        <item.icon className={cn(
                          "w-4.5 h-4.5 shrink-0 transition-colors",
                          active ? "text-brand-600" : "text-sidebar-fg/60 group-hover:text-sidebar-fg"
                        )} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </nav>
  )
}
