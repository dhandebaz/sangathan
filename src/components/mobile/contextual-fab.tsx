'use client'

import { usePathname } from 'next/navigation'
import {
  Plus, UserPlus, CheckCircle, Vote, Megaphone, Calendar,
  HeartHandshake, AlertCircle, Gift, Network,
  Users, HelpCircle, Activity, Clock, Newspaper, Printer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ContextualFABProps {
  lang: string
  role: string
  capabilities: Record<string, boolean>
}

export function ContextualFAB({ lang, role, capabilities }: ContextualFABProps) {
  const pathname = usePathname()
  
  if (!role) return null

  const isAdmin = ['admin', 'editor', 'executive'].includes(role)

  interface Action {
    href: string
    icon: React.ElementType
    label: string
  }

  let action: Action | null = null

  if ((pathname.endsWith('/dashboard/members') || pathname.endsWith('/dashboard/people')) && isAdmin && capabilities.basic_governance !== false) {
    action = { href: `/${lang}/dashboard/people`, icon: UserPlus, label: 'Add Member' }
  } else if ((pathname.endsWith('/dashboard/events') || pathname.endsWith('/dashboard/calendar')) && isAdmin && capabilities.basic_governance !== false) {
    action = { href: `/${lang}/dashboard/calendar`, icon: Calendar, label: 'Schedule Event' }
  } else if ((pathname.endsWith('/dashboard/inbox') || pathname.endsWith('/dashboard/communications')) && isAdmin) {
    action = { href: `/${lang}/dashboard/inbox`, icon: Megaphone, label: 'Broadcast Message' }
  } else if (pathname.endsWith('/dashboard/tasks') && isAdmin && capabilities.volunteer_engine !== false) {
    action = { href: `/${lang}/dashboard/tasks/new`, icon: CheckCircle, label: 'New Task' }
  } else if (pathname.endsWith('/dashboard/polls') && isAdmin && capabilities.voting_engine !== false) {
    action = { href: `/${lang}/dashboard/polls/new`, icon: Vote, label: 'New Poll' }
  } else if (pathname.endsWith('/dashboard/announcements') && isAdmin) {
    action = { href: `/${lang}/dashboard/inbox`, icon: Megaphone, label: 'Post Update' }
  } else if (pathname.endsWith('/dashboard/forms') && isAdmin) {
    action = { href: `/${lang}/dashboard/forms/new`, icon: Plus, label: 'Create Form' }
  } else if (pathname.endsWith('/dashboard/campaigns') && isAdmin) {
    action = { href: `/${lang}/dashboard/campaigns`, icon: Megaphone, label: 'New Campaign' }
  } else if (pathname.endsWith('/dashboard/volunteers') && isAdmin && capabilities.volunteers) {
    action = { href: `/${lang}/dashboard/volunteers`, icon: HeartHandshake, label: 'Add Volunteer' }
  } else if (pathname.endsWith('/dashboard/complaints') && isAdmin && capabilities.complaints) {
    action = { href: `/${lang}/dashboard/complaints`, icon: AlertCircle, label: 'New Complaint' }
  } else if (pathname.endsWith('/dashboard/donations') && isAdmin && capabilities.donations) {
    action = { href: `/${lang}/dashboard/donations`, icon: Gift, label: 'Record Donation' }
  } else if (pathname.endsWith('/dashboard/meetings') && isAdmin) {
    action = { href: `/${lang}/dashboard/meetings/new`, icon: Calendar, label: 'Schedule Meeting' }
  } else if (pathname.endsWith('/dashboard/subgroups') && isAdmin) {
    action = { href: `/${lang}/dashboard/subgroups`, icon: Users, label: 'Create Team' }
  } else if (pathname.endsWith('/dashboard/networks') && isAdmin && capabilities.federation_mode) {
    action = { href: `/${lang}/dashboard/networks/new`, icon: Network, label: 'Add Network' }
  } else if (pathname.endsWith('/dashboard/field-audits') && isAdmin) {
    action = { href: `/${lang}/dashboard/field-audits`, icon: Activity, label: 'Log Spot Audit' }
  } else if (pathname.endsWith('/dashboard/parcha') && isAdmin) {
    action = { href: `/${lang}/dashboard/parcha`, icon: Printer, label: 'Generate Parcha' }
  } else if (pathname.endsWith('/dashboard/receiving-tracker') && isAdmin) {
    action = { href: `/${lang}/dashboard/receiving-tracker`, icon: Clock, label: 'Log Receiving' }
  } else if (pathname.endsWith('/dashboard/press-releases') && isAdmin) {
    action = { href: `/${lang}/dashboard/press-releases`, icon: Newspaper, label: 'New Press Release' }
  } else if (pathname.endsWith('/dashboard') && pathname === `/${lang}/dashboard`) {
    action = { href: `/${lang}/dashboard/helpdesk`, icon: HelpCircle, label: 'Need Help?' }
  }

  if (!action) return null

  return (
    <div className="fixed bottom-[76px] right-4 z-40 md:hidden">
      <Button 
        asChild 
        className="h-14 w-14 rounded-2xl shadow-lg hover:shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all active:scale-90 flex items-center justify-center p-0 border border-indigo-500/30"
      >
        <Link href={action.href} aria-label={action.label}>
          <action.icon className="h-6 w-6" />
        </Link>
      </Button>
    </div>
  )
}

