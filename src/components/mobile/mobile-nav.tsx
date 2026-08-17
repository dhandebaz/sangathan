'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Calendar, Users,
  HandCoins, Vote, Wrench, Scale, Grid, Activity, MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { MobileToolsDrawer } from '@/components/mobile/mobile-tools-drawer'

interface MobileNavProps {
  lang: string
  orgType?: string
}

const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    switch (type) {
      case 'light':
        navigator.vibrate(10)
        break
      case 'medium':
        navigator.vibrate(20)
        break
      case 'heavy':
        navigator.vibrate(30)
        break
      case 'success':
        navigator.vibrate([10, 50, 10])
        break
      case 'warning':
        navigator.vibrate([10, 50, 10, 50, 10])
        break
      case 'error':
        navigator.vibrate([10, 50, 10, 50, 10, 50, 10])
        break
    }
  }
}

function getTab4(lang: string, orgType: string): { href: string; icon: typeof LayoutDashboard; labelEn: string; labelHi: string } {
  switch (orgType) {
    case 'civic_collective':
      return { href: `/${lang}/dashboard/field-audits`, icon: Activity, labelEn: 'Field Audits', labelHi: 'फील्ड जांच' }
    case 'ngo':
      return { href: `/${lang}/dashboard/donations`, icon: HandCoins, labelEn: 'Donations', labelHi: 'दान/चंदा' }
    case 'student_union':
      return { href: `/${lang}/dashboard/elections`, icon: Vote, labelEn: 'Elections', labelHi: 'चुनाव' }
    case 'workers_union':
      return { href: `/${lang}/dashboard/grievances`, icon: Scale, labelEn: 'Grievances', labelHi: 'शिकायतें' }
    case 'rwa':
      return { href: `/${lang}/dashboard/maintenance`, icon: Wrench, labelEn: 'Maintenance', labelHi: 'मरम्मत' }
    default:
      return { href: `/${lang}/dashboard/events`, icon: Calendar, labelEn: 'Events', labelHi: 'कार्यक्रम' }
  }
}

export function MobileNav({ lang, orgType = 'ngo' }: MobileNavProps) {
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const isHindi = lang === 'hi'
  const tab4 = getTab4(lang, orgType)

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      triggerHaptic('light')
      prevPathnameRef.current = pathname
      setIsToolsOpen(false)
    }
  }, [pathname])

  const navItems = [
    {
      href: `/${lang}/dashboard`,
      icon: LayoutDashboard,
      labelEn: 'Dashboard',
      labelHi: 'डैशबोर्ड',
    },
    {
      href: `/${lang}/dashboard/inbox`,
      icon: MessageSquare,
      labelEn: 'Inbox',
      labelHi: 'इनबॉक्स',
    },
    {
      href: `/${lang}/dashboard/calendar`,
      icon: Calendar,
      labelEn: 'Calendar',
      labelHi: 'कैलेंडर',
    },
    {
      href: `/${lang}/dashboard/people`,
      icon: Users,
      labelEn: orgType === 'rwa' ? 'Residents' : 'People',
      labelHi: orgType === 'rwa' ? 'निवासी' : 'सदस्य',
    },
  ]

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md pb-[max(env(safe-area-inset-bottom),8px)] shadow-[0_-4px_20px_rgba(15,23,42,0.06)] md:hidden select-none"
        aria-label="Mobile Navigation Bar"
      >
        <div className="flex h-16 items-center justify-around px-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== `/${lang}/dashboard` && pathname?.startsWith(item.href + '/'))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 transition-all active:scale-95',
                  isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <div
                  className={cn(
                    'relative flex items-center justify-center rounded-xl px-2.5 py-1 transition-all',
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'
                  )}
                >
                  <item.icon
                    className={cn('w-5 h-5 transition-transform duration-150', isActive && 'scale-110')}
                  />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-semibold leading-tight truncate',
                    isActive ? 'text-indigo-600 font-bold' : 'text-slate-500'
                  )}
                >
                  {isHindi ? item.labelHi : item.labelEn}
                </span>
              </Link>
            )
          })}

          {/* 5th Tab: All Tools Drawer Trigger */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium')
              setIsToolsOpen(true)
            }}
            className={cn(
              'relative flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 transition-all active:scale-95 text-slate-500 hover:text-slate-900'
            )}
            aria-label="Open all tools menu"
          >
            <div className="relative flex items-center justify-center rounded-xl px-2.5 py-1 text-slate-600">
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold leading-tight text-slate-500 truncate">
              {isHindi ? 'सभी उपकरण' : 'All Tools'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Tools Drawer Modal */}
      <MobileToolsDrawer
        isOpen={isToolsOpen}
        onClose={() => setIsToolsOpen(false)}
        lang={lang}
        orgType={orgType}
      />
    </>
  )
}

