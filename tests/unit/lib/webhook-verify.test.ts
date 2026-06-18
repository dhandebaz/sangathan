import { describe, it, expect, vi, beforeEach } from 'vitest'
import { webhookErrorResponse, verifyWebhookSignature, verifyWebhookRequest } from '@/lib/webhook-verify'
import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

// Mock the logger to avoid DB writes
vi.mock('@/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    security: vi.fn(),
    critical: vi.fn(),
  },
}))

describe('webhookErrorResponse', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a NextResponse with the correct status and message', async () => {
    const status = 400
    const message = 'Bad Request'

    const response = webhookErrorResponse(status, message)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(status)

    const body = await response.json()
    expect(body).toEqual({ error: message })
  })

  it('should log a warning when called', () => {
    const status = 401
    const message = 'Unauthorized'

    webhookErrorResponse(status, message)

    expect(logger.warn).toHaveBeenCalledWith('webhook', `Rejected webhook: ${message}`)
  })
})

describe('verifyWebhookSignature', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return invalid if signature header is missing', async () => {
    const result = await verifyWebhookSignature('{}', null, 'generic')
    expect(result).toEqual({ valid: false, error: 'Missing signature header' })
  })

  it('should return invalid if provider is not configured', async () => {
    // @ts-expect-error - testing invalid provider
    const result = await verifyWebhookSignature('{}', 'sig', 'unknown')
    expect(result).toEqual({ valid: false, error: 'Webhook not configured' })
  })
})

describe('verifyWebhookRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return invalid if signature verification fails', async () => {
    const mockRequest = {
      text: vi.fn().mockResolvedValue('{"foo":"bar"}'),
      headers: {
        get: vi.fn().mockReturnValue(null) // Missing signature
      }
    } as unknown as Request

    const result = await verifyWebhookRequest(mockRequest, 'stripe')

    expect(result.valid).toBe(false)
    expect(result.response).toBeInstanceOf(NextResponse)
    expect(result.response?.status).toBe(401)
  })
})
