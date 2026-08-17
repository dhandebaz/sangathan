'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logAction } from '@/lib/audit/log'

// --- Schemas ---

const CreateAuthoritySchema = z.object({
  department: z.string().min(2, "Department is required"),
  authority_name: z.string().min(2, "Authority name is required"),
  designation: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  jurisdiction: z.string().optional(),
  is_active: z.boolean().default(true),
})

const UpdateAuthoritySchema = CreateAuthoritySchema.extend({
  id: z.string().uuid(),
})

const DeleteAuthoritySchema = z.object({
  id: z.string().uuid(),
})

// --- Actions ---

export const createAuthority = createSafeAction(
  CreateAuthoritySchema,
  async (input, context) => {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('authority_contacts')
      .insert({
        organisation_id: context.organizationId,
        department: input.department,
        authority_name: input.authority_name,
        designation: input.designation,
        phone: input.phone,
        email: input.email || null,
        address: input.address,
        jurisdiction: input.jurisdiction,
        is_active: input.is_active,
      })
      .select('id')
      .maybeSingle()

    if (error || !data) {
      return { error: (error as { message?: string })?.message || 'Failed to create authority contact' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'AUTHORITY_CREATED',
      resource_table: 'authority_contacts',
      resource_id: data.id,
      details: { department: input.department, authority_name: input.authority_name }
    })

    revalidatePath('/[lang]/dashboard/settings/local-directory')
    return { success: true, authorityId: data.id }
  },
  { allowedRoles: ['admin', 'editor', 'can_manage', 'second_admin'] }
)

export const updateAuthority = createSafeAction(
  UpdateAuthoritySchema,
  async (input, context) => {
    const { id, ...rest } = input
    const supabase = await createClient()

    const { error } = await supabase
      .from('authority_contacts')
      .update({
        ...rest,
        email: rest.email || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('organisation_id', context.organizationId)

    if (error) {
      return { error: (error as { message?: string })?.message || 'Failed to update authority contact' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'AUTHORITY_UPDATED',
      resource_table: 'authority_contacts',
      resource_id: id,
      details: rest
    })

    revalidatePath('/[lang]/dashboard/settings/local-directory')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor', 'can_manage', 'second_admin'] }
)

export const deleteAuthority = createSafeAction(
  DeleteAuthoritySchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('authority_contacts')
      .delete()
      .eq('id', input.id)
      .eq('organisation_id', context.organizationId)

    if (error) {
      return { error: (error as { message?: string })?.message || 'Failed to delete authority contact' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'AUTHORITY_DELETED',
      resource_table: 'authority_contacts',
      resource_id: input.id,
      details: {}
    })

    revalidatePath('/[lang]/dashboard/settings/local-directory')
    return { success: true }
  },
  { allowedRoles: ['admin', 'can_manage', 'second_admin'] }
)

export async function getAuthorities(organisationId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('authority_contacts')
    .select('*')
    .eq('organisation_id', organisationId)
    .eq('is_active', true)
    .order('department', { ascending: true })
    .order('authority_name', { ascending: true })

  if (error) {
    console.error('Fetch Authorities Error:', error)
    return { success: false, error: 'Failed to fetch authorities', data: [] }
  }

  return { success: true, data: data || [] }
}

export async function getAllAuthorities(organisationId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('authority_contacts')
    .select('*')
    .eq('organisation_id', organisationId)
    .order('department', { ascending: true })
    .order('authority_name', { ascending: true })

  if (error) {
    console.error('Fetch All Authorities Error:', error)
    return { success: false, error: 'Failed to fetch authorities', data: [] }
  }

  return { success: true, data: data || [] }
}

// Seed default authorities for major Indian cities
export async function seedDefaultAuthorities(organisationId: string, city?: string) {
  const supabase = await createClient()

  const defaultAuthorities = getDefaultAuthorities(city)

  const { error } = await supabase
    .from('authority_contacts')
    .upsert(
      defaultAuthorities.map(a => ({
        ...a,
        organisation_id: organisationId,
      })),
      { onConflict: 'organisation_id,department,authority_name' }
    )

  if (error) {
    console.error('Seed Authorities Error:', error)
    return { success: false, error: 'Failed to seed default authorities' }
  }

  return { success: true, count: defaultAuthorities.length }
}

function getDefaultAuthorities(_city?: string): Array<{
  department: string
  authority_name: string
  designation: string
  phone: string
  email: string
  address: string
  jurisdiction: string
  is_active: boolean
}> {
  // Generic defaults that work for most Indian cities
  const base = [
    {
      department: 'Municipal Corporation',
      authority_name: 'Ward Officer',
      designation: 'Ward Officer / Assistant Commissioner',
      phone: '',
      email: '',
      address: 'Municipal Corporation Office',
      jurisdiction: 'Ward Level',
      is_active: true,
    },
    {
      department: 'Municipal Corporation',
      authority_name: 'Commissioner',
      designation: 'Municipal Commissioner',
      phone: '',
      email: '',
      address: 'Municipal Corporation Headquarters',
      jurisdiction: 'City Wide',
      is_active: true,
    },
    {
      department: 'Public Works Department (PWD)',
      authority_name: 'Executive Engineer',
      designation: 'Executive Engineer (Roads/Buildings)',
      phone: '',
      email: '',
      address: 'PWD Division Office',
      jurisdiction: 'Division Level',
      is_active: true,
    },
    {
      department: 'Water Supply & Sewerage',
      authority_name: 'Executive Engineer',
      designation: 'Executive Engineer (Water Supply)',
      phone: '',
      email: '',
      address: 'Water Supply Division Office',
      jurisdiction: 'Division Level',
      is_active: true,
    },
    {
      department: 'Police',
      authority_name: 'SHO / Police Inspector',
      designation: 'Station House Officer',
      phone: '100',
      email: '',
      address: 'Local Police Station',
      jurisdiction: 'Police Station Limits',
      is_active: true,
    },
    {
      department: 'Police',
      authority_name: 'DCP / ACP',
      designation: 'Deputy Commissioner of Police / Assistant Commissioner',
      phone: '',
      email: '',
      address: 'Police Commissionerate',
      jurisdiction: 'Zone/District',
      is_active: true,
    },
    {
      department: 'Electricity Board',
      authority_name: 'Superintending Engineer',
      designation: 'Superintending Engineer (Distribution)',
      phone: '1912',
      email: '',
      address: 'Electricity Board Division Office',
      jurisdiction: 'Circle Level',
      is_active: true,
    },
    {
      department: 'Health Department',
      authority_name: 'Chief Medical Officer',
      designation: 'Chief Medical Officer / District Health Officer',
      phone: '',
      email: '',
      address: 'District Health Office',
      jurisdiction: 'District Level',
      is_active: true,
    },
    {
      department: 'Pollution Control Board',
      authority_name: 'Regional Officer',
      designation: 'Regional Officer',
      phone: '',
      email: '',
      address: 'State Pollution Control Board Regional Office',
      jurisdiction: 'Regional',
      is_active: true,
    },
    {
      department: 'Transport Department',
      authority_name: 'RTO / ARTO',
      designation: 'Regional Transport Officer / Assistant RTO',
      phone: '',
      email: '',
      address: 'RTO Office',
      jurisdiction: 'District Level',
      is_active: true,
    },
  ]

  return base
}