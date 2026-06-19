'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, LayoutDashboard, Users, Settings, Megaphone, Calendar, CheckSquare, BarChart, Vote, Globe, Scale, AlertCircle, Wrench, Gift, FileText, Flag, Badge, HeartHandshake, Network, Shield, Landmark } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarNavProps {
  lang: string
  isAdmin: boolean
  capabilities: Record<string, boolean>
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

export function SidebarNav({ lang, isAdmin, capabilities }: SidebarNavProps) {
  const pathname = usePathname()

  const groups: NavGroup[] = useMemo(() => [
    {
      id: 'core',
      title: 'Core',
      items: [
        { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: 'Overview', show: true },
        { href: `/${lang}/dashboard`, icon: Landmark, label: 'Governance 2.0', show: true },
        { href: `/${lang}/dashboard/announcements`, icon: Megaphone, label: 'Announcements', show: true },
        { href: `/${lang}/dashboard/events`, icon: Calendar, label: 'Events', show: true },
        { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Tasks', show: true },
        { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Decisions', show: true },
        { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Campaigns', show: !!capabilities.campaigns },
      ]
    },
    {
      id: 'governance',
      title: 'Democratic Process',
      items: [
        { href: `/${lang}/dashboard/governance/proposals`, icon: FileText, label: 'Proposals & Deliberation', show: true },
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
      title: 'Admin & System',
      items: [
        { href: `/${lang}/dashboard/analytics`, icon: BarChart, label: 'Analytics', show: !!capabilities.advanced_analytics && isAdmin },
        { href: `/${lang}/dashboard/forms`, icon: FileText, label: 'Forms', show: isAdmin },
        { href: `/${lang}/dashboard/roles`, icon: Shield, label: 'Custom Roles', show: isAdmin },
        { href: `/${lang}/dashboard/settings`, icon: Settings, label: 'Settings', show: isAdmin },
      ]
    }
  ], [lang, isAdmin, capabilities])

  // Filter out empty groups and hidden items
  const visibleGroups = useMemo(() => groups.map(group => ({
    ...group,
    items: group.items.filter(i => i.show)
  })).filter(group => group.items.length > 0), [groups])

  // Track user toggled state
  const [userToggledGroups, setUserToggledGroups] = useState<Record<string, boolean>>({})

  // Determine which groups are open: manually toggled OR contains active path
  const openGroups = useMemo(() => {
    const state: Record<string, boolean> = {}
    visibleGroups.forEach(g => {
      // Default open logic
      const isAutoOpen = g.id === 'core' || g.id === 'governance' ||
        g.items.some(item => pathname === item.href || pathname?.startsWith(item.href + '/'))

      // Merge with user toggles (user preference wins if set)
      state[g.id] = userToggledGroups[g.id] !== undefined ? userToggledGroups[g.id] : isAutoOpen
    })
    return state
  }, [visibleGroups, pathname, userToggledGroups])

  const toggleGroup = (id: string) => {
    setUserToggledGroups(prev => ({ ...prev, [id]: !openGroups[id] }))
  }

  return (
    <div className="flex-1 py-5 px-4 overflow-y-auto native-scroll-y">
      {visibleGroups.map((group) => (
        <section key={group.id} className="mb-4 overflow-hidden rounded-3xl border border-slate-200 bg-card shadow-sm">
          <button
            onClick={() => toggleGroup(group.id)}
            className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 transition-colors hover:bg-slate-50"
          >
            {group.title}
            <ChevronDown className={cn("h-4 w-4 transition-transform", openGroups[group.id] ? "rotate-180" : "")} />
          </button>

          <div className={cn("space-y-1 overflow-hidden transition-all duration-300", openGroups[group.id] ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex min-h-11 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-brand-50 text-brand-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600")} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
