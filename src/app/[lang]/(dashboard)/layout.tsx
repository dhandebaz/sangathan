import Link from 'next/link'
import { LayoutDashboard, Users, Settings, LogOut, Menu, Megaphone, Calendar, CheckSquare, BarChart, Vote, Scale, Globe } from 'lucide-react'
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
    const { data: profileData } = await supabase.from('profiles').select('organization_id, role').eq('id', user.id).single()
    const profile = profileData as any
    if (profile?.organization_id) {
      capabilities = await getOrgCapabilities(profile.organization_id)
      role = profile.role
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground pb-16 md:pb-0">
      {/* Sidebar (Desktop) */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar text-sidebar-fg hidden md:flex flex-col">
        <div className="h-14 flex items-center px-6 border-b border-sidebar-border">
          <Link href={`/${lang}/dashboard`} className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
            Sangathan
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-3 space-y-1">
          <nav className="space-y-1">
             <Link href={`/${lang}/dashboard`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-bg-active hover:text-sidebar-fg-active transition-colors group">
               <LayoutDashboard className="w-4 h-4" />
               Dashboard
             </Link>
             <Link href={`/${lang}/announcements`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-bg-active hover:text-sidebar-fg-active transition-colors group">
               <Megaphone className="w-4 h-4" />
               Announcements
             </Link>
             <Link href={`/${lang}/dashboard/events`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-bg-active hover:text-sidebar-fg-active transition-colors group">
               <Calendar className="w-4 h-4" />
               Events
             </Link>
             
             {capabilities.volunteer_engine && (
               <Link href={`/${lang}/dashboard/tasks`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-bg-active hover:text-sidebar-fg-active transition-colors group">
                 <CheckSquare className="w-4 h-4" />
                 Tasks
               </Link>
             )}
             
             {capabilities.voting_engine && (
               <Link href={`/${lang}/dashboard/polls`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-bg-active hover:text-sidebar-fg-active transition-colors group">
                 <Vote className="w-4 h-4" />
                 Decisions
               </Link>
             )}

             {capabilities.federation_mode && (
               <Link href={`/${lang}/dashboard/networks`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-bg-active hover:text-sidebar-fg-active transition-colors group">
                 <Globe className="w-4 h-4" />
                 Networks
               </Link>
             )}
             
             <Link href={`/${lang}/dashboard/appeals`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-bg-active hover:text-sidebar-fg-active transition-colors group">
               <Scale className="w-4 h-4" />
               Appeals
             </Link>
             <Link href={`/${lang}/dashboard/members`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-bg-active hover:text-sidebar-fg-active transition-colors group">
               <Users className="w-4 h-4" />
               Members
             </Link>
             
             {capabilities.advanced_analytics && (
               <Link href={`/${lang}/dashboard/analytics`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-bg-active hover:text-sidebar-fg-active transition-colors group">
                 <BarChart className="w-4 h-4" />
                 Analytics
               </Link>
             )}
             
             <Link href={`/${lang}/dashboard/settings`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-bg-active hover:text-sidebar-fg-active transition-colors group">
               <Settings className="w-4 h-4" />
               Settings
             </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 flex items-center justify-between">
           <div className="flex items-center gap-4 md:hidden">
             {/* Mobile Nav is used instead of hamburger for main navigation, but we might want a drawer for 'More' */}
             <span className="font-bold text-lg">Sangathan</span>
           </div>
           
           <div className="ml-auto flex items-center gap-4">
             {/* Add UserProfile dropdown or similar here later */}
             <div className="w-8 h-8 rounded-full bg-neutral-200" />
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] mx-auto w-full animate-fade-in pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav lang={lang} role={role} capabilities={capabilities} />
      
      {/* Floating Action Button */}
      <ContextualFAB lang={lang} role={role} capabilities={capabilities} />
    </div>
  )
}
