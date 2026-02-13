import { createServiceClient } from '@/lib/supabase/service'

export interface MaintenanceStatus {
  enabled: boolean
  message: string
}

export async function checkMaintenanceMode(): Promise<MaintenanceStatus> {
  // In a real high-traffic app, this should be cached in Edge Config (Vercel) or Redis
  // For now, we query DB but we should be careful about load.
  // Optimization: Middleware might skip this check for static assets.
  
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'maintenance_mode')
      .single()

    if (data && (data as any).value) {
      return (data as any).value as MaintenanceStatus
    }
  } catch (error) {
    // Fail open
    console.error('Maintenance check failed', error)
  }

  return { enabled: false, message: '' }
}
