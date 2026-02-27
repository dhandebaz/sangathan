// Maintenance Mode Configuration
// In a real edge environment (Vercel), we would use Edge Config or KV.
// For now, we use an Environment Variable which requires redeployment to toggle,
// OR we check a special header/cookie that can be set by admins.
// "Zero database overhead" implies we don't query DB.

export const MAINTENANCE_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
  bypassSecret: process.env.MAINTENANCE_BYPASS_SECRET || 'sangathan-admin-access',
  cookieName: 'sangathan-maintenance-bypass'
}

export function isMaintenanceMode(req: Request) {
  // 1. Check Env Var (Global Switch)
  if (!MAINTENANCE_CONFIG.enabled) return false

  // 2. Check Bypass Cookie
  const cookies = (req.headers.get('cookie') || '').split(';')
  const hasBypass = cookies.some(c => c.trim().startsWith(`${MAINTENANCE_CONFIG.cookieName}=`))
  
  if (hasBypass) return false

  // 3. Check Bypass Header (for API testing)
  const bypassHeader = req.headers.get('x-maintenance-bypass')
  if (bypassHeader === MAINTENANCE_CONFIG.bypassSecret) return false

  return true
}
