import { createClient } from '@/lib/supabase/server'
import { Plus, Eye, Copy, FileText } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { FormStatusToggle } from '@/components/forms/form-status-toggle'
import { DashboardForm } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export default async function FormsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profileData } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  const profile = profileData as { organisation_id: string | null; role: string } | null

  if (!profile || !profile.organisation_id || !['admin', 'editor', 'executive'].includes(profile.role)) {
    return <AccessDenied lang={lang} />
  }

  const orgId = profile.organisation_id

  const { data, error } = await supabase
    .from('forms')
    .select('id, title, description, is_active, created_at, form_submissions(count)')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false })
  
  const forms = data as DashboardForm[] | null

  if (error) {
    return <div className="p-4 text-red-500">Error loading forms</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
           <p className="text-muted-foreground mt-1">Collect data from public or internal users.</p>
        </div>
        <Button asChild>
            <Link href={`/${lang}/dashboard/forms/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Create Form
            </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
        {forms?.map((form) => (
          <div key={form.id} className="content-card rounded-lg flex flex-col h-full relative group">
             <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg line-clamp-1">{form.title}</h3>
                <FormStatusToggle formId={form.id} isActive={form.is_active} />
             </div>
             
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
               {form.description || 'No description provided.'}
             </p>

             <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t mt-auto">
                <div className="flex items-center gap-1">
                   <FileText size={14} />
                   <span>{form.form_submissions?.[0]?.count || 0} Submissions</span>
                </div>
                 <div className="flex gap-1">
                    <Link href={`/${lang}/dashboard/forms/${form.id}`} className="flex items-center justify-center min-h-11 min-w-11 rounded-xl hover:bg-accent transition-colors" title="View Submissions">
                       <Eye size={18} />
                    </Link>
                    <Link href={`/f/${form.id}`} target="_blank" className="flex items-center justify-center min-h-11 min-w-11 rounded-xl hover:bg-accent transition-colors" title="Open Public Link">
                      <Copy size={18} />
                   </Link>
                 </div>
             </div>
          </div>
        ))}

        {forms?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <p>No forms created yet.</p>
            </div>
        )}
      </div>
    </div>
  )
}
