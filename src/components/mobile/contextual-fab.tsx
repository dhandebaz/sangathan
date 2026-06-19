'use client'

import { usePathname } from 'next/navigation'
import { Plus, UserPlus, CheckCircle, Vote, Megaphone, Calendar, HeartHandshake, Scale, AlertCircle, Wrench, Gift, Landmark, Network, Badge, Users } from 'lucide-react'
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

  if (pathname.endsWith('/dashboard/members') && isAdmin && capabilities.basic_governance !== false) {
    action = { href: `/${lang}/dashboard/members`, icon: UserPlus, label: 'Add Member' }
  } else if (pathname.endsWith('/dashboard/events') && isAdmin && capabilities.basic_governance !== false) {
    action = { href: `/${lang}/dashboard/events/new`, icon: Calendar, label: 'Create Event' }
  } else if (pathname.endsWith('/dashboard/tasks') && isAdmin && capabilities.volunteer_engine !== false) {
    action = { href: `/${lang}/dashboard/tasks/new`, icon: CheckCircle, label: 'New Task' }
  } else if (pathname.endsWith('/dashboard/polls') && isAdmin && capabilities.voting_engine !== false) {
    action = { href: `/${lang}/dashboard/polls/new`, icon: Vote, label: 'New Poll' }
  } else if (pathname.endsWith('/dashboard/announcements') && isAdmin) {
    action = { href: `/${lang}/dashboard/announcements/new`, icon: Megaphone, label: 'Post Announcement' }
  } else if (pathname.endsWith('/dashboard/forms') && isAdmin) {
    action = { href: `/${lang}/dashboard/forms/new`, icon: Plus, label: 'Create Form' }
  } else if (pathname.endsWith('/dashboard/campaigns') && isAdmin) {
    action = { href: `/${lang}/dashboard/campaigns`, icon: Megaphone, label: 'New Campaign' }
  } else if (pathname.endsWith('/dashboard/volunteers') && isAdmin && capabilities.volunteers) {
    action = { href: `/${lang}/dashboard/volunteers`, icon: HeartHandshake, label: 'Add Volunteer' }
  } else if (pathname.endsWith('/dashboard/grievances') && isAdmin && capabilities.grievances) {
    action = { href: `/${lang}/dashboard/grievances`, icon: Scale, label: 'File Grievance' }
  } else if (pathname.endsWith('/dashboard/complaints') && isAdmin && capabilities.complaints) {
    action = { href: `/${lang}/dashboard/complaints`, icon: AlertCircle, label: 'New Complaint' }
  } else if (pathname.endsWith('/dashboard/maintenance') && isAdmin && capabilities.maintenance) {
    action = { href: `/${lang}/dashboard/maintenance`, icon: Wrench, label: 'New Request' }
  } else if (pathname.endsWith('/dashboard/donations') && isAdmin && capabilities.donations) {
    action = { href: `/${lang}/dashboard/donations`, icon: Gift, label: 'Record Donation' }
  } else if (pathname.endsWith('/dashboard/financials') && isAdmin) {
    action = { href: `/${lang}/dashboard/financials`, icon: Landmark, label: 'Add Transaction' }
  } else if (pathname.endsWith('/dashboard/meetings') && isAdmin) {
    action = { href: `/${lang}/dashboard/meetings/new`, icon: Calendar, label: 'Schedule Meeting' }
  } else if (pathname.endsWith('/dashboard/subgroups') && isAdmin) {
    action = { href: `/${lang}/dashboard/subgroups`, icon: Users, label: 'Create Team' }
  } else if (pathname.endsWith('/dashboard/networks') && isAdmin && capabilities.federation_mode) {
    action = { href: `/${lang}/dashboard/networks/new`, icon: Network, label: 'Add Network' }
  } else if (pathname.endsWith('/dashboard/student-ids') && isAdmin && capabilities.student_ids) {
    action = { href: `/${lang}/dashboard/student-ids`, icon: Badge, label: 'Issue ID' }
  }

  if (!action) return null

  return (
    <div className="fixed bottom-20 right-4 z-50 md:hidden">
      <Button 
        asChild 
        size="icon"
        className="h-14 w-14 rounded-full shadow-xl hover:shadow-2xl bg-primary text-primary-foreground"
      >
        <Link href={action.href}>
          <action.icon className="h-7 w-7" />
          <span className="sr-only">{action.label}</span>
        </Link>
      </Button>
    </div>
  )
}
