'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, ChevronDown, LogOut, Settings, User, Sparkles, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { getOrgLabel } from '@/lib/org-types'

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

  const [clientOrgName, setClientOrgName] = useState<string | null>(orgName || null)

  useEffect(() => {
    if (orgName) {
      setClientOrgName(orgName)
      return
    }
    async function loadOrgName() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data: profile } = await supabase
          .from('profiles')
          .select('organisation_id')
          .eq('id', user.id)
          .single()
        if (profile?.organisation_id) {
          const { data: org } = await supabase
            .from('organisations')
            .select('name')
            .eq('id', profile.organisation_id)
            .single()
          if (org?.name) {
            setClientOrgName(org.name)
          }
        }
      } catch {
        // ignore
      }
    }
    loadOrgName()
  }, [orgName])

  const displayOrgName = clientOrgName || orgName || 'My Organisation'
  const displayRole = role || 'Member'
  const initials = userEmail?.[0]?.toUpperCase() ?? '?'
  const username = userEmail?.split('@')[0] || 'User'

  const orgInitials = displayOrgName
    .split(' ')
    .filter(w => w.length > 0)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'

  const orgTypeLabel = getOrgLabel(orgType)

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
      router.push(`/${lang}/login`)
    } finally {
      setIsSigningOut(false)
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
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs active:scale-95"
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
                'flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 transition-all shadow-2xs active:scale-95',
                'h-10'
              )}
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={(e) => {
                e.stopPropagation()
                setOpen((prev) => !prev)
              }}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-2xs">
                {orgInitials}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-xs font-bold text-slate-900 truncate max-w-[160px]">{displayOrgName}</span>
                <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                  {orgTypeLabel}
                  {planName === 'Institution' && (
                    <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5 border border-indigo-200">
                      <Sparkles className="w-2.5 h-2.5" /> Sustainer
                    </span>
                  )}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {open && (
              <div
                role="menu"
                aria-label="Profile menu"
                className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3.5 py-3 border-b border-slate-100 flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm shrink-0 border border-indigo-100">
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 truncate">{username}</span>
                    <span className="text-xs text-slate-500 truncate">{userEmail}</span>
                  </div>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left"
                    role="menuitem"
                    onClick={() => {
                      router.push(`/${lang}/dashboard/settings`)
                      setOpen(false)
                    }}
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    Workspace Settings (सेटिंग्स)
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left"
                    role="menuitem"
                    onClick={() => {
                      router.push(`/${lang}/dashboard/billing`)
                      setOpen(false)
                    }}
                  >
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    Billing & Plans (बिलिंग)
                  </button>
                </div>
                <div className="border-t border-slate-100 p-1.5">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    role="menuitem"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    <LogOut className="h-4 w-4" />
                    {isSigningOut ? 'Signing out...' : 'Sign Out (लॉग आउट)'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  )
}
