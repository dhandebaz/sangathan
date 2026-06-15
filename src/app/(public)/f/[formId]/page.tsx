import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { PublicForm } from '@/components/forms/public-form'
import { z } from 'zod'
import { FormFieldSchema } from '@/types/forms'
import { createSignedCookie } from '@/lib/auth/cookie'

interface PageProps {
  params: Promise<{ formId: string }>
}

export const dynamic = 'force-dynamic'

export default async function PublicFormPage({ params }: PageProps) {
  const { formId } = await params
  const supabase = createServiceClient()

  // Fetch form details
  const { data: form, error } = await supabase
    .from('forms')
    .select('id, title, description, fields, is_active, organisation_id, visibility, deleted_at')
    .eq('id', formId)
    .single() as { 
      data: { 
        id: string; 
        title: string; 
        description: string | null; 
        fields: z.infer<typeof FormFieldSchema>[]; 
        is_active: boolean; 
        organisation_id: string; 
        visibility: 'public' | 'members' | 'private'; 
        deleted_at: string | null 
      } | null, 
      error: { message: string } | null 
    }

  if (error || !form || !form.is_active || form.deleted_at !== null) {
    notFound()
  }

  // Fetch Organisation Name for branding
  const { data: org } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', form.organisation_id)
    .single() as { data: { name: string } | null, error: { message: string } | null }

  // Visibility Validation Gates
  const userClient = await createClient()
  const { data: { user } } = await userClient.auth.getUser()

  if (form.visibility === 'members') {
    if (!user) {
      redirect(`/en/login?redirect=/f/${formId}`)
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
              <a href={`/en/login?redirect=/f/${formId}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-700">
                Sign In with a different account
              </a>
            </div>
            
            <div className="mt-8 text-center text-xs text-gray-400">
               Powered by Sangathan Platform
            </div>
          </div>
        </div>
      )
    }
  }

  if (form.visibility === 'private') {
    if (!user) {
      redirect(`/en/login?redirect=/f/${formId}`)
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
              <a href={`/en/login?redirect=/f/${formId}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-700">
                Sign In with a different account
              </a>
            </div>
            
            <div className="mt-8 text-center text-xs text-gray-400">
               Powered by Sangathan Platform
            </div>
          </div>
        </div>
      )
    }
  }

  const csrfToken = await createSignedCookie({ formId })

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
        
        <div className="mt-8 text-center text-xs text-gray-400">
           Powered by Sangathan Platform
        </div>
      </div>
    </div>
  )
}
