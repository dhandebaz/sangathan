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

  // Protect all /dashboard routes
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/en') && // Allow Public Site
    !request.nextUrl.pathname.startsWith('/hi') && // Allow Public Site
    request.nextUrl.pathname.startsWith('/') && // Default protection
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/api') &&
    !request.nextUrl.pathname.startsWith('/f') && // Allow Public Forms
    !request.nextUrl.pathname.startsWith('/donate') && // Allow Public Donation
    request.nextUrl.pathname !== '/' // Allow landing page (which redirects to /en)
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Explicit dashboard protection
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
     const url = request.nextUrl.clone()
     url.pathname = '/login'
     return NextResponse.redirect(url)
  }

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (
    user &&
    (request.nextUrl.pathname.startsWith('/login') ||
     request.nextUrl.pathname.startsWith('/signup'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // i18n Redirection Logic
  const pathname = request.nextUrl.pathname
  const locales = ['en', 'hi']
  
  // Check if path is missing locale
  // We exclude api, _next, static, f, dashboard, login, signup, admin
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  const isPublicSite = 
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/f/') && // Public Forms
    !pathname.startsWith('/dashboard') &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/signup') &&
    !pathname.startsWith('/admin') &&
    !pathname.includes('.') // Exclude files

  if (pathnameIsMissingLocale && isPublicSite) {
      const locale = 'en' // Default or detect from request.headers.get('accept-language')
      
      // Redirect to /en/...
      return NextResponse.redirect(
        new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
      )
  }

  return supabaseResponse
}
