import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getUserMemberships } from '@/lib/auth/context'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const org = url.searchParams.get('org')

  if (!org) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user || !user.id) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  let memberships
  try {
    memberships = await getUserMemberships(user.id)
  } catch {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const hasActiveMembership = memberships.some(
    (m) => m.organisationId === org && m.status === 'active',
  )

  if (!hasActiveMembership) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const cookieStore = await cookies()
  cookieStore.set('sangathan_org_id', org, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })

  return NextResponse.redirect(new URL('/dashboard', request.url))
}

