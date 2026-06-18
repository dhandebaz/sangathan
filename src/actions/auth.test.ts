/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login, signup, otpLogin, forgotPassword, resetPassword, finalizeSignup } from './auth'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redis } from '@/lib/redis'
import { checkRateLimit } from '@/lib/rate-limit/db-limiter'
import { detectOTPRisk } from '@/lib/risk-engine'

// Helper to mock Supabase responses
const mockSupabaseResponse = (data: any = null, error: any = null) => ({
  data,
  error,
})

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should fail if validation fails', async () => {
      const result = await login({ email: 'invalid-email', password: '' })
      expect(result).toEqual({ success: false, error: 'Invalid email address' })
    })

    it('should fail if account is locked', async () => {
      vi.mocked(redis.get).mockResolvedValue(5) // Threshold reached

      const result = await login({ email: 'test@example.com', password: 'Password123!' })
      expect(result?.success).toBe(false)
      expect(result?.error).toContain('Account temporarily locked')
    })

    it('should increment lockout on failed login', async () => {
      vi.mocked(redis.get).mockResolvedValue(0)
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue(mockSupabaseResponse(null, { message: 'Invalid credentials' })),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await login({ email: 'test@example.com', password: 'Password123!' })

      expect(result).toEqual({ success: false, error: 'Invalid credentials' })
      expect(redis.set).toHaveBeenCalled()
      expect(redis.expire).toHaveBeenCalled()
    })

    it('should redirect to dashboard on successful login', async () => {
      vi.mocked(redis.get).mockResolvedValue(0)
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue(mockSupabaseResponse({ user: { id: 'user-123' } })),
          signOut: vi.fn(),
        },
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue(mockSupabaseResponse({ id: 'user-123', organisation_id: null })),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      await expect(login({ email: 'test@example.com', password: 'Password123!' }))
        .rejects.toThrow('Redirected to /en/dashboard')

      expect(redis.del).toHaveBeenCalled()
    })

    it('should fail if organisation is suspended', async () => {
      vi.mocked(redis.get).mockResolvedValue(0)
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue(mockSupabaseResponse({ user: { id: 'user-123' } })),
          signOut: vi.fn(),
        },
        from: vi.fn().mockImplementation((table) => ({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockImplementation(() => {
            if (table === 'profiles') return Promise.resolve(mockSupabaseResponse({ id: 'user-123', organisation_id: 'org-123' }))
            if (table === 'organisations') return Promise.resolve(mockSupabaseResponse({ id: 'org-123', status: 'suspended' }))
            return Promise.resolve(mockSupabaseResponse(null))
          })
        })),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await login({ email: 'test@example.com', password: 'Password123!' })

      expect(result).toEqual({ success: false, error: 'Your organisation has been suspended. Please contact support.' })
      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('signup', () => {
    it('should fail if validation fails', async () => {
      const result = await signup({
        fullName: '',
        email: 'invalid',
        password: '123',
        confirmPassword: '456',
        terms: false
      })
      expect(result?.success).toBe(false)
    })

    it('should return success on successful signup', async () => {
      const mockSupabase = {
        auth: {
          signUp: vi.fn().mockResolvedValue(mockSupabaseResponse({ user: { id: 'user-123' } })),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await signup({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        terms: true
      })

      expect(result).toEqual({ success: true, message: 'Check your email to verify your account.' })
    })

    it('should return error if user already exists', async () => {
      const mockSupabase = {
        auth: {
          signUp: vi.fn().mockResolvedValue(mockSupabaseResponse({ user: { id: 'user-123', identities: [] } })),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await signup({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        terms: true
      })

      expect(result).toEqual({ success: false, error: 'User already registered. Please login.' })
    })
  })

  describe('otpLogin', () => {
    it('should block if risk check fails', async () => {
      vi.mocked(detectOTPRisk).mockResolvedValue({ blocked: true })

      const result = await otpLogin({ email: 'test@example.com' })
      expect(result).toEqual({ success: false, error: 'Too many login attempts. Please try again later.' })
    })

    it('should return success if OTP is sent', async () => {
      vi.mocked(detectOTPRisk).mockResolvedValue({ blocked: false })
      const mockSupabase = {
        auth: {
          signInWithOtp: vi.fn().mockResolvedValue(mockSupabaseResponse({})),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await otpLogin({ email: 'test@example.com' })
      expect(result).toEqual({ success: true, message: 'Check your email for the login link.' })
    })
  })

  describe('forgotPassword', () => {
    it('should return success on password reset request', async () => {
      const mockSupabase = {
        auth: {
          resetPasswordForEmail: vi.fn().mockResolvedValue(mockSupabaseResponse({})),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await forgotPassword({ email: 'test@example.com' })
      expect(result).toEqual({ success: true, message: 'Password reset link sent to your email.' })
    })
  })

  describe('resetPassword', () => {
    it('should update password and revoke sessions', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }),
          updateUser: vi.fn().mockResolvedValue(mockSupabaseResponse({})),
        },
      }
      const mockServiceClient = {
        auth: {
          admin: {
            signOut: vi.fn().mockResolvedValue({}),
          }
        }
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
      vi.mocked(createServiceClient).mockReturnValue(mockServiceClient as any)

      await expect(resetPassword({ password: 'NewPassword123!' }))
        .rejects.toThrow('Redirected to /en/dashboard')

      expect(mockServiceClient.auth.admin.signOut).toHaveBeenCalledWith('user-123')
    })
  })

  describe('finalizeSignup', () => {
    it('should fail if not authenticated', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await finalizeSignup({ organizationName: 'Org', organizationType: 'Type' })
      expect(result).toEqual({ success: false, error: 'Session expired. Please login again.' })
    })

    it('should fail if rate limited', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123', email: 'test@example.com' } },
            error: null
          }),
        },
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
      vi.mocked(checkRateLimit).mockResolvedValue({ allowed: false, error: 'Rate limit exceeded' })

      const result = await finalizeSignup({ organizationName: 'Org', organizationType: 'Type' })
      expect(result).toEqual({ success: false, error: 'Rate limit exceeded' })
    })

    it('should return success on successful organization creation', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'user-123',
                email: 'test@example.com',
                user_metadata: { full_name: 'John Doe' }
              }
            },
            error: null
          }),
        },
      }
      const mockServiceClient = {
        rpc: vi.fn().mockResolvedValue(mockSupabaseResponse({ organisation_id: 'org-123' })),
        from: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      }
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
      vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true })
      vi.mocked(createServiceClient).mockReturnValue(mockServiceClient as any)

      const result = await finalizeSignup({ organizationName: 'My Org', organizationType: 'Non-profit' })
      expect(result).toEqual({ success: true, orgId: 'org-123' })
      expect(mockServiceClient.rpc).toHaveBeenCalled()
    })
  })
})
