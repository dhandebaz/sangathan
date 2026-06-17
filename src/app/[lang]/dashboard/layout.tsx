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
import { SidebarNav } from '@/components/dashboard/sidebar-nav'

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
        if ('name' in orgData) orgName = (orgData as any).name
        if ('logo_url' in orgData) orgLogoUrl = (orgData as any).logo_url
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={orgLogoUrl || "/logo/logo.png"}
              alt="Logo"
              className="h-8 w-auto object-contain"
              aria-hidden="true"
            />
          </Link>
        </div>

        <SidebarNav lang={lang} isAdmin={isAdmin} capabilities={capabilities} />

        <div className="px-4 pb-3">
          <Link href={`/${lang}/dashboard/support`} className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 p-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200">
            <Heart className="h-4 w-4 text-brand-500 fill-brand-500/20" />
            Support Sangathan
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
          <DashboardTopBar lang={lang} userEmail={user?.email ?? null} role={role} orgName={orgName} orgLogoUrl={orgLogoUrl} />
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

