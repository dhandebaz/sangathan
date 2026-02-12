import { createClient } from '@/lib/supabase/server'
import { createSafeAction } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// --- Input Validation ---

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  organizationName: z.string().min(3),
  fullName: z.string().min(2),
})

// --- Server Actions ---

export async function login(input: z.infer<typeof LoginSchema>) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword(input)

  if (error) {
    return { success: false, error: error.message }
  }

  // Next.js convention: redirect after successful mutation
  // But we need to verify the user has a profile first?
  // Let middleware handle the profile check on subsequent navigation.
  redirect('/')
}

export async function signup(input: z.infer<typeof SignupSchema>) {
  const supabase = await createClient()

  // 1. Sign Up the User
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName,
        organization_name: input.organizationName,
        // We store metadata here just in case, but rely on our explicit DB inserts below
      },
    },
  })

  if (authError || !authData.user) {
    return { success: false, error: authError?.message || 'Signup failed' }
  }

  // 2. Transactional Logic (Ideally SQL Trigger, but implemented here for architecture definition)
  // We assume the user is immediately authenticated if email confirmation is disabled.
  // If email confirmation is enabled, this logic must move to a Postgres Trigger on `auth.users` insert.
  
  // For the purpose of this architecture, we define the operations that MUST happen:
  
  // a) Create Organization
  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: input.organizationName,
      slug: input.organizationName.toLowerCase().replace(/\s+/g, '-'), // Basic slugify
    })
    .select()
    .single()

  if (orgError || !orgData) {
    // Rollback user creation? Hard without admin privileges.
    // This is why a database trigger is superior for data integrity.
    return { success: false, error: 'Organization creation failed: ' + orgError?.message }
  }

  // b) Create Profile linked to User and Organization as Admin
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    organization_id: orgData.id,
    role: 'admin',
    full_name: input.fullName,
    email: input.email,
  })

  if (profileError) {
    return { success: false, error: 'Profile creation failed: ' + profileError.message }
  }

  redirect('/')
}
