import Link from 'next/link'
import { Activity, Building2, FileClock, Gavel, LayoutDashboard, Scale, ShieldCheck, Users } from 'lucide-react'
import { requirePlatformAdmin } from '@/lib/auth/context'

const adminLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/organisations', label: 'Organisations', icon: Building2 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/logs', label: 'Logs', icon: FileClock },
  { href: '/admin/moderation', label: 'Moderation', icon: Gavel },
  { href: '/admin/compliance', label: 'Compliance', icon: Scale },
  { href: '/admin/health', label: 'Health', icon: Activity },
]

export default async function SystemAdminLayout({ children }: { children: React.ReactNode }) {
  await requirePlatformAdmin()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="page-container flex min-h-16 items-center justify-between gap-4 py-2">
          <Link href="/admin" className="flex min-h-11 items-center gap-3 rounded-lg" aria-label="System admin home">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-sm font-bold text-slate-950">Sangathan System Admin</span>
              <span className="block text-xs text-slate-600">Restricted platform operations</span>
            </span>
          </Link>
          <Link
            href="/en/dashboard"
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Organisation dashboard
          </Link>
        </div>
        <nav className="border-t border-slate-100" aria-label="System administration">
          <div className="page-container flex gap-1 overflow-x-auto py-2">
            {adminLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-orange-50 hover:text-orange-800"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1} className="page-container py-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}
