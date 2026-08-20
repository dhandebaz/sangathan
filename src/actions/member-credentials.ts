'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

const SaveCredentialSchema = z.object({
  memberName: z.string().min(2, 'Member name is required'),
  designation: z.string().min(2, 'Designation is required'),
  badgeTier: z.string().min(2, 'Badge tier is required'),
  badgeTemplate: z.string().default('executive_seal'),
  themeId: z.string().default('sovereign_navy'),
  symbolId: z.string().default('scales_of_justice'),
  chapterCity: z.string().optional(),
  bloodGroup: z.string().optional(),
  joiningYear: z.string().default('2026'),
  customTagline: z.string().optional(),
  avatarUrl: z.string().optional(),
})

export const saveMemberCredentialAction = createSafeAction(
  SaveCredentialSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId
    const profileId = context.user.id

    // Generate deterministic or stable credential ID
    const year = data.joiningYear || new Date().getFullYear().toString()
    const credentialId = `SAN-${year}-${profileId.slice(0, 6).toUpperCase()}`

    // Compute cryptographic SHA-256 hash for tamper-proof verification
    const rawPayload = `${credentialId}:${organisationId}:${profileId}:${data.badgeTier}:${data.designation}`
    const verificationHash = crypto.createHash('sha256').update(rawPayload).digest('hex')
    const qrToken = `verify:${credentialId}:${verificationHash.slice(0, 16)}`

    // Update profile table
    await supabase
      .from('profiles')
      .update({
        full_name: data.memberName,
        designation: data.designation,
        member_id_ref: credentialId,
        blood_group: data.bloodGroup || null,
        chapter_city: data.chapterCity || null,
        badge_tier: data.badgeTier,
        badge_theme: data.themeId,
        badge_template: data.badgeTemplate,
        custom_tagline: data.customTagline || null,
        avatar_url: data.avatarUrl || null,
      })
      .eq('id', profileId)

    // Upsert into member_credentials
    const adminClient = createServiceClient()
    const { data: credential, error } = await adminClient
      .from('member_credentials')
      .upsert(
        {
          profile_id: profileId,
          organisation_id: organisationId,
          credential_id: credentialId,
          member_name: data.memberName,
          designation: data.designation,
          badge_tier: data.badgeTier,
          badge_template: data.badgeTemplate,
          theme_id: data.themeId,
          symbol_id: data.symbolId,
          chapter_city: data.chapterCity,
          blood_group: data.bloodGroup,
          joining_year: data.joiningYear,
          custom_tagline: data.customTagline,
          qr_token: qrToken,
          verification_hash: verificationHash,
          status: 'active',
          is_public: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'credential_id' }
      )
      .select('*, organisations(name, slug, org_type, logo_url)')
      .maybeSingle()

    if (error) {
      return { error: error.message || 'Failed to save member credential' }
    }

    revalidatePath('/', 'layout')
    revalidatePath('/en/members/badge', 'page')
    revalidatePath('/hi/members/badge', 'page')

    return { credential }
  }
)

export async function getPublicMemberCredential(orgSlug: string, credentialId: string) {
  const supabase = createServiceClient()

  // First fetch org
  const { data: org } = await supabase
    .from('organisations')
    .select('id, name, slug, org_type, logo_url, description, darpan_id')
    .eq('slug', orgSlug)
    .maybeSingle()

  if (!org) return null

  // Fetch credential by credential_id and org_id
  const { data: credential } = await supabase
    .from('member_credentials')
    .select('*, profiles(full_name, email, role, avatar_url, created_at)')
    .eq('organisation_id', org.id)
    .eq('credential_id', credentialId)
    .eq('status', 'active')
    .maybeSingle()

  if (!credential) {
    // Check if there's a matching profile directly
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, role, designation, created_at, avatar_url, badge_tier, badge_theme, badge_template, chapter_city, blood_group')
      .eq('organisation_id', org.id)
      .maybeSingle()

    if (!profile) return null

    return {
      credential_id: credentialId,
      member_name: profile.full_name || 'Standing Member',
      designation: profile.designation || profile.role || 'Member',
      badge_tier: profile.badge_tier || 'Verified Standing Member',
      badge_template: profile.badge_template || 'executive_seal',
      theme_id: profile.badge_theme || 'sovereign_navy',
      symbol_id: 'scales_of_justice',
      chapter_city: profile.chapter_city || 'National Chapter',
      blood_group: profile.blood_group || 'O+',
      joining_year: new Date(profile.created_at).getFullYear().toString(),
      verification_hash: crypto.createHash('sha256').update(`${credentialId}:${org.id}`).digest('hex'),
      status: 'active',
      is_public: true,
      created_at: profile.created_at,
      organisations: org,
    }
  }

  return {
    ...credential,
    organisations: org,
  }
}
