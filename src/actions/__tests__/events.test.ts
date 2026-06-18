import { describe, it, expect, vi, beforeEach } from 'vitest'

// 1. Mocks must come before imports of the code being tested
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => mockSupabase),
}))

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: vi.fn(() => mockSupabase),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

interface MockResult {
  data: unknown;
  error: unknown;
  count: number | null;
  [key: string]: unknown;
}

const createMockResult = (data: unknown = null, error: unknown = null, count: number | null = null): MockResult => {
  const promise = Promise.resolve({ data, error, count }) as unknown as MockResult
  const methods = ['from', 'select', 'insert', 'update', 'delete', 'eq', 'or', 'order', 'limit', 'single', 'maybeSingle', 'rpc', 'head', 'range']
  methods.forEach(m => {
    promise[m] = vi.fn().mockImplementation(() => promise)
  })
  return promise
}

const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  },
  from: vi.fn().mockImplementation(() => createMockResult()),
}

import { createEvent, updateEvent, rsvpToEvent, generateQRData, verifyAndCheckIn } from '../events'
import { revalidatePath } from 'next/cache'

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000'
const ANOTHER_UUID = '660e8400-e29b-41d4-a716-446655440000'

describe('events actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: VALID_UUID } }, error: null })
    mockSupabase.from.mockImplementation(() => createMockResult())
  })

  describe('createEvent', () => {
    const input = {
      title: 'Test Event',
      start_time: new Date(Date.now() + 86400000).toISOString(),
      event_type: 'public' as const,
      rsvp_enabled: true,
      organisation_id: VALID_UUID
    }

    it('should create successfully', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') return createMockResult({ role: 'admin', organisation_id: VALID_UUID })
        return createMockResult({ id: ANOTHER_UUID })
      })

      const result = await createEvent(input)
      expect(result.success).toBe(true)
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    })

    it('should fail if unauthorized', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })
      const result = await createEvent(input)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Unauthorized')
    })

    it('should fail if permission denied', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') return createMockResult({ role: 'viewer', organisation_id: VALID_UUID })
        return createMockResult()
      })
      const result = await createEvent(input)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Permission denied')
    })
  })

  describe('updateEvent', () => {
    const input = {
      id: VALID_UUID,
      title: 'Updated',
      start_time: new Date(Date.now() + 86400000).toISOString(),
      event_type: 'public' as const,
      rsvp_enabled: true,
      organisation_id: ANOTHER_UUID
    }

    it('should update successfully', async () => {
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') return createMockResult({ role: 'admin', organisation_id: ANOTHER_UUID })
        return createMockResult({})
      })

      const result = await updateEvent(input)
      expect(result.success).toBe(true)
    })
  })

  describe('rsvpToEvent', () => {
    const eventId = VALID_UUID

    it('should allow public RSVP for guest', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      let callCount = 0
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'events') return createMockResult({ id: eventId, event_type: 'public', rsvp_enabled: true })
        if (table === 'event_rsvps') {
          callCount++
          if (callCount === 1) return createMockResult(null, { code: 'PGRST116' }) // Duplicate check
          return createMockResult({}) // Insert
        }
        return createMockResult()
      })

      const result = await rsvpToEvent({
        event_id: eventId,
        guest_name: 'Guest',
        guest_email: 'guest@example.com'
      })
      expect(result.success).toBe(true)
    })

    it('should block if event is full', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'events') return createMockResult({ id: eventId, event_type: 'public', rsvp_enabled: true, capacity: 5 })
        if (table === 'event_rsvps') return createMockResult(null, null, 5) // Capacity check
        return createMockResult()
      })

      const result = await rsvpToEvent({
        event_id: eventId,
        guest_name: 'Guest',
        guest_email: 'guest@example.com'
      })
      expect(result.success).toBe(false)
      expect(result.error).toBe('Event is full')
    })
  })

  describe('QR check-in', () => {
    it('should verify and check in successfully', async () => {
      const qrData = await generateQRData(VALID_UUID, ANOTHER_UUID)

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') return createMockResult({ role: 'admin', organisation_id: 'org1', status: 'active' })
        if (table === 'events') return createMockResult({ organisation_id: 'org1' })
        if (table === 'event_rsvps') return createMockResult({ id: 'r1', status: 'registered' })
        return createMockResult({})
      })

      const result = await verifyAndCheckIn({ qrData, scannedByUserId: VALID_UUID })
      expect(result.success).toBe(true)
    })

    it('should fail for invalid signature', async () => {
        const result = await verifyAndCheckIn({ qrData: 'invalid.sig', scannedByUserId: VALID_UUID })
        expect(result.success).toBe(false)
        expect(result.error).toBe('Invalid Signature')
    })
  })
})
