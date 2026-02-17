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
}

export function DashboardTopBar({ lang, userEmail, role, orgName }: DashboardTopBarProps) {
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
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4 min-w-0">
        <Link
          href={`/${lang}/dashboard`}
          className="flex items-center gap-2 group"
          aria-label="Sangathan Dashboard"
        >
          <Image
            src="/logo/whitesangathanlogo.png"
            alt=""
            width={128}
            height={32}
            className="h-8 w-auto logo-mark-light"
            aria-hidden="true"
            priority
          />
          <Image
            src="/logo/blacksangathanlogo.png"
            alt=""
            width={128}
            height={32}
            className="h-8 w-auto logo-mark-dark"
            aria-hidden="true"
            priority
          />
        </Link>
        <div className="hidden md:flex flex-col min-w-0">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            Organisation
          </span>
          <span className="text-sm font-semibold text-slate-900 truncate">
            {displayOrgName}
          </span>
        </div>
      </div>

      <div className="flex-1 hidden md:flex justify-center px-8">
        {breadcrumb && (
          <div className="inline-flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            {breadcrumb}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            className={cn(
              'flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900',
              'min-h-[40px] min-w-[40px]'
            )}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="hidden sm:flex flex-col items-end mr-1">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {username}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-tight">
                {displayRole}
              </span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold">
              {initials}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {open && (
            <div
              role="menu"
              aria-label="Profile menu"
              className="absolute right-0 mt-2 w-52 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-50"
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs text-slate-500 truncate">{displayOrgName}</div>
                <div className="text-sm font-semibold text-slate-900 truncate">{userEmail}</div>
              </div>
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:bg-slate-50"
                role="menuitem"
                onClick={() => {
                  router.push(`/${lang}/profile`)
                  setOpen(false)
                }}
              >
                View Profile
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:bg-slate-50"
                role="menuitem"
                onClick={() => {
                  router.push(`/${lang}/dashboard/settings`)
                  setOpen(false)
                }}
              >
                Organisation Settings
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:bg-red-50"
                role="menuitem"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? 'Signing out…' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

