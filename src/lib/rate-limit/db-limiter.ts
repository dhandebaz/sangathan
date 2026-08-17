import { createServiceClient } from '@/lib/supabase/service'

export async function checkRateLimit(action: string, identifier: string, limit: number, windowSeconds: number) {
  try {
    const supabase = createServiceClient()
    
    if (action === 'create_org') {
      const { count, error } = await supabase
        .from('organisations')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', identifier)
        .gte('created_at', new Date(Date.now() - windowSeconds * 1000).toISOString())
        
      if (error) {
        console.warn('Rate limit DB check error, bypassing:', error)
        return { allowed: true }
      }
      
      if ((count || 0) >= limit) {
        return { allowed: false, error: 'Too many organisations created. Please wait before creating another.' }
      }
    }
  } catch (err) {
    console.warn('checkRateLimit error fallback:', err)
    return { allowed: true }
  }
  
  return { allowed: true }
}

