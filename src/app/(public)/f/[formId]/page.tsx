import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'
import { PublicForm } from '@/components/forms/public-form'

interface PageProps {
  params: Promise<{ formId: string }>
}

export const dynamic = 'force-dynamic'

export default async function PublicFormPage({ params }: PageProps) {
  const { formId } = await params
  const supabase = createServiceClient()

  // Fetch form details
  const { data, error } = await supabase
    .from('forms')
    .select('id, title, description, fields, is_active, organisation_id')
    .eq('id', formId)
    .single()
  
  const form = data as any

  if (error || !form) {
    notFound()
  }

  if (!form.is_active) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
           <h1 className="text-xl font-bold mb-2">Form Closed</h1>
           <p className="text-gray-500">This form is no longer accepting submissions.</p>
        </div>
      </div>
    )
  }

  // Fetch Organisation Name for branding
  const { data: orgData } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', form.organisation_id)
    .single()
  
  const org = orgData as any

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
           <PublicForm form={form} />
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-400">
           Powered by Sangathan Platform
        </div>
      </div>
    </div>
  )
}
