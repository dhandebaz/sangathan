import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Users, Settings, LogOut, Megaphone, Calendar, CheckSquare, BarChart, Vote, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { getOrgCapabilities } from '@/lib/capabilities'
import { MobileNav } from '@/components/mobile/mobile-nav'
import { ContextualFAB } from '@/components/mobile/contextual-fab'
import { DashboardTopBar } from '@/components/dashboard/dashboard-topbar'

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
  
  if (user) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('organisation_id, role')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profileData) {
      capabilities = { basic_governance: false }
    } else {
      const profile = profileData as { organisation_id: string | null; role: string }
      if (profile.organisation_id) {
        capabilities = await getOrgCapabilities(profile.organisation_id)
        role = profile.role
        const { data: orgData } = await supabase
          .from('organisations')
          .select('name')
          .eq('id', profile.organisation_id)
          .single()
        if (orgData && 'name' in orgData) {
          orgName = (orgData as { name: string }).name
        }
      } else {
        capabilities = { basic_governance: false }
      }
    }
  }

  const isAdmin = ['admin', 'executive'].includes(role)

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-foreground pb-16 md:pb-0 font-sans">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white hidden md:flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link href={`/${lang}/dashboard`} className="flex items-center gap-2 group" aria-label="Sangathan Dashboard">
            <Image
              src="/logo/whitesangathanlogo.png"
              alt=""
              width={128}
              height={32}
              className="h-8 w-auto group-hover:scale-105 transition-transform logo-mark-light"
              aria-hidden="true"
              priority
            />
            <Image
              src="/logo/blacksangathanlogo.png"
              alt=""
              width={128}
              height={32}
              className="h-8 w-auto group-hover:scale-105 transition-transform logo-mark-dark"
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
               {capabilities.federation_mode && (
                 <SidebarLink href={`/${lang}/dashboard/networks`} icon={Globe} label="Networks" />
               )}
               <SidebarLink href={`/${lang}/dashboard/members`} icon={Users} label="Members" />
            </nav>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">System</h3>
            <nav className="space-y-1">
               {capabilities.advanced_analytics && isAdmin && (
                 <SidebarLink href={`/${lang}/dashboard/analytics`} icon={BarChart} label="Analytics" />
               )}
               {isAdmin && (
                 <SidebarLink href={`/${lang}/dashboard/settings`} icon={Settings} label="Settings" />
               )}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign Out</span>
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
        <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between">
           <DashboardTopBar lang={lang} userEmail={user?.email ?? null} role={role} orgName={orgName} />
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full animate-fade-in pb-24 md:pb-10">
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
      className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-all group"
    >
      <Icon className="w-5 h-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
      {label}
    </Link>
  )
}
