import 'server-only'
import { createServiceClient } from '@/lib/supabase/service'
import { encryptTokenSecret, decryptTokenSecret } from './crypto'
import { getProvider, isPlanEligibleForPlugins } from './providers'
import { logAction } from '@/lib/audit/log'

export type PlanGate = 'Community' | 'Metered' | 'Institution'

export interface StoredIntegration {
  status: 'connected' | 'error'
  scopes: string[]
  connectedBy: string | null
  connectedAt: string
  expiresAt: string | null
  lastError: string | null
  encAccess: string | null
  encRefresh: string | null
}

type Caps = Record<string, unknown>

async function readCaps(orgId: string): Promise<{ caps: Caps; planName: string }> {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('organisations')
    .select('plan_name, capabilities')
    .eq('id', orgId)
    .maybeSingle()
  return {
    caps: ((data?.capabilities as Caps) || {}) as Caps,
    planName: (data?.plan_name as string) || 'Community',
  }
}

async function writeCaps(orgId: string, caps: Caps): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from('organisations')
    .update({ capabilities: caps } as never)
    .eq('id', orgId)
  if (error) throw new Error(error.message)
}

/** Re-exported from providers (pure, test-safe). */
export { isPlanEligibleForPlugins }

function getMap(caps: Caps): Record<string, StoredIntegration> {
  const raw = caps.integrations
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  return raw as Record<string, StoredIntegration>
}

export async function getIntegrationStatus(
  orgId: string,
  providerId: string,
): Promise<{ connected: boolean; status: StoredIntegration | null; planEligible: boolean }> {
  const { caps, planName } = await readCaps(orgId)
  const entry = getMap(caps)[providerId] || null
  return {
    connected: entry?.status === 'connected',
    status: entry
      ? { ...entry, encAccess: null, encRefresh: null }
      : null,
    planEligible: isPlanEligibleForPlugins(planName),
  }
}

export async function listIntegrationStatuses(orgId: string): Promise<{
  planEligible: boolean
  items: Record<string, { connected: boolean; status: StoredIntegration | null }>
}> {
  const { caps, planName } = await readCaps(orgId)
  const map = getMap(caps)
  const items: Record<string, { connected: boolean; status: StoredIntegration | null }> = {}
  for (const [providerId, entry] of Object.entries(map)) {
    items[providerId] = {
      connected: entry?.status === 'connected',
      status: entry ? { ...entry, encAccess: null, encRefresh: null } : null,
    }
  }
  return { planEligible: isPlanEligibleForPlugins(planName), items }
}

/** Server-only: returns DECRYPTED tokens. Never expose to clients. */
export async function getDecryptedTokens(
  orgId: string,
  providerId: string,
): Promise<{ accessToken: string; refreshToken: string | null; expiresAt: string | null } | null> {
  const { caps } = await readCaps(orgId)
  const entry = getMap(caps)[providerId]
  if (!entry || entry.status !== 'connected' || !entry.encAccess) return null
  return {
    accessToken: decryptTokenSecret(entry.encAccess),
    refreshToken: entry.encRefresh ? decryptTokenSecret(entry.encRefresh) : null,
    expiresAt: entry.expiresAt,
  }
}

export async function saveIntegration(params: {
  orgId: string
  providerId: string
  accessToken: string
  refreshToken?: string | null
  expiresInSeconds?: number | null
  scopes: string[]
  connectedBy: string
}): Promise<void> {
  const provider = getProvider(params.providerId)
  if (!provider) throw new Error('Unknown provider')
  const { caps } = await readCaps(params.orgId)
  const map = getMap(caps)
  map[params.providerId] = {
    status: 'connected',
    scopes: params.scopes,
    connectedBy: params.connectedBy,
    connectedAt: new Date().toISOString(),
    expiresAt:
      typeof params.expiresInSeconds === 'number'
        ? new Date(Date.now() + params.expiresInSeconds * 1000).toISOString()
        : null,
    lastError: null,
    encAccess: encryptTokenSecret(params.accessToken),
    encRefresh: params.refreshToken ? encryptTokenSecret(params.refreshToken) : null,
  }
  await writeCaps(params.orgId, { ...caps, integrations: map })
  await logAction({
    organisation_id: params.orgId,
    user_id: params.connectedBy,
    action: 'INTEGRATION_CONNECTED',
    resource_table: 'organisations',
    resource_id: params.orgId,
    details: { provider: params.providerId, scopes: params.scopes },
  })
}

export async function markIntegrationError(orgId: string, providerId: string, message: string): Promise<void> {
  const { caps } = await readCaps(orgId)
  const map = getMap(caps)
  if (!map[providerId]) return
  map[providerId] = { ...map[providerId], status: 'error', lastError: message.slice(0, 500) }
  await writeCaps(orgId, { ...caps, integrations: map })
}

export async function disconnectIntegration(orgId: string, providerId: string, userId: string): Promise<void> {
  const { caps } = await readCaps(orgId)
  const map = getMap(caps)
  delete map[providerId]
  await writeCaps(orgId, { ...caps, integrations: map })
  await logAction({
    organisation_id: orgId,
    user_id: userId,
    action: 'INTEGRATION_DISCONNECTED',
    resource_table: 'organisations',
    resource_id: orgId,
    details: { provider: providerId },
  })
}
