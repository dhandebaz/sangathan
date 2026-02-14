'use client'

import { usePathname } from 'next/navigation'
import { Plus, UserPlus, CheckCircle, Vote, Megaphone } from 'lucide-react'
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
  const isVolunteer = ['volunteer', 'core', 'executive', 'admin', 'editor'].includes(role)

  let action = null

  if (pathname.endsWith('/dashboard/members') && isAdmin) {
    action = {
      href: `/${lang}/dashboard/members/new`, // Assuming we have this
      icon: UserPlus,
      label: 'Add Member'
    }
  } else if (pathname.endsWith('/dashboard/events') && isAdmin) {
    action = {
      href: `/${lang}/dashboard/events/new`,
      icon: Plus,
      label: 'Create Event'
    }
  } else if (pathname.endsWith('/dashboard/tasks') && isAdmin && capabilities.volunteer_engine) {
    action = {
      href: `/${lang}/dashboard/tasks/new`,
      icon: CheckCircle,
      label: 'New Task'
    }
  } else if (pathname.endsWith('/dashboard/polls') && isAdmin && capabilities.voting_engine) {
    action = {
      href: `/${lang}/dashboard/polls/new`,
      icon: Vote,
      label: 'New Poll'
    }
  } else if (pathname.endsWith('/announcements') && isAdmin) {
    action = {
      href: `/${lang}/announcements/new`,
      icon: Megaphone,
      label: 'Post'
    }
  }

  if (!action) return null

  return (
    <div className="fixed bottom-20 right-4 z-50 md:hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
      <Button asChild size="icon" className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground">
        <Link href={action.href}>
          <action.icon className="h-6 w-6" />
          <span className="sr-only">{action.label}</span>
        </Link>
      </Button>
    </div>
  )
}
