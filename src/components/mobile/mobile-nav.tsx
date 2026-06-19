'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Calendar, Users, Video, Settings as SettingsIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface MobileNavProps {
  lang: string
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

export function MobileNav({ lang }: MobileNavProps) {
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)

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

  const visibleItems = navItems.filter(item => item.show).slice(0, 5)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-sm pb-[max(env(safe-area-inset-bottom),8px)] shadow-[0_-4px_24px_rgba(15,23,42,0.08)] md:hidden select-none" aria-label="Dashboard navigation">
      <div className="flex h-16 items-center justify-around">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1",
                "transition-all duration-150",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={cn(
                "relative flex items-center justify-center rounded-xl px-3 py-1.5 transition-all",
                isActive ? "bg-brand-50 scale-110" : "active:bg-slate-100 active:scale-95"
              )}>
                <item.icon className={cn(
                  "w-6 h-6 transition-all duration-200",
                  isActive && "text-brand-600"
                )} />
              </div>
              <span className={cn(
                "text-[11px] font-medium leading-tight transition-all duration-150",
                isActive ? "text-brand-600 font-semibold" : "text-muted-foreground"
              )}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
