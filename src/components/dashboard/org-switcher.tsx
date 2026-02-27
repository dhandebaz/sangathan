'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type OrgOption = {
  id: string
  name: string
}

interface OrgSwitcherProps {
  currentOrgId: string
  organisations: OrgOption[]
}

export function OrgSwitcher({ currentOrgId, organisations }: OrgSwitcherProps) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  const activeOrg = organisations.find((o) => o.id === currentOrgId) || organisations[0]

  async function handleSelect(orgId: string) {
    if (!orgId || orgId === currentOrgId) return

    startTransition(async () => {
      // 1. Clear any sensitive client-side state/cache if any (e.g. Apollo/SWR, though we use RSC)
      // Since we primarily rely on Next.js Cache and Server Actions, router.refresh() handles most.
      // However, we explicitly clear the cookie via RPC or Server Action to be safe.
      // Here we use the RPC which sets the cookie on server side.
      
      const { error } = await supabase.rpc('set_selected_organisation', {
        p_organisation_id: orgId,
      } as never)

      if (!error) {
        setOpen(false)
        
        // 2. Force hard refresh to clear Router Cache and re-validate user role
        // router.refresh() might keep some client cache.
        // We use window.location.href to force a full document reload for security
        // to prevent "Ghost Access" where old org data might linger in React state.
        window.location.href = window.location.href
      }
    })
  }

  if (!activeOrg) return null

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50',
          pending && 'opacity-75 cursor-wait',
        )}
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate max-w-[160px]">{activeOrg.name}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
      {open && (
        <div className="absolute mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <ul className="max-h-60 overflow-auto py-1 text-sm text-slate-700">
            {organisations.map((org) => (
              <li key={org.id}>
                <button
                  type="button"
                  className={cn(
                    'flex w-full items-center px-3 py-1.5 text-left hover:bg-slate-50',
                    org.id === activeOrg.id && 'bg-slate-50 font-semibold',
                  )}
                  onClick={() => handleSelect(org.id)}
                >
                  <span className="truncate">{org.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
