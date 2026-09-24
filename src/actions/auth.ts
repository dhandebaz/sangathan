'use server'

import { generateSecureString } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { headers, cookies } from 'next/headers'
import { Database } from '@/types/database'
import { redis } from '@/lib/redis'
import { logger } from '@/lib/logger'
import { invalidateUserMembershipsCache } from '@/lib/auth/context'
import { checkRateLimit } from '@/lib/rate-limit/db-limiter'
import { detectOTPRisk } from '@/lib/risk-engine'
import { getAuthLocale, translateAuthMessage } from '@/lib/i18n/auth-errors'

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
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const SignupSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const OtpLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const ResetPasswordSchema = z.object({
  password: passwordSchema,
  code: z.string().optional(),
})

// --- Actions ---

const LOCKOUT_THRESHOLD = 5
const LOCKOUT_DURATION = 30 * 60 // 30 minutes
const LOCKOUT_COOLDOWN = 10 * 60 // 10 min minimum before lockout can trigger again

async function getLockoutKey(email: string): Promise<{ attempts: number; locked: boolean; remaining: number }> {
  const key = `lockout:login:${email.toLowerCase()}`
  const attempts = (await redis.get<number>(key)) || 0
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
  const cooldownKey = `lockout:cooldown:${email.toLowerCase()}`
  await redis.del(`lockout:login:${email.toLowerCase()}`)
  // Set cooldown so lockout can't immediately re-trigger
  await redis.set(cooldownKey, '1', { ex: LOCKOUT_COOLDOWN })
}

export async function login(input: z.infer<typeof LoginSchema>) {
  try {
    const locale = await getAuthLocale()
    const result = LoginSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: translateAuthMessage(result.error.issues[0].message, locale) }
    }

    const { email, password } = result.data

    const lockout = await getLockoutKey(email)
    if (lockout.locked) {
      return {
        success: false,
        error: translateAuthMessage(`Account temporarily locked. Try again in ${Math.ceil(lockout.remaining / 60)} minutes.`, locale),
      }
    }

    // Check cooldown - if a cooldown is active, wait before attempting login
    const cooldownKey = `lockout:cooldown:${email.toLowerCase()}`
    const cooldownActive = await redis.exists(cooldownKey)
    if (cooldownActive) {
      return {
        success: false,
        error: translateAuthMessage('Too many attempted logins. Please wait before trying again.', locale),
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
      .maybeSingle()

    const profile = profileData as Profile | null

    if (profile && profile.organisation_id) {
      const { data: orgData } = await supabase
        .from('organisations')
        .select('*')
        .eq('id', profile.organisation_id)
        .maybeSingle()

      const org = orgData as Organisation | null

      if (org && org.status === 'suspended') {
        await supabase.auth.signOut()
        return { success: false, error: translateAuthMessage('Your organisation has been suspended. Please contact support.', locale) }
      }
    }
  } catch (err: unknown) {
    console.error('Login Error:', err)
    const locale = await getAuthLocale()
    return { success: false, error: translateAuthMessage(err instanceof Error ? err.message : 'Failed to login', locale) }
  }

  const headersList = await headers()
  const referer = headersList.get('referer') || ''
  const match = referer.match(/\/(en|hi)\//)
  const lang = match?.[1] || 'en'

  redirect(`/${lang}/dashboard`)
}

export async function signup(input: z.infer<typeof SignupSchema>) {
  try {
    const locale = await getAuthLocale()
    const result = SignupSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: translateAuthMessage(result.error.issues[0].message, locale) }
    }

    const { email, password, fullName } = result.data

    const signupKey = `rate_limit:signup:${email.toLowerCase()}`
    const signupAttempts = (await redis.get<number>(signupKey)) || 0
    if (signupAttempts >= 3) {
      return { success: false, error: translateAuthMessage('Too many signup attempts for this email. Please try again later.', locale) }
    }

    const supabase = await createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://sangathan.space'
    const origin = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`

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
      await redis.set(signupKey, signupAttempts + 1)
      await redis.expire(signupKey, 3600)
      return { success: false, error: error.message }
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return { success: false, error: translateAuthMessage('User already registered. Please login.', locale) }
    }

    await redis.set(signupKey, signupAttempts + 1)
    await redis.expire(signupKey, 3600)

    return { success: true, message: translateAuthMessage('Check your email to verify your account.', locale) }
  } catch (err: unknown) {
    console.error('Signup Error:', err)
    const locale = await getAuthLocale()
    return { success: false, error: translateAuthMessage(err instanceof Error ? err.message : 'Failed to sign up', locale) }
  }
}

export async function otpLogin(input: z.infer<typeof OtpLoginSchema>) {
  try {
    const locale = await getAuthLocale()
    const result = OtpLoginSchema.safeParse(input)
    if (!result.success) return { success: false, error: translateAuthMessage(result.error.issues[0].message, locale) }

    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'

    // Risk Check
    const riskCheck = await detectOTPRisk(result.data.email, ip)
    if (riskCheck.blocked) return { success: false, error: translateAuthMessage('Too many login attempts. Please try again later.', locale) }

    const supabase = await createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://sangathan.space'
    const origin = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`

    const { error } = await supabase.auth.signInWithOtp({
      email: result.data.email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        shouldCreateUser: false,
      },
    })

    if (error) return { success: false, error: error.message }

    return { success: true, message: translateAuthMessage('Check your email for the login link.', locale) }
  } catch (err: unknown) {
    console.error('OTP Login Error:', err)
    const locale = await getAuthLocale()
    return { success: false, error: translateAuthMessage(err instanceof Error ? err.message : 'Failed to send login link', locale) }
  }
}

export async function forgotPassword(input: z.infer<typeof ForgotPasswordSchema>) {
  try {
    const locale = await getAuthLocale()
    const result = ForgotPasswordSchema.safeParse(input)
    if (!result.success) return { success: false, error: translateAuthMessage(result.error.issues[0].message, locale) }

    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    })

    if (error) return { success: false, error: error.message }

    return { success: true, message: translateAuthMessage('Password reset link sent to your email.', locale) }
  } catch (err: unknown) {
    console.error('Forgot Password Error:', err)
    const locale = await getAuthLocale()
    return { success: false, error: translateAuthMessage(err instanceof Error ? err.message : 'Failed to send password reset link', locale) }
  }
}

export async function resetPassword(input: z.infer<typeof ResetPasswordSchema>) {
  try {
    const locale = await getAuthLocale()
    const result = ResetPasswordSchema.safeParse(input)
    if (!result.success) return { success: false, error: translateAuthMessage(result.error.issues[0].message, locale) }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.auth.updateUser({
      password: result.data.password,
    })

    if (error) return { success: false, error: error.message }

    // Revoke all other sessions by signing out everywhere
    if (user) {
      const serviceClient = createServiceClient()
      await serviceClient.auth.admin.signOut(user.id)
      await logger.info('auth', 'Sessions revoked after password change', { userId: user.id })
    }
  } catch (err: unknown) {
    console.error('Reset Password Error:', err)
    const locale = await getAuthLocale()
    return { success: false, error: translateAuthMessage(err instanceof Error ? err.message : 'Failed to reset password', locale) }
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

import { getOrgTypeDefaults } from '@/lib/capabilities'

export async function finalizeSignup(input: {
  organizationName: string
  organizationType: string
  slug?: string
  description?: string
  logoUrl?: string | null
  registrationStatus?: string
  designation?: string
  membershipPolicy?: string
  monthlyDues?: string
  focusBlueprint?: string
  legalEntityType?: string | null
  enablePublicPetitions?: boolean
  enableTransparencyLedger?: boolean
  enableEmergencySos?: boolean
}) {
  try {
    const locale = await getAuthLocale()
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user || !user.email) {
      return { success: false, error: translateAuthMessage('Session expired or invalid. Please login again.', locale) }
    }

    const rateLimit = await checkRateLimit('create_org', user.id, 5, 86400)
    if (!rateLimit.allowed) return { success: false, error: rateLimit.error }

    const orgName = input.organizationName?.trim()
    const orgType = input.organizationType || 'civic_collective'
    const metadata = user.user_metadata || {}
    const fullName = ((metadata.full_name as string) || (metadata.name as string) || user.email.split('@')[0] || 'Administrator').trim()

    if (!orgName) {
      return { success: false, error: translateAuthMessage('Organisation name is required.', locale) }
    }

    let targetSlug = ''
    const supabaseAdmin = createServiceClient()

    if (input.slug && input.slug.trim().length >= 3) {
      const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '').replace(/(^-|-$)/g, '')
      const { data: slugCheck } = await supabaseAdmin
        .from('organisations')
        .select('id')
        .eq('slug', cleanSlug)
        .maybeSingle()
      if (!slugCheck) {
        targetSlug = cleanSlug
      }
    }

    if (!targetSlug) {
      let baseSlug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      if (baseSlug.length < 3) baseSlug = 'org'
      targetSlug = `${baseSlug}-${generateSecureString(5)}`
    }

    const userEmail = user.email || (metadata.email as string) || `${user.id}@sangathan.space`
    const regStatus = input.registrationStatus || (orgType === 'civic_collective' ? 'unregistered' : 'registered')

    let orgId: string | null = null

    // Tier 1: 8-parameter RPC
    const rpcRes1 = await supabaseAdmin.rpc('create_organisation_and_admin', {
      p_org_name: orgName,
      p_org_slug: targetSlug,
      p_user_id: user.id,
      p_full_name: fullName,
      p_email: userEmail,
      p_phone: null,
      p_org_type: orgType,
      p_registration_status: regStatus,
    } as never)

    if (rpcRes1.data && (rpcRes1.data as CreateOrganisationAndAdminResult).organisation_id) {
      orgId = (rpcRes1.data as CreateOrganisationAndAdminResult).organisation_id
    } else if (rpcRes1.error && rpcRes1.error.message?.includes('function') && rpcRes1.error.message?.includes('does not exist')) {
      // Tier 2: 7-parameter RPC
      const rpcRes2 = await supabaseAdmin.rpc('create_organisation_and_admin', {
        p_org_name: orgName,
        p_org_slug: targetSlug,
        p_user_id: user.id,
        p_full_name: fullName,
        p_email: userEmail,
        p_phone: null,
        p_org_type: orgType,
      } as never)
      if (rpcRes2.data && (rpcRes2.data as CreateOrganisationAndAdminResult).organisation_id) {
        orgId = (rpcRes2.data as CreateOrganisationAndAdminResult).organisation_id
      }
    }

    // Tier 3: Direct database fallback
    if (!orgId) {
      const initialCaps = getOrgTypeDefaults(orgType)
      const { data: newOrg, error: newOrgErr } = await supabaseAdmin
        .from('organisations')
        .insert({
          name: orgName,
          slug: targetSlug,
          org_type: orgType,
          registration_status: regStatus,
          capabilities: initialCaps,
        } as never)
        .select('id')
        .maybeSingle()

      if (newOrgErr || !newOrg) {
        console.error('Direct org creation error:', newOrgErr)
        await logger.error('auth', 'Signup Fallback Insert Error during finalizeSignup', {
          error: newOrgErr || rpcRes1.error,
          userId: user.id,
          orgName,
          orgType,
        })
        return { success: false, error: translateAuthMessage(newOrgErr?.message || rpcRes1.error?.message || 'Failed to create organisation. Please try again.', locale) }
      }
      orgId = (newOrg as { id: string }).id

      await supabaseAdmin
        .from('profiles')
        .upsert({
          id: user.id,
          organisation_id: orgId,
          role: 'admin',
          full_name: fullName,
          email: userEmail,
          status: 'active',
          approved_at: new Date().toISOString(),
          onboarding_completed: true,
        } as never)
    }

    const { error: profileUpdateError } = await supabaseAdmin
      .from('profiles')
      .update({
        status: 'active',
        approved_at: new Date().toISOString(),
        phone: null,
        phone_verified: false,
        designation: input.designation || null,
        onboarding_completed: true,
      } as never)
      .eq('id', user.id)

    if (profileUpdateError) {
      console.error('Profile update error:', profileUpdateError)
    }

    const defaultCaps = getOrgTypeDefaults(orgType)
    const customizedCaps: Record<string, unknown> = {
      ...defaultCaps,
      focus_blueprint: input.focusBlueprint || null,
    }

    if (input.enablePublicPetitions !== undefined) customizedCaps.campaigns = input.enablePublicPetitions
    if (input.enableTransparencyLedger !== undefined) customizedCaps.transparency_mode = input.enableTransparencyLedger
    if (input.enableEmergencySos !== undefined) customizedCaps.emergency_sos = input.enableEmergencySos

    const orgUpdates: Record<string, unknown> = {
      created_by: user.id,
      membership_policy: input.membershipPolicy || 'admin_approval',
      capabilities: customizedCaps,
    }
    if (input.registrationStatus) orgUpdates.registration_status = input.registrationStatus
    if (input.legalEntityType) orgUpdates.legal_entity_type = input.legalEntityType
    if (input.description) orgUpdates.description = input.description
    if (input.monthlyDues && Number(input.monthlyDues) > 0) orgUpdates.monthly_dues = Number(input.monthlyDues)

    if (input.logoUrl) {
      if (input.logoUrl.startsWith('data:image/')) {
        try {
          const base64Prefix = input.logoUrl.split(';base64,').pop()
          if (base64Prefix) {
            const buffer = Buffer.from(base64Prefix, 'base64')
            const filePath = `${orgId}/logo_${Date.now()}.png`
            const { error: logoUploadErr } = await supabaseAdmin.storage
              .from('organisation_assets')
              .upload(filePath, buffer, { contentType: 'image/png', upsert: true })
            
            if (!logoUploadErr) {
              const { data: publicUrlData } = supabaseAdmin.storage
                .from('organisation_assets')
                .getPublicUrl(filePath)
              orgUpdates.logo_url = publicUrlData.publicUrl
            }
          }
        } catch (uploadErr) {
          console.error('Logo upload error:', uploadErr)
        }
      } else {
        orgUpdates.logo_url = input.logoUrl
      }
    }

    const { error: orgUpdateError } = await supabaseAdmin
      .from('organisations')
      .update(orgUpdates as never)
      .eq('id', orgId)

    if (orgUpdateError) {
      console.error('Org update error:', orgUpdateError)
    }

    try {
      await supabaseAdmin.rpc('seed_compliance_items', {
        p_org_id: orgId,
        p_org_type: orgType,
      } as never)
    } catch (complianceErr) {
      console.error('Compliance seeding error:', complianceErr)
    }

    try {
      const cookieStore = await cookies()
      cookieStore.set('sangathan_org_id', orgId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      })
    } catch (cookieErr) {
      console.warn('Could not set cookie during finalizeSignup:', cookieErr)
    }

    try {
      await invalidateUserMembershipsCache(user.id)
    } catch (cacheErr) {
      console.warn('Cache invalidation warning:', cacheErr)
    }

    return { success: true, orgId, slug: targetSlug }
  } catch (err: unknown) {
    console.error('finalizeSignup Unhandled Exception:', err)
    await logger.error('auth', 'finalizeSignup Unhandled Exception', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    })
    const locale = await getAuthLocale()
    return {
      success: false,
      error: translateAuthMessage(err instanceof Error ? err.message : 'An unexpected error occurred during setup. Please try again.', locale),
    }
  }
}

export async function markOnboardingCompleted(userId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', userId)

    if (error) {
      console.error('Failed to mark onboarding completed:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: unknown) {
    console.error('markOnboardingCompleted Exception:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update onboarding status' }
  }
}
