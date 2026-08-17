import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params
  const searchParams = req.nextUrl.searchParams
  const status = searchParams.get('status')
  
  const supabase = createServiceClient()

  // In a real application, verify user is a member of the org here.

  let query = supabase
    .from('compliance_filings')
    .select('*')
    .eq('organisation_id', orgId)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params
  const supabase = createServiceClient()

  // In a real application, verify user is an admin/executive of the org here.

  try {
    const body = await req.json()
    
    const { data, error } = await supabase
      .from('compliance_filings')
      .insert({
        organisation_id: orgId,
        ...body
      })
      .select()
      .maybeSingle()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
