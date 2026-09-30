'use client'

import { useEffect } from 'react'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrintTrigger() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print()
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="print:hidden mb-6 flex justify-end gap-2">
      <Button
        onClick={() => window.print()}
        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-white font-bold text-xs gap-2 shadow-sm rounded-sm"
      >
        <Printer className="w-4 h-4" />
        Print / Save as PDF
      </Button>
    </div>
  )
}
