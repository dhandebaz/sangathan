import { createServiceClient } from '@/lib/supabase/service'

export async function softDelete(table: string, id: string, userId: string) {
  const supabase = createServiceClient()
  
  const { error } = await (supabase
    .from(table) as any)
    .update({ 
      deleted_at: new Date().toISOString() 
      // In a real system, we might also want 'deleted_by': userId
      // But we haven't added that column to all tables yet.
    })
    .eq('id', id)
    
  return { error }
}

export async function hardDelete(table: string, id: string) {
  const supabase = createServiceClient()
  // This is a dangerous operation
  const { error } = await supabase.from(table).delete().eq('id', id)
  return { error }
}

export async function restoreRecord(table: string, id: string) {
  const supabase = createServiceClient()
  const { error } = await (supabase
    .from(table) as any)
    .update({ deleted_at: null })
    .eq('id', id)
  return { error }
}
