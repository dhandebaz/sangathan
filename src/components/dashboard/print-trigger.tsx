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
        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-2 shadow-sm rounded-xl"
      >
        <Printer className="w-4 h-4" />
        Print / Save as PDF
      </Button>
    </div>
  )
}
