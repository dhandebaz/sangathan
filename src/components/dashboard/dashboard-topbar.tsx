'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, ChevronDown, LogOut, Settings, User, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface DashboardTopBarProps {
  lang: string
  userEmail?: string | null
  role?: string
  orgName?: string | null
  orgLogoUrl?: string | null
  orgType?: string
  planName?: string | null
}

export function DashboardTopBar(props: DashboardTopBarProps) {
  const { lang, userEmail, role, orgName, orgLogoUrl, orgType, planName } = props
  const [open, setOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const handler = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    
    // Add listener on next tick to avoid immediate trigger from the click that opened it
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handler)
      document.addEventListener('touchstart', handler)
    }, 0)
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [open])

  const displayOrgName = orgName || 'Sangathan'
  const displayRole = role || 'Member'
  const initials = userEmail?.[0]?.toUpperCase() ?? '?'
  const username = userEmail?.split('@')[0] || 'User'

  const orgInitials = displayOrgName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const orgTypeLabel = orgType === 'student_union' ? 'Student Union' :
                       orgType === 'workers_union' ? 'Workers Union' :
                       orgType === 'rwa' ? 'RWA' :
                       orgType === 'ngo' ? 'NGO' : 'Organisation'

  const breadcrumb = useMemo(() => {
    if (!pathname) return ''
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length < 2) return 'Dashboard'
    const parts = segments.slice(1)
    const words = parts.map((segment) => {
      if (segment === 'dashboard') return 'Dashboard'
      if (segment === 'events') return 'Events'
      if (segment === 'new') return 'Create'
      if (segment === 'members') return 'Members'
      if (segment === 'meetings') return 'Meetings'
      if (segment === 'forms') return 'Forms'
      if (segment === 'tasks') return 'Tasks'
      if (segment === 'polls') return 'Decisions'
      if (segment === 'donations') return 'Donations'
      if (segment === 'settings') return 'Settings'
      if (segment === 'announcements') return 'Announcements'
      if (segment === 'governance') return 'Governance'
      if (segment === 'proposals') return 'Proposals'
      if (segment === 'financials') return 'Financial Ledger'
      if (segment === 'membership-requests') return 'Membership Requests'
      if (segment === 'student-ids') return 'Student IDs'
      if (segment === 'print') return 'Print'
      if (segment === 'check-in') return 'Check-in'
      if (segment === 'edit') return 'Edit'
      if (segment === 'analytics') return 'Analytics'
      if (segment === 'volunteers') return 'Volunteers'
      if (segment === 'subgroups') return 'Teams'
      if (segment === 'networks') return 'Networks'
      if (segment === 'campaigns') return 'Campaigns'
      if (segment === 'grievances') return 'Grievances'
      if (segment === 'complaints') return 'Complaints'
      if (segment === 'maintenance') return 'Maintenance'
      if (segment === 'roles') return 'Custom Roles'
      if (segment === 'support') return 'Support'
      if (segment === 'appeals') return 'Appeals'
      if (segment === 'audit') return 'Audit Log'
      return segment.charAt(0).toUpperCase() + segment.slice(1)
    })
    return words.join(' / ')
  }, [pathname])

  async function handleSignOut() {
    if (isSigningOut) return
    try {
      setIsSigningOut(true)
      await supabase.auth.signOut()
    } finally {
      window.location.href = `/${lang}/login`
    }
  }

  return (
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/${lang}/dashboard`}
            className="flex items-center gap-2 md:hidden shrink-0"
            aria-label="Sangathan Dashboard"
          >
            {orgLogoUrl ? (
              <Image src={orgLogoUrl} alt="" width={32} height={32} className="h-8 w-8 rounded-sm object-contain" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground text-xs font-bold">
                {initials}
              </div>
            )}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground min-w-0">
          {breadcrumb && (
            <span className="truncate text-foreground font-medium">{breadcrumb}</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div 
            ref={menuRef} 
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              type="button"
              className={cn(
                'flex items-center gap-2 rounded-sm border border-border bg-card px-2.5 py-1.5 hover:bg-accent transition-colors',
                'h-9'
              )}
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={(e) => {
                e.stopPropagation()
                setOpen((prev) => !prev)
              }}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-primary-foreground text-xs font-bold">
                {orgInitials}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">{displayOrgName}</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                  {orgTypeLabel}
                  {planName === 'Institution' && (
                    <span className="bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded flex items-center gap-0.5 ml-1">
                      <Sparkles className="w-2.5 h-2.5" /> Inst
                    </span>
                  )}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {open && (
              <div
                role="menu"
                aria-label="Profile menu"
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-sm border border-border bg-card shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="px-3 py-3 border-b border-border flex items-center gap-3">
                  <div className="flex items-center justify-center h-9 w-9 rounded-sm bg-accent text-brand-700 font-bold text-sm shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">{username}</span>
                    <span className="text-xs text-muted-foreground truncate">{userEmail}</span>
                  </div>
                </div>
                <div className="p-1.5">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    role="menuitem"
                    onClick={() => {
                      router.push(`/${lang}/profile`)
                      setOpen(false)
                    }}
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    role="menuitem"
                    onClick={() => {
                      router.push(`/${lang}/dashboard/settings`)
                      setOpen(false)
                    }}
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Organisation Settings
                  </button>
                </div>
                <div className="border-t border-border p-1.5">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    role="menuitem"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    <LogOut className="h-4 w-4" />
                    {isSigningOut ? 'Signing out\u2026' : 'Sign Out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  )
}
