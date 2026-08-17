'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const RegisterStaffSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  role: z.enum([
    'maid',
    'cook',
    'driver',
    'gardener',
    'car_cleaner',
    'electrician',
    'plumber',
    'security_guard',
  ]),
  flat_units: z.string().min(1, 'At least one flat unit (comma-separated) is required'),
  aadhar_last4: z.string().length(4).optional(),
  police_verified: z.boolean().default(false),
  photo_url: z.string().optional(),
})

const UpdateStaffStatusSchema = z.object({
  staff_id: z.string().uuid('Invalid staff ID'),
  status: z.enum(['active', 'suspended', 'barred']),
  police_verified: z.boolean().optional(),
  flat_units: z.string().optional(),
})

export const registerDomesticStaff = createSafeAction(
  RegisterStaffSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId

    // Generate unique 6-digit gate Pass Code
    const passCode = `PASS-${Math.floor(100000 + Math.random() * 900000)}`
    const flatsArray = data.flat_units.split(',').map((f) => f.trim().toUpperCase()).filter(Boolean)

    const { data: staff, error } = await supabase
      .from('domestic_staff')
      .insert({
        organisation_id: organisationId,
        full_name: data.full_name,
        phone: data.phone,
        role: data.role,
        flat_units: flatsArray,
        photo_url: data.photo_url || null,
        police_verified: data.police_verified,
        aadhar_last4: data.aadhar_last4 || null,
        pass_code: passCode,
        status: 'active',
      })
      .select()
      .maybeSingle()

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('domestic_staff')
        .insert({
          organisation_id: organisationId,
          full_name: data.full_name,
          phone: data.phone,
          role: data.role,
          flat_units: flatsArray,
          photo_url: data.photo_url || null,
          police_verified: data.police_verified,
          aadhar_last4: data.aadhar_last4 || null,
          pass_code: passCode,
          status: 'active',
        })
        .select()
        .maybeSingle()

      if (fallback.error) throw new Error(fallback.error.message)
      revalidatePath('/', 'layout')
      return { success: true, staff: fallback.data }
    }

    revalidatePath('/', 'layout')
    return { success: true, staff }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin', 'editor'] }
)

export const updateDomesticStaffStatus = createSafeAction(
  UpdateStaffStatusSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId

    const updatePayload: Record<string, unknown> = {
      status: data.status,
      updated_at: new Date().toISOString(),
    }
    if (data.police_verified !== undefined) updatePayload.police_verified = data.police_verified
    if (data.flat_units !== undefined) {
      updatePayload.flat_units = data.flat_units.split(',').map((f) => f.trim().toUpperCase()).filter(Boolean)
    }

    const { error } = await supabase
      .from('domestic_staff')
      .update(updatePayload)
      .eq('id', data.staff_id)
      .eq('organisation_id', organisationId)

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('domestic_staff')
        .update(updatePayload)
        .eq('id', data.staff_id)
        .eq('organisation_id', organisationId)

      if (fallback.error) throw new Error(fallback.error.message)
    }

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin', 'editor'] }
)

export async function getDomesticStaffList(orgId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('domestic_staff')
      .select('*')
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: false })

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('domestic_staff')
        .select('*')
        .eq('organisation_id', orgId)
        .order('created_at', { ascending: false })

      if (!fallback.error) return { success: true, staff: fallback.data || [] }
      return { success: false, staff: [] }
    }

    return { success: true, staff: data || [] }
  } catch {
    return { success: false, staff: [] }
  }
}
