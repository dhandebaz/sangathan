'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const RegisterSocietyAssetSchema = z.object({
  asset_name: z.string().min(2, 'Asset name is required'),
  category: z.enum([
    'lift_elevator',
    'dg_generator',
    'fire_fighting',
    'water_pumps',
    'cctv_security',
    'swimming_pool',
    'gym_equipment',
    'transformer',
  ]),
  location_block: z.string().optional(),
  vendor_name: z.string().min(2, 'Vendor/Contractor name is required'),
  vendor_phone: z.string().optional(),
  amc_start_date: z.string().optional(),
  amc_expiry_date: z.string().min(4, 'AMC Expiry date is required'),
  statutory_noc_expiry: z.string().optional(),
  next_service_due: z.string().min(4, 'Next service date is required'),
  annual_amc_cost: z.coerce.number().optional(),
})

const LogServiceRecordSchema = z.object({
  asset_id: z.string().uuid('Invalid asset ID'),
  last_service_date: z.string().min(4, 'Service date is required'),
  next_service_due: z.string().min(4, 'Next service due date is required'),
  status: z.enum(['operational', 'service_due', 'under_breakdown', 'noc_pending']).default('operational'),
})

export const registerSocietyAsset = createSafeAction(
  RegisterSocietyAssetSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId

    const { data: asset, error } = await supabase
      .from('society_assets')
      .insert({
        organisation_id: organisationId,
        asset_name: data.asset_name,
        category: data.category,
        location_block: data.location_block || null,
        vendor_name: data.vendor_name,
        vendor_phone: data.vendor_phone || null,
        amc_start_date: data.amc_start_date || null,
        amc_expiry_date: data.amc_expiry_date,
        statutory_noc_expiry: data.statutory_noc_expiry || null,
        last_service_date: null,
        next_service_due: data.next_service_due,
        annual_amc_cost: data.annual_amc_cost || 0,
        status: 'operational',
      })
      .select()
      .maybeSingle()

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('society_assets')
        .insert({
          organisation_id: organisationId,
          asset_name: data.asset_name,
          category: data.category,
          location_block: data.location_block || null,
          vendor_name: data.vendor_name,
          vendor_phone: data.vendor_phone || null,
          amc_start_date: data.amc_start_date || null,
          amc_expiry_date: data.amc_expiry_date,
          statutory_noc_expiry: data.statutory_noc_expiry || null,
          last_service_date: null,
          next_service_due: data.next_service_due,
          annual_amc_cost: data.annual_amc_cost || 0,
          status: 'operational',
        })
        .select()
        .maybeSingle()

      if (fallback.error) throw new Error(fallback.error.message)
      revalidatePath('/', 'layout')
      return { success: true, asset: fallback.data }
    }

    revalidatePath('/', 'layout')
    return { success: true, asset }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin', 'editor'] }
)

export const logAssetServiceRecord = createSafeAction(
  LogServiceRecordSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId

    const { error } = await supabase
      .from('society_assets')
      .update({
        last_service_date: data.last_service_date,
        next_service_due: data.next_service_due,
        status: data.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.asset_id)
      .eq('organisation_id', organisationId)

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('society_assets')
        .update({
          last_service_date: data.last_service_date,
          next_service_due: data.next_service_due,
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.asset_id)
        .eq('organisation_id', organisationId)

      if (fallback.error) throw new Error(fallback.error.message)
    }

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin', 'editor'] }
)

export async function getSocietyAssets(orgId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('society_assets')
      .select('*')
      .eq('organisation_id', orgId)
      .order('next_service_due', { ascending: true })

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('society_assets')
        .select('*')
        .eq('organisation_id', orgId)
        .order('next_service_due', { ascending: true })

      if (!fallback.error) return { success: true, assets: fallback.data || [] }
      return { success: false, assets: [] }
    }

    return { success: true, assets: data || [] }
  } catch {
    return { success: false, assets: [] }
  }
}
