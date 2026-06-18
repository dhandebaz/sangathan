'use client'

import { useEffect } from 'react'

/**
 * A client-side component that triggers the browser's print dialog
 * safely upon mounting. This replaces the insecure use of
 * dangerouslySetInnerHTML in script tags.
 */
export function AutoPrint() {
  useEffect(() => {
    // We use a small timeout to ensure the DOM is fully ready and
    // any styles are applied before the print dialog opens.
    const timer = setTimeout(() => {
      window.print()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return null
}
