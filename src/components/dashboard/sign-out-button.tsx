'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function SignOutButton({ lang }: { lang: string }) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    if (isSigningOut) return
    setIsSigningOut(true)
    await supabase.auth.signOut()
    router.push(`/${lang}/login`)
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-fg transition-colors hover:bg-accent hover:text-foreground"
    >
      <LogOut className="h-4 w-4" />
      <span>{isSigningOut ? 'Signing out\u2026' : 'Sign Out'}</span>
    </button>
  )
}
