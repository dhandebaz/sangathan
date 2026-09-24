import { describe, expect, it, beforeEach } from 'vitest'
import { splitGst, isDelhiBuyer, invoiceNoFor } from '@/lib/billing/invoices'
import { verifyRazorpayWebhookSignature } from '@/lib/billing/razorpay-webhook'
import { encryptTokenSecret, decryptTokenSecret } from '@/lib/integrations/crypto'
import { getProvider, listProviders, isProviderConfigured, isPlanEligibleForPlugins } from '@/lib/integrations/providers'

describe('GST invoice math (inclusive prices)', () => {
  it('splits CGST/SGST for Delhi buyers', () => {
    const split = splitGst(118, 'Delhi')
    expect(split.subtotal).toBe(100)
    expect(split.cgst).toBe(9)
    expect(split.sgst).toBe(9)
    expect(split.igst).toBe(0)
    expect(split.total).toBe(118)
  })

  it('uses IGST for out-of-state buyers and empty state', () => {
    const mh = splitGst(118, 'Maharashtra')
    expect(mh.igst).toBe(18)
    expect(mh.cgst).toBe(0)
    expect(mh.subtotal).toBe(100)

    const unknown = splitGst(11, null)
    expect(unknown.igst + unknown.subtotal).toBeCloseTo(11, 1)
  })

  it('detects Delhi variants', () => {
    expect(isDelhiBuyer('Delhi')).toBe(true)
    expect(isDelhiBuyer('New Delhi')).toBe(true)
    expect(isDelhiBuyer('DL')).toBe(true)
    expect(isDelhiBuyer('Karnataka')).toBe(false)
    expect(isDelhiBuyer(null)).toBe(false)
  })

  it('builds deterministic invoice numbers', () => {
    const no = invoiceNoFor('2026-09-24', 'abcd1234-ef56-7890')
    expect(no).toBe('SANG-2026-ABCD1234')
  })
})

describe('Razorpay webhook signature', () => {
  it('accepts valid HMAC and rejects tampering', () => {
    const crypto = require('crypto') as typeof import('crypto')
    const secret = 'test_webhook_secret'
    const body = JSON.stringify({ event: 'subscription.charged' })
    const sig = crypto.createHmac('sha256', secret).update(body).digest('hex')
    expect(verifyRazorpayWebhookSignature(body, sig, secret)).toBe(true)
    expect(verifyRazorpayWebhookSignature(body + 'x', sig, secret)).toBe(false)
    expect(verifyRazorpayWebhookSignature(body, sig, 'wrong')).toBe(false)
    expect(verifyRazorpayWebhookSignature(body, null, secret)).toBe(false)
    expect(verifyRazorpayWebhookSignature(body, sig, undefined)).toBe(false)
  })
})

describe('Integration token crypto', () => {
  beforeEach(() => {
    process.env.INTEGRATION_TOKEN_KEY =
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  })

  it('round-trips secrets and fails closed without a key', () => {
    const enc = encryptTokenSecret('canva-refresh-token-abc')
    expect(enc).not.toContain('canva-refresh-token-abc')
    expect(decryptTokenSecret(enc)).toBe('canva-refresh-token-abc')

    delete process.env.INTEGRATION_TOKEN_KEY
    expect(() => encryptTokenSecret('x')).toThrow()
  })
})

describe('Integration provider registry + gating', () => {
  it('lists Canva with minimal scopes and env-driven config', () => {
    const canva = getProvider('canva')
    expect(canva).not.toBeNull()
    expect(canva?.scopes).toContain('design:content:read')
    expect(listProviders().length).toBeGreaterThanOrEqual(1)
    expect(getProvider('nope')).toBeNull()
    // No creds in test env → not configured (gallery shows "Coming soon").
    expect(isProviderConfigured(canva!)).toBe(false)
  })

  it('gates plugins to paying tiers only', () => {
    expect(isPlanEligibleForPlugins('Metered')).toBe(true)
    expect(isPlanEligibleForPlugins('Institution')).toBe(true)
    expect(isPlanEligibleForPlugins('Community')).toBe(false)
    expect(isPlanEligibleForPlugins('')).toBe(false)
  })
})
