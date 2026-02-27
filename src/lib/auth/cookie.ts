
const KEY_NAME = 'user-metadata'
// TODO: Use a server-side secret like SUPABASE_SERVICE_ROLE_KEY in production
const SECRET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'default-secret-do-not-use-in-prod'

// Simple HMAC-SHA256 signature
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
  // Convert ArrayBuffer to Base64 string
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
  const signatureBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0))
  return await crypto.subtle.verify('HMAC', key, signatureBytes, enc.encode(data))
}

export async function createSignedCookie(data: any) {
  const value = JSON.stringify(data)
  const signature = await sign(value, SECRET_KEY)
  return `${value}.${signature}`
}

export async function verifySignedCookie(cookieValue: string) {
  const lastDotIndex = cookieValue.lastIndexOf('.')
  if (lastDotIndex === -1) return null
  
  const value = cookieValue.substring(0, lastDotIndex)
  const signature = cookieValue.substring(lastDotIndex + 1)
  
  if (!value || !signature) return null
  
  const isValid = await verify(value, signature, SECRET_KEY)
  if (!isValid) return null
  
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}
