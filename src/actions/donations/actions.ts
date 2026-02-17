'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'

// --- Schemas ---

export const LogDonationSchema = z.object({
  donor_name: z.string().min(2),
  amount: z.coerce.number().positive(), // Coerce handles string->number from forms
  date: z.string().datetime(),
  payment_method: z.enum(['cash', 'upi', 'bank_transfer', 'other']),
  upi_reference: z.string().optional(),
  notes: z.string().optional(),
})

export const VerifyDonationSchema = z.object({
  donationId: z.string().uuid(),
})

export const DeleteDonationSchema = z.object({
  donationId: z.string().uuid(),
})

export const PublicDonationSchema = z.object({
  orgSlug: z.string(),
  donor_name: z.string().min(2),
  phone: z.string().min(10),
  amount: z.coerce.number().positive(),
  upi_reference: z.string().min(4),
  honeypot: z.string().optional(),
})

// --- Dashboard Actions ---

export const logDonation = createSafeAction(
  LogDonationSchema,
  async (input, context) => {
    const supabase = await createClient()

    // 1. Check uniqueness of UPI reference if provided
    if (input.upi_reference) {
      const { data: existing } = await supabase
        .from('donations')
        .select('id')
        .eq('organisation_id', context.organizationId)
        .eq('upi_reference', input.upi_reference)
        .single()

      if (existing) {
        throw new Error('This UPI reference has already been recorded.')
      }
    }

    // 2. Insert
    type DonationRow = {
      id: string
    }

    const { data: donation, error } = (await supabase
      .from('donations')
      .insert({
        organisation_id: context.organizationId,
        donor_name: input.donor_name,
        amount: input.amount,
        date: input.date,
        payment_method: input.payment_method,
        upi_reference: input.upi_reference,
        notes: input.notes,
        verified_by: context.user.id,
      } as never)
      .select('id')
      .single()) as { data: DonationRow | null, error: { message: string, code?: string } | null }

    if (error || !donation) {
      if (error?.code === '23505') throw new Error('Duplicate entry.')
      throw new Error(error?.message || 'Failed to log donation')
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'DONATION_LOGGED',
      resource_table: 'donations',
      resource_id: donation.id,
      details: { amount: input.amount, donor: input.donor_name }
    })

    revalidatePath('/dashboard/donations')
    return { donationId: donation.id }
  },
  { allowedRoles: ['admin', 'editor'] }
)

export const verifyDonation = createSafeAction(
  VerifyDonationSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('donations')
      .update({ verified_by: context.user.id } as never)
      .eq('id', input.donationId)
      .eq('organisation_id', context.organizationId)

    if (error) throw new Error(error.message)

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'DONATION_VERIFIED',
      resource_table: 'donations',
      resource_id: input.donationId
    })

    revalidatePath('/dashboard/donations')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'] }
)

export const deleteDonation = createSafeAction(
  DeleteDonationSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', input.donationId)
      .eq('organisation_id', context.organizationId)

    if (error) throw new Error(error.message)

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'DONATION_DELETED',
      resource_table: 'donations',
      resource_id: input.donationId
    })

    revalidatePath('/dashboard/donations')
    return { success: true }
  },
  { allowedRoles: ['admin'] } // Admin only
)

// --- Public Action ---

export async function submitPublicDonation(input: z.infer<typeof PublicDonationSchema>) {
  // 1. Spam Check
  if (input.honeypot && input.honeypot.length > 0) {
    return { success: false, error: 'Spam detected' }
  }

  const supabase = createServiceClient()

  // 2. Resolve Organisation from Slug
  const { data: organisation, error: orgError } = (await supabase
    .from('organisations')
    .select('id, is_suspended')
    .eq('slug', input.orgSlug)
    .single()) as {
      data: { id: string; is_suspended: boolean } | null
      error: { message: string } | null
    }

  if (orgError || !organisation) {
    return { success: false, error: 'Organisation not found' }
  }

  if (organisation.is_suspended) {
    return { success: false, error: 'Organisation is suspended' }
  }

  // 3. Check Duplicate UPI (Service Role bypasses RLS, so we must be specific)
  // Use Admin client for check to ensure we see all records
  const { data: existing } = await supabase
    .from('donations')
    .select('id')
    .eq('organisation_id', organisation.id)
    .eq('upi_reference', input.upi_reference)
    .single()

  if (existing) {
    return { success: false, error: 'This UPI reference has already been submitted.' }
  }

  // 4. Insert Donation (Admin client)
  const { error } = await supabase
    .from('donations')
    .insert({
      organisation_id: organisation.id,
      donor_name: input.donor_name,
      amount: input.amount,
      date: new Date().toISOString(),
      payment_method: 'upi',
      upi_reference: input.upi_reference,
      notes: `Public submission from ${input.phone}`,
      verified_by: null,
    } as never)

  if (error) {
    console.error('Donation Insert Error:', error)
    return { success: false, error: 'Failed to record donation' }
  }

  return { success: true }
}
