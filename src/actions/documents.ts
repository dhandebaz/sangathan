'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { logAction } from '@/lib/audit/log'
import { z } from 'zod'

export type OrgDocument = {
  id: string
  organisation_id: string
  title: string
  description?: string | null
  file_url: string
  file_name: string
  file_size: number
  mime_type: string
  category: 'statutory' | 'agreements' | 'agm_circulars' | 'property_deeds' | 'media' | 'general'
  access_level: 'public' | 'members_only' | 'executives_only'
  tags?: string[] | null
  uploaded_by?: string | null
  uploader_name?: string | null
  created_at: string
  updated_at: string
}

const CreateDocumentSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  file_url: z.string().url('Valid file URL required'),
  file_name: z.string().min(1, 'File name required'),
  file_size: z.number().nonnegative(),
  mime_type: z.string().default('application/pdf'),
  category: z.enum(['statutory', 'agreements', 'agm_circulars', 'property_deeds', 'media', 'general']).default('general'),
  access_level: z.enum(['public', 'members_only', 'executives_only']).default('members_only'),
  tags: z.array(z.string()).optional(),
})

export async function getDocuments(
  orgId: string,
  category?: string,
  search?: string
): Promise<OrgDocument[]> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return []

    const adminClient = createServiceClient()

    let query = adminClient
      .from('org_documents')
      .select('*')
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,file_name.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      // If table doesn't exist yet, return empty list gracefully
      console.warn('Documents fetch note:', error.message)
      return []
    }

    return (data || []) as OrgDocument[]
  } catch (err) {
    console.error('Error fetching documents:', err)
    return []
  }
}

export async function createDocumentRecord(input: z.infer<typeof CreateDocumentSchema>, orgId: string) {
  try {
    const validated = CreateDocumentSchema.parse(input)
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify user belongs to organisation and is admin or editor
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .eq('organisation_id', orgId)
      .maybeSingle()

    if (!profile || !['admin', 'executive', 'editor'].includes(profile.role)) {
      return { success: false, error: 'Permission denied. Admins and editors only.' }
    }

    const adminClient = createServiceClient()

    const { data: doc, error } = await adminClient
      .from('org_documents')
      .insert({
        organisation_id: orgId,
        title: validated.title,
        description: validated.description || null,
        file_url: validated.file_url,
        file_name: validated.file_name,
        file_size: validated.file_size,
        mime_type: validated.mime_type,
        category: validated.category,
        access_level: validated.access_level,
        tags: validated.tags || [],
        uploaded_by: user.id,
        uploader_name: profile.full_name || 'Staff',
      } as never)
      .select()
      .maybeSingle()

    if (error || !doc) {
      return { success: false, error: error?.message || 'Failed to save document record' }
    }

    await logAction({
      organisation_id: orgId,
      user_id: user.id,
      action: 'DOCUMENT_UPLOADED',
      resource_table: 'org_documents',
      resource_id: (doc as { id: string }).id,
      details: { title: validated.title, category: validated.category, access_level: validated.access_level },
    })

    revalidatePath('/[lang]/dashboard/documents', 'page')
    return { success: true, document: doc }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function deleteDocumentRecord(documentId: string, orgId: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .eq('organisation_id', orgId)
      .maybeSingle()

    if (!profile || !['admin', 'executive'].includes(profile.role)) {
      return { success: false, error: 'Only admins can delete vault documents.' }
    }

    const adminClient = createServiceClient()

    const { error } = await adminClient
      .from('org_documents')
      .delete()
      .eq('id', documentId)
      .eq('organisation_id', orgId)

    if (error) {
      return { success: false, error: error.message }
    }

    await logAction({
      organisation_id: orgId,
      user_id: user.id,
      action: 'DOCUMENT_DELETED',
      resource_table: 'org_documents',
      resource_id: documentId,
    })

    revalidatePath('/[lang]/dashboard/documents', 'page')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function updateDocumentAccessLevel(
  documentId: string,
  orgId: string,
  accessLevel: 'public' | 'members_only' | 'executives_only'
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    const adminClient = createServiceClient()

    const { error } = await adminClient
      .from('org_documents')
      .update({ access_level: accessLevel })
      .eq('id', documentId)
      .eq('organisation_id', orgId)

    if (error) return { success: false, error: error.message }

    revalidatePath('/[lang]/dashboard/documents', 'page')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}
