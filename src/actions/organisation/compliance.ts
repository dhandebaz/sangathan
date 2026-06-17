'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface ComplianceUpdatePayload {
  registration_status: 'registered' | 'unregistered' | 'in_progress'
  registration_number?: string | null
  incorporation_date?: string | null
  tax_id?: string | null
  darpan_id?: string | null
}

export async function updateComplianceData(orgId: string, payload: ComplianceUpdatePayload) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .eq('organisation_id', orgId)
      .single()

    if (!profile || !['admin', 'executive'].includes(profile.role)) {
      return { success: false, error: 'Unauthorized to update compliance details' }
    }

    // Clean up fields if they are switching back to unregistered
    const updateData = {
      registration_status: payload.registration_status,
      ...(payload.registration_status === 'registered' ? {
        registration_number: payload.registration_number || null,
        incorporation_date: payload.incorporation_date || null,
        tax_id: payload.tax_id || null,
        darpan_id: payload.darpan_id || null,
      } : {
        // Clear them out if they are not registered to keep DB clean
        registration_number: null,
        incorporation_date: null,
        tax_id: null,
        darpan_id: null,
      })
    }

    const { error } = await supabase
      .from('organisations')
      .update(updateData)
      .eq('id', orgId)

    if (error) {
      console.error('Compliance update error:', error)
      return { success: false, error: 'Failed to update database' }
    }

    revalidatePath('/[lang]/dashboard/settings', 'page')
    
    return { success: true }
  } catch (err) {
    console.error('Compliance update exception:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
