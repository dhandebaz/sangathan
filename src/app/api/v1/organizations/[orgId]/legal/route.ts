import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { VALID_LEGAL_TYPES, validateStatutoryId } from '@/lib/legal-entity-types'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params
  const supabase = await createClient()

  // In a real application, verify user is an admin/executive of the org here.
  
  const { data: org, error } = await supabase
    .from('organisations')
    .select('legal_entity_type, governing_law, registrar_authority, registration_state, tax_id, tan, gstin, cin, darpan_id, certificate_12a, certificate_80g, fcra_registration, csr_registration, trade_union_registration, cooperative_registration, society_registration, trust_registration, epfo_code, esic_code, udyam_registration')
    .eq('id', orgId)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(org)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params
  const supabase = await createClient()
  
  // In a real application, verify user is an admin/executive of the org here.

  try {
    const body = await req.json()
    const { legal_entity_type, ...statutoryIds } = body

    const { data: org, error: orgError } = await supabase
      .from('organisations')
      .select('org_type')
      .eq('id', orgId)
      .maybeSingle()

    if (orgError || !org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    if (legal_entity_type) {
      const validTypes = VALID_LEGAL_TYPES[org.org_type as keyof typeof VALID_LEGAL_TYPES]
      if (!validTypes?.includes(legal_entity_type as any)) {
        return NextResponse.json({ error: 'Invalid legal entity type for this organization type' }, { status: 400 })
      }
    }

    // Validate statutory IDs
    for (const [key, value] of Object.entries(statutoryIds)) {
      if (typeof value === 'string' && value.trim() !== '') {
        const isValid = validateStatutoryId(key as any, value)
        if (!isValid) {
          return NextResponse.json({ error: `Invalid format for ${key}` }, { status: 400 })
        }
      }
    }

    const { data, error } = await supabase
      .from('organisations')
      .update({ legal_entity_type, ...statutoryIds })
      .eq('id', orgId)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
