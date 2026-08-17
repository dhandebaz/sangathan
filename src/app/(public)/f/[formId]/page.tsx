import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { PublicForm } from '@/components/forms/public-form'
import { z } from 'zod'
import { FormFieldSchema } from '@/types/forms'
import { createSignedCookie } from '@/lib/auth/cookie'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ formId: string }>
}

export const dynamic = 'force-dynamic'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function getFormBySlugOrId(identifier: string) {
  const supabase = createServiceClient()
  const isUuid = UUID_REGEX.test(identifier)

  let query = supabase
    .from('forms')
    .select('id, title, description, slug, fields, is_active, organisation_id, visibility, deleted_at')

  if (isUuid) {
    query = query.or(`id.eq.${identifier},slug.eq.${identifier.toLowerCase()}`)
  } else {
    query = query.eq('slug', identifier.toLowerCase())
  }

  const { data: form, error } = await query.maybeSingle() as { 
    data: { 
      id: string; 
      title: string; 
      description: string | null; 
      slug: string | null;
      fields: z.infer<typeof FormFieldSchema>[]; 
      is_active: boolean; 
      organisation_id: string; 
      visibility: 'public' | 'members' | 'private'; 
      deleted_at: string | null 
    } | null, 
    error: { message: string } | null 
  }

  if (error || !form || !form.is_active || form.deleted_at !== null) {
    return null
  }

  return form
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { formId } = await params
  const form = await getFormBySlugOrId(formId)

  if (!form) {
    return {
      title: 'Form Not Found | Sangathan',
      description: 'The requested form is not available.',
    }
  }

  const supabase = createServiceClient()
  const { data: org } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', form.organisation_id)
    .maybeSingle()

  const orgName = org?.name || 'Sangathan'
  const title = `${form.title} | ${orgName}`
  const description = form.description || `Fill out the official ${form.title} survey on Sangathan.`
  const canonicalUrl = `https://sangathan.space/f/${form.slug || form.id}`
  const ogImageUrl = `https://sangathan.space/api/og/form/${form.slug || form.id}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: orgName,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${form.title} - Official Form`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@areynetaji',
    },
  }
}

export default async function PublicFormPage({ params }: PageProps) {
  const { formId } = await params
  const form = await getFormBySlugOrId(formId)

  if (!form) {
    notFound()
  }

  const supabase = createServiceClient()

  // Fetch Organisation Name for branding
  const { data: org } = await supabase
    .from('organisations')
    .select('name, whitelabel_enabled')
    .eq('id', form.organisation_id)
    .maybeSingle() as { data: { name: string; whitelabel_enabled?: boolean } | null, error: { message: string } | null }

  const whitelabelEnabled = org?.whitelabel_enabled ?? false
  const shareIdentifier = form.slug || form.id

  // Visibility Validation Gates
  const userClient = await createClient()
  const { data: { user } } = await userClient.auth.getUser()

  if (form.visibility === 'members') {
    if (!user) {
      redirect(`/en/login?redirect=/f/${shareIdentifier}`)
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, organisation_id, status, role')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile || profile.status !== 'active' || profile.organisation_id !== form.organisation_id) {
      return (
        <div className="min-h-screen bg-orange-50/30 py-12 px-4 sm:px-6">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
               <h2 className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-1">
                 {org?.name || 'Sangathan'}
               </h2>
               <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
               {form.description && (
                 <p className="mt-2 text-gray-600">{form.description}</p>
               )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-500 mb-6">Only active members of this organization can fill this form.</p>
              <a href={`/en/login?redirect=/f/${shareIdentifier}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-700">
                Sign In with a different account
              </a>
            </div>
            
            {!whitelabelEnabled && (
            <div className="mt-8 text-center text-xs text-gray-400">
               Powered by Sangathan Platform
            </div>
            )}
          </div>
        </div>
      )
    }
  }

  if (form.visibility === 'private') {
    if (!user) {
      redirect(`/en/login?redirect=/f/${shareIdentifier}`)
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, organisation_id, status, role')
      .eq('id', user.id)
      .maybeSingle()

    if (
      !profile ||
      profile.status !== 'active' ||
      profile.organisation_id !== form.organisation_id ||
      !['admin', 'editor', 'executive'].includes(profile.role)
    ) {
      return (
        <div className="min-h-screen bg-orange-50/30 py-12 px-4 sm:px-6">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
               <h2 className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-1">
                 {org?.name || 'Sangathan'}
               </h2>
               <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
               {form.description && (
                 <p className="mt-2 text-gray-600">{form.description}</p>
               )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-500 mb-6">Access denied. Only staff can submit responses to this form.</p>
              <a href={`/en/login?redirect=/f/${shareIdentifier}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-700">
                Sign In with a different account
              </a>
            </div>
            
            {!whitelabelEnabled && (
            <div className="mt-8 text-center text-xs text-gray-400">
               Powered by Sangathan Platform
            </div>
            )}
          </div>
        </div>
      )
    }
  }

  const csrfToken = await createSignedCookie({ formId: form.id })

  return (
    <div className="min-h-screen bg-orange-50/30 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
           <h2 className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-1">
             {org?.name || 'Sangathan'}
           </h2>
           <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
           {form.description && (
             <p className="mt-2 text-gray-600">{form.description}</p>
           )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
           <PublicForm form={form} csrfToken={csrfToken} />
        </div>
        
        {!whitelabelEnabled && (
          <div className="mt-8 text-center text-xs text-gray-400">
             Powered by Sangathan Platform
          </div>
        )}
      </div>
    </div>
  )
}

