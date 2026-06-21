import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { i18n } from '@/lib/i18n/config'
import { createSignedCookie, verifySignedCookie } from '@/lib/auth/cookie'

function applySecurityHeaders(response: NextResponse, isApiRoute = false): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      process.env.NODE_ENV === 'development'
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        : "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://*.ingest.sentry.io https://*.upstash.io wss://*.supabase.co",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "worker-src 'self'",
      "manifest-src 'self'",
    ].join('; ')
  )

  // Additional isolation headers
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')

  // CORS for API routes
  if (isApiRoute) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || 'https://sangathan.app')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Cron-Secret')
    response.headers.set('Access-Control-Max-Age', '86400')
  }

  return response
}

const MAX_BODY_SIZE = 1024 * 100 // 100KB

function checkBodySize(request: NextRequest): NextResponse | null {
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
    }
  }
  return null
}

export async function updateSession(request: NextRequest) {
  // Block oversized request bodies early
  const bodySizeCheck = checkBodySize(request)
  if (bodySizeCheck) return applySecurityHeaders(bodySizeCheck)

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
  } catch {
    // Auth error - proceed as unauthenticated without leaking details
  }

  // Protect System Admin Routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || !user.email) {
       const url = request.nextUrl.clone()
        url.pathname = '/login'
        return applySecurityHeaders(NextResponse.redirect(url))
    }
    
    // Strict Whitelist Check
    const superAdmins = process.env.SUPER_ADMIN_EMAILS?.split(',')
    if (!superAdmins || superAdmins.length === 0 || !superAdmins.includes(user.email)) {
       // Return 404 to hide admin existence or 403
       return applySecurityHeaders(NextResponse.json({ error: 'Not Found' }, { status: 404 }))
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
          .select('role, phone_verified, organisations(capabilities)')
          .eq('id', user.id)
          .maybeSingle()
        
        profile = fetchedProfile
    }

    if (!profile) {
      // Allow access to auth screens so the user can login or escape
    } else {
      const url = request.nextUrl.clone()
      url.pathname = '/en/dashboard'
      const response = applySecurityHeaders(NextResponse.redirect(url))
      
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
      pathname.startsWith(`/${loc}/features`) ||
      pathname.startsWith(`/${loc}/org/`) // Public Organization Pages
    )

  // Protect all other routes (Dashboard, etc)
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return applySecurityHeaders(NextResponse.redirect(url))
  }

  // --- Route Type Check ---
  const isDashboardRoute = i18n.locales.some(loc => pathname.startsWith(`/${loc}/dashboard`))
  const isApiRoute = pathname.startsWith('/api')

  applySecurityHeaders(supabaseResponse, isApiRoute)

   // --- CAPABILITIES (ORG TYPE) ENFORCEMENT ---
   if (user && isDashboardRoute) {
     const cookieName = 'user-metadata'
     const cached = request.cookies.get(cookieName)?.value
     const profile = cached ? await verifySignedCookie(cached) as unknown as { organisations?: { capabilities?: Record<string, boolean> } } : null

     if (profile && profile.organisations && profile.organisations.capabilities) {
       const caps = profile.organisations.capabilities
       const p = pathname

       // Restrict access based on capabilities
        if (p.includes('/dashboard/donations') && !caps.donations) {
          return applySecurityHeaders(NextResponse.redirect(new URL(`/${hasLocale ? pathname.split('/')[1] : i18n.defaultLocale}/dashboard`, request.url)))
       }
        if (p.includes('/dashboard/networks') && !caps.federation_mode) {
          return applySecurityHeaders(NextResponse.redirect(new URL(`/${hasLocale ? pathname.split('/')[1] : i18n.defaultLocale}/dashboard`, request.url)))
        }
        if (p.includes('/dashboard/campaigns') && !caps.campaigns) {
          return applySecurityHeaders(NextResponse.redirect(new URL(`/${hasLocale ? pathname.split('/')[1] : i18n.defaultLocale}/dashboard`, request.url)))
        }
        if (p.includes('/dashboard/grievances') && !caps.grievances) {
          return applySecurityHeaders(NextResponse.redirect(new URL(`/${hasLocale ? pathname.split('/')[1] : i18n.defaultLocale}/dashboard`, request.url)))
        }
        if (p.includes('/dashboard/complaints') && !caps.complaints) {
          return applySecurityHeaders(NextResponse.redirect(new URL(`/${hasLocale ? pathname.split('/')[1] : i18n.defaultLocale}/dashboard`, request.url)))
        }
        if (p.includes('/dashboard/maintenance') && !caps.maintenance) {
          return applySecurityHeaders(NextResponse.redirect(new URL(`/${hasLocale ? pathname.split('/')[1] : i18n.defaultLocale}/dashboard`, request.url)))
        }
        if (p.includes('/dashboard/volunteers') && !caps.volunteers) {
          return applySecurityHeaders(NextResponse.redirect(new URL(`/${hasLocale ? pathname.split('/')[1] : i18n.defaultLocale}/dashboard`, request.url)))
        }
        if (p.includes('/dashboard/student-ids') && !caps.student_ids) {
          return applySecurityHeaders(NextResponse.redirect(new URL(`/${hasLocale ? pathname.split('/')[1] : i18n.defaultLocale}/dashboard`, request.url)))
        }
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
      return applySecurityHeaders(NextResponse.redirect(
        new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
      ))
  }

  return supabaseResponse
}
