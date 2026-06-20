'use server'

import { createSafeAction, type ActionOptions } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'

const ProfileSchema = z.object({
  description: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  address: z.string().optional(),
  social_links: z.record(z.string(), z.string()).optional(),
})

const SlugSchema = z.object({
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and dashes.'),
})

const ImageSchema = z.object({
  type: z.enum(['logo', 'cover']),
  url: z.string().url(),
})

const adminAction: ActionOptions = {
  allowedRoles: ['admin', 'executive'],
  actionName: 'organisation_settings',
}

export const updateOrganisationProfile = createSafeAction(
  ProfileSchema,
  async (input, context) => {
    const supabase = createServiceClient()
    const { error } = await supabase
      .from('organisations')
      .update({
        description: input.description,
        contact_email: input.contact_email || null,
        contact_phone: input.contact_phone,
        website: input.website || null,
        address: input.address,
        social_links: input.social_links,
      })
      .eq('id', context.organizationId)

    if (error) {
      return { error: error.message }
    }

    await context.logAction({
      action: 'ORG_PROFILE_UPDATED',
      resourceTable: 'organisations',
      resourceId: context.organizationId,
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  adminAction,
)

export const updateOrganisationSlug = createSafeAction(
  SlugSchema,
  async (input, context) => {
    const supabase = createServiceClient()
    const newSlug = input.slug

    const { data: existing } = await supabase
      .from('organisations')
      .select('id')
      .eq('slug', newSlug)
      .single()

    if (existing && existing.id !== context.organizationId) {
      return { error: 'This slug is already taken by another organisation.' }
    }

    const { error } = await supabase
      .from('organisations')
      .update({ slug: newSlug })
      .eq('id', context.organizationId)

    if (error) {
      return { error: error.message }
    }

    await logger.security('organisation', `Slug updated to ${newSlug} by user ${context.user.id}`, {
      orgId: context.organizationId,
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  adminAction,
)

export const updateOrganisationImage = createSafeAction(
  ImageSchema,
  async (input, context) => {
    const supabase = createServiceClient()
    const updateData = input.type === 'logo' ? { logo_url: input.url } : { cover_url: input.url }

    const { error } = await supabase
      .from('organisations')
      .update(updateData)
      .eq('id', context.organizationId)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  },
  adminAction,
)
