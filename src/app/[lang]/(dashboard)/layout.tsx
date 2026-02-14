import Link from 'next/link'
import { LayoutDashboard, Users, Settings, LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function DashboardLayout(props: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
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
             <Link href={`/${lang}/members`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-bg-active hover:text-sidebar-fg-active transition-colors group">
               <Users className="w-4 h-4" />
               Members
             </Link>
             <Link href={`/${lang}/settings`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-bg-active hover:text-sidebar-fg-active transition-colors group">
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
             <Button variant="ghost" size="icon">
               <Menu className="w-5 h-5" />
             </Button>
             <span className="font-bold">Sangathan</span>
           </div>
           
           <div className="ml-auto flex items-center gap-4">
             {/* Add UserProfile dropdown or similar here later */}
             <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse" />
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
