'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown, LayoutDashboard, Users, Settings, Megaphone,
  Calendar, CheckSquare, BarChart, Vote, Globe, Scale,
  AlertCircle, Wrench, Gift, Flag, Badge,
  HeartHandshake, Network, Landmark, ScrollText,
  UserCog, DollarSign, FileText, UserCheck, HardHat,
  CalendarCheck, Printer, Zap, ShieldCheck, Smartphone, Database, AlertTriangle, Sparkles, Award, Radio, MessageSquare, CreditCard,
  FolderLock, BookOpen, Layers, Phone, BookOpenText, FileSignature,
  Activity, Clock, Newspaper, HandCoins
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

    // 1. Universal Core Operations Hub (Same for all Org Types)
    const coreOperationsGroup: NavGroup = {
      id: 'core_hubs',
      title: 'Core Workspace',
      items: [
        { href: `/${lang}/dashboard`, icon: LayoutDashboard, label: 'Dashboard', show: true },
        { href: `/${lang}/dashboard/inbox`, icon: MessageSquare, label: 'Inbox & Dispatch', show: true },
        { href: `/${lang}/dashboard/calendar`, icon: Calendar, label: 'Calendar & Sync', show: true },
        { href: `/${lang}/dashboard/people`, icon: Users, label: orgType === 'rwa' ? 'Residents & People' : 'People & Members', show: true },
        { href: `/${lang}/dashboard/forms`, icon: Sparkles, label: 'Forms & Surveys', show: true },
      ].filter(i => i.show)
    }

    // 2. Admin & Guardrails Vault (Clean & Consolidated)
    const adminVaultGroup: NavGroup = {
      id: 'admin_vault',
      title: 'Admin & Vault',
      items: [
        { href: `/${lang}/dashboard/documents`, icon: FolderLock, label: 'Document Vault', show: true },
        { href: `/${lang}/dashboard/registers`, icon: BookOpen, label: 'Statutory Registers', show: true },
        { href: `/${lang}/dashboard/transparency`, icon: Landmark, label: 'Transparency Ledger', show: true },
        { href: `/${lang}/dashboard/automations`, icon: Zap, label: 'Automations', show: isAdmin },
        { href: `/${lang}/dashboard/audit`, icon: ShieldCheck, label: 'Audit & Guardrails', show: isAdmin },
        { href: `/${lang}/dashboard/analytics`, icon: BarChart, label: 'Analytics', show: !!c.advanced_analytics && isAdmin },
        { href: `/${lang}/dashboard/billing`, icon: CreditCard, label: 'Billing & Plans', show: isAdmin },
        { href: `/${lang}/dashboard/roles`, icon: UserCog, label: 'Custom Roles', show: isAdmin },
        { href: `/${lang}/dashboard/settings`, icon: Settings, label: 'Settings', show: isAdmin },
      ].filter(i => i.show)
    }

    // --- STUDENT UNION ---
    if (orgType === 'student_union') {
      return [
        coreOperationsGroup,
        {
          id: 'student_governance',
          title: 'Union Ops & Governance',
          items: [
            { href: `/${lang}/dashboard/posts`, icon: Badge, label: 'Union Posts (पद)', show: true },
            { href: `/${lang}/dashboard/induction`, icon: UserCheck, label: 'Induction Drive', show: true },
            { href: `/${lang}/dashboard/campus-campaigning`, icon: Megaphone, label: 'Campus Campaigning', show: true },
            { href: `/${lang}/dashboard/memorandums`, icon: FileText, label: 'Gyapan & Memorandums', show: true },
            { href: `/${lang}/dashboard/letterhead`, icon: Printer, label: 'Official Letterhead', show: true },
            { href: `/${lang}/dashboard/rti-atr`, icon: FileText, label: 'RTI & ATR Assistant', show: true },
            { href: `/${lang}/dashboard/elections`, icon: Vote, label: 'Union Elections', show: !!c.elections },
            { href: `/${lang}/dashboard/lyngdoh-compliance`, icon: Scale, label: 'Lyngdoh Audit Desk', show: !!c.elections },
            { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Action Tasks', show: !!c.tasks },
            { href: `/${lang}/dashboard/financials`, icon: Landmark, label: 'Union Treasury', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'field_surveys',
          title: 'Field & Student Action',
          items: [
            { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Petitions & Drives', show: true },
            { href: `/${lang}/dashboard/field-mode`, icon: Database, label: 'Offline Field PWA', show: true },
            { href: `/${lang}/dashboard/collaboration`, icon: Network, label: 'Joint Front & Alliances', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'student_services',
          title: 'Student Welfare & Legal',
          items: [
            { href: `/${lang}/dashboard/hostel-mess`, icon: Wrench, label: 'Hostel & Mess Audit', show: true },
            { href: `/${lang}/dashboard/legal-aid`, icon: Scale, label: 'Legal Aid & Anti-Ragging', show: true },
            { href: `/${lang}/dashboard/grievances`, icon: Scale, label: 'Grievance Redressal', show: !!c.grievances },
            { href: `/${lang}/dashboard/helpdesk`, icon: AlertCircle, label: 'Student Helpdesk', show: true },
          ].filter(i => i.show)
        },
        adminVaultGroup
      ]
    }

    // --- WORKERS UNION ---
    if (orgType === 'workers_union') {
      return [
        coreOperationsGroup,
        {
          id: 'union_action_desk',
          title: 'Union Action & Collective Rights',
          items: [
            { href: `/${lang}/dashboard/disputes`, icon: Scale, label: 'Trade Disputes & ALC', show: true },
            { href: `/${lang}/dashboard/cba`, icon: FileText, label: 'CBA Documents & Accord', show: !!c.cba_documents },
            { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Strike Authorization Votes', show: !!c.voting_engine },
            { href: `/${lang}/dashboard/jobs`, icon: HardHat, label: 'Worker Dispatch & Shifts', show: !!c.jobs },
            { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Labor Petitions & Drives', show: true },
            { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Shopfloor Tasks', show: !!c.tasks },
            { href: `/${lang}/dashboard/dues`, icon: Landmark, label: 'Union Dues Ledger', show: !!c.dues },
          ].filter(i => i.show)
        },
        {
          id: 'field_surveys',
          title: 'Field & Intake Tools',
          items: [
            { href: `/${lang}/dashboard/field-mode`, icon: Database, label: 'Offline Field PWA', show: true },
            { href: `/${lang}/dashboard/letterhead`, icon: Printer, label: 'Official Letterhead', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'legal_support',
          title: 'Legal Defense & Compliance',
          items: [
            { href: `/${lang}/dashboard/grievances`, icon: Scale, label: 'Worker Grievances', show: !!c.grievances },
            { href: `/${lang}/dashboard/compliance`, icon: ScrollText, label: 'Labor Law Compliance', show: !!c.compliance },
            { href: `/${lang}/dashboard/helpdesk`, icon: AlertCircle, label: 'Support Helpdesk', show: true },
          ].filter(i => i.show)
        },
        adminVaultGroup
      ]
    }

    // --- RWA (RESIDENT WELFARE ASSOCIATION) ---
    if (orgType === 'rwa') {
      return [
        coreOperationsGroup,
        {
          id: 'estate_operations',
          title: 'Estate Operations & Billing',
          items: [
            { href: `/${lang}/dashboard/maintenance`, icon: Wrench, label: 'Maintenance Billing', show: !!c.maintenance },
            { href: `/${lang}/dashboard/assets`, icon: Wrench, label: 'Asset AMC & NOCs', show: true },
            { href: `/${lang}/dashboard/facilities`, icon: CalendarCheck, label: 'Facility Booking', show: true },
            { href: `/${lang}/dashboard/domestic-staff`, icon: UserCheck, label: 'Staff Passes & Guards', show: true },
            { href: `/${lang}/dashboard/visitors`, icon: UserCheck, label: 'Visitor Logs', show: !!c.visitors },
            { href: `/${lang}/dashboard/financials`, icon: Landmark, label: 'Society Financials', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'colony_utilities',
          title: 'Colony Utilities & Civic Desk',
          items: [
            { href: `/${lang}/dashboard/chanda`, icon: BookOpenText, label: 'Chanda Ledger (चंदा)', show: true },
            { href: `/${lang}/dashboard/tenant-verification`, icon: FileSignature, label: 'Tenant Police Verification', show: true },
            { href: `/${lang}/dashboard/municipal-letters`, icon: Printer, label: 'Municipal Letters', show: true },
            { href: `/${lang}/dashboard/local-directory`, icon: Phone, label: 'Local Directory', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'rwa_governance',
          title: 'Governance & Complaints',
          items: [
            { href: `/${lang}/dashboard/governance/proposals`, icon: ScrollText, label: 'AGM Proposals', show: true },
            { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Resident Polls & Voting', show: !!c.elections },
            { href: `/${lang}/dashboard/complaints`, icon: AlertCircle, label: 'Resident Complaints Desk', show: !!c.complaints },
            { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Maintenance Tasks', show: !!c.tasks },
          ].filter(i => i.show)
        },
        adminVaultGroup
      ]
    }

    // --- CIVIC COLLECTIVE & GRASSROOTS MOVEMENTS ---
    if (orgType === 'civic_collective') {
      return [
        coreOperationsGroup,
        {
          id: 'field_evidence_desk',
          title: 'Field Evidence & Citizen Science',
          items: [
            { href: `/${lang}/dashboard/field-audits`, icon: Activity, label: 'Field Audits & Sensor Desk', show: true },
            { href: `/${lang}/dashboard/parcha`, icon: Printer, label: '1-Page Printable Parcha (पर्चे)', show: true },
            { href: `/${lang}/dashboard/receiving-tracker`, icon: Clock, label: 'Stamped Receiving & RTI', show: true },
            { href: `/${lang}/dashboard/field-mode`, icon: Database, label: 'Offline Field Mode PWA', show: true },
          ].filter(i => i.show)
        },
        {
          id: 'direct_action_hub',
          title: 'Direct Action & Mobilization',
          items: [
            { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Public Petitions & Drives', show: true },
            { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Direct Democracy & Voting', show: !!c.voting_engine },
            { href: `/${lang}/dashboard/governance/proposals`, icon: ScrollText, label: 'Proposals & Demands', show: true },
            { href: `/${lang}/dashboard/collaboration`, icon: Network, label: 'Joint Front (संयुक्त मोर्चा)', show: true },
            { href: `/${lang}/dashboard/chanda`, icon: BookOpenText, label: 'Chanda & Mutual Aid', show: true },
            { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Field Action Tasks', show: !!c.tasks },
          ].filter(i => i.show)
        },
        {
          id: 'legal_defense_media',
          title: 'Legal Defense & Public Desk',
          items: [
            { href: `/${lang}/dashboard/compliance/bqf-verification`, icon: ShieldCheck, label: 'BQF AI Recognition', show: true },
            { href: `/${lang}/dashboard/press-releases`, icon: Newspaper, label: 'Press Release Studio', show: true },
            { href: `/${lang}/dashboard/municipal-letters`, icon: Printer, label: 'Govt & Civic Letters', show: true },
            { href: `/${lang}/dashboard/complaints`, icon: AlertCircle, label: 'Public Grievance Desk', show: true },
            { href: `/${lang}/dashboard/helpdesk`, icon: AlertCircle, label: 'Allies Helpdesk', show: true },
          ].filter(i => i.show)
        },
        adminVaultGroup
      ]
    }

    // --- DEFAULT / NGO / FOUNDATION ---
    return [
      coreOperationsGroup,
      {
        id: 'governance_programs',
        title: 'Governance & Programs',
        items: [
          { href: `/${lang}/dashboard/governance/proposals`, icon: ScrollText, label: 'Proposals & Resolutions', show: true },
          { href: `/${lang}/dashboard/polls`, icon: Vote, label: 'Board Voting & Decisions', show: !!c.voting_engine },
          { href: `/${lang}/dashboard/tasks`, icon: CheckSquare, label: 'Program Tasks', show: !!c.tasks },
          { href: `/${lang}/dashboard/campaigns`, icon: Flag, label: 'Petitions & Outreach', show: true },
          { href: `/${lang}/dashboard/field-mode`, icon: Database, label: 'Offline Field Mode', show: true },
        ].filter(i => i.show)
      },
      {
        id: 'finance_grants',
        title: 'Treasury & Grants Desk',
        items: [
          { href: `/${lang}/dashboard/financials`, icon: Landmark, label: 'Financial Ledger', show: true },
          { href: `/${lang}/dashboard/donations`, icon: HandCoins, label: 'Donations & 80G Receipts', show: !!c.donations },
          { href: `/${lang}/dashboard/grants`, icon: DollarSign, label: 'Grants & Matcher', show: true },
        ].filter(i => i.show)
      },
      {
        id: 'compliance_support',
        title: 'Compliance & Legal Support',
        items: [
          { href: `/${lang}/dashboard/compliance`, icon: ScrollText, label: 'Compliance Tracker', show: !!c.compliance },
          { href: `/${lang}/dashboard/compliance/bqf-verification`, icon: ShieldCheck, label: 'BQF AI Verification', show: true },
          { href: `/${lang}/dashboard/municipal-letters`, icon: Printer, label: 'Official Representations', show: true },
          { href: `/${lang}/dashboard/helpdesk`, icon: AlertCircle, label: 'Beneficiary Helpdesk', show: true },
        ].filter(i => i.show)
      },
      adminVaultGroup
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
      init[g.id] = !(g.id === 'core_hubs' || hasActiveGroup[g.id])
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
          <div 
            key={group.id} 
            className="mb-4"
            onMouseEnter={() => handleMouseEnter(group.id)}
            onMouseLeave={() => handleMouseLeave(group.id)}
          >
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center justify-between w-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors group"
            >
              <span>{group.title}</span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-200 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200',
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
                        'flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all',
                        active
                          ? 'bg-orange-50 text-orange-950 font-bold border border-orange-200/80 shadow-2xs dark:bg-orange-950/40 dark:text-orange-200 dark:border-orange-900'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 dark:text-slate-500')} />
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
