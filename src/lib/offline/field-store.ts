// Offline-First Field Queue Store for low-connectivity environments

export interface FieldRecord {
  id: string
  type: 'member_intake' | 'event_checkin' | 'field_grievance' | 'petition_signature'
  data: Record<string, any>
  createdAt: string
  synced: boolean
}

const STORAGE_KEY = 'sangathan_field_queue_v1'

export function getFieldQueue(): FieldRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveFieldQueue(queue: FieldRecord[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  } catch (err) {
    console.error('Failed to save field queue to localStorage', err)
  }
}

export function enqueueFieldRecord(type: FieldRecord['type'], data: Record<string, any>): FieldRecord {
  const queue = getFieldQueue()
  const record: FieldRecord = {
    id: 'field-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    type,
    data,
    createdAt: new Date().toISOString(),
    synced: false,
  }
  queue.push(record)
  saveFieldQueue(queue)
  return record
}

export function removeSyncedRecords(syncedIds: string[]): void {
  const queue = getFieldQueue()
  const remaining = queue.filter((r) => !syncedIds.includes(r.id))
  saveFieldQueue(remaining)
}

export function exportQueueToCsv(records: FieldRecord[]): string {
  if (records.length === 0) return ''
  const headers = ['Record_ID', 'Type', 'Created_At', 'Data_Payload']
  const rows = records.map((r) => [
    r.id,
    r.type,
    r.createdAt,
    `"${JSON.stringify(r.data).replace(/"/g, '""')}"`,
  ])
  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
}
