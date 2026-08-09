'use server'

import { cookies } from 'next/headers'

export async function setOrgCookie(orgId: string) {
  const cookieStore = await cookies()
  cookieStore.set('sangathan_org_id', orgId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
}
