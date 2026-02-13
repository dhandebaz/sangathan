import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // --- Post-Verification Setup Logic ---
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!profile) {
          // First time setup
          const metadata = user.user_metadata
          const orgName = metadata.organization_name
          const fullName = metadata.full_name

          if (orgName && fullName) {
            // Generate Slug
            const baseSlug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`

            // Create Organisation
            const { data: orgData, error: orgError } = await supabase
              .from('organisations')
              .insert({
                name: orgName,
                slug: uniqueSlug,
              } as any)
              .select('id')
              .single()
            
            const org = orgData as any

            if (!orgError && org) {
              // Create Profile
              await supabase.from('profiles').insert({
                id: user.id,
                organisation_id: org.id,
                full_name: fullName,
                email: user.email,
                role: 'admin',
              } as any)
            }
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`)
}
