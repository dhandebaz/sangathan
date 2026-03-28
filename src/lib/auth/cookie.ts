type SignedCookieValue = Record<string, unknown>

function getSecretKey() {
  const secretKey = process.env.COOKIE_SIGNING_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!secretKey) {
    throw new Error('Missing COOKIE_SIGNING_SECRET or SUPABASE_SERVICE_ROLE_KEY')
  }

  return secretKey
}

async function sign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

async function verify(data: string, signature: string, secret: string): Promise<boolean> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )
  const signatureBytes = Uint8Array.from(atob(signature), (char) => char.charCodeAt(0))
  return crypto.subtle.verify('HMAC', key, signatureBytes, enc.encode(data))
}

export async function createSignedCookie<T extends SignedCookieValue>(data: T) {
  const value = JSON.stringify({
    ...data,
    ts: typeof data.ts === 'number' ? data.ts : Date.now(),
  })
  const signature = await sign(value, getSecretKey())
  return `${value}.${signature}`
}

export async function verifySignedCookie<T extends SignedCookieValue>(cookieValue: string): Promise<T | null> {
  const lastDotIndex = cookieValue.lastIndexOf('.')
  if (lastDotIndex === -1) return null

  const value = cookieValue.substring(0, lastDotIndex)
  const signature = cookieValue.substring(lastDotIndex + 1)

  if (!value || !signature) return null

  const isValid = await verify(value, signature, getSecretKey())
  if (!isValid) return null

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}
