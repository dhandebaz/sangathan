'use client'

export interface OfflineQueueItem {
  id: string
  actionType: 'induction' | 'canvassing' | 'sos_alert' | 'mess_rating'
  payload: any
  timestamp: string
}

const STORAGE_KEY = 'sangathan_offline_queue'

export function getOfflineQueue(): OfflineQueueItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addToOfflineQueue(actionType: OfflineQueueItem['actionType'], payload: any): OfflineQueueItem {
  const item: OfflineQueueItem = {
    id: `off_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    actionType,
    payload,
    timestamp: new Date().toISOString()
  }

  const queue = getOfflineQueue()
  queue.push(item)
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  }
  return item
}

export function clearOfflineQueueItem(id: string) {
  if (typeof window === 'undefined') return
  const queue = getOfflineQueue().filter(i => i.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
}

export function clearAllOfflineQueue() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
