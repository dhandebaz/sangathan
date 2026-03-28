'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ResilientMember = {
  id: string
  full_name: string
  phone: string | null
  status: string | null
  role: string | null
}

export function useResilientMembers(orgId: string) {
  const [members, setMembers] = useState<ResilientMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const cacheKey = `sangathan-members-${orgId}`

  useEffect(() => {
    const supabase = createClient()
    const cached = localStorage.getItem(cacheKey)

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { data?: ResilientMember[] }
        setMembers(parsed.data || [])
      } catch (error) {
        console.error('Cache parse error', error)
      }
    }

    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('id, full_name, phone, status, role')
          .eq('organisation_id', orgId)
          .limit(100)

        if (error) throw error

        if (data) {
          setMembers(data)
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              timestamp: Date.now(),
              data,
            })
          )
        }
      } catch (error) {
        console.warn('Offline mode active or fetch failed:', error)
        setIsOffline(true)
      } finally {
        setLoading(false)
      }
    }

    if (navigator.onLine) {
      fetchMembers()
    } else {
      setIsOffline(true)
      setLoading(false)
    }

    const handleOnline = () => {
      setIsOffline(false)
      void fetchMembers()
    }
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [orgId, cacheKey])

  return { members, loading, isOffline }
}

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(() => (typeof navigator !== 'undefined' ? !navigator.onLine : false))

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed bottom-4 right-4 bg-orange-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg z-50 flex items-center gap-2 animate-pulse">
      <span className="w-2 h-2 bg-white rounded-full"></span>
      Offline Mode
    </div>
  )
}
