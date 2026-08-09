import { describe, it, expect } from 'vitest'

function cleanPhoneNumber(raw: string): string {
  let cleaned = raw.replace(/[^\d+]/g, '').trim()
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '+91' + cleaned.substring(1)
  } else if (!cleaned.startsWith('+') && cleaned.length === 10) {
    cleaned = '+91' + cleaned
  }
  return cleaned
}

describe('Universal Member Importer Phone Normalizer', () => {
  it('should normalize standard 10-digit Indian numbers to E.164 +91 format', () => {
    expect(cleanPhoneNumber('9876543210')).toBe('+919876543210')
    expect(cleanPhoneNumber('98765 43210')).toBe('+919876543210')
    expect(cleanPhoneNumber('98765-43210')).toBe('+919876543210')
  })

  it('should normalize 11-digit leading zero numbers to +91', () => {
    expect(cleanPhoneNumber('09876543210')).toBe('+919876543210')
  })

  it('should preserve already formatted +91 international numbers', () => {
    expect(cleanPhoneNumber('+919876543210')).toBe('+919876543210')
    expect(cleanPhoneNumber('+91 98765 43210')).toBe('+919876543210')
  })
})
