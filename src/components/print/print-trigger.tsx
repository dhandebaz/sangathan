'use client'

import { useEffect } from 'react'

export function PrintTrigger() {
  useEffect(() => {
    // Small delay to ensure the content is fully rendered before print dialog appears
    const timer = setTimeout(() => {
      window.print()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return null
}
