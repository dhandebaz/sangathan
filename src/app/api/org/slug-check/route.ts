import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { generateSecureString } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')

  if (!slug || slug.length < 3) {
    return NextResponse.json({ available: false, error: 'Slug must be at least 3 characters' })
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ available: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' })
  }

  const supabase = createServiceClient()

  const { data: exactMatch } = await supabase
    .from('organisations')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (exactMatch) {
    const suggested = `${slug}-${generateSecureString(4).toLowerCase()}`
    return NextResponse.json({ available: false, suggested })
  }

  return NextResponse.json({ available: true, slug })
}
