'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface DashboardTopBarProps {
  lang: string
  userEmail?: string | null
  role?: string
  orgName?: string | null
  orgLogoUrl?: string | null
}

export function DashboardTopBar({ lang, userEmail, role, orgName, orgLogoUrl }: DashboardTopBarProps) {
  const [open, setOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const handler = (event: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const displayOrgName = orgName || 'Sangathan'
  const displayRole = role || 'Member'
  const initials = userEmail?.[0]?.toUpperCase() ?? '?'
  const username = userEmail?.split('@')[0] || 'User'

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
      return segment.charAt(0).toUpperCase() + segment.slice(1)
    })
    return words.join(' / ')
  }, [pathname])

  async function handleSignOut() {
    setIsSigningOut(true)
    await supabase.auth.signOut()
    router.push(`/${lang}/login`)
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">
      <div className="flex items-center gap-4 min-w-0">
        <Link
          href={`/${lang}/dashboard`}
          className="flex items-center gap-2 md:hidden"
          aria-label="Sangathan Dashboard"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={orgLogoUrl || "/logo/logo.png"}
            alt="Logo"
            className="h-7 w-auto object-contain"
            aria-hidden="true"
          />
        </Link>
        <div className="hidden md:flex flex-col min-w-0">
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
            Organisation
          </span>
          <span className="text-sm font-semibold text-slate-900 truncate">
            {displayOrgName}
          </span>
        </div>
      </div>

      <div className="flex-1 hidden md:flex justify-center px-4">
        {breadcrumb && (
          <div className="inline-flex items-center text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            {breadcrumb}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            className={cn(
              'flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-sm hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900',
              'min-h-11'
            )}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {username}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider leading-tight">
                {displayRole}
              </span>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold">
              {initials}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {open && (
            <div
              role="menu"
              aria-label="Profile menu"
              className="absolute right-0 mt-2 w-60 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-orange-100 text-orange-700 font-semibold shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-900 truncate">{displayOrgName}</span>
                  <span className="text-xs text-slate-500 truncate">{userEmail}</span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">{displayRole}</span>
                </div>
              </div>
              <div className="p-2">
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-2xl transition-colors flex items-center gap-2"
                  role="menuitem"
                  onClick={() => {
                    router.push(`/${lang}/profile`)
                    setOpen(false)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  View Profile
                </button>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-2xl transition-colors flex items-center gap-2"
                  role="menuitem"
                  onClick={() => {
                    router.push(`/${lang}/dashboard/settings`)
                    setOpen(false)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                  Organisation Settings
                </button>
              </div>
              <div className="p-2 border-t border-slate-100">
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-2xl transition-colors flex items-center gap-2"
                  role="menuitem"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                  {isSigningOut ? 'Signing out…' : 'Sign Out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
