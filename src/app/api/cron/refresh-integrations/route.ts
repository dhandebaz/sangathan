import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { captureException } from '@/lib/sentry'
import { validateCronRequest } from '@/lib/cron-auth'
import { getProvider } from '@/lib/integrations/providers'
import { decryptTokenSecret, encryptTokenSecret } from '@/lib/integrations/crypto'
import { logAction } from '@/lib/audit/log'

/**
 * Daily: refresh OAuth tokens expiring within 24h.
 * Reads/writes capabilities JSON only (zero-DDL). Marks failures on the
 * integration so the gallery shows them instead of silently breaking.
 */
export async function GET(request: NextRequest) {
  const auth = await validateCronRequest(request)
  if (!auth.ok) return auth.response

  const supabase = createServiceClient()
  const refreshed: string[] = []
  const errors: { orgId: string; provider: string; error: string }[] = []

  try {
    const orgs: { id: string; capabilities: unknown }[] = []
    const pageSize = 200
    for (let page = 0; ; page++) {
      const { data, error } = await supabase
        .from('organisations')
        .select('id, capabilities')
        .in('plan_name', ['Metered', 'Institution'])
        .range(page * pageSize, (page + 1) * pageSize - 1)
      if (error) throw new Error(`org list failed: ${error.message}`)
      if (!data || data.length === 0) break
      orgs.push(...data)
      if (data.length < pageSize) break
    }

    const soon = Date.now() + 24 * 60 * 60 * 1000

    for (const org of orgs) {
      const caps = ((org.capabilities as Record<string, unknown>) || {}) as Record<string, unknown>
      const rawMap = caps.integrations
      if (!rawMap || typeof rawMap !== 'object' || Array.isArray(rawMap)) continue
      const map = rawMap as Record<string, {
        status?: string
        encAccess?: string
        encRefresh?: string
        expiresAt?: string | null
        scopes?: string[]
        lastError?: string | null
      }>

      for (const [providerId, entry] of Object.entries(map)) {
        if (!entry || entry.status !== 'connected' || !entry.encRefresh) continue
        if (entry.expiresAt && new Date(entry.expiresAt).getTime() > soon) continue

        try {
          const provider = getProvider(providerId)
          if (!provider) continue
          const refreshToken = decryptTokenSecret(entry.encRefresh)
          const res = await fetch(provider.tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
              client_id: process.env[provider.clientIdEnv] || '',
              client_secret: process.env[provider.clientSecretEnv] || '',
            }),
          })
          const json = (await res.json().catch(() => ({}))) as {
            access_token?: string
            refresh_token?: string
            expires_in?: number
            error?: string
            error_description?: string
          }
          if (!res.ok || !json.access_token) {
            throw new Error(json.error_description || json.error || `refresh failed (${res.status})`)
          }
          map[providerId] = {
            ...entry,
            encAccess: encryptTokenSecret(json.access_token),
            encRefresh: json.refresh_token ? encryptTokenSecret(json.refresh_token) : entry.encRefresh,
            expiresAt:
              typeof json.expires_in === 'number'
                ? new Date(Date.now() + json.expires_in * 1000).toISOString()
                : entry.expiresAt || null,
            lastError: null,
          }
          await supabase
            .from('organisations')
            .update({ capabilities: { ...caps, integrations: map } } as never)
            .eq('id', org.id)
          refreshed.push(`${org.id}:${providerId}`)
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          errors.push({ orgId: org.id, provider: providerId, error: message })
          try {
            map[providerId] = { ...entry, status: 'error', lastError: message.slice(0, 500) }
            await supabase
              .from('organisations')
              .update({ capabilities: { ...caps, integrations: map } } as never)
              .eq('id', org.id)
            await logAction({
              organisation_id: org.id,
              action: 'INTEGRATION_REFRESH_FAILED',
              resource_table: 'organisations',
              resource_id: org.id,
              details: { provider: providerId, error: message.slice(0, 300) },
            })
          } catch {
            // best-effort marking; the error above is already recorded
          }
        }
      }
    }

    return NextResponse.json({ success: true, refreshed: refreshed.length, errors, detail: refreshed })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown refresh error'
    logger.error('cron_integrations', `Refresh cron failed: ${message}`, {}, err)
    captureException(err, { source: 'cron_integrations' })
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
