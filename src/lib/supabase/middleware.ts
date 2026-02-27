import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { i18n } from '@/lib/i18n/config'
import { createSignedCookie, verifySignedCookie } from '@/lib/auth/cookie'
import { isMaintenanceMode } from '@/lib/maintenance'

export async function updateSession(request: NextRequest) {
  // --- MAINTENANCE MODE CHECK (Zero DB Overhead) ---
  if (isMaintenanceMode(request)) {
     // Allow access to maintenance page and static assets
     const pathname = request.nextUrl.pathname
     if (!pathname.startsWith('/maintenance') && 
         !pathname.startsWith('/_next') && 
         !pathname.startsWith('/static')) {
        const url = request.nextUrl.clone()
        url.pathname = '/maintenance'
        return NextResponse.redirect(url)
     }
  }

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
    const superAdmins = process.env.SUPER_ADMIN_EMAILS?.split(',')
    if (!superAdmins || superAdmins.length === 0 || !superAdmins.includes(user.email)) {
       // Return 404 to hide admin existence or 403
       return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }
  }

  const pathname = request.nextUrl.pathname
  
  // Helper to check if path starts with locale
  const hasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Auth Routes that should be public but redirected to dashboard if logged in
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email']
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || 
    i18n.locales.some(loc => pathname === `/${loc}${route}`)
  )

  if (user && isAuthRoute) {
    const cookieName = 'user-metadata'
    const cached = request.cookies.get(cookieName)?.value
    let profile = cached ? await verifySignedCookie(cached) : null

    if (!profile) {
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() { return request.cookies.getAll() },
              setAll() {},
            },
          },
        )

        const { data: fetchedProfile } = await supabase
          .from('profiles')
          .select('role, phone_verified')
          .eq('id', user.id)
          .maybeSingle()
        
        profile = fetchedProfile
    }

    if (!profile || (profile.role === 'admin' && !profile.phone_verified)) {
      // Allow access to auth screens so the user can login or escape
    } else {
      const url = request.nextUrl.clone()
      url.pathname = '/en/dashboard'
      const response = NextResponse.redirect(url)
      
      if (profile && !cached) {
          const signedValue = await createSignedCookie(profile)
          response.cookies.set(cookieName, signedValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 10
          })
      }
      return response
    }
  }

  // Define strictly public paths (no auth required)
  const isPublicPath = 
    pathname === '/' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/f/') || // Public Forms
    pathname.startsWith('/donate') || // Public Donation
    pathname.startsWith('/auth') || // Auth Callback
    authRoutes.some(route => pathname === route || i18n.locales.some(loc => pathname.startsWith(`/${loc}${route}`))) || // Auth pages
    i18n.locales.some(loc => 
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
  const isDashboardRoute = i18n.locales.some(loc => pathname.startsWith(`/${loc}/dashboard`))
  const isVerificationPage = i18n.locales.some(loc => pathname.startsWith(`/${loc}/verify-phone`)) || pathname === '/verify-phone'

  if (user && isDashboardRoute && !isVerificationPage) {
     const cookieName = 'user-metadata'
     const cached = request.cookies.get(cookieName)?.value
     let profile = cached ? await verifySignedCookie(cached) : null
     
     if (!profile) {
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
         
         const { data: fetchedProfile } = await supabase
           .from('profiles')
           .select('role, phone_verified')
           .eq('id', user.id)
           .single()
         
         profile = fetchedProfile
         
         if (profile) {
             const signedValue = await createSignedCookie(profile)
             supabaseResponse.cookies.set(cookieName, signedValue, {
                 httpOnly: true,
                 secure: process.env.NODE_ENV === 'production',
                 maxAge: 60 * 10
             })
         }
     }
     
     if (!profile || (profile.role === 'admin' && !profile.phone_verified)) {
        const locale = hasLocale ? pathname.split('/')[1] : i18n.defaultLocale
        const url = request.nextUrl.clone()
        url.pathname = `/${locale}/verify-phone`
        const response = NextResponse.redirect(url)
        
        if (profile) {
             const signedValue = await createSignedCookie(profile)
             response.cookies.set(cookieName, signedValue, {
                 httpOnly: true,
                 secure: process.env.NODE_ENV === 'production',
                 maxAge: 60 * 10
             })
        }
        return response
     }
  }

  // Security Headers
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // If user is verified and tries to access verify-phone, redirect to dashboard
  if (user && isVerificationPage) {
      const cookieName = 'user-metadata'
      const cached = request.cookies.get(cookieName)?.value
      let profile = cached ? await verifySignedCookie(cached) : null

     if (!profile) {
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

         const { data: fetchedProfile } = await supabase
           .from('profiles')
           .select('role, phone_verified')
           .eq('id', user.id)
           .single()
         
         profile = fetchedProfile
         
         if (profile) {
             const signedValue = await createSignedCookie(profile)
             supabaseResponse.cookies.set(cookieName, signedValue, {
                 httpOnly: true,
                 secure: process.env.NODE_ENV === 'production',
                 maxAge: 60 * 10
             })
         }
     }

     if (profile && (profile.role !== 'admin' || profile.phone_verified)) {
        const url = request.nextUrl.clone()
        url.pathname = '/en/dashboard'
        const response = NextResponse.redirect(url)
        
        if (!cached && profile) {
            const signedValue = await createSignedCookie(profile)
            response.cookies.set(cookieName, signedValue, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 10
            })
        }
        return response
     }
  }

  // i18n Redirection Logic
  const shouldHandleLocale = 
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/f/') &&
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/bootstrap-org') &&
    !pathname.startsWith('/maintenance') && // Exclude maintenance
    !pathname.includes('.') &&
    !hasLocale

  if (shouldHandleLocale) {
      const locale = i18n.defaultLocale
      return NextResponse.redirect(
        new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
      )
  }

  return supabaseResponse
}
