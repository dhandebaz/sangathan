// Maintenance Mode Configuration
// In a real edge environment (Vercel), we would use Edge Config or KV.
// For now, we use an Environment Variable which requires redeployment to toggle,
// OR we check a special header/cookie that can be set by admins.
// "Zero database overhead" implies we don't query DB.

export const MAINTENANCE_CONFIG = {
  enabled: false,
}

export function isMaintenanceMode() {
  return false
}
