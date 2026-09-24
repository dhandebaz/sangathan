/**
 * OAuth provider registry for org plugins (paid tiers only).
 * Add a provider here + env credentials to onboard a new integration.
 * Scopes are intentionally minimal — expand only with a documented need.
 */

export interface OAuthProviderConfig {
  id: string
  name: string
  tagline: string
  docsUrl: string
  authUrl: string
  tokenUrl: string
  scopes: string[]
  clientIdEnv: string
  clientSecretEnv: string
  /** PKCE required by this provider. */
  usePkce: boolean
}

export const OAUTH_PROVIDERS: Record<string, OAuthProviderConfig> = {
  canva: {
    id: 'canva',
    name: 'Canva',
    tagline: 'Push parchas and posters into Canva designs',
    docsUrl: 'https://www.canva.dev/docs/connect/',
    authUrl: 'https://www.canva.com/api/oauth/authorize',
    tokenUrl: 'https://api.canva.com/rest/v1/oauth/token',
    // Minimal design scopes — confirm final set during Canva app review.
    scopes: ['design:content:read', 'design:content:write'],
    clientIdEnv: 'CANVA_CLIENT_ID',
    clientSecretEnv: 'CANVA_CLIENT_SECRET',
    usePkce: true,
  },
}

export function getProvider(providerId: string): OAuthProviderConfig | null {
  return OAUTH_PROVIDERS[providerId] || null
}

export function listProviders(): OAuthProviderConfig[] {
  return Object.values(OAUTH_PROVIDERS)
}

export function isProviderConfigured(provider: OAuthProviderConfig): boolean {
  return Boolean(process.env[provider.clientIdEnv] && process.env[provider.clientSecretEnv])
}

/** Plugins unlock for paying tiers only (Metered + legacy Institution). Pure — safe anywhere. */
export function isPlanEligibleForPlugins(planName: string): boolean {
  return planName === 'Metered' || planName === 'Institution' || planName === 'Sustainer'
}
