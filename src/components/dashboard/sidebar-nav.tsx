'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown, LayoutDashboard, Users, Settings, Megaphone,
  Calendar, CheckSquare, BarChart, Vote, Globe, Scale,
  AlertCircle, Wrench, Gift, Flag, Badge,
  HeartHandshake, Network, Landmark, ScrollText,
  GalleryVerticalEnd, Gavel, UserCog, DollarSign, FileText, UserCheck, HardHat,
  CalendarCheck, Printer, Zap, ShieldCheck, Smartphone, Database, AlertTriangle, Sparkles, Award, Radio, MessageSquare, CreditCard,
  FolderLock, BookOpen, Layers, Phone, BookOpenText, MapPinHouse, FileSignature
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
      title: 'Admin & Guardrails',
      items: [
        { href: `/${lang}/dashboard/documents`, icon: FolderLock, label: 'Document Vault', show: true },
        { href: `/${lang}/dashboard/registers`, icon: BookOpen, label: 'Statutory Registers', show: true },
        { href: `/${lang}/dashboard/reference-data`, icon: Layers, label: 'Master Reference Data', show: true },
        { href: `/${lang}/dashboard/billing`, icon: CreditCard, label: 'Billing & Plans', show: isAdmin },
        { href: `/${lang}/dashboard/automations`, icon: Zap, label: 'Automations', show: isAdmin },
        { href: `/${lang}/dashboard/audit`, icon: ShieldCheck, label: 'Audit & Guardrails', show: isAdmin },
        { href: `/${lang}/dashboard/transparency`, icon: Landmark, label: 'Transparency Ledger', show: true },
        { href: `/${lang}/dashboard/analytics`, icon: BarChart, label: 'Analytics', show: !!c.advanced_analytics && isAdmin },
        { href: `/${lang}/dashboard/roles`, icon: UserCog, label: 'Custom Roles', show: isAdmin },
        { href: `/${lang}/dashboard/settings`, icon: Settings, label: 'Settings', show: isAdmin },
      ].filter(i => i.show)
    }

    const fieldToolsGroup: NavGroup = {
      id: 'field_ops',
      title: 'Field & Grassroots',
      items: [
        { href: `/${lang}/dashboard/forms`, icon: Sparkles, label: 'Forms & Survey Studio', show: true },
        { href: `/${lang}/dashboard/communications`, icon: MessageSquare, label: 'Unified Communications', show: true },
        { href: `/${lang}/dashboard/channels`, icon: Radio, label: 'Master Channels & QR', show: true },
        { href: `/${lang}/dashboard/field-mode`, icon: Database, label: 'Offline Field Mode', show: true },
        { href: `/${lang}/dashboard/bot-simulator`, icon: Smartphone, label: 'Bot Simulator', show: true },
        { href: `/${lang}/dashboard/emergency-sos`, icon: AlertTriangle, label: 'Emergency SOS', show: true },
        { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Petitions & Campaigns', show: true },
        { href: `/${lang}/members/badge`, icon: Award, label: 'Verified Member Badges', show: true },
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
            { href: `/${lang}/dashboard/events`, icon: Calendar, label: 'Events', show: !!c.events },
          ].filter(i => i.show)
        },
        {
          id: 'student_body',
          title: 'Student Body',
          items: [
            { href: `/${lang}/dashboard/members`, icon: Users, label: 'Members', show: true },
            { href: `/${lang}/dashboard/induction`, icon: UserCheck, label: 'Induction Drive', show: true },
            { href: `/${lang}/dashboard/posts`, icon: Badge, label: 'Union Posts (पद)', show: true },
            { href: `/${lang}/dashboard/subgroups`, icon: Network, label: 'Committees', show: !!c.subgroups },
            { href: `/${lang}/dashboard/id-card`, icon: Award, label: 'Student IDs & Badges', show: true },
            { href: `/${lang}/dashboard/volunteers`, icon: HeartHandshake, label: 'Volunteers', show: !!c.volunteers },
          ].filter(i => i.show)
        },
        {
          id: 'governance',
          title: 'Governance & Ops',
          items: [
            { href: `/${lang}/dashboard/governance/proposals`, icon: ScrollText, label: 'Proposals', show: true },
            { href: `/${lang}/dashboard/memorandums`, icon: FileText, label: 'Gyapan & Memorandums', show: true },
            { href: `/${lang}/dashboard/letterhead`, icon: Printer, label: 'Official Letterhead', show: true },
            { href: `/${lang}/dashboard/rti-atr`, icon: FileText, label: 'RTI & ATR Assistant', show: true },
            { href: `/${lang}/dashboard/collaboration`, icon: Network, label: 'Joint Front & Collab', show: true },
            { href: `/${lang}/dashboard/elections`, icon: Vote, label: 'Elections', show: !!c.elections },
            { href: `/${lang}/dashboard/election-counting`, icon: Vote, label: 'Election Counting Desk', show: !!c.elections },
            { href: `/${lang}/dashboard/lyngdoh-compliance`, icon: Scale, label: 'Lyngdoh Audit', show: !!c.elections },
            { href: `/${lang}/dashboard/campus-campaigning`, icon: Megaphone, label: 'Campus Campaigning', show: true },
            { href: `/${lang}/dashboard/meetings`, icon: CalendarCheck, label: 'Meetings', show: !!c.meetings },
            { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Tasks', show: !!c.tasks },
            { href: `/${lang}/dashboard/financials`, icon: Landmark, label: 'Financials', show: true },
          ].filter(i => i.show)
        },
        fieldToolsGroup,
        {
          id: 'support',
          title: 'Student Services',
          items: [
            { href: `/${lang}/dashboard/hostel-mess`, icon: Wrench, label: 'Hostel & Mess Audit', show: true },
            { href: `/${lang}/dashboard/legal-aid`, icon: Scale, label: 'Legal Aid & Anti-Ragging', show: true },
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
            { href: `/${lang}/dashboard/events`, icon: Calendar, label: 'Events', show: !!c.events },
          ].filter(i => i.show)
        },
        {
          id: 'workforce',
          title: 'Workforce',
          items: [
            { href: `/${lang}/dashboard/members`, icon: Users, label: 'Members', show: true },
            { href: `/${lang}/dashboard/id-card`, icon: Award, label: 'Member IDs & Badges', show: true },
            { href: `/${lang}/dashboard/subgroups`, icon: Network, label: 'Local Branches', show: !!c.subgroups },
            { href: `/${lang}/dashboard/networks`, icon: Globe, label: 'Federation', show: !!c.federation_mode },
          ].filter(i => i.show)
        },
        {
          id: 'union_actions',
          title: 'Union Actions',
          items: [
            { href: `/${lang}/dashboard/cba`, icon: FileText, label: 'CBA Documents', show: !!c.cba_documents },
            { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Campaigns & Petitions', show: true },
            { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Strike Votes & Polls', show: !!c.voting_engine },
            { href: `/${lang}/dashboard/jobs`, icon: HardHat, label: 'Worker Dispatch', show: !!c.jobs },
            { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Tasks', show: !!c.tasks },
            { href: `/${lang}/dashboard/dues`, icon: Landmark, label: 'Union Dues', show: !!c.dues },
            { href: `/${lang}/dashboard/meetings`, icon: CalendarCheck, label: 'Meetings', show: !!c.meetings },
          ].filter(i => i.show)
        },
        fieldToolsGroup,
        {
          id: 'legal',
          title: 'Legal & Support',
          items: [
            { href: `/${lang}/dashboard/grievances`, icon: Scale, label: 'Grievances', show: !!c.grievances },
            { href: `/${lang}/dashboard/helpdesk`, icon: AlertCircle, label: 'Helpdesk', show: true },
            { href: `/${lang}/dashboard/compliance`, icon: ScrollText, label: 'Compliance Tracker', show: !!c.compliance },
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
            { href: `/${lang}/dashboard/events`, icon: Calendar, label: 'Community Events', show: !!c.events },
          ].filter(i => i.show)
        },
        {
          id: 'residents',
          title: 'Community',
          items: [
            { href: `/${lang}/dashboard/members`, icon: Users, label: 'Residents', show: true },
            { href: `/${lang}/dashboard/id-card`, icon: Award, label: 'Resident IDs', show: true },
            { href: `/${lang}/dashboard/subgroups`, icon: Network, label: 'Committees', show: !!c.subgroups },
            { href: `/${lang}/dashboard/visitors`, icon: UserCheck, label: 'Visitor Logs', show: !!c.visitors },
          ].filter(i => i.show)
        },
        {
          id: 'estate_ops',
          title: 'Estate Ops',
          items: [
            { href: `/${lang}/dashboard/maintenance`, icon: Wrench, label: 'Maintenance', show: !!c.maintenance },
            { href: `/${lang}/dashboard/facilities`, icon: Calendar, label: 'Facility Booking', show: true },
            { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Tasks', show: !!c.tasks },
            { href: `/${lang}/dashboard/financials`, icon: Landmark, label: 'Financials & Bills', show: true },
            { href: `/${lang}/dashboard/meetings`, icon: CalendarCheck, label: 'Meetings', show: !!c.meetings },
          ].filter(i => i.show)
        },
        {
          id: 'colony_utilities',
          title: 'Colony Utilities',
          items: [
            { href: `/${lang}/dashboard/chanda`, icon: BookOpenText, label: 'Chanda Ledger (चंदा)', show: true },
            { href: `/${lang}/dashboard/tenant-verification`, icon: FileSignature, label: 'Tenant Verification', show: true },
            { href: `/${lang}/dashboard/municipal-letters`, icon: Printer, label: 'Municipal Letters', show: true },
            { href: `/${lang}/dashboard/local-directory`, icon: Phone, label: 'Local Directory', show: true },
          ].filter(i => i.show)
        },
        fieldToolsGroup,
        {
          id: 'governance_support',
          title: 'Governance & Support',
          items: [
            { href: `/${lang}/dashboard/governance/proposals`, icon: ScrollText, label: 'Proposals', show: true },
            { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Polls & Elections', show: !!c.elections },
            { href: `/${lang}/dashboard/complaints`, icon: AlertCircle, label: 'Complaints', show: !!c.complaints },
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
          { href: `/${lang}/dashboard/events`, icon: Calendar, label: 'Events', show: !!c.events },
        ].filter(i => i.show)
      },
      {
        id: 'people',
        title: 'People & Members',
        items: [
          { href: `/${lang}/dashboard/members`, icon: Users, label: 'Members', show: true },
          { href: `/${lang}/dashboard/id-card`, icon: Award, label: 'Member Badges', show: true },
          { href: `/${lang}/dashboard/subgroups`, icon: Network, label: 'Teams & Committees', show: !!c.subgroups },
          { href: `/${lang}/dashboard/volunteers`, icon: HeartHandshake, label: 'Volunteers', show: !!c.volunteers },
          { href: `/${lang}/dashboard/networks`, icon: Globe, label: 'Networks', show: !!c.federation_mode },
        ].filter(i => i.show)
      },
      {
        id: 'governance',
        title: 'Governance & Ops',
        items: [
          { href: `/${lang}/dashboard/governance/proposals`, icon: ScrollText, label: 'Proposals', show: true },
          { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Voting & Decisions', show: !!c.voting_engine },
          { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Tasks', show: !!c.tasks },
          { href: `/${lang}/dashboard/meetings`, icon: CalendarCheck, label: 'Meetings', show: !!c.meetings },
          { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Petitions & Campaigns', show: true },
          { href: `/${lang}/dashboard/financials`, icon: Landmark, label: 'Financial Ledger', show: true },
          { href: `/${lang}/dashboard/donations`, icon: Gift, label: 'Donations', show: !!c.donations },
          { href: `/${lang}/dashboard/grants`, icon: DollarSign, label: 'Grants & Matcher', show: true },
        ].filter(i => i.show)
      },
      fieldToolsGroup,
      {
        id: 'support_compliance',
        title: 'Support & Compliance',
        items: [
          { href: `/${lang}/dashboard/helpdesk`, icon: AlertCircle, label: 'Helpdesk', show: true },
          { href: `/${lang}/dashboard/compliance`, icon: ScrollText, label: 'Compliance Tracker', show: !!c.compliance },
          { href: `/${lang}/dashboard/compliance/bqf-verification`, icon: ShieldCheck, label: 'BQF AI Verification', show: true },
          { href: `/${lang}/dashboard/municipal-letters`, icon: Printer, label: 'Govt & Civic Letters', show: true },
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
    setUserToggles(prev => {
      const isCurrentlyCollapsed = id in prev ? prev[id] : autoCollapsed[id]
      return { ...prev, [id]: !isCurrentlyCollapsed }
    })
  }, [autoCollapsed])

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
              className="flex items-center justify-between w-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors group"
            >
              <span>{group.title}</span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-200 text-slate-400 group-hover:text-slate-900',
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
                        'flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all',
                        active
                          ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-100/80 shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
                      )}
                    >
                      <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-indigo-600' : 'text-slate-400')} />
                      <span className="truncate">{item.label}</span>
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
