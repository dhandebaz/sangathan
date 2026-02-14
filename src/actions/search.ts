'use server'

import { createServiceClient } from '@/lib/supabase/service'

export async function searchOrganisations(query: string) {
  if (!query || query.length < 3) return []
  
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('organisations')
    .select('id, name, slug')
    .ilike('name', `%${query}%`)
    .limit(5)
    
  return data || []
}
