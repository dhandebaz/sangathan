import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Users, Settings, LogOut, Megaphone, Calendar, CheckSquare, BarChart, Vote, Globe, AlertTriangle, Flag, Badge, HeartHandshake, Scale, AlertCircle, Wrench, Gift, FileText, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { getOrgCapabilities } from '@/lib/capabilities'
import { MobileNav } from '@/components/mobile/mobile-nav'
import { ContextualFAB } from '@/components/mobile/contextual-fab'
import { DashboardTopBar } from '@/components/dashboard/dashboard-topbar'
import { getSelectedOrganisationId } from '@/lib/auth/context'

export default async function DashboardLayout(props: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const { children } = props
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let capabilities: Record<string, boolean> = { basic_governance: true }
  let role = ''
  let orgName: string | null = null
  let maintenanceMessage: string | null = null

  if (user) {
    try {
      const selectedOrgId = await getSelectedOrganisationId()
      capabilities = await getOrgCapabilities(selectedOrgId)
      const { data: orgData } = await supabase
        .from('organisations')
        .select('name')
        .eq('id', selectedOrgId)
        .single()
      if (orgData && 'name' in orgData) {
        orgName = (orgData as { name: string }).name
      }
      const { data: membership } = await supabase
        .from('members')
        .select('role')
        .eq('user_id', user.id)
        .eq('organisation_id', selectedOrgId)
        .eq('status', 'active')
        .maybeSingle()
      if (membership && 'role' in membership) {
        role = (membership as { role: string }).role
      }
    } catch {
      capabilities = { basic_governance: false }
    }
  }

  try {
    const { data: setting } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'maintenance_mode')
      .maybeSingle()

    if (setting && setting.value && typeof setting.value === 'object') {
      const value = setting.value as { enabled?: boolean; message?: string }
      if (value.enabled) {
        maintenanceMessage = value.message || 'The platform is currently under maintenance.'
      }
    }
  } catch {
    maintenanceMessage = null
  }

  const isAdmin = ['admin', 'executive'].includes(role)

  return (
    <div className="flex min-h-screen bg-background pb-16 font-sans text-foreground md:pb-0">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link href={`/${lang}/dashboard`} className="flex items-center gap-2 group" aria-label="Sangathan Dashboard">
            <Image
              src="/logo/logo.png"
              alt=""
              width={128}
              height={32}
              className="h-8 w-auto"
              aria-hidden="true"
              priority
            />
          </Link>
        </div>

        <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto">
          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Main Menu</h3>
            <nav className="space-y-1">
              <SidebarLink href={`/${lang}/dashboard`} icon={LayoutDashboard} label="Overview" />
              <SidebarLink href={`/${lang}/dashboard/announcements`} icon={Megaphone} label="Announcements" />
              <SidebarLink href={`/${lang}/dashboard/events`} icon={Calendar} label="Events" />
            </nav>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Operations</h3>
            <nav className="space-y-1">
              <SidebarLink href={`/${lang}/dashboard/tasks`} icon={CheckSquare} label="Tasks" />
              <SidebarLink href={`/${lang}/dashboard/polls`} icon={Vote} label="Decisions" />
              {capabilities.campaigns && (
                <SidebarLink href={`/${lang}/dashboard/campaigns`} icon={Flag} label="Campaigns" />
              )}
              {capabilities.grievances && (
                <SidebarLink href={`/${lang}/dashboard/grievances`} icon={Scale} label="Grievances" />
              )}
              {capabilities.complaints && (
                <SidebarLink href={`/${lang}/dashboard/complaints`} icon={AlertCircle} label="Complaints" />
              )}
              {capabilities.maintenance && (
                <SidebarLink href={`/${lang}/dashboard/maintenance`} icon={Wrench} label="Maintenance" />
              )}
              {capabilities.donations && (
                <SidebarLink href={`/${lang}/dashboard/donations`} icon={Gift} label="Donations" />
              )}
              {capabilities.federation_mode && (
                <SidebarLink href={`/${lang}/dashboard/networks`} icon={Globe} label="Networks" />
              )}
              <SidebarLink href={`/${lang}/dashboard/members`} icon={Users} label="Members" />
              {capabilities.volunteers && (
                <SidebarLink href={`/${lang}/dashboard/volunteers`} icon={HeartHandshake} label="Volunteers" />
              )}
              {capabilities.student_ids && (
                <SidebarLink href={`/${lang}/dashboard/student-ids`} icon={Badge} label="Student IDs" />
              )}
            </nav>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">System</h3>
            <nav className="space-y-1">
              {capabilities.advanced_analytics && isAdmin && (
                <SidebarLink href={`/${lang}/dashboard/analytics`} icon={BarChart} label="Analytics" />
              )}
              {isAdmin && (
                <SidebarLink href={`/${lang}/dashboard/forms`} icon={FileText} label="Forms" />
              )}
              {isAdmin && (
                <SidebarLink href={`/${lang}/dashboard/settings`} icon={Settings} label="Settings" />
              )}
            </nav>
          </div>
        </div>

        <div className="mt-4 px-4 pb-4">
          <Link href={`/${lang}/dashboard/support`} className="group relative block overflow-hidden rounded-xl bg-slate-900 p-4 text-left shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/30 to-purple-600/30 opacity-50 transition-opacity group-hover:opacity-100" />
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-brand-500/20 blur-xl" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Heart className="h-5 w-5 text-brand-400 fill-brand-400/20" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Support Us</h4>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">Keep Sangathan online</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 p-4 mt-auto">
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign Out</span>
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        {maintenanceMessage && (
          <div className="flex flex-wrap items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 sm:px-6 lg:px-8">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold">Maintenance mode</span>
            <span className="text-amber-900/80">{maintenanceMessage}</span>
          </div>
        )}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <DashboardTopBar lang={lang} userEmail={user?.email ?? null} role={role} orgName={orgName} />
        </header>

        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 animate-fade-in px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          {children}
        </main>
      </div>

      <MobileNav lang={lang} />
      <ContextualFAB lang={lang} role={role} capabilities={capabilities} />
    </div>
  )
}

function SidebarLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link
      href={href}
      className="group flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
    >
      <Icon className="w-5 h-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
      {label}
    </Link>
  )
}
