'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { headers } from 'next/headers'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Organisation = Database['public']['Tables']['organisations']['Row']

// --- Input Schemas ---

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const SignupSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm Password is required"),
  terms: z.boolean().refine(val => val === true, "You must accept the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

const OtpLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
})

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm Password is required"),
  code: z.string().optional(), // If using PKCE code exchange manually
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

// --- Actions ---

export async function login(input: z.infer<typeof LoginSchema>) {
  try {
    // 1. Validate Input
    const result = LoginSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0].message }
    }

    const supabase = await createClient()
    const { email, password } = result.data

    // 2. Sign In
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // 3. Check Suspension
    // We need to fetch the profile -> organisation
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    const profile = profileData as Profile | null

    if (profile && profile.organisation_id) {
      const { data: orgData } = await supabase
        .from('organisations')
        .select('*')
        .eq('id', profile.organisation_id)
        .single()

      const org = orgData as Organisation | null

      if (org && org.is_suspended) {
        await supabase.auth.signOut()
        return { success: false, error: 'Your organisation has been suspended. Please contact support.' }
      }
    }
  } catch (err: unknown) {
    console.error('Login Error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Failed to login' }
  }

  const headersList = await headers()
  const referer = headersList.get('referer') || ''
  const match = referer.match(/\/(en|hi)\//)
  const lang = match?.[1] || 'en'

  redirect(`/${lang}/dashboard`)
}

import { checkRateLimit } from '@/lib/rate-limit/db-limiter'

export async function signup(input: z.infer<typeof SignupSchema>) {
  try {
    // 1. Validate Input
    const result = SignupSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0].message }
    }

    const { email, password, fullName } = result.data
    const supabase = await createClient()

    // 2. Rate Limit (IP based is handled by Supabase Auth).
    // We can't do much here for IP since we don't have a reliable IP store yet.
    // We rely on Supabase Auth's built-in protections for now.

    // 3. Sign Up
    // Prioritize NEXT_PUBLIC_APP_URL for consistent production behavior AND ensure https
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://sangathan.space';
    const origin = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return { success: false, error: 'User already registered. Please login.' }
    }

    return { success: true, message: 'Check your email to verify your account.' }
  } catch (err: unknown) {
    console.error('Signup Error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Failed to sign up' }
  }
}

import { detectOTPRisk } from '@/lib/risk-engine'

export async function otpLogin(input: z.infer<typeof OtpLoginSchema>) {
  const result = OtpLoginSchema.safeParse(input)
  if (!result.success) return { success: false, error: result.error.issues[0].message }

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'

  // Risk Check
  const riskCheck = await detectOTPRisk(result.data.email, ip) // Using email as identifier for now since we don't have phone
  if (riskCheck.blocked) return { success: false, error: 'Too many login attempts. Please try again later.' }

  const supabase = await createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://sangathan.space';
  const origin = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`;

  const { error } = await supabase.auth.signInWithOtp({
    email: result.data.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      shouldCreateUser: false, // Don't create new users via OTP login
    },
  })

  if (error) return { success: false, error: error.message }

  return { success: true, message: 'Check your email for the login link.' }
}

export async function forgotPassword(input: z.infer<typeof ForgotPasswordSchema>) {
  const result = ForgotPasswordSchema.safeParse(input)
  if (!result.success) return { success: false, error: result.error.issues[0].message }

  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  })

  if (error) return { success: false, error: error.message }

  return { success: true, message: 'Password reset link sent to your email.' }
}

export async function resetPassword(input: z.infer<typeof ResetPasswordSchema>) {
  const result = ResetPasswordSchema.safeParse(input)
  if (!result.success) return { success: false, error: result.error.issues[0].message }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: result.data.password
  })

  if (error) return { success: false, error: error.message }

  const headersList = await headers()
  const referer = headersList.get('referer') || ''
  const match = referer.match(/\/(en|hi)\//)
  const lang = match?.[1] || 'en'

  redirect(`/${lang}/dashboard`)
}

type CreateOrganisationAndAdminResult = {
  success: boolean
  organisation_id: string
  profile_id: string
}

export async function finalizeSignup(input: { organizationName: string; organizationType: string }) {
  // Get Authenticated User
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return { success: false, error: 'Session expired. Please login again.' }
  }

  // Check Rate Limit (Org Creation)
  // Max 2 orgs per user per 24h
  const rateLimit = await checkRateLimit('create_org', user.id, 2, 86400)
  if (!rateLimit.allowed) return { success: false, error: rateLimit.error }

  const orgName = input.organizationName
  const orgType = input.organizationType
  const metadata = user.user_metadata || {}
  const fullName = metadata.full_name

  if (!orgName || !fullName || !orgType) {
    return { success: false, error: 'Incomplete registration details. Please provide all required fields.' }
  }

  const baseSlug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`

  const supabaseAdmin = createServiceClient()
  const {
    data: rpcData,
    error: rpcError,
  } = await supabaseAdmin.rpc('create_organisation_and_admin', {
    p_org_name: orgName,
    p_org_slug: uniqueSlug,
    p_user_id: user.id,
    p_full_name: fullName,
    p_email: user.email,
    p_phone: null,
    p_org_type: orgType,
  } as never)

  if (!rpcError && rpcData) {
    await supabaseAdmin
      .from('profiles')
      .update({
        status: 'active',
        approved_at: new Date().toISOString(),
        phone: null,
        phone_verified: false,
      } as never)
      .eq('id', user.id)
  }

  if (rpcError || !rpcData) {
    console.error('Signup RPC Error:', rpcError)
    return { success: false, error: `Database Registration Failed: ${rpcError?.message || 'Unknown Error'} (Code: ${rpcError?.code || 'UNKNOWN'})` }
  }

  const result = rpcData as CreateOrganisationAndAdminResult

  return { success: true, orgId: result.organisation_id }
}


