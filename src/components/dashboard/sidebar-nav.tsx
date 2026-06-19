'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown, LayoutDashboard, Users, Settings, Megaphone,
  Calendar, CheckSquare, BarChart, Vote, Globe, Scale,
  AlertCircle, Wrench, Gift, FileText, Flag, Badge,
  HeartHandshake, Network, Shield, Landmark, ScrollText,
  GalleryVerticalEnd, Gavel, UserCog
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

export function SidebarNav({ lang, isAdmin, capabilities }: SidebarNavProps) {
  const pathname = usePathname()

  const groups: NavGroup[] = useMemo(() => [
    {
      id: 'core',
      title: 'Core',
      items: [
        { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: 'Overview', show: true },
        { href: `/${lang}/dashboard/governance/proposals`, icon: ScrollText, label: 'Governance', show: true },
        { href: `/${lang}/dashboard/announcements`, icon: Megaphone, label: 'Announcements', show: true },
        { href: `/${lang}/dashboard/events`, icon: Calendar, label: 'Events', show: true },
        { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Tasks', show: true },
        { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Decisions', show: true },
        { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Campaigns', show: !!capabilities.campaigns },
      ]
    },
    {
      id: 'governance',
      title: 'Governance',
      items: [
        { href: `/${lang}/dashboard/governance/proposals`, icon: Gavel, label: 'Proposals', show: true },
        { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Voting & Resolutions', show: true },
      ]
    },
    {
      id: 'people',
      title: 'People',
      items: [
        { href: `/${lang}/dashboard/members`, icon: Users, label: 'Members', show: true },
        { href: `/${lang}/dashboard/subgroups`, icon: Network, label: 'Teams & Committees', show: true },
        { href: `/${lang}/dashboard/volunteers`, icon: HeartHandshake, label: 'Volunteers', show: !!capabilities.volunteers },
        { href: `/${lang}/dashboard/student-ids`, icon: Badge, label: 'Student IDs', show: !!capabilities.student_ids },
        { href: `/${lang}/dashboard/networks`, icon: Globe, label: 'Networks', show: !!capabilities.federation_mode },
      ]
    },
    {
      id: 'operations',
      title: 'Operations',
      items: [
        { href: `/${lang}/dashboard/financials`, icon: Landmark, label: 'Financial Ledger', show: true },
        { href: `/${lang}/dashboard/grievances`, icon: Scale, label: 'Grievances', show: !!capabilities.grievances },
        { href: `/${lang}/dashboard/complaints`, icon: AlertCircle, label: 'Complaints', show: !!capabilities.complaints },
        { href: `/${lang}/dashboard/maintenance`, icon: Wrench, label: 'Maintenance', show: !!capabilities.maintenance },
        { href: `/${lang}/dashboard/donations`, icon: Gift, label: 'Donations', show: !!capabilities.donations },
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
  ], [lang, isAdmin, capabilities])

  const visibleGroups = useMemo(() =>
    groups
      .map(g => ({ ...g, items: g.items.filter(i => i.show) }))
      .filter(g => g.items.length > 0),
    [groups]
  )

  const hasActiveGroup = useActiveGroup(pathname, visibleGroups)

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    for (const g of visibleGroups) {
      init[g.id] = !(g.id === 'core')
    }
    return init
  })

  useEffect(() => {
    setCollapsed(prev => {
      const next = { ...prev }
      for (const g of visibleGroups) {
        const shouldBeOpen = g.id === 'core' || hasActiveGroup[g.id]
        if (next[g.id] === shouldBeOpen) continue
        next[g.id] = !shouldBeOpen
      }
      return next
    })
  }, [hasActiveGroup, visibleGroups])

  const toggleGroup = useCallback((id: string) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }))
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
