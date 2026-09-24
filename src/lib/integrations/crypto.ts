import crypto from 'crypto'

/**
 * AES-256-GCM token envelope for OAuth secrets stored in capabilities JSON.
 * Fails CLOSED: throws when INTEGRATION_TOKEN_KEY is missing/malformed so
 * tokens are never persisted weakly. Env value = 64 hex chars (32 bytes).
 */

function getKey(): Buffer {
  const hex = (process.env.INTEGRATION_TOKEN_KEY || '').trim()
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error('INTEGRATION_TOKEN_KEY missing or invalid (need 64 hex chars)')
  }
  return Buffer.from(hex, 'hex')
}

export function encryptTokenSecret(plaintext: string): string {
  const key = getKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const data = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.from(JSON.stringify({
    iv: iv.toString('base64'),
    data: data.toString('base64'),
    tag: tag.toString('base64'),
  })).toString('base64')
}

export function decryptTokenSecret(envelope: string): string {
  const key = getKey()
  const parsed = JSON.parse(Buffer.from(envelope, 'base64').toString('utf8')) as {
    iv: string
    data: string
    tag: string
  }
  if (!parsed.iv || !parsed.data || !parsed.tag) throw new Error('Bad token envelope')
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(parsed.iv, 'base64'))
  decipher.setAuthTag(Buffer.from(parsed.tag, 'base64'))
  return decipher.update(Buffer.from(parsed.data, 'base64'), undefined, 'utf8') + decipher.final('utf8')
}

/** Generate: openssl rand -hex 32 */
export function generateTokenKeyHex(): string {
  return crypto.randomBytes(32).toString('hex')
}
