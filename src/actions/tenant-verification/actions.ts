'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit/log'
import crypto from 'crypto'

// --- Schemas ---

const TenantVerificationSchema = z.object({
  tenant_name: z.string().min(2, "Tenant name is required"),
  tenant_father_name: z.string().min(2, "Father's name is required"),
  colony_name: z.string().min(2, "Colony/sector name is required"),
  pin_code: z.string().length(6, "Valid 6-digit PIN code required"),
  verification_hash: z.string().length(64, "Verification hash must be 64 characters"),
  energy_exertion: z.number().int().min(0).max(100).default(0),
  last_access: z.string().optional(),
})

// --- Actions ---

export const createTenantVerification = createSafeAction(
  TenantVerificationSchema,
  async (input, context) => {
    const supabase = await createClient()

    // Check if verification hash already exists
    const { data: existingData, error: checkError } = await supabase
      .from('tenant_verification')
      .select('id')
      .eq('verification_hash', input.verification_hash)
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned (expected for new hash)
      return { error: 'Database error during verification check' }
    }

    if (existingData) {
      return { error: 'Verification hash already exists. Please generate a new one.' }
    }

    // Insert new verification record
    const { data, error } = await supabase
      .from('tenant_verification')
      .insert({
        tenant_name: input.tenant_name,
        tenant_father_name: input.tenant_father_name,
        colony_name: input.colony_name,
        pin_code: input.pin_code,
        verification_hash: input.verification_hash,
        energy_exertion: input.energy_exertion,
        last_access: new Date().toISOString(),
        validated: false
      })
      .select('id')
      .maybeSingle()

    if (error || !data) {
      return { error: (error as { message?: string })?.message || 'Failed to create tenant verification' }
    }

    // Log the action
    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'TENANT_VERIFICATION_CREATED',
      resource_table: 'tenant_verification',
      resource_id: data.id,
      details: { tenant_name: input.tenant_name, colony_name: input.colony_name }
    })

    revalidatePath('/', 'layout')
    return { success: true, verificationId: data.id }
  },
  { allowedRoles: ['admin', 'editor'] }
)

export const validateTenantVerification = createSafeAction(
  z.object({
    verificationId: z.string(),
  }),
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('tenant_verification')
      .update({ validated: true })
      .eq('id', input.verificationId)

    if (error) {
      return { error: (error as { message?: string })?.message || 'Failed to validate tenant verification' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'TENANT_VERIFICATION_VALIDATED',
      resource_table: 'tenant_verification',
      resource_id: input.verificationId,
      details: {}
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin'] }
)

export const updateTenantVerificationMetrics = createSafeAction(
  z.object({
    verificationId: z.string(),
    energy_exertion: z.number().int().min(0).max(100),
    last_access: z.string(),
  }),
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('tenant_verification')
      .update({
        energy_exertion: input.energy_exertion,
        last_access: input.last_access,
        updated_at: new Date().toISOString()
      })
      .eq('id', input.verificationId)

    if (error) {
      return { error: (error as { message?: string })?.message || 'Failed to update verification metrics' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'TENANT_VERIFICATION_METRICS_UPDATED',
      resource_table: 'tenant_verification',
      resource_id: input.verificationId,
      details: { energy_exertion: input.energy_exertion }
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'] }
)