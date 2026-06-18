import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateSession } from './middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// Mock dependencies
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}))

vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn(),
    redirect: vi.fn(),
    json: vi.fn(),
  },
  NextRequest: vi.fn(),
}))

vi.mock('@/lib/i18n/config', () => ({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'hi'],
  },
}))

vi.mock('@/lib/auth/cookie', () => ({
  createSignedCookie: vi.fn(),
  verifySignedCookie: vi.fn(),
}))

vi.mock('@/lib/maintenance', () => ({
  isMaintenanceMode: vi.fn(() => false),
}))

describe('middleware updateSession', () => {
  let mockRequest: any
  let mockResponse: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'

    mockResponse = {
      cookies: {
        set: vi.fn(),
      },
      headers: {
        set: vi.fn(),
      },
    }

    mockRequest = {
      cookies: {
        getAll: vi.fn(() => []),
        set: vi.fn(),
        get: vi.fn(),
      },
      nextUrl: {
        pathname: '/',
        clone: vi.fn(function() {
            return {
                pathname: this.pathname,
                clone: vi.fn().mockReturnThis()
            }
        }),
      },
      url: 'https://example.com/',
    }

    vi.mocked(NextResponse.next).mockReturnValue(mockResponse)
    vi.mocked(NextResponse.redirect).mockReturnValue(mockResponse)
  })

  it('should handle auth error gracefully and proceed as unauthenticated', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Mock createServerClient to return an object where getUser throws
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockRejectedValue(new Error('Auth failed')),
      },
      from: vi.fn(),
    } as any)

    const result = await updateSession(mockRequest as any)

    expect(consoleSpy).toHaveBeenCalledWith('Middleware Auth Error:', expect.any(Error))
    expect(NextResponse.next).toHaveBeenCalled()
    expect(result).toBe(mockResponse)

    consoleSpy.mockRestore()
  })

  it('should redirect to login if auth error occurs when accessing admin route', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    mockRequest.nextUrl.pathname = '/admin'

    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockRejectedValue(new Error('Auth failed')),
      },
    } as any)

    await updateSession(mockRequest as any)

    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.objectContaining({
        pathname: '/login'
    }))
  })
})
