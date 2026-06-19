import Link from 'next/link'
import { LayoutDashboard, LogOut, Megaphone, Calendar, CheckSquare, Vote, Globe, AlertTriangle, Flag, Badge, HeartHandshake, Scale, AlertCircle, Wrench, Gift, FileText, Heart, Landmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { getOrgCapabilities } from '@/lib/capabilities'
import { MobileNav } from '@/components/mobile/mobile-nav'
import { ContextualFAB } from '@/components/mobile/contextual-fab'
import { DashboardTopBar } from '@/components/dashboard/dashboard-topbar'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'

interface Organisation {
  name: string
  logo_url: string | null
}

interface Membership {
  role: string
}

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
  let orgLogoUrl: string | null = null
  let maintenanceMessage: string | null = null

  if (user) {
    try {
      const selectedOrgId = await getSelectedOrganisationId()
      capabilities = await getOrgCapabilities(selectedOrgId)
      const { data: orgData } = await supabase
        .from('organisations')
        .select('name, logo_url')
        .eq('id', selectedOrgId)
        .single()
      if (orgData) {
        const org = orgData as unknown as Organisation
        orgName = org.name
        orgLogoUrl = org.logo_url
      }
      const { data: membershipData } = await supabase
        .from('members')
        .select('role')
        .eq('user_id', user.id)
        .eq('organisation_id', selectedOrgId)
        .eq('status', 'active')
        .maybeSingle()
      if (membershipData) {
        const membership = membershipData as unknown as Membership
        role = membership.role
      }
    } catch (_e) {
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
  } catch (_e) {
    maintenanceMessage = null
  }

  const isAdmin = ['admin', 'executive'].includes(role)

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 md:pb-0">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-slate-200 bg-slate-50 shadow-sm md:flex">
        <div className="h-20 flex items-center px-6 border-b border-slate-200">
          <Link href={`/${lang}/dashboard`} className="flex items-center gap-3" aria-label="Sangathan Dashboard">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={orgLogoUrl || "/logo/logo.png"}
              alt="Logo"
              className="h-10 w-auto object-contain"
              aria-hidden="true"
            />
            <span className="text-sm font-semibold tracking-wide text-slate-900">{orgName ?? 'Sangathan'}</span>
          </Link>
        </div>

        <SidebarNav lang={lang} isAdmin={isAdmin} capabilities={capabilities} />

        <div className="px-5 pb-4">
          <Link href={`/${lang}/dashboard/support`} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
            <Heart className="h-4 w-4 text-orange-300" />
            Support Sangathan
          </Link>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 p-5 mt-auto">
          <Button variant="outline" className="w-full justify-start gap-3 rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign Out</span>
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:pl-72">
        {maintenanceMessage && (
          <div className="flex flex-wrap items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:px-6 lg:px-8">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold">Maintenance mode</span>
            <span className="text-amber-900/80">{maintenanceMessage}</span>
          </div>
        )}
        <header className="sticky top-0 z-40 flex h-20 items-center border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-sm sm:px-6 lg:px-8">
          <DashboardTopBar lang={lang} userEmail={user?.email ?? null} role={role} orgName={orgName} orgLogoUrl={orgLogoUrl} />
        </header>

        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-8xl flex-1 animate-fade-in px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          {children}
        </main>
      </div>

      <MobileNav lang={lang} />
      <ContextualFAB lang={lang} role={role} capabilities={capabilities} />
    </div>
  )
}
