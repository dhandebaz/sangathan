import Link from 'next/link'
import { LayoutDashboard, Users, Settings, LogOut, Megaphone, Calendar, CheckSquare, BarChart, Vote, Scale, Globe } from 'lucide-react'
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
      .select('organization_id, role')
      .eq('id', user.id)
      .single()
    
    // If profile is missing but user is logged in, this is a state that needs handling
    if (profileError || !profileData) {
      // In a real app, you'd trigger profile creation here or redirect to onboarding
      capabilities = { basic_governance: false }
    } else {
      const profile = profileData
      if (profile?.organization_id) {
        capabilities = await getOrgCapabilities(profile.organization_id)
        role = profile.role
      } else {
        capabilities = { basic_governance: false }
      }
    }
  }

  const isAdmin = ['admin', 'executive'].includes(role)
  const isEditor = isAdmin || role === 'editor'

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-foreground pb-16 md:pb-0 font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white hidden md:flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link href={`/${lang}/dashboard`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Sangathan</span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto">
          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Main Menu</h3>
            <nav className="space-y-1">
               <SidebarLink href={`/${lang}/dashboard`} icon={LayoutDashboard} label="Overview" />
               <SidebarLink href={`/${lang}/announcements`} icon={Megaphone} label="Announcements" />
               <SidebarLink href={`/${lang}/events`} icon={Calendar} label="Events" />
            </nav>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Operations</h3>
            <nav className="space-y-1">
               {capabilities.volunteer_engine && (
                 <SidebarLink href={`/${lang}/tasks`} icon={CheckSquare} label="Tasks" />
               )}
               {capabilities.voting_engine && (
                 <SidebarLink href={`/${lang}/polls`} icon={Vote} label="Decisions" />
               )}
               {capabilities.federation_mode && (
                 <SidebarLink href={`/${lang}/networks`} icon={Globe} label="Networks" />
               )}
               {isEditor && (
                 <SidebarLink href={`/${lang}/appeals`} icon={Scale} label="Appeals" />
               )}
               <SidebarLink href={`/${lang}/members`} icon={Users} label="Members" />
            </nav>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">System</h3>
            <nav className="space-y-1">
               {capabilities.advanced_analytics && isAdmin && (
                 <SidebarLink href={`/${lang}/analytics`} icon={BarChart} label="Analytics" />
               )}
               {isAdmin && (
                 <SidebarLink href={`/${lang}/settings`} icon={Settings} label="Settings" />
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
             <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
             <span className="font-bold text-lg text-slate-900">Sangathan</span>
           </div>
           
           <div className="ml-auto flex items-center gap-4">
             <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-slate-900">{user?.email?.split('@')[0]}</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{role || 'Member'}</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200 transition-colors cursor-pointer shadow-sm">
               {user?.email?.[0].toUpperCase()}
             </div>
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
