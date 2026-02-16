import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Users, Settings, LogOut, Megaphone, Calendar, CheckSquare, BarChart, Vote, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { getOrgCapabilities } from '@/lib/capabilities'
import { MobileNav } from '@/components/mobile/mobile-nav'
import { ContextualFAB } from '@/components/mobile/contextual-fab'

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
      } else {
        capabilities = { basic_governance: false }
      }
    }
  }

  const isAdmin = ['admin', 'executive'].includes(role)

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-foreground pb-16 md:pb-0 font-sans">
      {/* Sidebar (Desktop) */}
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
               {capabilities.volunteer_engine && (
                 <SidebarLink href={`/${lang}/dashboard/tasks`} icon={CheckSquare} label="Tasks" />
               )}
               {capabilities.voting_engine && (
                 <SidebarLink href={`/${lang}/dashboard/polls`} icon={Vote} label="Decisions" />
               )}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between">
           <div className="flex items-center gap-4 md:hidden">
             <Image
               src="/logo/whitesangathanlogo.png"
               alt=""
               width={120}
               height={32}
               className="h-8 w-auto logo-mark-light"
               aria-hidden="true"
               priority
             />
             <Image
               src="/logo/blacksangathanlogo.png"
               alt=""
               width={120}
               height={32}
               className="h-8 w-auto logo-mark-dark"
               aria-hidden="true"
               priority
             />
           </div>
           
           <div className="ml-auto flex items-center gap-4">
             <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-slate-900">{user?.email?.split('@')[0]}</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{role || 'Member'}</span>
             </div>
             <Link
               href={`/${lang}/dashboard/settings`}
               className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200 transition-colors cursor-pointer shadow-sm"
               aria-label="Open organisation settings"
             >
               {user?.email?.[0].toUpperCase()}
             </Link>
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full animate-fade-in pb-24 md:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav lang={lang} capabilities={capabilities} />
      
      {/* Floating Action Button */}
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
