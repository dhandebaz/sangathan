/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createNetwork, joinNetwork, getNetworkDetails } from '../networks'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'

// Mock the Supabase clients
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: vi.fn(),
}))

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('networks actions', () => {
  const mockUser = { id: 'user-123', email: 'admin@example.com' }
  const mockOrgId = 'org-123'

  let mockSupabase: { client: any; builder: any }
  let mockSupabaseAdmin: { client: any; builder: any }

  const createMockClient = () => {
    const builder: any = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      then: vi.fn().mockImplementation(function(this: unknown, onfulfilled: (val: any) => any) {
        return Promise.resolve({ data: null, error: null }).then(onfulfilled)
      })
    }

    const client: any = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn().mockReturnValue(builder),
    }

    return { client, builder }
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockSupabase = createMockClient()
    mockSupabaseAdmin = createMockClient()

    vi.mocked(createClient).mockResolvedValue(mockSupabase.client)
    vi.mocked(createServiceClient).mockReturnValue(mockSupabaseAdmin.client)
  })

  describe('createNetwork', () => {
    const validInput = {
      name: 'Test Network',
      description: 'A test network',
      slug: 'test-network',
      visibility: 'public' as const,
    }

    it('should create a network successfully for an authorized admin with federation mode', async () => {
      // Mock profile check
      mockSupabase.builder.single.mockResolvedValueOnce({
        data: {
          role: 'admin',
          organisation_id: mockOrgId,
          organisations: { capabilities: { federation_mode: true } },
        },
        error: null,
      })

      // Mock network creation
      const mockNetwork = { id: 'network-123', ...validInput }
      mockSupabaseAdmin.builder.single.mockResolvedValueOnce({ data: mockNetwork, error: null })

      const result = await createNetwork(validInput)

      expect(result).toEqual({ success: true, id: 'network-123' })
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    })

    it('should return error for invalid input', async () => {
      const invalidInput = { ...validInput, name: 'ab' } // min 3
      const result = await createNetwork(invalidInput as unknown as typeof validInput)
      expect(result.success).toBe(false)
      expect(result.error).toContain('character')
    })

    it('should return error if unauthorized', async () => {
      mockSupabase.client.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: null })
      const result = await createNetwork(validInput)
      expect(result).toEqual({ success: false, error: 'Unauthorized' })
    })

    it('should return error if not an admin', async () => {
      mockSupabase.builder.single.mockResolvedValueOnce({
        data: { role: 'member', organisation_id: mockOrgId, organisations: {} },
        error: null,
      })
      const result = await createNetwork(validInput)
      expect(result).toEqual({ success: false, error: 'Permission denied' })
    })

    it('should return error if federation mode is disabled', async () => {
      mockSupabase.builder.single.mockResolvedValueOnce({
        data: {
          role: 'admin',
          organisation_id: mockOrgId,
          organisations: { capabilities: { federation_mode: false } },
        },
        error: null,
      })
      const result = await createNetwork(validInput)
      expect(result).toEqual({ success: false, error: 'Federation Mode not enabled for your organisation.' })
    })
  })

  describe('joinNetwork', () => {
    const networkId = '550e8400-e29b-41d4-a716-446655440000'

    it('should join a public network successfully', async () => {
      // Mock profile
      mockSupabase.builder.single.mockResolvedValueOnce({
        data: {
          role: 'admin',
          organisation_id: mockOrgId,
          organisations: { name: 'My Org', capabilities: { federation_mode: true } },
        },
        error: null,
      })

      // Mock network lookup
      mockSupabaseAdmin.builder.single.mockResolvedValueOnce({
        data: { id: networkId, visibility: 'public' },
        error: null,
      })

      // Mock membership check (not a member)
      mockSupabaseAdmin.builder.maybeSingle.mockResolvedValueOnce({ data: null, error: null })

      const result = await joinNetwork(networkId)

      expect(result).toEqual({ success: true, status: 'active' })
      expect(revalidatePath).toHaveBeenCalled()
    })

    it('should request to join a private network', async () => {
      mockSupabase.builder.single.mockResolvedValueOnce({
        data: {
          role: 'admin',
          organisation_id: mockOrgId,
          organisations: { name: 'My Org', capabilities: { federation_mode: true } },
        },
        error: null,
      })

      mockSupabaseAdmin.builder.single.mockResolvedValueOnce({
        data: { id: networkId, visibility: 'private' },
        error: null,
      })

      mockSupabaseAdmin.builder.maybeSingle.mockResolvedValueOnce({ data: null, error: null })

      // Mock coordinator emails for notification
      const mockCoordinators = [{ user: { email: 'coord@example.com', full_name: 'Coord' } }]
      mockSupabaseAdmin.builder.then.mockImplementationOnce(function(this: unknown, onfulfilled: (val: any) => any) {
        return Promise.resolve({ data: mockCoordinators, error: null }).then(onfulfilled)
      })

      const result = await joinNetwork(networkId)

      expect(result).toEqual({ success: true, status: 'pending' })
    })

    it('should return error if already a member', async () => {
      mockSupabase.builder.single.mockResolvedValueOnce({
        data: {
          role: 'admin',
          organisation_id: mockOrgId,
          organisations: { capabilities: { federation_mode: true } },
        },
        error: null,
      })

      mockSupabaseAdmin.builder.single.mockResolvedValueOnce({
        data: { id: networkId, visibility: 'public' },
        error: null,
      })

      mockSupabaseAdmin.builder.maybeSingle.mockResolvedValueOnce({
        data: { id: 'mem-1', status: 'active' },
        error: null,
      })

      const result = await joinNetwork(networkId)

      expect(result).toEqual({ success: false, error: 'Your organisation is already a member of this network.' })
    })
  })

  describe('getNetworkDetails', () => {
    it('should fetch network details', async () => {
      const mockNetwork = { id: '123', name: 'Net', slug: 'net' }
      mockSupabaseAdmin.builder.single.mockResolvedValueOnce({ data: mockNetwork, error: null })

      const result = await getNetworkDetails('net')

      expect(result).toEqual(mockNetwork)
      expect(mockSupabaseAdmin.client.from).toHaveBeenCalledWith('networks')
      expect(mockSupabaseAdmin.builder.eq).toHaveBeenCalledWith('slug', 'net')
    })
  })
})
