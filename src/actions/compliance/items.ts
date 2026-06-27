'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ComplianceItemRow = {
  id: string
  organisation_id: string
  category: string
  title: string
  description: string | null
  status: string
  due_date: string | null
  document_url: string | null
  document_name: string | null
  document_size: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export async function getComplianceItems(orgId: string): Promise<ComplianceItemRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('compliance_items')
    .select('*')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching compliance items:', error)
    return []
  }

  if (!data || data.length === 0) {
    const { data: orgData } = await supabase
      .from('organisations')
      .select('org_type')
      .eq('id', orgId)
      .single()

    const { error: seedError } = await supabase.rpc('seed_compliance_items', {
      p_org_id: orgId,
      p_org_type: orgData?.org_type || 'ngo'
    })

    if (seedError) {
      console.error('Error seeding compliance items:', seedError)
      return []
    }

    const { data: seededData } = await supabase
      .from('compliance_items')
      .select('*')
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: true })

    return seededData || []
  }

  return data
}

export async function updateComplianceItemStatus(
  itemId: string,
  status: string,
  notes?: string | null
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const updateData: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (notes !== undefined) updateData.notes = notes

  const { error } = await supabase
    .from('compliance_items')
    .update(updateData)
    .eq('id', itemId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/[lang]/dashboard/compliance')
  return { success: true }
}

export async function deleteComplianceItem(itemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('compliance_items')
    .delete()
    .eq('id', itemId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/[lang]/dashboard/compliance')
  return { success: true }
}

export async function addComplianceItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organisation_id) return { success: false, error: 'No organisation' }

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string

  if (!title || !category) return { success: false, error: 'Title and category required' }

  const { error } = await supabase
    .from('compliance_items')
    .insert({
      organisation_id: profile.organisation_id,
      title,
      category,
      description: description || null,
      status: 'not_started'
    })

  if (error) return { success: false, error: error.message }

  revalidatePath('/[lang]/dashboard/compliance')
  return { success: true }
}

export async function uploadComplianceDocument(itemId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  if (!profile?.organisation_id || !['admin', 'executive'].includes(profile.role)) {
    return { success: false, error: 'Unauthorized' }
  }

  const file = formData.get('file') as File
  if (!file) return { success: false, error: 'No file provided' }

  if (file.size > 10 * 1024 * 1024) return { success: false, error: 'File exceeds 10MB limit' }

  const fileExt = file.name.split('.').pop()
  const fileName = `compliance_${itemId}_${Date.now()}.${fileExt}`
  const filePath = `${profile.organisation_id}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('compliance_docs')
    .upload(filePath, file, { upsert: true })

  if (uploadError) return { success: false, error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage
    .from('compliance_docs')
    .getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from('compliance_items')
    .update({
      document_url: publicUrl,
      document_name: file.name,
      document_size: file.size,
      status: 'submitted',
      updated_at: new Date().toISOString()
    })
    .eq('id', itemId)

  if (updateError) return { success: false, error: updateError.message }

  revalidatePath('/[lang]/dashboard/compliance')
  return { success: true }
}

export async function removeComplianceDocument(itemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('compliance_items')
    .update({
      document_url: null,
      document_name: null,
      document_size: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', itemId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/[lang]/dashboard/compliance')
  return { success: true }
}
