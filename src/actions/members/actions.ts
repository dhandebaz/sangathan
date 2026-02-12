import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit/log'

// --- Schemas ---

// Required: full_name, phone, joining_date, status
const AddMemberSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"), // Assuming 10 digits minimum
  email: z.string().email().optional().or(z.literal('')),
  designation: z.string().optional(),
  area: z.string().optional(),
  joining_date: z.string().datetime().default(() => new Date().toISOString()),
  status: z.enum(['active', 'inactive']).default('active'),
  notes: z.string().optional(),
  role: z.enum(['admin', 'editor', 'viewer', 'member']).default('member'),
})

const UpdateMemberSchema = AddMemberSchema.partial().extend({
  memberId: z.string().uuid(),
})

const ChangeStatusSchema = z.object({
  memberId: z.string().uuid(),
  status: z.enum(['active', 'inactive']),
})

// --- Actions ---

export const addMember = createSafeAction(
  AddMemberSchema,
  async (input, context) => {
    const supabase = await createClient()

    // We are adding to the 'members' table
    const { data, error } = await supabase
      .from('members')
      .insert({
        organisation_id: context.organizationId,
        full_name: input.full_name,
        email: input.email || null, // Convert empty string to null
        phone: input.phone,
        designation: input.designation,
        area: input.area,
        joining_date: input.joining_date,
        status: input.status, // Add status column to DB schema if missing
        notes: input.notes, // Add notes column to DB schema if missing
        role: input.role,
      })
      .select('id')
      .single()

    if (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Phone number already exists in this organisation.')
      }
      throw new Error(error.message)
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'MEMBER_CREATED',
      resource_table: 'members',
      resource_id: data.id,
      details: { full_name: input.full_name, role: input.role }
    })

    revalidatePath('/members')
    return { memberId: data.id }
  },
  { allowedRoles: ['admin', 'editor'] } // Editor can create too
)

export const updateMember = createSafeAction(
  UpdateMemberSchema,
  async (input, context) => {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('members')
      .update({
        full_name: input.full_name,
        email: input.email || null,
        phone: input.phone,
        designation: input.designation,
        area: input.area,
        joining_date: input.joining_date,
        status: input.status,
        notes: input.notes,
        role: input.role,
      })
      .eq('id', input.memberId)
      .eq('organisation_id', context.organizationId)

    if (error) {
       if (error.code === '23505') {
        throw new Error('Phone number already exists.')
      }
      throw new Error(error.message)
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'MEMBER_UPDATED',
      resource_table: 'members',
      resource_id: input.memberId,
      details: { changes: input }
    })

    revalidatePath('/members')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'] }
)

export const changeMemberStatus = createSafeAction(
  ChangeStatusSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('members')
      .update({ status: input.status })
      .eq('id', input.memberId)
      .eq('organisation_id', context.organizationId)

    if (error) {
      throw new Error(error.message)
    }
    
    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'MEMBER_STATUS_CHANGED',
      resource_table: 'members',
      resource_id: input.memberId,
      details: { status: input.status }
    })

    revalidatePath('/members')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'] }
)
