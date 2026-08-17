import { NextRequest, NextResponse } from 'next/server'
import { getPublicMemberCredential } from '@/actions/member-credentials'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await context.params
  const credential = await getPublicMemberCredential(slug, id)

  if (!credential) {
    return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
  }

  const searchParams = request.nextUrl.searchParams
  const format = searchParams.get('format') || 'json'

  if (format === 'svg') {
    const memberName = credential.member_name
    const orgName = credential.organisations?.name || 'Sangathan'
    const role = credential.designation || 'Verified Member'
    const tier = credential.badge_tier || 'Verified Protector'

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="450" height="180" viewBox="0 0 450 180" fill="none">
  <rect width="450" height="180" rx="8" fill="#0F172A" stroke="#334155" stroke-width="2"/>
  <rect x="20" y="20" width="410" height="30" rx="4" fill="#3B82F6"/>
  <text x="225" y="40" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">✦ SANGATHAN VERIFIED CREDENTIAL ✦</text>
  <text x="225" y="75" fill="#F59E0B" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">${orgName.toUpperCase()}</text>
  <text x="225" y="108" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" text-anchor="middle">${memberName}</text>
  <text x="225" y="132" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">${role} • ${tier}</text>
  <text x="225" y="160" fill="#64748B" font-family="monospace" font-size="10" text-anchor="middle">ID: ${credential.credential_id} • SHA256: ${credential.verification_hash?.slice(0, 16)}...</text>
</svg>`

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }

  return NextResponse.json({
    status: 'verified',
    credential_id: credential.credential_id,
    member_name: credential.member_name,
    designation: credential.designation,
    badge_tier: credential.badge_tier,
    organisation: {
      name: credential.organisations?.name,
      slug: credential.organisations?.slug,
      type: credential.organisations?.org_type,
    },
    verification_hash: credential.verification_hash,
    joining_year: credential.joining_year,
    chapter_city: credential.chapter_city,
    verified_url: `https://sangathan.space/verify/${slug}/${id}`,
  })
}
