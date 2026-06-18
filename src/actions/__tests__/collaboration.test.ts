/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createCollaborationRequest, respondToCollaborationRequest, getCollaboratingOrgs, getPendingRequests } from '../collaboration'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { UserContext } from '@/types/auth'

const mockUser = { id: '00000000-0000-0000-0000-000000000001', email: 'test@example.com' }
const mockOrgId = '00000000-0000-0000-0000-000000000002'
const mockTargetOrgId = '00000000-0000-0000-0000-000000000003'

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/auth/actions', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    createSafeAction: vi.fn((schema, handler) => {
      return async (input: unknown) => {
        const validation = schema.safeParse(input)
        if (!validation.success) {
          return { success: false, error: validation.error.issues[0].message }
        }
        try {
          const mockContext: UserContext = {
            user: mockUser,
            organizationId: mockOrgId,
            role: 'admin',
            memberships: [],
          }
          const data = await handler(validation.data, mockContext)
          return { success: true, data }
        } catch (error: any) {
          const message = error?.message || 'Unknown error'
          return { success: false, error: message }
        }
      }
    }),
  }
})

vi.mock('@/lib/redis', () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    expire: vi.fn(),
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}))

describe('collaboration actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createCollaborationRequest', () => {
    it('successfully creates a request', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null }),
        insert: vi.fn().mockResolvedValue({ error: null }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await createCollaborationRequest({ targetOrgId: mockTargetOrgId })

      expect(result.success).toBe(true)
      expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
        requester_org_id: mockOrgId,
        responder_org_id: mockTargetOrgId,
        status: 'pending',
        created_by: mockUser.id,
      }))
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    })

    it('fails if collaborating with self', async () => {
      const result = await createCollaborationRequest({ targetOrgId: mockOrgId })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Cannot collaborate with yourself')
    })

    it('fails if request already pending', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: '1', status: 'pending' } }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await createCollaborationRequest({ targetOrgId: mockTargetOrgId })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Request already pending')
    })

    it('fails if request already active', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: '1', status: 'active' } }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await createCollaborationRequest({ targetOrgId: mockTargetOrgId })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Already collaborated')
    })

    it('fails if request has other status', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: '1', status: 'rejected' } }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await createCollaborationRequest({ targetOrgId: '00000000-0000-0000-0000-000000000099' })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Previous request exists')
    })
  })

  describe('respondToCollaborationRequest', () => {
    const mockLinkId = 'link-1'

    it('successfully accepts a request', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: mockLinkId, requester_org_id: mockTargetOrgId, responder_org_id: mockOrgId, status: 'pending' }
        }),
        update: vi.fn().mockReturnThis(),
      }

      const mockEq = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.update = vi.fn().mockReturnValue({
        eq: mockEq
      })

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await respondToCollaborationRequest({ linkId: mockLinkId, status: 'active' })

      expect(result.success).toBe(true)
      expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'active' })
      expect(mockEq).toHaveBeenCalledWith('id', mockLinkId)
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    })

    it('fails if request not found', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await respondToCollaborationRequest({ linkId: mockLinkId, status: 'active' })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Request not found')
    })

    it('fails if not authorized to respond (not responder)', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: mockLinkId, requester_org_id: mockOrgId, responder_org_id: 'other-org', status: 'pending' }
        }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await respondToCollaborationRequest({ linkId: mockLinkId, status: 'active' })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authorized to respond')
    })

    it('successfully allows requester to cancel', async () => {
      const mockLinkId = 'link-requester-cancel'
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: mockLinkId, requester_org_id: mockOrgId, responder_org_id: 'other-org', status: 'pending' }
        }),
        update: vi.fn().mockReturnThis(),
      }

      const mockEq = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.update = vi.fn().mockReturnValue({
        eq: mockEq
      })

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await respondToCollaborationRequest({ linkId: mockLinkId, status: 'rejected' })

      expect(result.success).toBe(true)
      expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'rejected' })
    })
  })

  describe('getCollaboratingOrgs', () => {
    it('returns collaborating partners', async () => {
      const mockLinks = [
        { id: '1', status: 'active', requester: { id: mockOrgId, name: 'My Org' }, responder: { id: 'org-2', name: 'Partner 1' } },
        { id: '2', status: 'active', requester: { id: 'org-3', name: 'Partner 2' }, responder: { id: mockOrgId, name: 'My Org' } },
      ]
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockLinks }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as any)

      const result = await getCollaboratingOrgs(mockOrgId)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('org-2')
      expect(result[1].id).toBe('org-3')
    })
  })

  describe('getPendingRequests', () => {
    it('returns incoming and outgoing pending requests', async () => {
      const mockIncoming = [{ id: '1', status: 'pending', requester: { id: 'org-2', name: 'Requester' } }]
      const mockOutgoing = [{ id: '2', status: 'pending', responder: { id: 'org-3', name: 'Responder' } }]

      let callCount = 0
      const mockSupabaseFixed = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation(() => {
          return {
            eq: vi.fn().mockImplementation(() => {
              callCount++
              return Promise.resolve({ data: callCount === 1 ? mockIncoming : mockOutgoing })
            })
          }
        })
      }

      vi.mocked(createServiceClient).mockReturnValue(mockSupabaseFixed as any)

      const result = await getPendingRequests(mockOrgId)

      expect(result.incoming).toHaveLength(1)
      expect(result.outgoing).toHaveLength(1)
      expect((result.incoming[0] as any).requester.id).toBe('org-2')
      expect((result.outgoing[0] as any).responder.id).toBe('org-3')
    })
  })

  describe('Error handling', () => {
    it('throws error if insert fails in createCollaborationRequest', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null }),
        insert: vi.fn().mockResolvedValue({ error: { message: 'Insert failed' } }),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await createCollaborationRequest({ targetOrgId: mockTargetOrgId })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insert failed')
    })

    it('throws error if update fails in respondToCollaborationRequest', async () => {
      const mockLinkId = 'link-fail'
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: mockLinkId, requester_org_id: mockTargetOrgId, responder_org_id: mockOrgId, status: 'pending' }
        }),
        update: vi.fn().mockReturnThis(),
      }
      mockSupabase.update = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: { message: 'Update failed' } })
      })
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await respondToCollaborationRequest({ linkId: mockLinkId, status: 'active' })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Update failed')
    })
  })
})
