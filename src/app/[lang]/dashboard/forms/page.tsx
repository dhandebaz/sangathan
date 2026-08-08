import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Plus, Eye, Copy, FileText } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { FormStatusToggle } from '@/components/forms/form-status-toggle'

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

  if (!profile || !profile.organisation_id) {
    return <AccessDenied lang={lang} />
  }

  const orgId = profile.organisation_id
  let forms: any[] = []

  const { data, error } = await supabase
    .from('forms')
    .select('id, title, description, is_active, created_at')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false })
  
  if (error) {
    try {
      const adminClient = createServiceClient()
      const fallbackRes = await adminClient
        .from('forms')
        .select('id, title, description, is_active, created_at')
        .eq('organisation_id', orgId)
        .order('created_at', { ascending: false })

      if (!fallbackRes.error) {
        forms = fallbackRes.data || []
      }
    } catch {
      forms = []
    }
  } else {
    forms = data || []
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
           <h1 className="text-3xl font-bold tracking-tight text-foreground">Forms</h1>
           <p className="text-muted-foreground mt-1">Collect data from public or internal users.</p>
        </div>
        <Button asChild>
            <Link href={`/${lang}/dashboard/forms/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Create Form
            </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div key={form.id} className="content-card rounded-lg flex flex-col h-full relative group p-5 bg-card border border-border">
             <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="font-bold text-lg line-clamp-1">{form.title}</h3>
                <FormStatusToggle formId={form.id} isActive={form.is_active} />
             </div>
             
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
               {form.description || 'No description provided.'}
              </p>

             <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border mt-auto">
                <div className="flex items-center gap-1.5 text-xs">
                   <FileText size={14} className="text-brand-500" />
                   <span>Active Form</span>
                </div>
                 <div className="flex gap-1">
                    <Link href={`/${lang}/dashboard/forms/${form.id}`} className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors" title="View Submissions">
                       <Eye size={16} />
                    </Link>
                    <Link href={`/f/${form.id}`} target="_blank" className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors" title="Open Public Link">
                      <Copy size={16} />
                   </Link>
                 </div>
             </div>
          </div>
        ))}

        {forms.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <p>No forms created yet.</p>
            </div>
        )}
      </div>
    </div>
  )
}
