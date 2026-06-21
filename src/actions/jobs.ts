'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createJobSchema = z.object({
  title: z.string().min(1),
  employer_name: z.string().min(1),
  location: z.string().optional(),
  description: z.string().optional(),
  skills_required: z.string().optional(), // Comma separated
  wage_rate: z.string().optional(),
  positions_available: z.number().min(1).default(1),
  start_date: z.string().optional(),
})

export const createJobPosting = createSafeAction(
  createJobSchema,
  async (data, context) => {
    const supabase = await createClient();
    const organisationId = context.organizationId;
    const profileId = context.user.id;
    const skillsArray = data.skills_required 
      ? data.skills_required.split(',').map(s => s.trim()) 
      : []

    const { error } = await supabase
      .from('job_postings')
      .insert({
        organisation_id: organisationId,
        title: data.title,
        employer_name: data.employer_name,
        location: data.location,
        description: data.description,
        skills_required: skillsArray,
        wage_rate: data.wage_rate,
        positions_available: data.positions_available,
        start_date: data.start_date || null
      })

    if (error) throw new Error(error.message)
    revalidatePath('/[lang]/dashboard/jobs', 'page')
    return { success: true }
  }
)

const applyJobSchema = z.object({
  job_id: z.string().uuid(),
  notes: z.string().optional(),
})

export const applyForJob = createSafeAction(
  applyJobSchema,
  async (data, context) => {
    const supabase = await createClient();
    const organisationId = context.organizationId;
    const profileId = context.user.id;
    const { error } = await supabase
      .from('job_applications')
      .insert({
        job_id: data.job_id,
        profile_id: profileId,
        notes: data.notes
      })

    if (error) {
      if (error.code === '23505') throw new Error('You have already applied for this job.')
      throw new Error(error.message)
    }
    
    revalidatePath('/[lang]/dashboard/jobs', 'page')
    return { success: true }
  }
)

const updateApplicationStatusSchema = z.object({
  application_id: z.string().uuid(),
  status: z.enum(['dispatched', 'rejected', 'completed'])
})

export const updateApplicationStatus = createSafeAction(
  updateApplicationStatusSchema,
  async (data, context) => {
    const supabase = await createClient();
    const organisationId = context.organizationId;
    const profileId = context.user.id;
    // Note: RLS ensures only admins of the job's org can update it
    const { error } = await supabase
      .from('job_applications')
      .update({ status: data.status })
      .eq('id', data.application_id)

    if (error) throw new Error(error.message)
    revalidatePath('/[lang]/dashboard/jobs', 'page')
    return { success: true }
  }
)
