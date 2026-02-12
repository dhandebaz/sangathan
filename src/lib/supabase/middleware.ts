import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect System Admin Routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || !user.email) {
       const url = request.nextUrl.clone()
       url.pathname = '/login'
       return NextResponse.redirect(url)
    }
    
    // Strict Whitelist Check
    const superAdmins = process.env.SUPER_ADMIN_EMAILS?.split(',') || []
    if (!superAdmins.includes(user.email)) {
       // Return 404 to hide admin existence or 403
       return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }
  }

  const pathname = request.nextUrl.pathname
  const locales = ['en', 'hi']
  
  // Helper to check if path starts with locale
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Auth Routes that should be public but redirected to dashboard if logged in
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email']
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || 
    locales.some(loc => pathname === `/${loc}${route}`)
  )

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Define strictly public paths (no auth required)
  const isPublicPath = 
    pathname === '/' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/f/') || // Public Forms
    pathname.startsWith('/donate') || // Public Donation
    pathname.startsWith('/auth') || // Auth Callback
    authRoutes.some(route => pathname === route || locales.some(loc => pathname.startsWith(`/${loc}${route}`))) || // Auth pages
    locales.some(loc => pathname === `/${loc}` || pathname.startsWith(`/${loc}/docs`) || pathname.startsWith(`/${loc}/contact`) || pathname.startsWith(`/${loc}/status`) || pathname.startsWith(`/${loc}/terms`) || pathname.startsWith(`/${loc}/privacy`))

  // Protect all other routes (Dashboard, etc)
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // i18n Redirection Logic
  // Check if path is missing locale
  // We exclude api, _next, static, f, auth
  const shouldHandleLocale = 
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/f/') &&
    !pathname.startsWith('/auth') &&
    !pathname.includes('.') 

  if (shouldHandleLocale && !hasLocale) {
      const locale = 'en' // Default
      return NextResponse.redirect(
        new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
      )
  }

  return supabaseResponse
}
