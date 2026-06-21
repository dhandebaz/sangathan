'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const uploadCBASchema = z.object({
  title: z.string().min(1, 'Title is required'),
  file_url: z.string().url('Must be a valid URL'),
  valid_from: z.string().optional(),
  valid_until: z.string().optional(),
})

export const uploadCBADocument = createSafeAction(
  'upload_cba',
  uploadCBASchema,
  async (data, { supabase, organisationId, profileId }) => {
    const { error } = await supabase
      .from('cba_documents')
      .insert({
        organisation_id: organisationId,
        title: data.title,
        file_url: data.file_url,
        status: 'draft',
        valid_from: data.valid_from ? new Date(data.valid_from).toISOString() : null,
        valid_until: data.valid_until ? new Date(data.valid_until).toISOString() : null,
        created_by: profileId
      })

    if (error) throw new Error(error.message)
    
    revalidatePath('/[lang]/dashboard/cba', 'page')
    return { success: true }
  }
)

const updateCBAStatusSchema = z.object({
  document_id: z.string().uuid(),
  status: z.enum(['draft', 'active', 'expired', 'archived'])
})

export const updateCBAStatus = createSafeAction(
  'update_cba_status',
  updateCBAStatusSchema,
  async (data, { supabase, organisationId }) => {
    const { error } = await supabase
      .from('cba_documents')
      .update({ status: data.status })
      .eq('id', data.document_id)
      .eq('organisation_id', organisationId)

    if (error) throw new Error(error.message)
    
    revalidatePath('/[lang]/dashboard/cba', 'page')
    return { success: true }
  }
)
