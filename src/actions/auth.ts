'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { headers } from 'next/headers'
import { Database } from '@/types/database'
import { redis } from '@/lib/redis'
import { logger } from '@/lib/logger'

type Profile = Database['public']['Tables']['profiles']['Row']
type Organisation = Database['public']['Tables']['organisations']['Row']

// --- Password Validation ---

const PASSWORD_MIN_LENGTH = 12
const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

// --- Input Schemas ---

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const SignupSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Confirm Password is required"),
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
  password: passwordSchema,
  code: z.string().optional(),
})

// --- Actions ---

const LOCKOUT_THRESHOLD = 5
const LOCKOUT_DURATION = 15 * 60

async function getLockoutKey(email: string): Promise<{ attempts: number; locked: boolean; remaining: number }> {
  const key = `lockout:login:${email.toLowerCase()}`
  const attempts = await redis.get<number>(key) || 0
  const locked = attempts >= LOCKOUT_THRESHOLD
  return { attempts, locked, remaining: LOCKOUT_DURATION }
}

async function incrementLockout(email: string): Promise<void> {
  const key = `lockout:login:${email.toLowerCase()}`
  const attempts = (await redis.get<number>(key)) || 0
  await redis.set(key, attempts + 1)
  await redis.expire(key, LOCKOUT_DURATION)
}

async function clearLockout(email: string): Promise<void> {
  await redis.del(`lockout:login:${email.toLowerCase()}`)
}

export async function login(input: z.infer<typeof LoginSchema>) {
  try {
    const result = LoginSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0].message }
    }

    const { email, password } = result.data

    const lockout = await getLockoutKey(email)
    if (lockout.locked) {
      return {
        success: false,
        error: `Account temporarily locked. Try again in ${Math.ceil(lockout.remaining / 60)} minutes.`,
      }
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      await incrementLockout(email)
      const remaining = LOCKOUT_THRESHOLD - (await getLockoutKey(email)).attempts
      if (remaining <= 0) {
        await logger.warn('auth', `Account locked due to failed attempts`, { email })
      }
      return { success: false, error: error.message }
    }

    await clearLockout(email)

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

      if (org && org.status === 'suspended') {
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
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.auth.updateUser({
    password: result.data.password
  })

  if (error) return { success: false, error: error.message }

  // Revoke all other sessions by signing out everywhere
  if (user) {
    const serviceClient = createServiceClient()
    await serviceClient.auth.admin.signOut(user.id)
    await logger.info('auth', 'Sessions revoked after password change', { userId: user.id })
  }

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

export async function finalizeSignup(input: { organizationName: string; organizationType: string; registrationStatus?: string }) {
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
  const fullName = metadata.full_name as string

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
    const resultObj = rpcData as CreateOrganisationAndAdminResult;

    // Update profile
    await supabaseAdmin
      .from('profiles')
      .update({
        status: 'active',
        approved_at: new Date().toISOString(),
        phone: null,
        phone_verified: false,
      } as never)
      .eq('id', user.id)

    // Update organisation with registration status if provided
    if (input.registrationStatus) {
      await supabaseAdmin
        .from('organisations')
        .update({
          registration_status: input.registrationStatus,
        } as never)
        .eq('id', resultObj.organisation_id)
    }
  }

  if (rpcError || !rpcData) {
    console.error('Signup RPC Error:', rpcError)
    return { success: false, error: `Database Registration Failed: ${rpcError?.message || 'Unknown Error'} (Code: ${rpcError?.code || 'UNKNOWN'})` }
  }

  const result = rpcData as CreateOrganisationAndAdminResult

  return { success: true, orgId: result.organisation_id }
}
