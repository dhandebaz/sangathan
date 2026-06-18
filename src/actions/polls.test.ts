import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { createPoll, castVote, closePoll } from './polls'
import { revalidatePath } from 'next/cache'
import { Role, UserContext } from '@/types/auth'
import { z } from 'zod'

const ORG_ID = '550e8400-e29b-41d4-a716-446655440001'
const POLL_ID = '550e8400-e29b-41d4-a716-446655440002'
const OPT_ID = '550e8400-e29b-41d4-a716-446655440003'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: '550e8400-e29b-41d4-a716-446655440002' }, error: null }),
    eq: vi.fn().mockReturnThis(),
  }),
}))

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: vi.fn().mockImplementation((fn: (data: unknown) => unknown) => Promise.resolve({ data: [], error: null }).then(fn)),
  }),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

let mockUserRole: Role = 'admin'

vi.mock('@/lib/auth/actions', () => ({
  createSafeAction: <TInput, TOutput>(
    schema: z.ZodSchema<TInput>,
    handler: (input: TInput, context: UserContext) => Promise<TOutput>
  ) => {
    return async (input: TInput) => {
      const validation = schema.safeParse(input)
      if (!validation.success) {
        return { success: false, error: validation.error?.issues[0].message }
      }
      const context: UserContext = {
        user: { id: '550e8400-e29b-41d4-a716-446655440004', email: 'test@example.com' },
        organizationId: '550e8400-e29b-41d4-a716-446655440001',
        role: mockUserRole,
        memberships: []
      }
      try {
        const result = await handler(validation.data, context)
        return { success: true, ...(result as object) }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return { success: false, error: message }
      }
    }
  }
}))

describe('polls actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUserRole = 'admin'
  })

  describe('createPoll', () => {
    it('should create a poll successfully', async () => {
      const result = await createPoll({
        title: 'Test Poll',
        description: 'Test Description',
        type: 'informal' as const,
        visibility_level: 'members' as const,
        voting_method: 'anonymous' as const,
        options: ['Option 1', 'Option 2'],
        is_public: false
      })
      expect(result.success).toBe(true)
      expect(revalidatePath).toHaveBeenCalled()
    })

    it('should fail with invalid input', async () => {
      const input = {
        title: 'Po', // too short
        options: ['Opt 1'], // too few
      }
      const result = await createPoll(input as unknown as Parameters<typeof createPoll>[0])
      expect(result.success).toBe(false)
    })
  })

  describe('castVote', () => {
    it('should cast an anonymous vote successfully', async () => {
      const { createServiceClient } = await import('@/lib/supabase/service')
      const mockSupabaseAdmin = createServiceClient() as unknown as { single: Mock }
      const mockPoll = {
        id: POLL_ID,
        organisation_id: ORG_ID,
        status: 'active',
        visibility_level: 'members',
        voting_method: 'anonymous'
      }

      mockSupabaseAdmin.single
        .mockResolvedValueOnce({ data: mockPoll, error: null }) // poll check
        .mockResolvedValueOnce({ data: null, error: null }) // double vote check

      const result = await castVote({ poll_id: POLL_ID, option_id: OPT_ID })
      expect(result.success).toBe(true)
      expect(revalidatePath).toHaveBeenCalled()
    })
  })

  describe('closePoll', () => {
    it('should close a poll and calculate results', async () => {
      const { createServiceClient } = await import('@/lib/supabase/service')
      const mockSupabaseAdmin = createServiceClient() as unknown as { single: Mock, then: Mock }
      const mockPoll = {
        id: POLL_ID,
        organisation_id: ORG_ID,
        status: 'active',
        type: 'informal'
      }
      const mockVotes = [
        { option_id: 'opt-1' },
        { option_id: 'opt-1' },
        { option_id: 'opt-2' },
      ]

      mockSupabaseAdmin.single.mockResolvedValue({ data: mockPoll, error: null })
      mockSupabaseAdmin.then.mockImplementation((fn: (data: unknown) => unknown) =>
        Promise.resolve({ data: mockVotes, error: null }).then(fn)
      )

      const result = await closePoll({ poll_id: POLL_ID })
      expect(result.success).toBe(true)
      expect(revalidatePath).toHaveBeenCalled()
    })
  })
})
