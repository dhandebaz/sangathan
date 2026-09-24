import { NextResponse, type NextRequest } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { getProvider, isProviderConfigured } from '@/lib/integrations/providers'
import { isPlanEligibleForPlugins } from '@/lib/integrations/store'
import { createServiceClient } from '@/lib/supabase/service'

const ADMIN_ROLES = ['admin', 'second_admin', 'executive']

function base64url(input: Buffer): string {
  return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Starts an OAuth connect: validates admin + paying plan, creates PKCE pair,
 * stores the verifier in a short-lived signed cookie, redirects to provider.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: providerId } = await params
  const provider = getProvider(providerId)
  if (!provider) return NextResponse.json({ error: 'Unknown provider' }, { status: 404 })
  if (!isProviderConfigured(provider)) {
    return NextResponse.json({ error: `${provider.name} is not configured yet` }, { status: 503 })
  }

  const url = new URL(request.url)
  const orgId = url.searchParams.get('orgId') || ''
  const lang = url.searchParams.get('lang') === 'hi' ? 'hi' : 'en'
  if (!orgId) return NextResponse.json({ error: 'Missing orgId' }, { status: 400 })

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createServiceClient()
  const { data: membership } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .eq('organisation_id', orgId)
    .maybeSingle()
  if (!membership || !ADMIN_ROLES.includes((membership.role as string) || '')) {
    return NextResponse.json({ error: 'Only organisation admins can connect integrations' }, { status: 403 })
  }

  const { data: org } = await admin
    .from('organisations')
    .select('plan_name')
    .eq('id', orgId)
    .maybeSingle()
  if (!isPlanEligibleForPlugins((org?.plan_name as string) || 'Community')) {
    return NextResponse.json(
      { error: 'Integrations unlock on metered billing. Turn on the meter first.' },
      { status: 402 },
    )
  }

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://sangathan.space').replace(/\/$/, '')
  const redirectUri = `${appUrl}/api/integrations/${provider.id}/callback`
  const verifier = base64url(crypto.randomBytes(32))
  const challenge = base64url(crypto.createHash('sha256').update(verifier).digest())
  const nonce = crypto.randomBytes(16).toString('hex')
  const state = base64url(Buffer.from(JSON.stringify({ orgId, lang, nonce })))

  const authUrl = new URL(provider.authUrl)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', process.env[provider.clientIdEnv] || '')
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', provider.scopes.join(' '))
  authUrl.searchParams.set('state', state)
  if (provider.usePkce) {
    authUrl.searchParams.set('code_challenge', challenge)
    authUrl.searchParams.set('code_challenge_method', 'S256')
  }

  logger.info('integrations', 'OAuth connect started', { orgId, provider: provider.id })
  const res = NextResponse.redirect(authUrl.toString())
  res.cookies.set(`ig_pkce_${provider.id}`, JSON.stringify({ verifier, nonce, orgId }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  })
  return res
}
