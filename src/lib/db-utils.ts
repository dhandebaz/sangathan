import { createServiceClient } from '@/lib/supabase/service'

export async function softDelete(table: string, id: string) {
  const supabase = createServiceClient()
  
  const { error } = await supabase
    .from(table)
    .update({ 
      deleted_at: new Date().toISOString() 
    })
    .eq('id', id)
    
  return { error }
}

export async function hardDelete(table: string, id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase.from(table).delete().eq('id', id)
  return { error }
}

export async function restoreRecord(table: string, id: string) {
  const supabase = createServiceClient()
  const { error } = await supabase
    .update({ 
      deleted_at: null 
    })
    .eq('id', id)
  return { error }
}
