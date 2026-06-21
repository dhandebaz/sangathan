'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown, LayoutDashboard, Users, Settings, Megaphone,
  Calendar, CheckSquare, BarChart, Vote, Globe, Scale,
  AlertCircle, Wrench, Gift, Flag, Badge,
  HeartHandshake, Network, Landmark, ScrollText,
  GalleryVerticalEnd, Gavel, UserCog, DollarSign, FileText, UserCheck, HardHat
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

  const groups: NavGroup[] = useMemo(() => {
    const c = capabilities
    const adminGroup: NavGroup = {
      id: 'admin',
      title: 'Admin',
      items: [
        { href: `/${lang}/dashboard/analytics`, icon: BarChart, label: 'Analytics', show: !!c.advanced_analytics && isAdmin },
        { href: `/${lang}/dashboard/forms`, icon: GalleryVerticalEnd, label: 'Forms', show: isAdmin },
        { href: `/${lang}/dashboard/roles`, icon: UserCog, label: 'Custom Roles', show: isAdmin },
        { href: `/${lang}/dashboard/settings`, icon: Settings, label: 'Settings', show: isAdmin },
      ].filter(i => i.show)
    }

    if (orgType === 'student_union') {
      return [
        {
          id: 'overview',
          title: 'Overview',
          items: [
            { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: 'Dashboard', show: true },
            { href: `/${lang}/dashboard/announcements`, icon: Megaphone, label: 'Announcements', show: true },
            { href: `/${lang}/dashboard/events`, icon: Calendar, label: 'Events', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'student_body',
          title: 'Student Body',
          items: [
            { href: `/${lang}/dashboard/members`, icon: Users, label: 'Members', show: true },
            { href: `/${lang}/dashboard/subgroups`, icon: Network, label: 'Committees', show: true },
            { href: `/${lang}/dashboard/id-card`, icon: Badge, label: 'Student IDs', show: !!c.student_ids },
            { href: `/${lang}/dashboard/volunteers`, icon: HeartHandshake, label: 'Volunteers', show: !!c.volunteers },
          ].filter(i => i.show)
        },
        {
          id: 'governance',
          title: 'Governance & Ops',
          items: [
            { href: `/${lang}/dashboard/governance/proposals`, icon: ScrollText, label: 'Proposals', show: true },
            { href: `/${lang}/dashboard/elections`, icon: Vote, label: 'Elections', show: true },
            { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Campaigns', show: !!c.campaigns },
            { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Tasks', show: true },
            { href: `/${lang}/dashboard/financials`, icon: Landmark, label: 'Financials', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'support',
          title: 'Student Services',
          items: [
            { href: `/${lang}/dashboard/helpdesk`, icon: AlertCircle, label: 'Helpdesk', show: true },
            { href: `/${lang}/dashboard/grievances`, icon: Scale, label: 'Grievances', show: !!c.grievances },
            { href: `/${lang}/dashboard/appeals`, icon: ScrollText, label: 'Appeals', show: isAdmin },
          ].filter(i => i.show)
        },
        adminGroup
      ]
    }

    if (orgType === 'workers_union') {
      return [
        {
          id: 'overview',
          title: 'Overview',
          items: [
            { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: 'Dashboard', show: true },
            { href: `/${lang}/dashboard/announcements`, icon: Megaphone, label: 'Announcements', show: true },
            { href: `/${lang}/dashboard/events`, icon: Calendar, label: 'Events', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'workforce',
          title: 'Workforce',
          items: [
            { href: `/${lang}/dashboard/members`, icon: Users, label: 'Members', show: true },
            { href: `/${lang}/dashboard/subgroups`, icon: Network, label: 'Local Branches', show: true },
            { href: `/${lang}/dashboard/networks`, icon: Globe, label: 'Federation', show: !!c.federation_mode },
          ].filter(i => i.show)
        },
        {
          id: 'union_actions',
          title: 'Union Actions',
          items: [
            { href: `/${lang}/dashboard/cba`, icon: FileText, label: 'CBA Documents', show: true },
            { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Campaigns', show: !!c.campaigns },
            { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Strike Votes & Polls', show: true },
            { href: `/${lang}/dashboard/jobs`, icon: HardHat, label: 'Worker Dispatch', show: true },
            { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Tasks', show: true },
            { href: `/${lang}/dashboard/dues`, icon: Landmark, label: 'Union Dues', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'legal',
          title: 'Legal & Support',
          items: [
            { href: `/${lang}/dashboard/grievances`, icon: Scale, label: 'Grievances', show: true },
            { href: `/${lang}/dashboard/helpdesk`, icon: AlertCircle, label: 'Helpdesk', show: true },
            { href: `/${lang}/dashboard/compliance`, icon: ScrollText, label: 'Compliance Tracker', show: isAdmin },
          ].filter(i => i.show)
        },
        adminGroup
      ]
    }

    if (orgType === 'rwa') {
      return [
        {
          id: 'overview',
          title: 'Overview',
          items: [
            { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: 'Dashboard', show: true },
            { href: `/${lang}/dashboard/announcements`, icon: Megaphone, label: 'Notice Board', show: true },
            { href: `/${lang}/dashboard/events`, icon: Calendar, label: 'Community Events', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'residents',
          title: 'Community',
          items: [
            { href: `/${lang}/dashboard/members`, icon: Users, label: 'Residents', show: true },
            { href: `/${lang}/dashboard/subgroups`, icon: Network, label: 'Committees', show: true },
            { href: `/${lang}/dashboard/visitors`, icon: UserCheck, label: 'Visitor Logs', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'estate_ops',
          title: 'Estate Ops',
          items: [
            { href: `/${lang}/dashboard/maintenance`, icon: Wrench, label: 'Maintenance', show: true },
            { href: `/${lang}/dashboard/facilities`, icon: Calendar, label: 'Facility Booking', show: true },
            { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Tasks', show: true },
            { href: `/${lang}/dashboard/financials`, icon: Landmark, label: 'Financials & Bills', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'governance_support',
          title: 'Governance & Support',
          items: [
            { href: `/${lang}/dashboard/governance/proposals`, icon: ScrollText, label: 'Proposals', show: true },
            { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Polls & Elections', show: true },
            { href: `/${lang}/dashboard/complaints`, icon: AlertCircle, label: 'Complaints', show: true },
          ].filter(i => i.show)
        },
        adminGroup
      ]
    }

    if (orgType === 'political_party') {
      return [
        {
          id: 'overview',
          title: 'Overview',
          items: [
            { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: 'Dashboard', show: true },
            { href: `/${lang}/dashboard/announcements`, icon: Megaphone, label: 'Announcements', show: true },
            { href: `/${lang}/dashboard/events`, icon: Calendar, label: 'Rallies & Events', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'people',
          title: 'Party Cadre',
          items: [
            { href: `/${lang}/dashboard/members`, icon: Users, label: 'Members', show: true },
            { href: `/${lang}/dashboard/subgroups`, icon: Network, label: 'Wings & Cells', show: true },
            { href: `/${lang}/dashboard/volunteers`, icon: HeartHandshake, label: 'Volunteers', show: !!c.volunteers },
            { href: `/${lang}/dashboard/networks`, icon: Globe, label: 'Networks', show: !!c.federation_mode },
          ].filter(i => i.show)
        },
        {
          id: 'campaigns',
          title: 'Operations',
          items: [
            { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Campaigns', show: !!c.campaigns },
            { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Tasks', show: true },
            { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Internal Voting', show: true },
            { href: `/${lang}/dashboard/financials`, icon: Landmark, label: 'Party Funds', show: true },
            { href: `/${lang}/dashboard/donations`, icon: Gift, label: 'Donations', show: !!c.donations },
          ].filter(i => i.show)
        },
        {
          id: 'support',
          title: 'Support',
          items: [
            { href: `/${lang}/dashboard/helpdesk`, icon: AlertCircle, label: 'Helpdesk', show: true },
            { href: `/${lang}/dashboard/grievances`, icon: Scale, label: 'Grievances', show: !!c.grievances },
          ].filter(i => i.show)
        },
        adminGroup
      ]
    }

    // Default / NGO
    return [
      {
        id: 'overview',
        title: 'Overview',
        items: [
          { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: 'Overview', show: true },
          { href: `/${lang}/dashboard/announcements`, icon: Megaphone, label: 'Announcements', show: true },
          { href: `/${lang}/dashboard/events`, icon: Calendar, label: 'Events', show: true },
        ].filter(i => i.show)
      },
      {
        id: 'people',
        title: 'People & Members',
        items: [
          { href: `/${lang}/dashboard/members`, icon: Users, label: 'Members', show: true },
          { href: `/${lang}/dashboard/subgroups`, icon: Network, label: 'Teams & Committees', show: true },
          { href: `/${lang}/dashboard/volunteers`, icon: HeartHandshake, label: 'Volunteers', show: !!c.volunteers },
          { href: `/${lang}/dashboard/networks`, icon: Globe, label: 'Networks', show: !!c.federation_mode },
        ].filter(i => i.show)
      },
      {
        id: 'governance',
        title: 'Governance & Ops',
        items: [
          { href: `/${lang}/dashboard/governance/proposals`, icon: ScrollText, label: 'Proposals', show: true },
          { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Voting & Decisions', show: true },
          { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Tasks', show: true },
          { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Campaigns', show: !!c.campaigns },
          { href: `/${lang}/dashboard/financials`, icon: Landmark, label: 'Financial Ledger', show: true },
          { href: `/${lang}/dashboard/donations`, icon: Gift, label: 'Donations', show: !!c.donations },
          { href: `/${lang}/dashboard/grants`, icon: DollarSign, label: 'Grants', show: true },
        ].filter(i => i.show)
      },
      {
        id: 'support_compliance',
        title: 'Support & Compliance',
        items: [
          { href: `/${lang}/dashboard/helpdesk`, icon: AlertCircle, label: 'Helpdesk', show: true },
          { href: `/${lang}/dashboard/compliance`, icon: ScrollText, label: 'Compliance Tracker', show: isAdmin },
        ].filter(i => i.show)
      },
      adminGroup
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

  const handleMouseEnter = useCallback((id: string) => {
    setUserToggles(prev => ({ ...prev, [id]: false }))
  }, [])

  const handleMouseLeave = useCallback((id: string) => {
    setUserToggles(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const isActive = useCallback((href: string) => {
    return pathname === href || pathname?.startsWith(href + '/')
  }, [pathname])

  return (
    <nav className="flex-1 overflow-y-auto py-6 px-3 native-scroll-y" aria-label="Dashboard navigation">
      {visibleGroups.map((group) => {
        const isCollapsed = collapsed[group.id]
        return (
          <div 
            key={group.id} 
            className="mb-5"
            onMouseEnter={() => handleMouseEnter(group.id)}
            onMouseLeave={() => handleMouseLeave(group.id)}
          >
            <button
              onClick={() => toggleGroup(group.id)}
              className={cn(
                "flex w-full items-center justify-between px-3 py-1.5 text-xs font-bold",
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
                          "group relative flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-all duration-150",
                          active
                            ? "bg-sidebar-bg-active text-sidebar-fg-active"
                            : "text-sidebar-fg hover:bg-accent hover:text-foreground"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-500 rounded-sm" />
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
