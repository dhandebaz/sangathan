import { createClient } from '@/lib/supabase/server'
import { Plus, Eye, Copy, FileText, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { FormStatusToggle } from '@/components/forms/form-status-toggle'

export const dynamic = 'force-dynamic'

export default async function FormsPage() {
  const supabase = await createClient()

  const { data: forms, error } = await supabase
    .from('forms')
    .select('id, title, description, is_active, created_at, form_submissions(count)')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-4 text-red-500">Error loading forms</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
           <p className="text-gray-500 mt-1">Collect data from public or internal users.</p>
        </div>
        <Link 
            href="/dashboard/forms/new" 
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
            <Plus size={16} />
            Create Form
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms?.map((form) => (
          <div key={form.id} className="content-card rounded-lg flex flex-col h-full relative group">
             <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg line-clamp-1">{form.title}</h3>
                <FormStatusToggle formId={form.id} isActive={form.is_active} />
             </div>
             
             <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
               {form.description || 'No description provided.'}
             </p>

             <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t mt-auto">
                <div className="flex items-center gap-1">
                   <FileText size={14} />
                   <span>{form.form_submissions?.[0]?.count || 0} Submissions</span>
                </div>
                <div className="flex gap-2">
                   <Link href={`/dashboard/forms/${form.id}`} className="hover:text-black" title="View Submissions">
                      <Eye size={18} />
                   </Link>
                   <Link href={`/f/${form.id}`} target="_blank" className="hover:text-black" title="Open Public Link">
                      <Copy size={18} />
                   </Link>
                </div>
             </div>
          </div>
        ))}

        {forms?.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                <p>No forms created yet.</p>
            </div>
        )}
      </div>
    </div>
  )
}
