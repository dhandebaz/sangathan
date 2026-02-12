'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'

// --- Schemas ---

const LogDonationSchema = z.object({
  donor_name: z.string().min(2),
  amount: z.coerce.number().positive(), // Coerce handles string->number from forms
  date: z.string().datetime(),
  payment_method: z.enum(['cash', 'upi', 'bank_transfer', 'other']),
  upi_reference: z.string().optional(),
  notes: z.string().optional(),
})

const VerifyDonationSchema = z.object({
  donationId: z.string().uuid(),
})

const DeleteDonationSchema = z.object({
  donationId: z.string().uuid(),
})

const PublicDonationSchema = z.object({
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
    const { data, error } = await supabase
      .from('donations')
      .insert({
        organisation_id: context.organizationId,
        donor_name: input.donor_name,
        amount: input.amount,
        date: input.date,
        payment_method: input.payment_method,
        upi_reference: input.upi_reference,
        notes: input.notes,
        verified_by: context.user.id // Auto-verify if logged manually
      })
      .select('id')
      .single()

    if (error) {
       if (error.code === '23505') throw new Error('Duplicate entry.')
       throw new Error(error.message)
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'DONATION_LOGGED',
      resource_table: 'donations',
      resource_id: data.id,
      details: { amount: input.amount, donor: input.donor_name }
    })

    revalidatePath('/dashboard/donations')
    return { donationId: data.id }
  },
  { allowedRoles: ['admin', 'editor'] }
)

export const verifyDonation = createSafeAction(
  VerifyDonationSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('donations')
      .update({ verified_by: context.user.id }) // Mark as verified by current user
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
  const { data: org, error: orgError } = await supabase
    .from('organisations')
    .select('id')
    .eq('slug', input.orgSlug)
    .single()

  if (orgError || !org) {
    return { success: false, error: 'Organisation not found' }
  }

  // 3. Check Duplicate UPI (Service Role bypasses RLS, so we must be specific)
  const { data: existing } = await supabase
    .from('donations')
    .select('id')
    .eq('organisation_id', org.id)
    .eq('upi_reference', input.upi_reference)
    .single()

  if (existing) {
    return { success: false, error: 'This UPI reference has already been submitted.' }
  }

  // 4. Insert
  const { error } = await supabase
    .from('donations')
    .insert({
      organisation_id: org.id,
      donor_name: input.donor_name,
      amount: input.amount,
      payment_method: 'upi',
      upi_reference: input.upi_reference,
      notes: `Phone: ${input.phone}`, // Storing phone in notes as per schema limitation or design
      verified_by: null // Pending verification
    })

  if (error) {
    console.error('Donation Insert Error:', error)
    return { success: false, error: 'Failed to record donation' }
  }

  return { success: true }
}
