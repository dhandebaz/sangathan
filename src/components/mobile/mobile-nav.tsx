'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Calendar, Users, Video, Settings as SettingsIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface MobileNavProps {
  lang: string
}

// Haptic feedback helper
interface NavigatorWithVibrate extends Navigator {
  vibrate?: (pattern: number | number[]) => boolean
}

const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
  if (typeof window !== 'undefined') {
    const nav = navigator as NavigatorWithVibrate
    if (nav.vibrate) {
      switch (type) {
        case 'light':
          nav.vibrate(10)
          break
        case 'medium':
          nav.vibrate(20)
          break
        case 'heavy':
          nav.vibrate(30)
          break
        case 'success':
          nav.vibrate([10, 50, 10])
          break
        case 'warning':
          nav.vibrate([10, 50, 10, 50, 10])
          break
        case 'error':
          nav.vibrate([10, 50, 10, 50, 10, 50, 10])
          break
      }
    }
  }
}

export function MobileNav({ lang }: MobileNavProps) {
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)

  // Trigger haptic feedback when navigating
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      triggerHaptic('light')
      prevPathnameRef.current = pathname
    }
  }, [pathname])

  const navItems = [
    {
      href: `/${lang}/dashboard`,
      icon: LayoutDashboard,
      label: 'Home',
      show: true
    },
    {
      href: `/${lang}/dashboard/members`,
      icon: Users,
      label: 'Members',
      show: true
    },
    {
      href: `/${lang}/dashboard/events`,
      icon: Calendar,
      label: 'Events',
      show: true
    },
    {
      href: `/${lang}/dashboard/meetings`,
      icon: Video,
      label: 'Meetings',
      show: true
    },
    {
      href: `/${lang}/dashboard/settings`,
      icon: SettingsIcon,
      label: 'Settings',
      show: true
    }
  ]

  // Filter and limit to 5 items for bottom nav constraint
  const visibleItems = navItems.filter(item => item.show).slice(0, 5)

  const handleLinkClick = () => {
    triggerHaptic('light')
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-sm pb-[max(env(safe-area-inset-bottom),8px)] shadow-[0_-4px_24px_rgba(15,23,42,0.08)] md:hidden" aria-label="Dashboard navigation">
      <div className="flex h-16 items-center justify-around">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "relative flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={cn(
                "relative flex items-center justify-center transition-all duration-300",
                isActive ? "scale-110" : ""
              )}>
                <item.icon className={cn(
                  "w-6 h-6 transition-all duration-200",
                  isActive && "fill-current/20"
                )} />
                {isActive && (
                  <span className="absolute -bottom-1 h-1 w-6 bg-primary rounded-full" />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                isActive ? "font-semibold" : ""
              )}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
