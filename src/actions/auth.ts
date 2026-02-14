'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { headers } from 'next/headers'

// --- Input Schemas ---

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const SignupSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  organizationName: z.string().min(3, "Organisation Name must be at least 3 chars"),
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
    
    const profile = profileData as any

    if (profile && profile.organisation_id) {
      const { data: orgData } = await supabase
        .from('organisations')
        .select('*')
        .eq('id', profile.organisation_id)
        .single()
      
      const org = orgData as any

      if (org && org.is_suspended) {
        await supabase.auth.signOut()
        return { success: false, error: 'Your organisation has been suspended. Please contact support.' }
      }
    }
  } catch (err: any) {
    console.error('Login Error:', err)
    return { success: false, error: err.message || 'Failed to login' }
  }

  redirect('/dashboard')
}

export async function signup(input: z.infer<typeof SignupSchema>) {
  try {
    // 1. Validate Input
    const result = SignupSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0].message }
    }

    const { email, password, fullName, organizationName } = result.data
    const supabase = await createClient()
    
    // 2. Rate Limit (Basic IP check via headers if possible, or assume Supabase handles it)
    // Supabase Auth has built-in rate limits.

    // 3. Sign Up
    // We store metadata for the Callback route to handle DB creation
    const headersList = await headers()
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://sangathan.space'
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          organization_name: organizationName,
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
  } catch (err: any) {
    console.error('Signup Error:', err)
    return { success: false, error: err.message || 'Failed to sign up' }
  }
}

export async function otpLogin(input: z.infer<typeof OtpLoginSchema>) {
  const result = OtpLoginSchema.safeParse(input)
  if (!result.success) return { success: false, error: result.error.issues[0].message }

  const supabase = await createClient()
  const origin = (await headers()).get('origin')

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

  redirect('/dashboard')
}

import { firebaseAdminAuth } from '@/lib/firebase/admin'

const PhoneLoginSchema = z.object({
  idToken: z.string().min(1, "Firebase ID Token required"),
})

export async function phoneLogin(input: z.infer<typeof PhoneLoginSchema>) {
  // 1. Verify Firebase Token
  const result = PhoneLoginSchema.safeParse(input)
  if (!result.success) return { success: false, error: result.error.issues[0].message }

  let decodedToken
  try {
    decodedToken = await firebaseAdminAuth.verifyIdToken(input.idToken)
  } catch (error) {
    return { success: false, error: 'Invalid phone verification' }
  }

  const phoneNumber = decodedToken.phone_number
  if (!phoneNumber) return { success: false, error: 'No phone number in token' }

  // 2. Find Profile by Phone
  const supabaseAdmin = createServiceClient()
  
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('phone', phoneNumber)
    .single()
    
  const profile = data as any

  if (profile) {
    // User exists. Generate magic link session.
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: profile.email,
    })
    
    if (linkError) return { success: false, error: 'Failed to generate session' }
    
    return { success: true, redirectUrl: linkData.properties.action_link }
  }
  
  // User not found -> Link Flow
  return { success: false, code: 'LINK_REQUIRED', phoneNumber }
}

export async function linkPhoneToAccount(input: z.infer<typeof LoginSchema> & { idToken: string }) {
  // 1. Verify Credentials (Login)
  const result = LoginSchema.safeParse(input)
  if (!result.success) return { success: false, error: result.error.issues[0].message }
  
  const supabase = await createClient()
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password
  })
  
  if (authError || !authData.user) return { success: false, error: 'Invalid credentials' }
  
  // 2. Verify Firebase Token
  let decodedToken
  try {
    decodedToken = await firebaseAdminAuth.verifyIdToken(input.idToken)
  } catch (error) {
    return { success: false, error: 'Invalid phone verification' }
  }
  
  const phoneNumber = decodedToken.phone_number
  if (!phoneNumber) return { success: false, error: 'No phone number in token' }
  
  // 3. Update Profile
  const supabaseAdmin = createServiceClient()
  
  // Check if phone already used
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('phone', phoneNumber)
    .neq('id', authData.user.id) // Allow re-linking to self
    .single()
    
  const existing = data as any

  if (existing) return { success: false, error: 'Phone number already linked to another account' }
  
  const admin: any = supabaseAdmin
  await admin
    .from('profiles')
    .update({ 
      phone: phoneNumber,
      phone_verified: true,
      firebase_uid: decodedToken.uid
    })
    .eq('id', authData.user.id)
    
  redirect('/dashboard')
}

export async function finalizeSignup(input: { idToken: string }) {
  // 1. Verify Firebase Token
  let decodedToken
  try {
    decodedToken = await firebaseAdminAuth.verifyIdToken(input.idToken)
  } catch (error) {
    return { success: false, error: 'Invalid phone verification' }
  }

  const phoneNumber = decodedToken.phone_number
  if (!phoneNumber) return { success: false, error: 'No phone number in token' }
  const firebaseUid = decodedToken.uid

  // 2. Get Authenticated User
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return { success: false, error: 'Session expired. Please login again.' }
  }

  // 3. Check Phone Uniqueness (Global Check)
  const supabaseAdmin = createServiceClient()
  const { data: existingPhone } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('phone', phoneNumber)
    .maybeSingle()
  
  if (existingPhone) {
    return { success: false, error: 'This phone number is already registered as an admin.' }
  }

  // 4. Retrieve Metadata
  const metadata = user.user_metadata
  const orgName = metadata.organization_name
  const fullName = metadata.full_name

  if (!orgName || !fullName) {
    // Edge case: Metadata lost or direct access
    // We could prompt user to re-enter details, but for now error out.
    return { success: false, error: 'Registration details not found. Please sign up again.' }
  }

  // 5. Atomic Creation (Organisation + Profile)
  // Generate Slug
  const baseSlug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`

  const { error: rpcError } = await (supabaseAdmin.rpc as any)('create_organisation_and_admin', {
    p_org_name: orgName,
    p_org_slug: uniqueSlug,
    p_user_id: user.id,
    p_full_name: fullName,
    p_email: user.email,
    p_phone: phoneNumber,
    p_firebase_uid: firebaseUid
  })

  if (rpcError) {
    console.error('Signup RPC Error:', rpcError)
    return { success: false, error: 'Failed to complete registration. Please try again.' }
  }

  return { success: true }
}
