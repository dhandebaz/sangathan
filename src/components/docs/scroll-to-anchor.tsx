'use client'

import { useEffect } from 'react'

export function ScrollToAnchor() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 150)
      }
    }
  }, [])

  return null
}
