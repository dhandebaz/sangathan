'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit/log'

const ServiceContactSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  designation: z.string().startsWith('[SERVICE]'),
  area: z.string().optional(),
  notes: z.string().optional(),
  energy_exertion: z.number().int().optional(),
  last_access: z.string().optional(),
})

const DeleteContactSchema = z.object({
  id: z.string().uuid(),
})

export const addServiceContact = createSafeAction(
  ServiceContactSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('members')
      .insert({
        organisation_id: context.organizationId,
        full_name: input.full_name,
        phone: input.phone,
        designation: input.designation,
        area: input.area,
        notes: input.notes,
        energy_exertion: input.energy_exertion || 0,
        last_access: new Date().toISOString(),
        role: 'viewer', // lowest permission
        status: 'active',
        joining_date: new Date().toISOString()
      })
      .select('id')
      .single()

    if (error || !data) {
      if ((error as { code?: string })?.code === '23505') {
        return { error: 'Phone number already exists in this organisation.' }
      }
      return { error: (error as { message?: string })?.message || 'Failed to add service contact' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'SERVICE_CONTACT_CREATED',
      resource_table: 'members',
      resource_id: data.id,
      details: { full_name: input.full_name, designation: input.designation }
    })

    revalidatePath('/', 'layout')
    return { success: true, contactId: data.id }
  },
  { allowedRoles: ['admin', 'editor'] }
)

export const updateServiceContact = createSafeAction(
  ServiceContactSchema.extend({ id: z.string().uuid() }),
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('members')
      .update({
        full_name: input.full_name,
        phone: input.phone,
        designation: input.designation,
        area: input.area,
        notes: input.notes,
        energy_exertion: input.energy_exertion,
        last_access: new Date().toISOString(),
      })
      .eq('id', input.id)
      .eq('organisation_id', context.organizationId)

    if (error) {
      return { error: (error as { message?: string })?.message || 'Failed to update service contact' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'SERVICE_CONTACT_UPDATED',
      resource_table: 'members',
      resource_id: input.id,
      details: { full_name: input.full_name, designation: input.designation }
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'] }
)

export const removeServiceContact = createSafeAction(
  DeleteContactSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', input.id)
      .eq('organisation_id', context.organizationId)

    if (error) {
      return { error: (error as { message?: string })?.message || 'Failed to remove service contact' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'SERVICE_CONTACT_DELETED',
      resource_table: 'members',
      resource_id: input.id,
      details: {}
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'] }
)
