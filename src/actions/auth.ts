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
  // 1. Validate Input
  const result = LoginSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message }
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
  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', data.user.id)
    .single()
  
  if (profile && profile.organisation_id) {
    const { data: org } = await supabase
      .from('organisations')
      .select('is_suspended')
      .eq('id', profile.organisation_id)
      .single()
    
    if (org && org.is_suspended) {
      await supabase.auth.signOut()
      return { success: false, error: 'Your organisation has been suspended. Please contact support.' }
    }
  }

  redirect('/dashboard')
}

export async function signup(input: z.infer<typeof SignupSchema>) {
  // 1. Validate Input
  const result = SignupSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message }
  }

  const { email, password, fullName, organizationName } = result.data
  const supabase = await createClient()
  
  // 2. Rate Limit (Basic IP check via headers if possible, or assume Supabase handles it)
  // Supabase Auth has built-in rate limits.

  // 3. Sign Up
  // We store metadata for the Callback route to handle DB creation
  const origin = (await headers()).get('origin')
  
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
}

export async function otpLogin(input: z.infer<typeof OtpLoginSchema>) {
  const result = OtpLoginSchema.safeParse(input)
  if (!result.success) return { success: false, error: result.error.errors[0].message }

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
  if (!result.success) return { success: false, error: result.error.errors[0].message }

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
  if (!result.success) return { success: false, error: result.error.errors[0].message }

  const supabase = await createClient()
  
  const { error } = await supabase.auth.updateUser({
    password: result.data.password
  })

  if (error) return { success: false, error: error.message }

  redirect('/dashboard')
}
