'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

export type ProfileData = {
  description?: string
  contact_email?: string
  contact_phone?: string
  website?: string
  address?: string
  social_links?: Record<string, string>
}

async function getAdminOrg(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.organisation_id || !['admin', 'executive'].includes(profile.role)) {
    throw new Error('Unauthorized: Admin access required')
  }

  return { userId: user.id, orgId: profile.organisation_id }
}

export async function updateOrganisationProfile(data: ProfileData) {
  try {
    const supabase = await createClient()
    const { orgId } = await getAdminOrg(supabase)

    const adminClient = createServiceClient()

    const { error } = await adminClient
      .from('organisations')
      .update({
        description: data.description,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        website: data.website,
        address: data.address,
        social_links: data.social_links,
      })
      .eq('id', orgId)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/[lang]/dashboard/settings', 'page')
    revalidatePath('/[lang]/(site)/org/[slug]', 'page')
    
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateOrganisationSlug(newSlug: string) {
  try {
    // Basic validation
    if (!/^[a-z0-9-]+$/.test(newSlug)) {
      throw new Error('Slug can only contain lowercase letters, numbers, and dashes.')
    }
    if (newSlug.length < 3 || newSlug.length > 50) {
      throw new Error('Slug must be between 3 and 50 characters.')
    }

    const supabase = await createClient()
    const { orgId, userId } = await getAdminOrg(supabase)

    const adminClient = createServiceClient()

    // Check uniqueness
    const { data: existing } = await adminClient
      .from('organisations')
      .select('id')
      .eq('slug', newSlug)
      .single()

    if (existing && existing.id !== orgId) {
      throw new Error('This slug is already taken by another organisation.')
    }

    const { error } = await adminClient
      .from('organisations')
      .update({ slug: newSlug })
      .eq('id', orgId)

    if (error) {
      throw new Error(error.message)
    }

    await logger.security('organisation', `Slug updated to ${newSlug} by user ${userId}`, { orgId })

    revalidatePath('/[lang]/dashboard/settings', 'page')

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateOrganisationImage(type: 'logo' | 'cover', url: string) {
  try {
    const supabase = await createClient()
    const { orgId } = await getAdminOrg(supabase)

    const adminClient = createServiceClient()
    const updateData = type === 'logo' ? { logo_url: url } : { cover_url: url }

    const { error } = await adminClient
      .from('organisations')
      .update(updateData)
      .eq('id', orgId)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/[lang]/dashboard/settings', 'page')
    revalidatePath('/[lang]/(site)/org/[slug]', 'page')
    
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
