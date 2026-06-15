'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Calendar, Users, Video, Settings as SettingsIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  lang: string
}

export function MobileNav({ lang }: MobileNavProps) {
  const pathname = usePathname()

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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(15,23,42,0.06)] md:hidden" aria-label="Dashboard navigation">
      <div className="flex h-16 items-center justify-around">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className={cn("w-5 h-5", isActive && "fill-current/20")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
