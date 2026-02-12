export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-black text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8 text-orange-500">Sangathan</h2>
        <nav className="space-y-4">
          <a href="/" className="block hover:text-orange-400">Dashboard</a>
          <a href="/members" className="block hover:text-orange-400">Members</a>
          <a href="/settings" className="block hover:text-orange-400">Settings</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
