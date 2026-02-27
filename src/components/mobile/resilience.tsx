'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Simple LocalStorage-based caching for offline resilience
// In a real PWA, we would use Service Workers and IndexedDB.

export function useResilientMembers(orgId: string) {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const supabase = createClient()
  const CACHE_KEY = `sangathan-members-${orgId}`

  useEffect(() => {
    // 1. Load from Cache First (Stale-While-Revalidate)
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        setMembers(parsed.data)
        // If cache is fresh enough (< 1 hour), maybe don't fetch?
        // But we want SWR, so we fetch anyway unless offline.
      } catch (e) {
        console.error('Cache parse error', e)
      }
    }

    // 2. Fetch Fresh Data
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('id, full_name, phone, status, role')
          .eq('organisation_id', orgId)
          .limit(100) // Page size for mobile
        
        if (error) throw error
        
        if (data) {
           setMembers(data)
           localStorage.setItem(CACHE_KEY, JSON.stringify({
               timestamp: Date.now(),
               data: data
           }))
        }
      } catch (err) {
        console.warn('Offline mode active or fetch failed:', err)
        setIsOffline(true)
      } finally {
        setLoading(false)
      }
    }

    // Check connectivity
    if (navigator.onLine) {
        fetchMembers()
    } else {
        setIsOffline(true)
        setLoading(false)
    }

    // Listen for online status
    const handleOnline = () => { setIsOffline(false); fetchMembers(); }
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
    }
  }, [orgId, supabase])

  return { members, loading, isOffline }
}

export function OfflineIndicator() {
    const [isOffline, setIsOffline] = useState(false)
    
    useEffect(() => {
        setIsOffline(!navigator.onLine)
        
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
