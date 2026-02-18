import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  let user = null

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
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

      const { data } = await supabase.auth.getUser()
      user = data.user
    }
  } catch (error) {
    console.error('Middleware Auth Error:', error)
    // Proceed as unauthenticated
  }

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

  const pathname = request.nextUrl.pathname // Declare pathname early for use below

  const isSystemAdmin = user?.email && (process.env.SUPER_ADMIN_EMAILS?.split(',') || []).includes(user.email)
  
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
    url.pathname = '/en/dashboard'
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
    locales.some(loc => 
      pathname === `/${loc}` || 
      pathname.startsWith(`/${loc}/docs`) || 
      pathname.startsWith(`/${loc}/contact`) || 
      pathname.startsWith(`/${loc}/status`) || 
      pathname.startsWith(`/${loc}/terms`) || 
      pathname.startsWith(`/${loc}/privacy`) ||
      pathname.startsWith(`/${loc}/about`) ||
      pathname.startsWith(`/${loc}/governance`) ||
      pathname.startsWith(`/${loc}/security`) ||
      pathname.startsWith(`/${loc}/transparency`) ||
      pathname.startsWith(`/${loc}/roadmap`) ||
      pathname.startsWith(`/${loc}/changelog`) ||
      pathname.startsWith(`/${loc}/brand`) ||
      pathname.startsWith(`/${loc}/press`) ||
      pathname.startsWith(`/${loc}/acceptable-use-policy`) ||
      pathname.startsWith(`/${loc}/refund-policy`) ||
      pathname.startsWith(`/${loc}/vision`) ||
      pathname.startsWith(`/${loc}/community-guidelines`) ||
      pathname.startsWith(`/${loc}/data-practices`) ||
      pathname.startsWith(`/${loc}/admin-accountability`) ||
      pathname.startsWith(`/${loc}/cookies`) ||
      pathname.startsWith(`/${loc}/data-rights`) ||
      pathname.startsWith(`/${loc}/reports`) ||
      pathname.startsWith(`/${loc}/org/`) // Public Organization Pages
    )

  // Protect all other routes (Dashboard, etc)
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // --- PHONE VERIFICATION ENFORCEMENT ---
  // If user is accessing protected routes (Dashboard), enforce verification.
  // We check if it's a dashboard route AND not the verification page itself.
  // CRITICAL FIX: Add explicit dashboard route check without locale
  const isDashboardRoute = locales.some(loc => pathname.startsWith(`/${loc}/dashboard`))
  const isVerificationPage = locales.some(loc => pathname.startsWith(`/${loc}/verify-phone`)) || pathname === '/verify-phone'

  if (user && isDashboardRoute && !isVerificationPage) {
     // Cache Strategy: In a real app, check a signed cookie first.
     // For now, we optimize by selecting minimal fields.
     
     const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return request.cookies.getAll() },
            setAll() {}
          }
        }
      )

     // Use RPC for potentially faster lookup if function exists, or fallback to direct select
     // Direct select on ID is extremely fast (primary key lookup)
     const { data: profile } = await supabase
       .from('profiles')
       .select('role, phone_verified')
       .eq('id', user.id)
       .single()
     
     if (!profile || (profile.role === 'admin' && !profile.phone_verified)) {
        const locale = hasLocale ? pathname.split('/')[1] : 'en'
        const url = request.nextUrl.clone()
        url.pathname = `/${locale}/verify-phone`
        return NextResponse.redirect(url)
     }
  }

  // Security Headers
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // If user is verified and tries to access verify-phone, redirect to dashboard
  if (user && isVerificationPage) {
      // Check if actually verified
     const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return request.cookies.getAll() },
            setAll() {}
          }
        }
      )

     const { data: profile } = await supabase
       .from('profiles')
       .select('role, phone_verified')
       .eq('id', user.id)
       .single()

     if (profile && (profile.role !== 'admin' || profile.phone_verified)) {
        const url = request.nextUrl.clone()
        url.pathname = '/en/dashboard'
        return NextResponse.redirect(url)
     }
  }

  // i18n Redirection Logic
  // Check if path is missing locale
  // We exclude api, _next, static, f, auth, admin, and certain system routes
  const shouldHandleLocale = 
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/f/') &&
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/bootstrap-org') &&
    !pathname.includes('.') &&
    !hasLocale

  if (shouldHandleLocale) {
      const locale = 'en' // Default
      return NextResponse.redirect(
        new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
      )
  }

  return supabaseResponse
}
