import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { getProvider } from '@/lib/integrations/providers'
import { saveIntegration } from '@/lib/integrations/store'

function base64urlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(padded, 'base64').toString('utf8')
}

/**
 * OAuth callback: validates state + PKCE cookie, exchanges the code,
 * encrypts tokens into capabilities, redirects to the gallery.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: providerId } = await params
  const provider = getProvider(providerId)
  const fail = (lang: string, reason: string) =>
    NextResponse.redirect(
      `${(process.env.NEXT_PUBLIC_APP_URL || 'https://sangathan.space').replace(/\/$/, '')}/${lang}/dashboard/integrations?error=${encodeURIComponent(reason)}`,
    )

  if (!provider) return NextResponse.json({ error: 'Unknown provider' }, { status: 404 })

  const url = new URL(request.url)
  const code = url.searchParams.get('code') || ''
  const stateRaw = url.searchParams.get('state') || ''
  const oauthError = url.searchParams.get('error') || ''

  let state: { orgId?: string; lang?: string; nonce?: string } = {}
  try {
    state = JSON.parse(base64urlDecode(stateRaw)) as typeof state
  } catch {
    return fail('en', 'bad-state')
  }
  const lang = state.lang === 'hi' ? 'hi' : 'en'

  if (oauthError || !code) {
    logger.warn('integrations', 'Provider returned an error', { provider: providerId, oauthError })
    return fail(lang, oauthError || 'denied')
  }

  const cookieRaw = request.cookies.get(`ig_pkce_${provider.id}`)?.value
  if (!cookieRaw) return fail(lang, 'session-expired')
  let cookie: { verifier?: string; nonce?: string; orgId?: string } = {}
  try {
    cookie = JSON.parse(cookieRaw) as typeof cookie
  } catch {
    return fail(lang, 'session-expired')
  }
  if (!cookie.verifier || cookie.nonce !== state.nonce || cookie.orgId !== state.orgId) {
    return fail(lang, 'state-mismatch')
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return fail(lang, 'unauthorized')

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://sangathan.space').replace(/\/$/, '')
  const body: Record<string, string> = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: `${appUrl}/api/integrations/${provider.id}/callback`,
    client_id: process.env[provider.clientIdEnv] || '',
    client_secret: process.env[provider.clientSecretEnv] || '',
  }
  if (provider.usePkce) body.code_verifier = cookie.verifier

  let tokenJson: {
    access_token?: string
    refresh_token?: string
    expires_in?: number
    scope?: string
    error?: string
    error_description?: string
  }
  try {
    const res = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body),
    })
    tokenJson = (await res.json()) as typeof tokenJson
    if (!res.ok || !tokenJson.access_token) {
      throw new Error(tokenJson.error_description || tokenJson.error || `token exchange failed (${res.status})`)
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'token exchange failed'
    logger.error('integrations', 'Token exchange failed', { provider: providerId, error: message })
    return fail(lang, 'exchange-failed')
  }

  try {
    await saveIntegration({
      orgId: state.orgId as string,
      providerId: provider.id,
      accessToken: tokenJson.access_token as string,
      refreshToken: tokenJson.refresh_token || null,
      expiresInSeconds: typeof tokenJson.expires_in === 'number' ? tokenJson.expires_in : null,
      scopes: (tokenJson.scope || provider.scopes.join(' ')).split(' ').filter(Boolean),
      connectedBy: user.id,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'save failed'
    logger.error('integrations', 'Integration save failed', { provider: providerId, error: message })
    return fail(lang, 'save-failed')
  }

  logger.info('integrations', 'OAuth connected', { orgId: state.orgId, provider: provider.id })
  const done = NextResponse.redirect(
    `${appUrl}/${lang}/dashboard/integrations?connected=${provider.id}`,
  )
  done.cookies.set(`ig_pkce_${provider.id}`, '', { path: '/', maxAge: 0 })
  return done
}
