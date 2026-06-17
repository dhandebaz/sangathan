'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, LayoutDashboard, Users, Settings, Megaphone, Calendar, CheckSquare, BarChart, Vote, Globe, Scale, AlertCircle, Wrench, Gift, FileText, Flag, Badge, HeartHandshake, Network, Shield } from 'lucide-react'
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

  const groups: NavGroup[] = [
    {
      id: 'core',
      title: 'Core',
      items: [
        { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: 'Overview', show: true },
        { href: `/${lang}/dashboard/announcements`, icon: Megaphone, label: 'Announcements', show: true },
        { href: `/${lang}/dashboard/events`, icon: Calendar, label: 'Events', show: true },
        { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Tasks', show: true },
        { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Decisions', show: true },
        { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Campaigns', show: !!capabilities.campaigns },
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
  ]

  // Filter out empty groups and hidden items
  const visibleGroups = groups.map(group => ({
    ...group,
    items: group.items.filter(i => i.show)
  })).filter(group => group.items.length > 0)

  // Auto-expand groups containing the current path
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {}
    visibleGroups.forEach(g => {
      initialState[g.id] = g.id === 'core' // Always open 'core' by default
    })
    return initialState
  })

  // Open group if active route is inside it
  useEffect(() => {
    if (!pathname) return
    let matchedId = ''
    visibleGroups.forEach(g => {
      if (g.items.some(item => pathname === item.href || pathname.startsWith(item.href + '/'))) {
        matchedId = g.id
      }
    })
    if (matchedId) {
      setOpenGroups(prev => ({ ...prev, [matchedId]: true }))
    }
  }, [pathname])

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      {visibleGroups.map((group) => (
        <div key={group.id} className="mb-2">
          <button
            onClick={() => toggleGroup(group.id)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            {group.title}
            <ChevronDown className={cn("h-4 w-4 transition-transform", openGroups[group.id] ? "rotate-180" : "")} />
          </button>
          
          <div className={cn("mt-1 space-y-0.5 overflow-hidden transition-all duration-200", openGroups[group.id] ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex min-h-9 items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors",
                    isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-[18px] h-[18px] transition-colors", isActive ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600")} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
