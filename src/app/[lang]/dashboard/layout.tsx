import Link from 'next/link'
import Image from 'next/image'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { Heart } from 'lucide-react'
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
  org_type: string
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
  let orgType = 'ngo'
  let maintenanceMessage: string | null = null

  if (user) {
    try {
      const selectedOrgId = await getSelectedOrganisationId()
      capabilities = await getOrgCapabilities(selectedOrgId)
      const { data: orgData } = await supabase
        .from('organisations')
        .select('name, logo_url, org_type')
        .eq('id', selectedOrgId)
        .single()
      if (orgData) {
        const org = orgData as unknown as Organisation
        orgName = org.name
        orgLogoUrl = org.logo_url
        orgType = org.org_type || 'ngo'
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
    } catch (e) {
      if (isRedirectError(e)) throw e
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
  const orgInitials = (orgName || 'S')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex min-h-screen bg-background text-foreground md:pb-0">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <Link href={`/${lang}/dashboard`} className="flex items-center gap-3 min-w-0" aria-label="Sangathan Dashboard">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              <Image 
                src="/logo/logo.png" 
                alt="Sangathan Logo" 
                width={32} 
                height={32} 
                className="object-contain dark:invert" 
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-bold text-foreground truncate leading-tight">
                Sangathan
              </span>
            </div>
          </Link>
        </div>

        <SidebarNav lang={lang} isAdmin={isAdmin} capabilities={capabilities} orgType={orgType} />

        <div className="px-3 pb-3">
          <Link
            href={`/${lang}/dashboard/support`}
            className="flex items-center justify-center gap-2 rounded-lg bg-foreground px-3 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            <Heart className="h-4 w-4 text-brand-300" />
            Support Sangathan
          </Link>
        </div>

      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        {maintenanceMessage && (
          <div className="flex flex-wrap items-center gap-2 border-b border-warning/30 bg-warning-bg px-4 py-3 text-sm text-warning-text sm:px-6 lg:px-8">
            <span className="font-semibold">Maintenance mode</span>
            <span className="opacity-80">{maintenanceMessage}</span>
          </div>
        )}
        <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border bg-card/95 px-4 shadow-sm backdrop-blur-sm sm:px-6 lg:px-8">
          <DashboardTopBar lang={lang} userEmail={user?.email ?? null} role={role} orgName={orgName} orgLogoUrl={orgLogoUrl} orgType={orgType} />
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
