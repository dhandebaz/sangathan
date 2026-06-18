import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
import '../../../tests/mocks'
import { addMember, updateMember, changeMemberStatus } from './actions'
import { mockSupabase, mockRedis } from '../../../tests/mocks'
import { requireRole } from '@/lib/auth/context'
import { UserContext } from '@/types/auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = mockSupabase as any

describe('Members Actions', () => {
  const mockContext: UserContext = {
    user: { id: 'user-1', email: 'user@example.com' },
    organizationId: 'org-1',
    role: 'admin',
    memberships: []
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockRedis.get.mockResolvedValue(0)
    ;(requireRole as Mock).mockResolvedValue(mockContext)

    supabase.from.mockReturnValue(supabase)
    supabase.insert.mockReturnValue(supabase)
    supabase.update.mockReturnValue(supabase)
    supabase.select.mockReturnValue(supabase)
    supabase.eq.mockReturnValue(supabase)
    supabase.single.mockReturnValue(supabase)
  })

  describe('addMember', () => {
    const validMember = {
      full_name: 'John Doe',
      phone: '1234567890',
      email: 'john@example.com',
      role: 'member' as const,
      status: 'active' as const,
    }

    it('should successfully add a member', async () => {
      supabase.single.mockResolvedValueOnce({ data: { id: 'member-1' }, error: null })
      const result = await addMember(validMember)
      expect(result.success).toBe(true)
      expect(result.data).toEqual({ success: true, memberId: 'member-1' })
    })

    it('should return error for duplicate phone number', async () => {
      supabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: '23505', message: 'duplicate key' }
      })
      const result = await addMember(validMember)
      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('error', 'Phone number already exists in this organisation.')
    })

    it('should return error for generic failure', async () => {
      supabase.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      })
      const result = await addMember(validMember)
      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('error', 'Database error')
    })
  })

  describe('updateMember', () => {
    const updateData = {
      memberId: '00000000-0000-0000-0000-000000000000',
      full_name: 'Jane Doe',
      phone: '1234567890',
    }

    it('should successfully update a member', async () => {
      supabase.eq.mockReturnValueOnce(supabase).mockResolvedValueOnce({ error: null })
      const result = await updateMember(updateData)
      expect(result.success).toBe(true)
      expect(result.data).toEqual({ success: true })
    })

    it('should return error for duplicate phone number during update', async () => {
      supabase.eq
        .mockReturnValueOnce(supabase)
        .mockResolvedValueOnce({ error: { code: '23505' } })
      const result = await updateMember(updateData)
      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('error', 'Phone number already exists.')
    })
  })

  describe('changeMemberStatus', () => {
    const statusData = {
      memberId: '00000000-0000-0000-0000-000000000000',
      status: 'inactive' as const
    }

    it('should successfully change status', async () => {
      supabase.eq.mockReturnValueOnce(supabase).mockResolvedValueOnce({ error: null })
      const result = await changeMemberStatus(statusData)
      expect(result.success).toBe(true)
      expect(result.data).toEqual({ success: true })
    })

    it('should return error on failure', async () => {
      supabase.eq.mockReturnValueOnce(supabase).mockResolvedValueOnce({
          error: { message: 'fail' }
      })
      const result = await changeMemberStatus(statusData)
      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('error', 'fail')
    })
  })
})

describe('Role-based Access', () => {
  it('should allow admin role', async () => {
    ;(requireRole as Mock).mockResolvedValue({
      user: { id: 'admin-1', email: 'admin@example.com' },
      organizationId: 'org-1',
      role: 'admin',
      memberships: []
    })
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'm1' }, error: null })

    const result = await addMember({
      full_name: 'Test',
      phone: '1234567890',
    })
    expect(result.success).toBe(true)
  })

  it('should allow editor role', async () => {
    ;(requireRole as Mock).mockResolvedValue({
      user: { id: 'editor-1', email: 'editor@example.com' },
      organizationId: 'org-1',
      role: 'editor',
      memberships: []
    })
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'm1' }, error: null })

    const result = await addMember({
      full_name: 'Test',
      phone: '1234567890',
    })
    expect(result.success).toBe(true)
  })

  it('should deny viewer role (handled by createSafeAction)', async () => {
    ;(requireRole as Mock).mockImplementationOnce((roles: string[]) => {
      if (roles && !roles.includes('viewer')) {
        throw new Error('Forbidden')
      }
      return Promise.resolve({ role: 'viewer' })
    })

    const result = await addMember({
      full_name: 'Test',
      phone: '1234567890',
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Forbidden')
  })
})
